"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BrandedButton } from "@/components/brand/Button";
import { BrandedCard } from "@/components/brand/Card";
import { useCreateProject } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";

type ProjectForm = {
  title: string;
  sector: string;
  country: string;
  brief_description: string;
  project_stage: string;
  funding_required: string;
  funding_type: string;
};

export default function NewProjectPage() {
  const t = useTranslations("ownerPortal");
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
      router.push(`/project-owner/projects/${project.id}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("projectError"));
    }
  });

  return (
    <BrandedCard className="p-6">
      <h2 className="font-semibold">{t("newProject")}</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-4">
        <input className="input-field" placeholder={t("titleField")} required {...field("title")} />
        <input className="input-field" placeholder={t("sector")} required {...field("sector")} />
        <input className="input-field" placeholder={t("country")} required maxLength={2} {...field("country")} />
        <textarea className="input-field min-h-24" placeholder={t("briefDescription")} required {...field("brief_description")} />
        <input className="input-field" type="number" placeholder={t("fundingRequired")} required {...field("funding_required")} />
        <BrandedButton type="submit" disabled={createProject.isPending}>
          {t("submitProject")}
        </BrandedButton>
      </form>
    </BrandedCard>
  );
}
