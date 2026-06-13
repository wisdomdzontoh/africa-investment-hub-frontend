"use client";

import { ArrowLeft, Download, FileText, Lock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ApprovalRequired } from "@/components/auth/PortalAuthGate";
import { Button, Card } from "@/components/ds";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Link } from "@/i18n/navigation";
import {
  DueDiligenceSection,
  MilestonesSection,
  PortalPage,
  StatusPill,
} from "@/components/portal";
import {
  useAccount,
  useDealRoom,
  useDealRoomDocument,
  useSetMatchConfidential,
  useSignNda,
} from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { fmtMoney } from "@/lib/format";
import { getCountry } from "@/lib/data/countries";
import { getSector } from "@/lib/data/sectors";
import type { DealRoomProject } from "@/types/api";

export default function DealRoomPage() {
  const { data: account } = useAccount();
  const t = useTranslations("investorPortal");
  return (
    <PortalPage title={t("dealRoom.title")} description={t("dealRoom.subtitle")}>
      <Link
        href="/investor/matches"
        className="-mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] no-underline hover:underline"
      >
        <ArrowLeft size={15} aria-hidden />
        {t("dealRoom.back")}
      </Link>
      <ApprovalRequired status={account?.status}>
        <DealRoomContent />
      </ApprovalRequired>
    </PortalPage>
  );
}

function DealRoomContent() {
  const t = useTranslations("investorPortal");
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useDealRoom(params.id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
          />
        ))}
      </div>
    );
  }
  if (isError || !data) {
    return <ErrorState title={t("dealRoom.notFound")} onRetry={() => refetch()} />;
  }

  const { match, project, nda_unlocked, can_sign_nda } = data;
  const score = match.score != null ? Math.round(match.score * 100) : null;

  return (
    <div className="flex flex-col gap-4">
      <Card hoverLift={false}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
                {project.title}
              </h2>
              <StatusPill status={match.status} />
            </div>
            <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.04em] text-[var(--text-muted)]">
              {getSector(project.sector).name}
              {" · "}
              {getCountry(project.country)?.name ?? project.country.toUpperCase()}
              {" · "}
              {fmtMoney(Number(project.funding_required))}
            </p>
          </div>
          {score != null ? (
            <div className="shrink-0 text-right">
              <div className="font-mono text-2xl font-bold leading-none text-[var(--accent)]">
                {score}
                <span className="text-sm">%</span>
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                {t("matchScore")}
              </div>
            </div>
          ) : null}
        </div>

        {project.executive_summary ? (
          <>
            <h3 className="mt-5 mb-2 text-sm font-semibold text-[var(--ink)]">
              {t("dealRoom.executiveSummary")}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-body)]">
              {project.executive_summary}
            </p>
          </>
        ) : null}
      </Card>

      {can_sign_nda ? (
        <NdaCard matchId={match.id} />
      ) : !nda_unlocked ? (
        <Card hoverLift={false} className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[var(--radius-icon)] bg-[var(--p-info-bg)] text-[var(--p-info-fg)]">
            <Lock className="size-4" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-[var(--ink)]">{t("dealRoom.awaitingTitle")}</p>
            <p className="mt-1 text-sm text-[var(--text-body)]">{t("dealRoom.awaitingBody")}</p>
          </div>
        </Card>
      ) : null}

      <ConfidentialToggle matchId={match.id} confidential={match.is_confidential} />

      {nda_unlocked ? (
        <>
          {project.full_description ? (
            <Card hoverLift={false}>
              <h3 className="mb-2 text-sm font-semibold text-[var(--ink)]">
                {t("dealRoom.fullBrief")}
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-body)]">
                {project.full_description}
              </p>
            </Card>
          ) : null}
          <DocumentsCard matchId={match.id} documents={project.documents} />
          <DueDiligenceSection matchId={match.id} />
          <MilestonesSection projectId={project.id} />
        </>
      ) : null}
    </div>
  );
}

function ConfidentialToggle({
  matchId,
  confidential,
}: {
  matchId: string;
  confidential: boolean;
}) {
  const t = useTranslations("investorPortal");
  const setConfidential = useSetMatchConfidential(matchId);

  async function toggle() {
    try {
      await setConfidential.mutateAsync(!confidential);
      toast.success(confidential ? t("dealRoom.confidentialOff") : t("dealRoom.confidentialOn"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("matchActionError"));
    }
  }

  return (
    <Card hoverLift={false} className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-[var(--ink)]">{t("dealRoom.confidentialTitle")}</p>
        <p className="mt-1 text-sm text-[var(--text-body)]">{t("dealRoom.confidentialBody")}</p>
      </div>
      <Button
        size="sm"
        variant={confidential ? "primary" : "outline"}
        disabled={setConfidential.isPending}
        onClick={toggle}
      >
        {confidential ? t("dealRoom.confidentialEnabled") : t("dealRoom.confidentialEnable")}
      </Button>
    </Card>
  );
}

function NdaCard({ matchId }: { matchId: string }) {
  const t = useTranslations("investorPortal");
  const sign = useSignNda(matchId);
  const [agreed, setAgreed] = useState(false);

  async function doSign() {
    try {
      await sign.mutateAsync();
      toast.success(t("dealRoom.ndaSigned"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("matchActionError"));
    }
  }

  return (
    <Card hoverLift={false} className="border-[var(--accent)]/40 bg-[var(--accent-tint-06)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-10)] text-[var(--accent)]">
          <ShieldCheck className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--ink)]">{t("dealRoom.ndaTitle")}</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-body)]">
            {t("dealRoom.ndaBody")}
          </p>
          <label className="mt-3 flex items-start gap-2 text-sm text-[var(--text-body)]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 size-4 accent-[var(--accent)]"
            />
            <span>{t("dealRoom.ndaConsent")}</span>
          </label>
          <Button
            className="mt-4 gap-1.5"
            size="sm"
            disabled={!agreed || sign.isPending}
            onClick={doSign}
          >
            <ShieldCheck className="size-3.5" aria-hidden />
            {sign.isPending ? t("dealRoom.signing") : t("dealRoom.signNda")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DocumentsCard({
  matchId,
  documents,
}: {
  matchId: string;
  documents: DealRoomProject["documents"];
}) {
  const t = useTranslations("investorPortal");
  const getDocUrl = useDealRoomDocument();
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function download(r2Key: string) {
    setBusyKey(r2Key);
    try {
      const { url } = await getDocUrl(matchId, r2Key);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("dealRoom.docError"));
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <Card hoverLift={false}>
      <h3 className="mb-4 text-sm font-semibold text-[var(--ink)]">{t("dealRoom.documents")}</h3>
      {documents.length === 0 ? (
        <EmptyState compact icon={FileText} title={t("dealRoom.noDocuments")} />
      ) : (
        <ul className="divide-y divide-[var(--accent-border)]">
          {documents.map((doc) => (
            <li key={doc.r2_key} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-08)] text-[var(--accent)]">
                  <FileText className="size-4" aria-hidden />
                </span>
                <p className="truncate text-sm font-medium text-[var(--ink)]">{doc.filename}</p>
              </div>
              <button
                type="button"
                onClick={() => download(doc.r2_key)}
                disabled={busyKey === doc.r2_key}
                aria-label={t("dealRoom.download")}
                title={t("dealRoom.download")}
                className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
              >
                <Download className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
