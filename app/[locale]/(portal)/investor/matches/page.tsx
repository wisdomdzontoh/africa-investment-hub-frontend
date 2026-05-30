"use client";

import { useTranslations } from "next-intl";
import { ApprovalRequired } from "@/components/auth/PortalAuthGate";
import { BrandedCard } from "@/components/brand/Card";
import { useAccount, useInvestorMatches } from "@/lib/api/hooks";

export default function InvestorMatchesPage() {
  const { data: account } = useAccount();
  return (
    <ApprovalRequired status={account?.status}>
      <MatchesContent />
    </ApprovalRequired>
  );
}

function MatchesContent() {
  const t = useTranslations("investorPortal");
  const { data, isLoading } = useInvestorMatches();

  if (isLoading) return <p className="text-muted-foreground">{t("loading")}</p>;

  const items = data?.items ?? [];

  return (
    <div className="grid gap-3">
      {items.length === 0 ? (
        <BrandedCard className="p-6 text-sm text-muted-foreground">{t("noMatches")}</BrandedCard>
      ) : (
        items.map((match) => (
          <BrandedCard key={match.id} className="p-4">
            <p className="font-medium">{t("matchProject")}: {match.project_id}</p>
            <p className="text-sm text-muted-foreground">
              {t("status")}: {match.status}
              {match.score != null ? ` · ${t("score")}: ${match.score}` : ""}
            </p>
            {match.explanation && (
              <p className="mt-2 text-sm">{match.explanation}</p>
            )}
          </BrandedCard>
        ))
      )}
    </div>
  );
}
