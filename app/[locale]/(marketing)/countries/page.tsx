import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { CountryGrid } from "@/features/countries/CountryGrid";
import { getCountries } from "@/lib/data/countries";

export default async function CountriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("countries");
  const countries = await getCountries();

  return (
    <div className="page py-12">
      <div className="mb-8">
        <h1 className="h1">{t("title")}</h1>
        <p className="lead mt-2 max-w-[640px]">{t("subtitle")}</p>
      </div>
      <CountryGrid countries={countries} />
    </div>
  );
}
