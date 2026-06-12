"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Card } from "@/components/ds";
import { ErrorState } from "@/components/common/ErrorState";
import { Link, useRouter } from "@/i18n/navigation";
import { PortalPage, StatusPill } from "@/components/portal";
import { useMyProject, useUpdateProject } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { getCountry } from "@/lib/data/countries";
import { getSector } from "@/lib/data/sectors";
import type { FacilitatorProjectDetail } from "@/types/api";

const STAGES = ["concept", "pre_revenue", "revenue_generating", "expansion"] as const;
const FUNDING = ["equity", "debt", "jv", "ppp", "acquisition"] as const;

const controlClass =
  "w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3.5 py-2.5 font-sans text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]";
const labelClass =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]";

type EditForm = {
  title: string;
  brief_description: string;
  executive_summary: string;
  project_stage: string;
  funding_type: string;
  funding_required: string;
  min_investment: string;
  expected_roi_min: string;
  expected_roi_max: string;
  timeline_to_returns_months: string;
  use_of_funds: string;
};

function toFormValues(p: FacilitatorProjectDetail): EditForm {
  return {
    title: p.title,
    brief_description: p.brief_description,
    executive_summary: p.executive_summary ?? "",
    project_stage: p.project_stage,
    funding_type: p.funding_type,
    funding_required: String(Number(p.funding_required)),
    min_investment: p.min_investment ? String(Number(p.min_investment)) : "",
    expected_roi_min: p.expected_roi_min ? String(Number(p.expected_roi_min)) : "",
    expected_roi_max: p.expected_roi_max ? String(Number(p.expected_roi_max)) : "",
    timeline_to_returns_months:
      p.timeline_to_returns_months != null ? String(p.timeline_to_returns_months) : "",
    use_of_funds: p.use_of_funds ?? "",
  };
}

export default function EditProjectPage() {
  const t = useTranslations("facilitatorPortal");
  const params = useParams<{ id: string }>();
  const { data: project, isLoading, isError, refetch } = useMyProject(params.id);

  if (isLoading) {
    return (
      <div
        className="h-96 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
        aria-busy="true"
      />
    );
  }
  if (isError || !project) {
    return (
      <ErrorState
        title={t("notFound")}
        description={t("notFoundDesc")}
        onRetry={() => refetch()}
        action={
          <Button href="/facilitator/projects" variant="outline" size="sm">
            {t("backToProjects")}
          </Button>
        }
      />
    );
  }

  return <EditProjectForm project={project} />;
}

