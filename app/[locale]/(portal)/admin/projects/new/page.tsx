"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { Button, Card } from "@/components/ds";
import { Link, useRouter } from "@/i18n/navigation";
import { useAdminCreateProject } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { SECTORS } from "@/lib/data/sectors";

type ProjectForm = {
  title: string;
  sector: string;
  country: string;
  brief_description: string;
  project_stage: string;
  funding_type: string;
  funding_required: string;
};

const STAGES = ["concept", "pre_revenue", "revenue_generating", "expansion"] as const;
const FUNDING = ["equity", "debt", "jv", "ppp", "acquisition"] as const;

const controlClass =
  "w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3.5 py-2.5 font-sans text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]";
const labelClass =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]";

export default function AdminNewProjectPage() {
  const t = useTranslations("adminPortal");
  const router = useRouter();
  const createProject = useAdminCreateProject();
  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectForm>({
    defaultValues: { project_stage: "concept", funding_type: "equity" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createProject.mutateAsync({
        ...values,
        country: values.country.toUpperCase(),
        funding_required: Number(values.funding_required),
      });
      toast.success(t("addProjectCreated"));
      router.push("/admin/projects");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  });

  return (
    <div>
      <AdminPageHeader title={t("addProjectTitle")} subtitle={t("addProjectSubtitle")} />

      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] no-underline hover:underline"
      >
        <ArrowLeft size={15} aria-hidden />
        {t("backToList")}
      </Link>

      <Card hoverLift={false} className="max-w-2xl">
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          <div>
            <label htmlFor="title" className={labelClass}>
              {t("apfTitle")}
            </label>
            <input
              id="title"
              className={controlClass}
              aria-invalid={Boolean(errors.title)}
              {...field("title", { required: true })}
            />
            {errors.title ? (
              <p className="mt-1 text-xs text-[var(--p-danger-fg)]">{t("apfRequired")}</p>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sector" className={labelClass}>
                {t("colSector")}
              </label>
              <select id="sector" className={controlClass} required {...field("sector")}>
                {SECTORS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="country" className={labelClass}>
                {t("colCountry")}
              </label>
              <input
                id="country"
                className={controlClass}
                required
                maxLength={2}
                placeholder="KE"
                {...field("country", { required: true, minLength: 2 })}
              />
            </div>
            <div>
              <label htmlFor="project_stage" className={labelClass}>
                {t("apfStage")}
              </label>
              <select id="project_stage" className={controlClass} {...field("project_stage")}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {t(`apfStageOptions.${s}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="funding_type" className={labelClass}>
                {t("apfFundingType")}
              </label>
              <select id="funding_type" className={controlClass} {...field("funding_type")}>
                {FUNDING.map((f) => (
                  <option key={f} value={f}>
                    {t(`apfFundingOptions.${f}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="funding_required" className={labelClass}>
              {t("apfFundingRequired")}
            </label>
            <input
              id="funding_required"
              className={controlClass}
              type="number"
              min={1}
              required
              placeholder="5000000"
              aria-invalid={Boolean(errors.funding_required)}
              {...field("funding_required", { required: true, min: 1 })}
            />
          </div>

          <div>
            <label htmlFor="brief_description" className={labelClass}>
              {t("apfBrief")}
            </label>
            <textarea
              id="brief_description"
              className={`${controlClass} min-h-28`}
              required
              maxLength={500}
              aria-invalid={Boolean(errors.brief_description)}
              {...field("brief_description", { required: true })}
            />
          </div>

          <p className="text-xs text-[var(--text-muted)]">{t("addProjectNote")}</p>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? t("apfSaving") : t("apfSubmit")}
            </Button>
            <Button href="/admin/projects" variant="outline">
              {t("cancel")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
