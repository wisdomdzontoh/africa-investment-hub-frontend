"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Card } from "@/components/ds";
import { PortalPage } from "@/components/portal";
import { useRouter } from "@/i18n/navigation";
import { useCreateProject } from "@/lib/api/hooks";
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

export default function NewProjectPage() {
  const t = useTranslations("facilitatorPortal");
  const router = useRouter();
  const createProject = useCreateProject();
  const { register: field, handleSubmit } = useForm<ProjectForm>({
    defaultValues: { project_stage: "concept", funding_type: "equity" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const project = await createProject.mutateAsync({
        ...values,
        country: values.country.toUpperCase(),
        funding_required: Number(values.funding_required),
      });
      toast.success(t("projectCreated"));
      router.push(`/facilitator/projects/${project.id}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("projectError"));
    }
  });

  return (
    <PortalPage title={t("newProject")} description={t("newProjectDesc")}>
      <Card hoverLift={false} className="max-w-2xl">
        <form onSubmit={onSubmit} className="grid gap-5">
          <div>
            <label htmlFor="title" className={labelClass}>{t("titleField")}</label>
            <input id="title" className={controlClass} required {...field("title")} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sector" className={labelClass}>{t("sector")}</label>
              <select id="sector" className={controlClass} required {...field("sector")}>
                {SECTORS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="country" className={labelClass}>{t("country")}</label>
              <input
                id="country"
                className={controlClass}
                required
                maxLength={2}
                placeholder="KE"
                {...field("country")}
              />
            </div>
            <div>
              <label htmlFor="project_stage" className={labelClass}>{t("stageLabel")}</label>
              <select id="project_stage" className={controlClass} {...field("project_stage")}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {t(`stageOptions.${s}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="funding_type" className={labelClass}>{t("fundingTypeLabel")}</label>
              <select id="funding_type" className={controlClass} {...field("funding_type")}>
                {FUNDING.map((f) => (
                  <option key={f} value={f}>
                    {t(`fundingOptions.${f}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="funding_required" className={labelClass}>{t("fundingRequired")}</label>
            <input
              id="funding_required"
              className={controlClass}
              type="number"
              min={0}
              required
              placeholder="5000000"
              {...field("funding_required")}
            />
          </div>

          <div>
            <label htmlFor="brief_description" className={labelClass}>{t("briefDescription")}</label>
            <textarea
              id="brief_description"
              className={`${controlClass} min-h-28`}
              required
              maxLength={500}
              {...field("brief_description")}
            />
          </div>

          <Button type="submit" disabled={createProject.isPending} className="justify-self-start">
            {t("submitProject")}
          </Button>
        </form>
      </Card>
    </PortalPage>
  );
}
