"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ProjectCard } from "@/components/ds";
import { fmtMoney } from "@/lib/format";
import { getCountry } from "@/lib/data/countries";
import { getSector } from "@/lib/data/sectors";
import type { Project } from "@/types";

export function FeaturedProjectCard({ project }: { project: Project }) {
  const t = useTranslations("home.featured");
  const router = useRouter();
  const country = getCountry(project.countryCode);
  const sector = getSector(project.sectorId);

  return (
    <ProjectCard
      title={project.title}
      sector={sector.name}
      country={country?.name ?? project.countryCode.toUpperCase()}
      funding={fmtMoney(project.funding)}
      roi={`${project.roiMin}–${project.roiMax}%`}
      timeline={project.timeline}
      risk={project.risk}
      summary={project.summary}
      ctaLabel={t("viewOpportunity")}
      onCta={() => router.push(`/opportunities/${project.id}`)}
    />
  );
}
