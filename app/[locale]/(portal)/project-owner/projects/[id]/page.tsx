"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { BrandedCard } from "@/components/brand/Card";
import { useApiClient } from "@/lib/api/hooks";
import { useQuery } from "@tanstack/react-query";
import type { ProjectDetail } from "@/types/api";

export default function ProjectDetailPage() {
  const t = useTranslations("ownerPortal");
  const params = useParams<{ id: string }>();
  const api = useApiClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["projects", params.id],
    queryFn: () => api.get<ProjectDetail>(`/projects/${params.id}`),
  });

  if (isLoading) return <p className="text-muted-foreground">{t("loading")}</p>;
  if (!project) return <p className="text-muted-foreground">{t("notFound")}</p>;

  return (
    <BrandedCard className="p-6">
      <h2 className="font-display text-xl font-semibold">{project.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {project.sector} · {project.country} · {project.status}
      </p>
      <p className="mt-4">{project.brief_description}</p>
      {project.executive_summary && (
        <div className="mt-4">
          <h3 className="font-medium">{t("executiveSummary")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{project.executive_summary}</p>
        </div>
      )}
    </BrandedCard>
  );
}
