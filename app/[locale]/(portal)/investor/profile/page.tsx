"use client";

import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, Card, Chip } from "@/components/ds";
import { PortalPage } from "@/components/portal";
import { useInvestorProfile } from "@/lib/api/hooks";
import { getCountry } from "@/lib/data/countries";
import { getSector } from "@/lib/data/sectors";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[var(--ink)]">{value || "—"}</dd>
    </div>
  );
}

function Chips({ values, kind }: { values: string[]; kind: "sector" | "country" }) {
  if (values.length === 0) return <span className="text-sm text-[var(--text-muted)]">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <Chip key={v} className="px-2.5 py-1 text-xs">
          {kind === "sector" ? getSector(v).name : (getCountry(v)?.name ?? v.toUpperCase())}
        </Chip>
      ))}
    </div>
  );
}

export default function InvestorProfilePage() {
  const t = useTranslations("investorPortal");
  const { data: profile, isLoading, isError } = useInvestorProfile();

  if (isLoading) return <p className="text-[var(--text-muted)]">{t("loading")}</p>;
  if (isError || !profile)
    return <p className="text-[var(--text-muted)]">{t("noProfile")}</p>;

  return (
    <PortalPage
      title={t("profile")}
      description={t("profileDesc")}
      actions={
        <Button href="/investor/profile/edit" variant="outline" size="sm" className="gap-1.5">
          <Pencil className="size-3.5" aria-hidden />
          {t("editProfile")}
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card hoverLift={false}>
          <h2 className="mb-4 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
            {t("secCompany")}
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Field label={t("companyLabel")} value={profile.company_name} />
            <Field
              label={t("country")}
              value={
                getCountry(profile.country_of_registration)?.name ??
                profile.country_of_registration
              }
            />
            <Field label={t("websiteLabel")} value={profile.website} />
            <Field label={t("addressLabel")} value={profile.registered_address} />
            <Field label={t("contact")} value={profile.contact_name} />
            <Field label={t("contactTitleLabel")} value={profile.contact_title} />
            <Field label={t("email")} value={profile.contact_email} />
            <Field label={t("phoneLabel")} value={profile.contact_phone} />
          </dl>
        </Card>

        <Card hoverLift={false}>
          <h2 className="mb-4 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
            {t("secInvestment")}
          </h2>
          <dl className="grid gap-4">
            <div>
              <dt className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
                {t("sectors")}
              </dt>
              <dd>
                <Chips values={profile.investment_sectors} kind="sector" />
              </dd>
            </div>
            <div>
              <dt className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
                {t("markets")}
              </dt>
              <dd>
                <Chips values={profile.investment_countries} kind="country" />
              </dd>
            </div>
            <Field label={t("riskLabel")} value={profile.risk_appetite} />
          </dl>
        </Card>
      </div>
    </PortalPage>
  );
}
