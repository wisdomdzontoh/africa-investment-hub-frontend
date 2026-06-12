"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApprovalRequired } from "@/components/auth/PortalAuthGate";
import { Button, Card } from "@/components/ds";
import { PortalPage, StatusPill } from "@/components/portal";
import { useAccount, useInvestorMatches } from "@/lib/api/hooks";

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

function ComingSoon() {
  const t = useTranslations("investorPortal");
  return (
    <Card hoverLift={false} className="flex flex-col items-center gap-3 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-08)] text-[var(--accent)]">
        <Sparkles size={22} aria-hidden />
      </span>
      <p className="max-w-md text-sm text-[var(--text-muted)]">{t("matchesComingSoon")}</p>
    </Card>
  );
}

function MatchesContent() {
  const t = useTranslations("investorPortal");
  const { data, isLoading, isError } = useInvestorMatches();

  if (isLoading) return <p className="text-[var(--text-muted)]">{t("loading")}</p>;

  const items = data?.items ?? [];
  // Matching is Phase 2 — until the engine is live the endpoint is empty/guarded.
  if (isError || items.length === 0) return <ComingSoon />;

  return (
    <div className="grid gap-3">
      {items.map((match) => (
        <Card key={match.id} hoverLift={false} padding="20px">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-[var(--ink)]">{t("matchProject")}</p>
              {match.explanation ? (
                <p className="mt-1 text-sm text-[var(--text-body)]">{match.explanation}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {match.score != null ? (
                <span className="font-mono text-sm font-bold text-[var(--accent)]">
                  {Math.round(match.score)}
                </span>
              ) : null}
              <StatusPill status={match.status} />
            </div>
          </div>
          <Button href={`/opportunities/${match.project_id}`} variant="outline" size="sm" className="mt-4">
            {t("viewProject")}
          </Button>
        </Card>
      ))}
    </div>
  );
}
