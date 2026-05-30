"use client";

import { useTranslations } from "next-intl";
import { BrandedCard } from "@/components/brand/Card";
import { useInvestorProfile } from "@/lib/api/hooks";

export default function InvestorProfilePage() {
  const t = useTranslations("investorPortal");
  const { data: profile, isLoading, isError } = useInvestorProfile();

  if (isLoading) return <p className="text-muted-foreground">{t("loading")}</p>;
  if (isError || !profile) return <p className="text-muted-foreground">{t("noProfile")}</p>;

  return (
    <BrandedCard className="p-6">
      <h2 className="font-semibold">{profile.company_name}</h2>
      <dl className="mt-4 grid gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">{t("country")}</dt>
          <dd>{profile.country_of_registration}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("contact")}</dt>
          <dd>{profile.contact_name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("email")}</dt>
          <dd>{profile.contact_email ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("sectors")}</dt>
          <dd>{profile.investment_sectors.join(", ") || "—"}</dd>
        </div>
      </dl>
    </BrandedCard>
  );
}
