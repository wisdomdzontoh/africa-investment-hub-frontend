"use client";

import { Gauge, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { z } from "zod";
import {
  MoneyField,
  NumberField,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/onboarding/fields";
import { ChipMultiSelect } from "@/components/onboarding/ChipMultiSelect";
import { CountryComboField } from "@/components/onboarding/CountryComboField";
import { CheckGrid, RadioSegment } from "@/components/onboarding/RadioSegment";
import { RepeatableProjects } from "@/components/onboarding/RepeatableProjects";
import { DocsPrivacyNote, FileDropField } from "@/components/onboarding/documents";
import { useRegisterInvestor, useUploadInvestorDocuments } from "@/lib/api/hooks";
import { displayMoney } from "@/lib/onboarding/format";
import type { ReviewRow, WizardConfig } from "@/lib/onboarding/types";
import { COUNTRIES } from "@/lib/data/countries";
import { SECTORS } from "@/lib/data/sectors";
import { WORLD_COUNTRIES, worldCountryName } from "@/lib/data/world-countries";

/* ------------------------------ schema ---------------------------------- */

function buildSchema(tv: (k: string) => string) {
  const optStr = z.string().trim().optional();
  const optNum = z.number().nonnegative(tv("nonNegative")).optional();
  return z.object({
    // A — Company
    company_name: z.string().trim().min(1, tv("required")),
    country_of_registration: z.string().trim().min(1, tv("country")),
    registration_number: z.string().trim().min(1, tv("required")),
    years_of_operation: optNum,
    registered_address: optStr,
    website: optStr,
    contact_name: z.string().trim().min(1, tv("required")),
    contact_title: optStr,
    contact_email: z.string().trim().email(tv("email")),
    contact_phone: optStr,
    // B — Investment profile
    investment_countries: z.array(z.string()).min(1, tv("atLeastOneCountry")),
    investment_sectors: z.array(z.string()).min(1, tv("atLeastOneSector")),
    investment_types: z.array(z.string()).default([]),
    min_ticket_size: optNum,
    max_ticket_size: optNum,
    preferred_deal_size: optNum,
    capital_availability: optNum,
    // C — Risk & returns
    risk_appetite: z.enum(["low", "medium", "high"]).optional(),
    target_roi_min: optNum,
    target_roi_max: optNum,
    time_horizon: optStr,
    exit_strategy: optStr,
    preferred_ownership_structures: z.array(z.string()).default([]),
    preferred_ownership_pct_min: z.number().min(0).max(100).optional(),
    preferred_ownership_pct_max: z.number().min(0).max(100).optional(),
    // D — Compliance & ESG
    esg_requirements: optStr,
    sectors_excluded: z.array(z.string()).default([]),
    political_risk_tolerance: optStr,
    currency_risk_tolerance: optStr,
    // E — Track record
    previous_projects: z
      .array(
        z.object({
          project_name: z.string().trim().optional().default(""),
          country: z.string().optional().default(""),
          sector: z.string().optional().default(""),
          year: z.number().optional(),
        }),
      )
      .max(5)
      .default([]),
    certifications: optStr,
  });
}

export type InvestorForm = z.infer<ReturnType<typeof buildSchema>>;

/* --------------------------- payload builder ---------------------------- */

function toPayload(v: InvestorForm): Record<string, unknown> {
  const previous = (v.previous_projects ?? [])
    .filter((p) => p.project_name && p.project_name.trim())
    .map((p) => ({
      project_name: p.project_name,
      country: p.country || undefined,
      sector: p.sector || undefined,
      year: p.year,
    }));

  const raw: Record<string, unknown> = {
    ...v,
    country_of_registration: v.country_of_registration.toLowerCase(),
    previous_projects: previous,
  };

  // Drop empty strings and undefined so optional columns stay null server-side.
  for (const [k, val] of Object.entries(raw)) {
    if (val === "" || val === undefined || val === null) delete raw[k];
  }
  return raw;
}

/* ------------------------------ config ---------------------------------- */

export function useInvestorWizardConfig(): WizardConfig<InvestorForm> {
  const t = useTranslations("onboarding.investor");
  const tv = useTranslations("onboarding.investor.validation");
  const registerInvestor = useRegisterInvestor();
  const uploadDocs = useUploadInvestorDocuments();

  return useMemo<WizardConfig<InvestorForm>>(() => {
    const schema = buildSchema((k) => tv(k));

    const countryChips = COUNTRIES.map((c) => ({ value: c.code, label: c.name }));
    const worldCountries = WORLD_COUNTRIES.map((c) => ({ value: c.code, label: c.name }));
    const sectorChips = SECTORS.map((s) => ({ value: s.id, label: s.name }));
    const excludeChips = [
      ...sectorChips,
      { value: "tobacco", label: t("options.tobacco") },
      { value: "arms", label: t("options.arms") },
      { value: "gambling", label: t("options.gambling") },
    ];
    const investmentTypeChips = [
      { value: "equity", label: t("options.equity") },
      { value: "jv", label: t("options.jv") },
      { value: "debt", label: t("options.debt") },
      { value: "ppp", label: t("options.ppp") },
      { value: "acquisition", label: t("options.acquisition") },
    ];
    const ownershipOptions = [
      { value: "full", label: t("options.ownFull") },
      { value: "jv", label: t("options.ownJv") },
      { value: "bot", label: t("options.ownBot") },
      { value: "lease", label: t("options.ownLease") },
      { value: "ppp", label: t("options.ownPpp") },
      { value: "minority", label: t("options.ownMinority") },
    ];
    const horizonOptions = ["1-3", "3-5", "5-7", "7-10", "10+"].map((v) => ({
      value: v,
      label: t(`options.horizon.${v}` as never),
    }));
    const exitOptions = ["trade_sale", "ipo", "buyback", "long_term_hold", "bot"].map((v) => ({
      value: v,
      label: t(`options.exit.${v}` as never),
    }));
    const polRiskOptions = ["conservative", "moderate", "opportunistic"].map((v) => ({
      value: v,
      label: t(`options.polRisk.${v}` as never),
    }));
    const fxRiskOptions = ["hedged", "partial", "full"].map((v) => ({
      value: v,
      label: t(`options.fxRisk.${v}` as never),
    }));

    const f = (k: string) => t(`fields.${k}.label`);
    const ph = (k: string) => t(`fields.${k}.placeholder`);

    return {
      role: "investor",
      schema,
      defaultValues: {
        investment_countries: [],
        investment_sectors: [],
        investment_types: [],
        preferred_ownership_structures: [],
        sectors_excluded: [],
        previous_projects: [],
      } as Partial<InvestorForm> as never,
      reviewTitle: t("review.title"),
      reviewSubtitle: t("review.subtitle"),
      consentLabel: t("review.consent"),
      submitLabel: t("review.submit"),
      submittingLabel: t("review.submitting"),
      editLabel: t("review.edit"),
      doneRedirect: "/investor",
      steps: [
        {
          id: "company",
          badge: "A",
          label: t("steps.company.label"),
          title: t("steps.company.title"),
          subtitle: t("steps.company.subtitle"),
          fields: [
            "company_name",
            "country_of_registration",
            "registration_number",
            "contact_name",
            "contact_email",
          ],
          render: () => (
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField name="company_name" label={f("companyName")} required placeholder={ph("companyName")} />
                <CountryComboField
                  name="country_of_registration"
                  label={f("regCountry")}
                  required
                  placeholder={ph("regCountry")}
                  options={worldCountries}
                />
                <TextField name="registration_number" label={f("regNumber")} required placeholder={ph("regNumber")} />
                <NumberField name="years_of_operation" label={f("years")} placeholder={ph("years")} min={0} />
                <TextField name="registered_address" label={f("address")} placeholder={ph("address")} />
                <TextField name="website" label={f("website")} type="url" placeholder={ph("website")} />
              </div>
              <p className="border-t border-border pt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("dividers.primaryContact")}
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField name="contact_name" label={f("contactName")} required placeholder={ph("contactName")} />
                <TextField name="contact_title" label={f("contactTitle")} placeholder={ph("contactTitle")} />
                <TextField name="contact_email" label={f("contactEmail")} required type="email" placeholder={ph("contactEmail")} />
                <TextField name="contact_phone" label={f("contactPhone")} type="tel" placeholder={ph("contactPhone")} />
              </div>
            </div>
          ),
          summary: (v): ReviewRow[] => [
            { label: f("companyName"), value: v.company_name || "—", missing: !v.company_name },
            { label: f("regCountry"), value: worldCountryName(v.country_of_registration) },
            { label: f("contactName"), value: v.contact_name || "—" },
          ],
        },
        {
          id: "profile",
          badge: "B",
          label: t("steps.profile.label"),
          title: t("steps.profile.title"),
          subtitle: t("steps.profile.subtitle"),
          fields: ["investment_countries", "investment_sectors"],
          render: () => (
            <div className="flex flex-col gap-6">
              <ChipMultiSelect
                name="investment_countries"
                label={f("investCountries")}
                required
                hint={t("fields.investCountries.hint")}
                options={countryChips}
                searchable
                searchPlaceholder={ph("investCountries")}
                collapseAfter={18}
              />
              <ChipMultiSelect name="investment_sectors" label={f("investSectors")} required options={sectorChips} />
              <ChipMultiSelect name="investment_types" label={f("investTypes")} options={investmentTypeChips} />
              <div className="grid gap-5 sm:grid-cols-2">
                <MoneyField name="min_ticket_size" label={f("minTicket")} placeholder={ph("minTicket")} />
                <MoneyField name="max_ticket_size" label={f("maxTicket")} placeholder={ph("maxTicket")} />
                <MoneyField name="preferred_deal_size" label={f("dealSize")} placeholder={ph("dealSize")} />
                <MoneyField name="capital_availability" label={f("capital")} placeholder={ph("capital")} />
              </div>
            </div>
          ),
          summary: (v): ReviewRow[] => [
            { label: f("investCountries"), value: t("summary.countSelected", { count: v.investment_countries?.length ?? 0 }) },
            { label: f("investSectors"), value: t("summary.countSelected", { count: v.investment_sectors?.length ?? 0 }) },
            { label: f("minTicket"), value: `${displayMoney(v.min_ticket_size)} – ${displayMoney(v.max_ticket_size)}` },
          ],
        },
        {
          id: "risk",
          badge: "C",
          label: t("steps.risk.label"),
          title: t("steps.risk.title"),
          subtitle: t("steps.risk.subtitle"),
          fields: [],
          render: () => (
            <div className="flex flex-col gap-6">
              <RadioSegment
                name="risk_appetite"
                label={f("risk")}
                options={[
                  { value: "low", label: t("options.riskLow"), icon: ShieldCheck },
                  { value: "medium", label: t("options.riskMedium"), icon: Gauge },
                  { value: "high", label: t("options.riskHigh"), icon: TriangleAlert },
                ]}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <NumberField name="target_roi_min" label={f("roiMin")} placeholder={ph("roiMin")} hint={t("fields.roiMin.hint")} />
                <NumberField name="target_roi_max" label={f("roiMax")} placeholder={ph("roiMax")} hint={t("fields.roiMax.hint")} />
                <SelectField name="time_horizon" label={f("horizon")} placeholder={ph("horizon")} options={horizonOptions} />
                <SelectField name="exit_strategy" label={f("exit")} placeholder={ph("exit")} options={exitOptions} />
              </div>
              <CheckGrid name="preferred_ownership_structures" label={f("ownership")} options={ownershipOptions} />
              <div className="grid gap-5 sm:grid-cols-2">
                <NumberField name="preferred_ownership_pct_min" label={f("ownMin")} placeholder={ph("ownMin")} min={0} max={100} />
                <NumberField name="preferred_ownership_pct_max" label={f("ownMax")} placeholder={ph("ownMax")} min={0} max={100} />
              </div>
            </div>
          ),
          summary: (v): ReviewRow[] => [
            { label: f("risk"), value: v.risk_appetite ? t(`options.risk${cap(v.risk_appetite)}` as never) : "—" },
            { label: f("roiMin"), value: roiRange(v.target_roi_min, v.target_roi_max) },
          ],
        },
        {
          id: "compliance",
          badge: "D",
          label: t("steps.compliance.label"),
          title: t("steps.compliance.title"),
          subtitle: t("steps.compliance.subtitle"),
          fields: [],
          render: () => (
            <div className="flex flex-col gap-6">
              <TextareaField name="esg_requirements" label={f("esg")} hint={t("fields.esg.hint")} placeholder={ph("esg")} />
              <ChipMultiSelect name="sectors_excluded" label={f("excluded")} hint={t("fields.excluded.hint")} options={excludeChips} />
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField name="political_risk_tolerance" label={f("polRisk")} placeholder={ph("polRisk")} options={polRiskOptions} />
                <SelectField name="currency_risk_tolerance" label={f("fxRisk")} placeholder={ph("fxRisk")} options={fxRiskOptions} />
              </div>
            </div>
          ),
          summary: (v): ReviewRow[] => [
            { label: f("excluded"), value: t("summary.countSectors", { count: v.sectors_excluded?.length ?? 0 }) },
          ],
        },
        {
          id: "track",
          badge: "E",
          label: t("steps.track.label"),
          title: t("steps.track.title"),
          subtitle: t("steps.track.subtitle"),
          fields: [],
          render: () => (
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">{t("fields.previousProjects.label")}</p>
                <RepeatableProjects
                  name="previous_projects"
                  addLabel={t("fields.previousProjects.add")}
                  emptyHint={t("fields.previousProjects.empty")}
                  max={5}
                  labels={{
                    projectName: t("fields.previousProjects.name"),
                    country: t("fields.previousProjects.country"),
                    sector: t("fields.previousProjects.sector"),
                    year: t("fields.previousProjects.year"),
                  }}
                  countryOptions={worldCountries}
                  sectorOptions={sectorChips}
                />
              </div>
              <TextareaField name="certifications" label={f("certifications")} hint={t("fields.certifications.hint")} placeholder={ph("certifications")} />
            </div>
          ),
          summary: (v): ReviewRow[] => [
            {
              label: f("previousProjects"),
              value: t("summary.countReferences", {
                count: (v.previous_projects ?? []).filter((p) => p.project_name?.trim()).length,
              }),
            },
          ],
        },
        {
          id: "documents",
          badge: "F",
          label: t("steps.documents.label"),
          title: t("steps.documents.title"),
          subtitle: t("steps.documents.subtitle"),
          fields: [],
          render: () => (
            <div className="flex flex-col gap-5">
              <DocsPrivacyNote text={t("documents.note")} />
              <div className="grid gap-5 sm:grid-cols-2">
                <FileDropField docType="company_registration" label={t("documents.registration")} hint={t("documents.optionalHint")} />
                <FileDropField docType="aml_certificate" label={t("documents.aml")} hint={t("documents.optionalHint")} />
                <FileDropField docType="proof_of_capacity" label={t("documents.capacity")} hint={t("documents.capacityHint")} />
                <FileDropField docType="additional" label={t("documents.additional")} hint={t("documents.optionalHint")} multi />
              </div>
            </div>
          ),
        },
      ],
      onSubmit: async (values, documents) => {
        await registerInvestor.mutateAsync(toPayload(values));
        if (documents.length > 0) {
          try {
            await uploadDocs(documents);
          } catch {
            // Profile is saved; documents are best-effort (R2 may be unconfigured).
            const { toast } = await import("sonner");
            toast.warning(t("documents.uploadFailed"));
          }
        }
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, tv]);
}

/* ------------------------------ helpers --------------------------------- */

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function roiRange(min?: number, max?: number): string {
  if (min === undefined && max === undefined) return "—";
  return `${min ?? "—"}% – ${max ?? "—"}%`;
}
