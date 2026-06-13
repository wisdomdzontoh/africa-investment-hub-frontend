"use client";

import { Check, Download, FileCheck2, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Card } from "@/components/ds";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusPill } from "@/components/portal/StatusPill";
import {
  useDueDiligence,
  useRequestDueDiligence,
  useSetDdItemStatus,
  useUploadDdItemDocument,
} from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import type { DueDiligenceItem } from "@/types/api";

const ACCEPTED =
  "application/pdf,image/jpeg,image/png,image/webp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** Due-diligence workspace: request DD, upload evidence per checklist item, and
 *  track status. With `canSignOff` (admin), each item gains approve/reject. */
export function DueDiligenceSection({
  matchId,
  canSignOff = false,
}: {
  matchId: string;
  canSignOff?: boolean;
}) {
  const t = useTranslations("investorPortal");
  const { data: dd, isLoading, isError } = useDueDiligence(matchId);
  const request = useRequestDueDiligence(matchId);

  async function startDd() {
    try {
      await request.mutateAsync();
      toast.success(t("dd.requested"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("dd.error"));
    }
  }

  // Not-yet-requested resolves as a 404 → isError; offer to start DD.
  if (isLoading) {
    return (
      <Card hoverLift={false}>
        <div className="h-24 animate-pulse rounded-[var(--radius-md)] bg-[var(--bg-section)]" />
      </Card>
    );
  }

  if (isError || !dd) {
    return (
      <Card hoverLift={false}>
        <EmptyState
          compact
          icon={FileCheck2}
          title={t("dd.title")}
          description={t("dd.startBody")}
          action={
            <Button size="sm" disabled={request.isPending} onClick={startDd}>
              {request.isPending ? t("dd.requesting") : t("dd.request")}
            </Button>
          }
        />
      </Card>
    );
  }

  // Group checklist items by category for readability.
  const groups = dd.checklist.reduce<Record<string, DueDiligenceItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <Card hoverLift={false}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
          {t("dd.title")}
        </h3>
        <StatusPill status={dd.status} />
      </div>

      <div className="flex flex-col gap-5">
        {Object.entries(groups).map(([category, items]) => (
          <div key={category}>
            <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
              {category}
            </p>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <DdItem
                  key={item.item_id}
                  matchId={matchId}
                  ddId={dd.id}
                  item={item}
                  canSignOff={canSignOff}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DdItem({
  matchId,
  ddId,
  item,
  canSignOff,
}: {
  matchId: string;
  ddId: string;
  item: DueDiligenceItem;
  canSignOff: boolean;
}) {
  const t = useTranslations("investorPortal");
  const docs = useUploadDdItemDocument(matchId);
  const signOff = useSetDdItemStatus(matchId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function setStatus(status: "approved" | "rejected") {
    try {
      await signOff.mutateAsync({ ddId, itemId: item.item_id, status });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("dd.error"));
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      await docs.upload(ddId, item.item_id, file);
      toast.success(t("dd.uploaded"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("dd.error"));
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    setBusy(true);
    try {
      const { url } = await docs.downloadUrl(ddId, item.item_id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("dd.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--accent-border)] p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--ink)]">{item.title}</p>
        {item.filename ? (
          <p className="truncate text-xs text-[var(--text-muted)]">{item.filename}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <StatusPill status={item.status} label={t(`dd.status.${item.status}`)} />
        {item.document_r2_key ? (
          <button
            type="button"
            onClick={download}
            disabled={busy}
            aria-label={t("dd.download")}
            title={t("dd.download")}
            className="grid size-8 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
          >
            <Download className="size-4" aria-hidden />
          </button>
        ) : null}
        {canSignOff ? (
          <>
            <button
              type="button"
              onClick={() => setStatus("approved")}
              disabled={signOff.isPending}
              aria-label={t("dd.approve")}
              title={t("dd.approve")}
              className="grid size-8 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--p-success-fg)] hover:text-[var(--p-success-fg)] disabled:opacity-50"
            >
              <Check className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setStatus("rejected")}
              disabled={signOff.isPending}
              aria-label={t("dd.reject")}
              title={t("dd.reject")}
              className="grid size-8 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--p-danger-fg)] hover:text-[var(--p-danger-fg)] disabled:opacity-50"
            >
              <X className="size-4" aria-hidden />
            </button>
          </>
        ) : (
          <>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={onFile}
            />
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="gap-1.5"
            >
              <Upload className="size-3.5" aria-hidden />
              {item.document_r2_key ? t("dd.replace") : t("dd.upload")}
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
