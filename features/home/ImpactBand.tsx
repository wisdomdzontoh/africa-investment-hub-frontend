import { getLocale, getTranslations } from "next-intl/server";
import { StatBlock } from "@/components/ds";
import { getHomepageContent, resolveLocaleText } from "@/lib/api/public-content";
import { getHomeStats } from "@/lib/data/home";

const STAT_KEYS = ["population", "countries", "gdp", "infrastructure"] as const;

export async function ImpactBand() {
  const t = await getTranslations("home.stats");
  const locale = await getLocale();

  // Admin-managed figures win (PRD §6.1, FE-03); static i18n set is the
  // fallback until the CMS is populated.
  const cms = await getHomepageContent();
  const cmsStats = (cms?.stats ?? []).filter((s) => s.value?.trim());

  if (cmsStats.length > 0) {
    return (
      <section className="bg-[var(--surface-dark)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3rem,6vw,6rem)]">
        <div className="page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cmsStats.map((stat, i) => (
            <StatBlock
              key={`${stat.value}-${i}`}
              value={stat.value}
              label={resolveLocaleText(stat.label, locale)}
            />
          ))}
        </div>
      </section>
    );
  }

  const stats = await getHomeStats();
  return (
    <section className="bg-[var(--surface-dark)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3rem,6vw,6rem)]">
      <div className="page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const key = STAT_KEYS[i] ?? `item${i}`;
          return (
            <StatBlock
              key={key}
              value={stat.value}
              label={t(`items.${key}.label`)}
              caption={t(`items.${key}.caption`)}
            />
          );
        })}
      </div>
    </section>
  );
}
