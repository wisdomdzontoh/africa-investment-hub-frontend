import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { CountryGrid } from "@/features/countries/CountryGrid";
import { PageHero } from "@/components/marketing/PageHero";
import { countLiveProjectsByCountry } from "@/lib/api/public-projects";
import { getCountries } from "@/lib/data/countries";

export default async function CountriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("countries");
  const [countries, liveCounts] = await Promise.all([
    getCountries(),
    countLiveProjectsByCountry(),
  ]);
  // Reflect real approved-project counts per country (0 when none yet).
  const withCounts = countries.map((c) => ({ ...c, opps: liveCounts[c.code] ?? 0 }));

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} eyebrow={t("eyebrow")} />
      <div className="page py-12">
        <CountryGrid countries={withCounts} />
      </div>
    </>
  );
}
