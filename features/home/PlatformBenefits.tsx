import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ds";
import { PlatformBenefitsCarousel } from "@/features/home/PlatformBenefitsCarousel";

const ITEMS = ["verified", "legal", "diligence", "ai", "monitoring", "matchmaking"] as const;

// Placeholder imagery (public/platform-benefits/*) — swap for real product
// visuals later, same as the problem section's placeholder images.
const ITEM_IMAGES: Record<(typeof ITEMS)[number], string> = {
  verified: "/platform-benefits/verified-projects.png",
  legal: "/platform-benefits/legal-guidance.png",
  diligence: "/platform-benefits/due-diligence.png",
  ai: "/platform-benefits/AI-powered.png",
  monitoring: "/platform-benefits/project-monitoring.png",
  matchmaking: "/platform-benefits/investor-match-making.png",
};

export async function PlatformBenefits() {
  const t = await getTranslations("home.platformBenefits");

  const items = ITEMS.map((key) => ({
    key,
    title: t(`items.${key}.title`),
    desc: t(`items.${key}.desc`),
    image: ITEM_IMAGES[key],
  }));

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
          <PlatformBenefitsCarousel items={items} />
        </div>
      </div>
    </section>
  );
}
