import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { BrandedCard } from "@/components/brand/Card";

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
    <div className="page py-12">
      <div className="mb-10 max-w-[720px]">
        <h1 className="h1">{t("title")}</h1>
        <p className="lead mt-3">{t("subtitle")}</p>
      </div>
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
  );
}
