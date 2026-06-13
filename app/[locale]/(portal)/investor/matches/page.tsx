"use client";

import { Check, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ApprovalRequired } from "@/components/auth/PortalAuthGate";
import { Button, Card } from "@/components/ds";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PortalPage, StatusPill } from "@/components/portal";
import { ApiError } from "@/lib/api/client";
import {
  useAccount,
  useDismissMatch,
  useExpressInterest,
  useInvestorMatches,
} from "@/lib/api/hooks";
import { fmtMoney } from "@/lib/format";
import { getCountry } from "@/lib/data/countries";
import { getSector } from "@/lib/data/sectors";
import type { MatchItem } from "@/types/api";

// Statuses where the investor can still accept or pass on a recommendation.
const ACTIONABLE = new Set(["admin_reviewed", "investor_notified"]);

export default function InvestorMatchesPage() {
  const { data: account } = useAccount();
  const t = useTranslations("investorPortal");

  return (
    <PortalPage title={t("matches")} description={t("matchesDesc")}>
      <ApprovalRequired status={account?.status}>
        <MatchesContent />
      </ApprovalRequired>
    </PortalPage>
  );
}

function MatchesContent() {
  const t = useTranslations("investorPortal");
  const { data, isLoading, isError, refetch } = useInvestorMatches();

  if (isLoading) {
    return (
      <div className="grid gap-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
          />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const items = data?.items ?? [];
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title={t("matchesEmptyTitle")}
        description={t("matchesEmptyBody")}
      />
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

function MatchCard({ match }: { match: MatchItem }) {
  const t = useTranslations("investorPortal");
  const interest = useExpressInterest();
  const dismiss = useDismissMatch();
  const busy = interest.isPending || dismiss.isPending;

  const project = match.project;
  const score = match.score != null ? Math.round(match.score * 100) : null;
  const canAct = ACTIONABLE.has(match.status);

  async function act(kind: "interest" | "dismiss") {
    try {
      if (kind === "interest") {
        await interest.mutateAsync(match.id);
        toast.success(t("interestRegistered"));
      } else {
        await dismiss.mutateAsync(match.id);
        toast.success(t("matchDismissed"));
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("matchActionError"));
    }
  }

  return (
    <Card hoverLift={false} padding="20px">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
              {project.title}
            </h3>
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

      {match.explanation ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">
          {match.explanation}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button href={`/opportunities/${match.project_id}`} variant="outline" size="sm">
          {t("viewProject")}
        </Button>
        {canAct ? (
          <>
            <Button
              size="sm"
              disabled={busy}
              onClick={() => act("interest")}
              className="gap-1.5"
            >
              <Check className="size-3.5" aria-hidden />
              {t("expressInterest")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => act("dismiss")}
              className="gap-1.5"
            >
              <X className="size-3.5" aria-hidden />
              {t("dismissMatch")}
            </Button>
          </>
        ) : match.status === "investor_interested" ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--p-success-fg)]">
            <Check className="size-3.5" aria-hidden />
            {t("interestOnRecord")}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
