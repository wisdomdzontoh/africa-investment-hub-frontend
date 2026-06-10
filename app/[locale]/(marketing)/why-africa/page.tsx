import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ds";
import { PageHero } from "@/components/marketing/PageHero";

const SECTIONS = [
  "demographics",
  "afcfta",
  "infrastructure",
  "returns",
] as const;

export default async function WhyAfricaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("whyAfricaPage");

  return (
    <>
      <PageHero
        tone="dark"
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        meta={["54 countries", "AfCFTA · 1.3B people", "$3.4T market"]}
      />
      <div className="page py-[clamp(3rem,7vw,6rem)]">
        <div className="grid gap-6 md:grid-cols-2">
          {SECTIONS.map((key) => (
            <Card key={key}>
              <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-bold tracking-[-0.01em] text-[var(--ink)]">
                {t(`sections.${key}.title`)}
              </h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--text-body)]">
                {t(`sections.${key}.body`)}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
