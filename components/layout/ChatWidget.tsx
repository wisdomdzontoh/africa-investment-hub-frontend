"use client";

import { ArrowUp, MessageCircle, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { BrandedButton } from "@/components/brand/Button";
import { Input } from "@/components/ui/input";

type Message = { from: "ai" | "user"; text: string };

export function ChatWidget() {
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([
    { from: "ai", text: t("greeting") },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("aih:open-chat", handleOpen);
    return () => window.removeEventListener("aih:open-chat", handleOpen);
  }, []);

  const suggestions = [
    t("suggestions.verification"),
    t("suggestions.kenya"),
    t("suggestions.afcfta"),
  ];

  const send = (text: string) => {
    setMsgs((m) => [...m, { from: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "ai", text: t("mockReply") }]);
    }, 1100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input.trim());
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

      <div className="chat-body">
        {msgs.map((m, i) => (
          <div key={i} className={`chat-msg ${m.from}`}>
            {m.text}
          </div>
        ))}
        {typing && (
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
          className="flex-1"
        />
        <BrandedButton type="submit" size="icon" aria-label={t("send")}>
          <ArrowUp size={16} />
        </BrandedButton>
      </form>
    </div>
  );
}
