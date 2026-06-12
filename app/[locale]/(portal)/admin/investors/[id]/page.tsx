"use client";

import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import {
  DetailGrid,
  DetailSection,
  DocumentList,
  Field,
  TagList,
} from "@/components/admin/DetailView";
import { RejectDialog } from "@/components/admin/RejectDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ds";
import { Link } from "@/i18n/navigation";
import { useAdminInvestor, useSetInvestorStatus, type InvestorAction } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { displayMoney } from "@/lib/onboarding/format";
import { worldCountryName } from "@/lib/data/world-countries";

export default function AdminInvestorDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const t = useTranslations("adminPortal");
  const locale = useLocale();
  const { data: inv, isLoading, isError } = useAdminInvestor(id);
  const setStatus = useSetInvestorStatus();

  async function act(action: InvestorAction, reason?: string) {
    try {
      await setStatus.mutateAsync({ id, action, reason });
      toast.success(t(action === "approve" ? "approved" : "rejected"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  if (isLoading) return <p className="text-muted-foreground">{t("loading")}</p>;
  if (isError || !inv) return <p className="text-muted-foreground">{t("notFound")}</p>;

  const roi =
    inv.target_roi_min || inv.target_roi_max
      ? `${inv.target_roi_min ?? "—"}% – ${inv.target_roi_max ?? "—"}%`
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/admin/investors"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> {t("backToList")}
      </Link>

      <AdminPageHeader
        title={inv.company_name}
        subtitle={`${worldCountryName(inv.country_of_registration)} · ${t("submitted")} ${new Date(inv.created_at).toLocaleDateString(locale, { dateStyle: "medium" })}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={inv.status} label={t(`filter.${inv.status}`)} />
            {inv.status === "pending" && (
              <>
                <RejectDialog
                  triggerLabel={t("reject")}
                  pending={setStatus.isPending}
                  onConfirm={(reason) => act("reject", reason)}
                />
                <Button disabled={setStatus.isPending} onClick={() => act("approve")}>
                  {t("approve")}
                </Button>
              </>
            )}
          </div>
        }
      />

      <DetailSection title={t("secCompany")}>
        <DetailGrid>
          <Field label={t("fCompanyName")} value={inv.company_name} />
          <Field label={t("fRegCountry")} value={worldCountryName(inv.country_of_registration)} />
          <Field label={t("fRegNumber")} value={inv.registration_number} />
          <Field label={t("fYears")} value={inv.years_of_operation} />
          <Field label={t("fAddress")} value={inv.registered_address} full />
          <Field label={t("fWebsite")} value={inv.website} />
          <Field label={t("fContactName")} value={inv.contact_name} />
          <Field label={t("fContactTitle")} value={inv.contact_title} />
          <Field label={t("fContactEmail")} value={inv.contact_email} />
          <Field label={t("fContactPhone")} value={inv.contact_phone} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title={t("secInvestment")}>
        <DetailGrid>
          <Field label={t("fCountries")} value={<TagList items={inv.investment_countries} />} full />
          <Field label={t("fSectors")} value={<TagList items={inv.investment_sectors} />} full />
          <Field label={t("fTypes")} value={<TagList items={inv.investment_types} />} full />
          <Field label={t("fMinTicket")} value={displayMoney(inv.min_ticket_size)} />
          <Field label={t("fMaxTicket")} value={displayMoney(inv.max_ticket_size)} />
          <Field label={t("fDealSize")} value={displayMoney(inv.preferred_deal_size)} />
          <Field label={t("fCapital")} value={displayMoney(inv.capital_availability)} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title={t("secRisk")}>
        <DetailGrid>
          <Field label={t("fRisk")} value={inv.risk_appetite} />
          <Field label={t("fRoi")} value={roi} />
          <Field label={t("fHorizon")} value={inv.time_horizon} />
          <Field label={t("fExit")} value={inv.exit_strategy} />
          <Field label={t("fOwnership")} value={<TagList items={inv.preferred_ownership_structures} />} full />
        </DetailGrid>
      </DetailSection>

      <DetailSection title={t("secCompliance")}>
        <DetailGrid>
          <Field label={t("fEsg")} value={inv.esg_requirements} full />
          <Field label={t("fExcluded")} value={<TagList items={inv.sectors_excluded} />} full />
          <Field label={t("fPolRisk")} value={inv.political_risk_tolerance} />
          <Field label={t("fFxRisk")} value={inv.currency_risk_tolerance} />
        </DetailGrid>
      </DetailSection>

      {inv.previous_projects.length > 0 && (
        <DetailSection title={t("secTrack")}>
          <ul className="flex flex-col gap-2">
            {inv.previous_projects.map((p, i) => (
              <li key={i} className="rounded-[var(--radius-base)] border border-border bg-background px-3 py-2 text-sm">
                <span className="font-medium text-foreground">{p.project_name}</span>
                <span className="text-muted-foreground">
                  {[p.country, p.sector, p.year].filter(Boolean).join(" · ") &&
                    ` — ${[p.country, p.sector, p.year].filter(Boolean).join(" · ")}`}
                </span>
              </li>
            ))}
          </ul>
          {inv.certifications && <p className="mt-3 text-sm text-muted-foreground">{inv.certifications}</p>}
        </DetailSection>
      )}

      <DetailSection title={t("secDocuments")}>
        <DocumentList documents={inv.documents} emptyLabel={t("noDocuments")} />
      </DetailSection>
    </div>
  );
}