function EditProjectForm({ project }: { project: FacilitatorProjectDetail }) {
  const t = useTranslations("facilitatorPortal");
  const router = useRouter();
  const updateProject = useUpdateProject();
  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<EditForm>({ defaultValues: toFormValues(project) });

  const onSubmit = handleSubmit(async (values) => {
    // Optional numeric fields: empty string clears the value (null).
    const optNum = (v: string) => (v.trim() === "" ? null : Number(v));
    const optText = (v: string) => (v.trim() === "" ? null : v.trim());
    try {
      await updateProject.mutateAsync({
        projectId: project.id,
        body: {
          title: values.title.trim(),
          brief_description: values.brief_description.trim(),
          executive_summary: optText(values.executive_summary),
          project_stage: values.project_stage,
          funding_type: values.funding_type,
          funding_required: Number(values.funding_required),
          min_investment: optNum(values.min_investment),
          expected_roi_min: optNum(values.expected_roi_min),
          expected_roi_max: optNum(values.expected_roi_max),
          timeline_to_returns_months: optNum(values.timeline_to_returns_months),
          use_of_funds: optText(values.use_of_funds),
        },
      });
      toast.success(t("projectUpdated"));
      router.push(`/facilitator/projects/${project.id}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("projectUpdateError"));
    }
  });

  return (
    <PortalPage
      title={t("editProjectTitle")}
      description={t("editProjectDesc")}
      actions={<StatusPill status={project.status} />}
    >
      <Link
        href={`/facilitator/projects/${project.id}`}
        className="-mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] no-underline hover:underline"
      >
        <ArrowLeft size={15} aria-hidden />
        {t("backToProject")}
      </Link>

      <Card hoverLift={false} className="max-w-2xl">
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          {/* Sector and country are fixed after submission (re-review scope). */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className={labelClass}>{t("sector")}</span>
              <p className="px-0.5 py-1 text-sm text-[var(--text-body)]">
                {getSector(project.sector).name}
              </p>
            </div>
            <div>
              <span className={labelClass}>{t("country")}</span>
              <p className="px-0.5 py-1 text-sm text-[var(--text-body)]">
                {getCountry(project.country)?.name ?? project.country.toUpperCase()}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>
              {t("titleField")}
            </label>
            <input
              id="title"
              className={controlClass}
              aria-invalid={Boolean(errors.title)}
              {...field("title", { required: true })}
            />
            {errors.title ? (
              <p className="mt-1 text-xs text-[var(--p-danger)]">{t("fieldRequired")}</p>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="project_stage" className={labelClass}>
                {t("stageLabel")}
              </label>
              <select id="project_stage" className={controlClass} {...field("project_stage")}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {t(`stageOptions.${s}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="funding_type" className={labelClass}>
                {t("fundingTypeLabel")}
              </label>
              <select id="funding_type" className={controlClass} {...field("funding_type")}>
                {FUNDING.map((f) => (
                  <option key={f} value={f}>
                    {t(`fundingOptions.${f}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="funding_required" className={labelClass}>
                {t("fundingRequired")}
              </label>
              <input
                id="funding_required"
                className={controlClass}
                type="number"
                min={1}
                aria-invalid={Boolean(errors.funding_required)}
                {...field("funding_required", { required: true, min: 1 })}
              />
              {errors.funding_required ? (
                <p className="mt-1 text-xs text-[var(--p-danger)]">{t("fieldPositive")}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="min_investment" className={labelClass}>
                {t("minInvestment")}
              </label>
              <input
                id="min_investment"
                className={controlClass}
                type="number"
                min={0}
                {...field("min_investment")}
              />
            </div>
            <div>
              <label htmlFor="expected_roi_min" className={labelClass}>
                {t("roiMin")}
              </label>
              <input
                id="expected_roi_min"
                className={controlClass}
                type="number"
                step="0.1"
                {...field("expected_roi_min")}
              />
            </div>
            <div>
              <label htmlFor="expected_roi_max" className={labelClass}>
                {t("roiMax")}
              </label>
              <input
                id="expected_roi_max"
                className={controlClass}
                type="number"
                step="0.1"
                {...field("expected_roi_max")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="timeline_to_returns_months" className={labelClass}>
              {t("timelineToReturns")}
            </label>
            <input
              id="timeline_to_returns_months"
              className={controlClass}
              type="number"
              min={0}
              placeholder="24"
              {...field("timeline_to_returns_months")}
            />
          </div>

          <div>
            <label htmlFor="brief_description" className={labelClass}>
              {t("briefDescription")}
            </label>
            <textarea
              id="brief_description"
              className={`${controlClass} min-h-28`}
              maxLength={500}
              aria-invalid={Boolean(errors.brief_description)}
              {...field("brief_description", { required: true })}
            />
            {errors.brief_description ? (
              <p className="mt-1 text-xs text-[var(--p-danger)]">{t("fieldRequired")}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="executive_summary" className={labelClass}>
              {t("executiveSummary")}
            </label>
            <textarea
              id="executive_summary"
              className={`${controlClass} min-h-32`}
              {...field("executive_summary")}
            />
          </div>

          <div>
            <label htmlFor="use_of_funds" className={labelClass}>
              {t("useOfFunds")}
            </label>
            <textarea
              id="use_of_funds"
              className={`${controlClass} min-h-24`}
              {...field("use_of_funds")}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={updateProject.isPending}>
              {updateProject.isPending ? t("saving") : t("saveChanges")}
            </Button>
            <Button
              href={`/facilitator/projects/${project.id}`}
              variant="outline"
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </Card>
    </PortalPage>
  );
}
