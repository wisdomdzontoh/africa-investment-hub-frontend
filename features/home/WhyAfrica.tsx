import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Card, SectionLabel } from "@/components/ds";

const ITEMS = [
  "population",
  "markets",
  "resources",
  "afcfta",
  "urbanization",
  "digital",
] as const;

const ICONS: Record<(typeof ITEMS)[number], string> = {
  population: "globe",
  markets: "search",
  resources: "building",
  afcfta: "network",
  urbanization: "building",
  digital: "trend",
};

function IconWell({ name }: { name: string }) {
  return (
    <div className="mb-4 flex size-11 items-center justify-center rounded-[10px] bg-[var(--accent-tint-08)]">
      <Image src={`/brand/icons/${name}.svg`} width={22} height={22} alt="" aria-hidden />
    </div>
  );
}

export async function WhyAfrica() {
  const t = await getTranslations("home.whyAfrica");

  return (
    <section className="bg-[var(--bg-section)] py-[clamp(3rem,7vw,7.5rem)]">
      <div className="page">
        <div className="max-w-[560px]">
          <SectionLabel>{t("eyebrow")}</SectionLabel>
          <h2 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
            {t("title")}
          </h2>
          <p className="mt-3.5 text-[var(--text-body)]">{t("lead")}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((key) => (
            <Card key={key}>
              <IconWell name={ICONS[key]} />
              <h3 className="text-lg font-semibold text-[var(--ink)]">
                {t(`items.${key}.title`)}
              </h3>
              <p className="m-0 mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {t(`items.${key}.desc`)}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
