import { Compass } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button, SectionLabel } from "@/components/ds";
import { EmptyState } from "@/components/common/EmptyState";
import { FeaturedProjectCard } from "@/features/home/FeaturedProjectCard";
import { getLiveFeaturedProjects } from "@/lib/api/public-projects";

export async function FeaturedSection() {
  const t = await getTranslations("home.featured");
  const projects = await getLiveFeaturedProjects(3);

  return (
    <section className="bg-[var(--bg-page)] py-[clamp(3rem,7vw,7.5rem)]">
      <div className="page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>{t("eyebrow")}</SectionLabel>
            <h2 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-xl text-[var(--text-body)]">{t("sub")}</p>
          </div>
          <Button href="/opportunities" variant="outline" size="sm">
            {t("viewAll")} →
          </Button>
        </div>

        {projects.length > 0 ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {projects.map((p) => (
              <FeaturedProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-10"
            icon={Compass}
            title={t("emptyTitle")}
            description={t("emptyBody")}
            action={
              <Button href="/opportunities" size="sm">
                {t("viewAll")}
              </Button>
            }
          />
        )}
      </div>
    </section>
  );
}
