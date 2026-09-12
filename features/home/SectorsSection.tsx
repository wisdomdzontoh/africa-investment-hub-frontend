import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ds";
import { SectorsCarousel } from "@/features/home/SectorsCarousel";
import { SECTORS } from "@/lib/data/sectors";

export async function SectorsSection() {
  const t = await getTranslations("home.sectors");

  const taglines = Object.fromEntries(SECTORS.map((s) => [s.id, t(`featured.${s.id}`)]));

  return (
    <section className="bg-[var(--bg-section)] py-[clamp(3rem,7vw,7.5rem)]">
      <div className="page">
        <div className="max-w-2xl">
          <SectionLabel>{t("eyebrow")}</SectionLabel>
          <h2 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-xl text-[var(--text-body)]">{t("lead")}</p>
        </div>

        <div className="mt-9">
          <SectorsCarousel
            activeInLabel={t("activeIn")}
            focusAreasLabel={t("focusAreas")}
            ctaTitle={t("ctaTitle")}
            ctaDesc={t("ctaDesc")}
            ctaLink={t("viewAll")}
            taglines={taglines}
          />
        </div>
      </div>
    </section>
  );
}
