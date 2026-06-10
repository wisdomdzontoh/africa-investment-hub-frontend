import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { BrandedCard } from "@/components/brand/Card";
import { PageHero } from "@/components/marketing/PageHero";

const SECTIONS = ["mission", "team", "partners", "trust"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} eyebrow={t("eyebrow")} />
      <div className="page py-12">
      <div className="grid gap-5 md:grid-cols-2">
        {SECTIONS.map((key) => (
          <BrandedCard key={key} pad>
            <h2 className="h3">{t(`${key}.title`)}</h2>
            <p className="mt-2 text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
              {t(`${key}.body`)}
            </p>
          </BrandedCard>
        ))}
      </div>
      </div>
    </>
  );
}
