"use client";

import { useTranslations } from "next-intl";
import { BrandedCard } from "@/components/brand/Card";
import { Link } from "@/i18n/navigation";
import { useMyProjects } from "@/lib/api/hooks";

export default function ProjectOwnerProjectsPage() {
  const t = useTranslations("ownerPortal");
  const { data: projects, isLoading } = useMyProjects();

  if (isLoading) return <p className="text-muted-foreground">{t("loading")}</p>;

  return (
    <div className="grid gap-3">
      {(projects ?? []).length === 0 ? (
        <BrandedCard className="p-6 text-sm text-muted-foreground">
          {t("noProjects")}{" "}
          <Link href="/project-owner/projects/new" className="text-[var(--brand-primary)]">
            {t("createFirst")}
          </Link>
        </BrandedCard>
      ) : (
        projects?.map((project) => (
          <BrandedCard key={project.id} className="p-4">
            <Link href={`/project-owner/projects/${project.id}`} className="font-medium hover:underline">
              {project.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              {project.sector} · {project.country} · {project.status}
            </p>
          </BrandedCard>
        ))
      )}
    </div>
  );
}
