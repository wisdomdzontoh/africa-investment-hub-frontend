"use client";

import { ArrowUp, MessageCircle, Sparkles, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api/client";

type Message = { from: "ai" | "user"; text: string; error?: boolean };

const SESSION_KEY = "aih:chat-session";

function getSessionToken(): string {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing && existing.length >= 8) return existing;
    const token = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, token);
    return token;
  } catch {
    // Storage unavailable (private mode) — session lives for this page only.
    return crypto.randomUUID();
  }
}

/** Parse one SSE frame into its data payload. Standard `data:` lines are
 *  joined per spec; bare lines are kept as continuations because the backend
 *  frames tokens naively and a token may itself contain newlines. */
function parseEventData(frame: string): string | null {
  const datas: string[] = [];
  for (const line of frame.split("\n")) {
    if (line.startsWith("data: ")) datas.push(line.slice(6));
    else if (line.startsWith("data:")) datas.push(line.slice(5));
    else if (line !== "" && datas.length > 0) datas.push(line);
  }
  if (datas.length === 0) return null;
  return datas.join("\n");
}

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([
    { from: "ai", text: t("greeting") },
  ]);
  const [streaming, setStreaming] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [input, setInput] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("aih:open-chat", handleOpen);
    return () => {
      window.removeEventListener("aih:open-chat", handleOpen);
      abortRef.current?.abort();
    };
  }, []);

  // Keep the latest message in view as tokens stream in.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [msgs, waiting]);

  const suggestions = [
    t("suggestions.verification"),
    t("suggestions.kenya"),
    t("suggestions.afcfta"),
  ];

  const send = async (text: string) => {
    if (streaming) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setStreaming(true);
    setWaiting(true);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const clerkToken = await getToken().catch(() => null);
      const res = await fetch(`${API_BASE_URL}/v1/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
          ...(clerkToken ? { Authorization: `Bearer ${clerkToken}` } : {}),
        },
        body: JSON.stringify({ session_token: getSessionToken(), message: text }),
        signal: ac.signal,
      });

      if (!res.ok || !res.body) {
        const errText = res.status === 429 ? t("rateLimited") : t("error");
        setMsgs((m) => [...m, { from: "ai", text: errText, error: true }]);
        return;
      }

      // Stream tokens into a growing assistant bubble.
      setMsgs((m) => [...m, { from: "ai", text: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (readerDone) break;
        buffer += decoder.decode(value, { stream: true });

        let sep = buffer.indexOf("\n\n");
        while (sep !== -1) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          const data = parseEventData(frame);
          if (data === "[DONE]") {
            done = true;
            break;
          }
          if (data !== null) {
            setWaiting(false);
            setMsgs((m) => {
              const next = [...m];
              const last = next[next.length - 1];
              if (last?.from === "ai") {
                next[next.length - 1] = { ...last, text: last.text + data };
              }
              return next;
            });
          }
          sep = buffer.indexOf("\n\n");
        }
      }

      // Stream ended without producing any text — surface a retryable error.
      setMsgs((m) => {
        const last = m[m.length - 1];
        if (last?.from === "ai" && last.text === "") {
          return [...m.slice(0, -1), { from: "ai" as const, text: t("error"), error: true }];
        }
        return m;
      });
    } catch {
      if (!ac.signal.aborted) {
        setMsgs((m) => [...m, { from: "ai", text: t("error"), error: true }]);
      }
    } finally {
      setWaiting(false);
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;
    send(text);
    setInput("");
  };

  if (!open) {
    return (
      <button
        type="button"
        className="chat-fab"
        onClick={() => setOpen(true)}
        aria-label={t("open")}
      >
        <MessageCircle size={22} />
      </button>
    );
  }

  return (
    <div className="chat-panel fade-in">
      <div className="chat-head">
        <div className="flex items-center gap-2.5">
          <span className="chat-avatar">
            <Sparkles size={16} />
          </span>
          <div>
            <div className="text-[var(--text-sm)] font-bold text-white">
              {t("title")}
            </div>
            <div className="text-[var(--text-2xs)] text-white/70">
              {t("subtitle")}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="chat-x"
          onClick={() => setOpen(false)}
          aria-label={t("close")}
        >
          <X size={18} />
        </button>
      </div>

      <div className="chat-body" ref={bodyRef} aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`chat-msg ${m.from}`}>
            {m.text}
          </div>
        ))}
        {waiting && (
          <div className="chat-msg ai chat-typing">
            <span />
            <span />
            <span />
          </div>
        )}
        {msgs.length === 1 && (
          <div className="chat-sugs">
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          maxLength={4000}
          className="flex-1"
          aria-label={t("placeholder")}
        />
        <Button
          type="submit"
          size="icon"
          disabled={streaming || !input.trim()}
          aria-label={t("send")}
        >
          <ArrowUp size={16} />
        </Button>
      </form>
    </div>
  );
}
