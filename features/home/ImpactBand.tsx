import { getTranslations } from "next-intl/server";
import { StatBlock } from "@/components/ds";
import { getHomeStats } from "@/lib/data/home";

const STAT_KEYS = ["population", "countries", "gdp", "infrastructure"] as const;

export async function ImpactBand() {
  const t = await getTranslations("home.stats");
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
