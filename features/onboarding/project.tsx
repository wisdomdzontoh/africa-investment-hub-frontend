"use client";

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
import { CountryComboField } from "@/components/onboarding/CountryComboField";
import { DocsPrivacyNote, FileDropField } from "@/components/onboarding/documents";
import { useCreateProject, useUploadProjectDocuments } from "@/lib/api/hooks";
import { displayMoney } from "@/lib/onboarding/format";
import type { ReviewRow, WizardConfig } from "@/lib/onboarding/types";
import type { ProjectDetail } from "@/types/api";
import { COUNTRIES } from "@/lib/data/countries";
import { SECTORS } from "@/lib/data/sectors";

function countryName(code: string | undefined): string {
  if (!code) return "—";
  return COUNTRIES.find((c) => c.code === code.toLowerCase())?.name ?? code.toUpperCase();
}

/* ------------------------------ schema ---------------------------------- */

function buildSchema(tv: (k: string) => string) {
  const optStr = z.string().trim().optional();
  const optNum = z.number().nonnegative(tv("nonNegative")).optional();
  return z.object({
    // 1 — Basics
    title: z.string().trim().min(1, tv("required")).max(255),
    sector: z.string().trim().min(1, tv("required")),
    country: z.string().trim().min(1, tv("country")),
    project_stage: z.enum(["concept", "pre_revenue", "revenue_generating", "expansion"], {
      message: tv("required"),
    }),
    brief_description: z.string().trim().min(1, tv("required")).max(500, tv("max500")),
    // 2 — Funding
    funding_required: z
      .number({ message: tv("required") })
      .positive(tv("positive")),
    funding_type: z.enum(["equity", "debt", "jv", "ppp", "acquisition"], {
      message: tv("required"),
    }),
    min_investment: optNum,
    existing_funding: optNum,
    use_of_funds: optStr,
    // 3 — Returns & financials
    expected_roi_min: optNum,
    expected_roi_max: optNum,
    timeline_to_returns_months: optNum,
    current_annual_revenue: optNum,
    projected_revenue_12m: optNum,
    projected_revenue_24m: optNum,
    projected_revenue_36m: optNum,
    executive_summary: optStr,
    full_description: optStr,
  });
}

export type ProjectForm = z.infer<ReturnType<typeof buildSchema>>;

function toPayload(v: ProjectForm): Record<string, unknown> {
  const raw: Record<string, unknown> = { ...v, country: v.country.toLowerCase() };
  for (const [k, val] of Object.entries(raw)) {
    if (val === "" || val === undefined || val === null) delete raw[k];
  }
  return raw;
}

/* ------------------------------ config ---------------------------------- */

