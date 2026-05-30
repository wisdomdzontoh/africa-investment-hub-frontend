"use client";

import { useTranslations } from "next-intl";
import { BrandedCard } from "@/components/brand/Card";
import { useAccount, useInvestorProfile } from "@/lib/api/hooks";

export default function InvestorOverviewPage() {
  const t = useTranslations("investorPortal");
  const { data: account } = useAccount();
  const { data: profile } = useInvestorProfile();

  return (
    <div className="grid gap-4">
      <BrandedCard className="p-6">
        <h2 className="font-semibold text-[var(--text-strong)]">{t("welcome")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("statusLabel")}: <strong>{account?.status}</strong>
        </p>
        {profile && (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("companyLabel")}: <strong>{profile.company_name}</strong>
          </p>
        )}
      </BrandedCard>
    </div>
  );
}
