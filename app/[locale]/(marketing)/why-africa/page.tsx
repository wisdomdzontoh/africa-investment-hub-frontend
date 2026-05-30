import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { BrandedCard } from "@/components/brand/Card";

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
    <div className="page py-12">
      <div className="mb-10 max-w-[720px]">
        <h1 className="h1">{t("title")}</h1>
        <p className="lead mt-3">{t("subtitle")}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {SECTIONS.map((key) => (
          <BrandedCard key={key} pad>
            <h2 className="h3">{t(`sections.${key}.title`)}</h2>
            <p className="mt-2 text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
              {t(`sections.${key}.body`)}
            </p>
          </BrandedCard>
        ))}
      </div>
    </div>
  );
}
