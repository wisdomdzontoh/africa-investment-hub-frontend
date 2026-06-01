import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandedButton } from "@/components/brand/Button";
import { SectionHead } from "@/components/common/SectionHead";
import { ProjectCard } from "@/features/opportunities/ProjectCard";
import { getLiveFeaturedProjects } from "@/lib/api/public-projects";

export async function FeaturedSection() {
  const t = await getTranslations("home.featured");
  const projects = await getLiveFeaturedProjects(3);

  if (projects.length === 0) return null;

  return (
    <section className="page py-12 pb-8">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        sub={t("sub")}
        action={
          <BrandedButton asChild variant="secondary">
            <Link href="/opportunities" className="inline-flex items-center gap-2">
              {t("viewAll")}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </BrandedButton>
        }
      />
      <div className="card-grid-3 mt-7">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