export function useProjectWizardConfig(): WizardConfig<ProjectForm> {
  const t = useTranslations("onboarding.project");
  const tv = useTranslations("onboarding.project.validation");
  const createProject = useCreateProject();
  const uploadDocs = useUploadProjectDocuments();

  return useMemo<WizardConfig<ProjectForm>>(() => {
    const schema = buildSchema((k) => tv(k));
    const sectorOptions = SECTORS.map((s) => ({ value: s.id, label: s.name }));
    const countryOptions = COUNTRIES.map((c) => ({ value: c.code, label: c.name }));
    const stageOptions = ["concept", "pre_revenue", "revenue_generating", "expansion"].map((v) => ({
      value: v,
      label: t(`options.stage.${v}` as never),
    }));
    const fundingTypeOptions = ["equity", "debt", "jv", "ppp", "acquisition"].map((v) => ({
      value: v,
      label: t(`options.fundingType.${v}` as never),
    }));

    const f = (k: string) => t(`fields.${k}.label`);
    const ph = (k: string) => t(`fields.${k}.placeholder`);

    return {
      role: "project_owner",
      schema,
      defaultValues: {} as Partial<ProjectForm> as never,
      reviewTitle: t("review.title"),
      reviewSubtitle: t("review.subtitle"),
      consentLabel: t("review.consent"),
      submitLabel: t("review.submit"),
      submittingLabel: t("review.submitting"),
      editLabel: t("review.edit"),
      doneRedirect: "/project-owner",
      steps: [
        {
          id: "basics",
          badge: "1",
          label: t("steps.basics.label"),
          title: t("steps.basics.title"),
          subtitle: t("steps.basics.subtitle"),
          fields: ["title", "sector", "country", "project_stage", "brief_description"],
          render: () => (
            <div className="flex flex-col gap-5">
              <TextField name="title" label={f("title")} required placeholder={ph("title")} maxLength={255} />
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField name="sector" label={f("sector")} required placeholder={ph("sector")} options={sectorOptions} />
                <CountryComboField name="country" label={f("country")} required placeholder={ph("country")} options={countryOptions} />
                <SelectField name="project_stage" label={f("stage")} required placeholder={ph("stage")} options={stageOptions} />
              </div>
              <TextareaField
                name="brief_description"
                label={f("brief")}
                required
                hint={t("fields.brief.hint")}
                placeholder={ph("brief")}
                maxLength={500}
              />
            </div>
          ),
          summary: (v): ReviewRow[] => [
            { label: f("title"), value: v.title || "—", missing: !v.title },
            { label: f("sector"), value: SECTORS.find((s) => s.id === v.sector)?.name ?? "—" },
            { label: f("country"), value: countryName(v.country) },
          ],
        },
        {
          id: "funding",
          badge: "2",
          label: t("steps.funding.label"),
          title: t("steps.funding.title"),
          subtitle: t("steps.funding.subtitle"),
          fields: ["funding_required", "funding_type"],
          render: () => (
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <MoneyField name="funding_required" label={f("fundingRequired")} required placeholder={ph("fundingRequired")} />
                <SelectField name="funding_type" label={f("fundingType")} required placeholder={ph("fundingType")} options={fundingTypeOptions} />
                <MoneyField name="min_investment" label={f("minInvestment")} placeholder={ph("minInvestment")} />
                <MoneyField name="existing_funding" label={f("existingFunding")} placeholder={ph("existingFunding")} />
              </div>
              <TextareaField name="use_of_funds" label={f("useOfFunds")} hint={t("fields.useOfFunds.hint")} placeholder={ph("useOfFunds")} />
            </div>
          ),
          summary: (v): ReviewRow[] => [
            { label: f("fundingRequired"), value: displayMoney(v.funding_required) },
            {
              label: f("fundingType"),
              value: v.funding_type ? t(`options.fundingType.${v.funding_type}` as never) : "—",
            },
          ],
        },
        {
          id: "financials",
          badge: "3",
          label: t("steps.financials.label"),
          title: t("steps.financials.title"),
          subtitle: t("steps.financials.subtitle"),
          fields: [],
          render: () => (
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <NumberField name="expected_roi_min" label={f("roiMin")} placeholder={ph("roiMin")} hint={t("fields.roiMin.hint")} />
                <NumberField name="expected_roi_max" label={f("roiMax")} placeholder={ph("roiMax")} hint={t("fields.roiMax.hint")} />
                <NumberField name="timeline_to_returns_months" label={f("timeline")} placeholder={ph("timeline")} min={0} />
                <MoneyField name="current_annual_revenue" label={f("currentRevenue")} placeholder={ph("currentRevenue")} />
              </div>
              <p className="border-t border-border pt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("dividers.projections")}
              </p>
              <div className="grid gap-5 sm:grid-cols-3">
                <MoneyField name="projected_revenue_12m" label={f("rev12")} placeholder={ph("rev12")} />
                <MoneyField name="projected_revenue_24m" label={f("rev24")} placeholder={ph("rev24")} />
                <MoneyField name="projected_revenue_36m" label={f("rev36")} placeholder={ph("rev36")} />
              </div>
              <TextareaField name="executive_summary" label={f("execSummary")} hint={t("fields.execSummary.hint")} placeholder={ph("execSummary")} rows={4} />
              <TextareaField name="full_description" label={f("fullDescription")} hint={t("fields.fullDescription.hint")} placeholder={ph("fullDescription")} rows={5} />
            </div>
          ),
          summary: (v): ReviewRow[] => [
            {
              label: f("roiMin"),
              value:
                v.expected_roi_min === undefined && v.expected_roi_max === undefined
                  ? "—"
                  : `${v.expected_roi_min ?? "—"}% – ${v.expected_roi_max ?? "—"}%`,
            },
          ],
        },
        {
          id: "documents",
          badge: "4",
          label: t("steps.documents.label"),
          title: t("steps.documents.title"),
          subtitle: t("steps.documents.subtitle"),
          fields: [],
          render: () => (
            <div className="flex flex-col gap-5">
              <DocsPrivacyNote text={t("documents.note")} />
              <div className="grid gap-5 sm:grid-cols-2">
                <FileDropField docType="business_plan" label={t("documents.businessPlan")} hint={t("documents.optionalHint")} />
                <FileDropField docType="financial_model" label={t("documents.financials")} hint={t("documents.optionalHint")} />
                <FileDropField docType="pitch_deck" label={t("documents.pitchDeck")} hint={t("documents.optionalHint")} />
                <FileDropField docType="additional" label={t("documents.additional")} hint={t("documents.optionalHint")} multi />
              </div>
            </div>
          ),
        },
      ],
      onSubmit: async (values, documents) => {
        const project = (await createProject.mutateAsync(toPayload(values))) as ProjectDetail;
        if (documents.length > 0 && project?.id) {
          try {
            await uploadDocs(project.id, documents);
          } catch {
            const { toast } = await import("sonner");
            toast.warning(t("documents.uploadFailed"));
          }
        }
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, tv]);
}
