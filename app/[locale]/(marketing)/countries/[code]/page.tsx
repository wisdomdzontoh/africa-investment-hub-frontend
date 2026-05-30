import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { BrandedButton } from "@/components/brand/Button";
import { Flag } from "@/components/common/Flag";
import { getCountryDetail } from "@/lib/data/countries";

const SECTION_KEYS = [
  "climate",
  "laws",
  "tax",
  "registration",
  "licensing",
  "ownership",
  "repatriation",
  "immigration",
  "contacts",
  "news",
] as const;

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const country = await getCountryDetail(code);
  if (!country) notFound();

  const t = await getTranslations("countries.detail");

  return (
    <div className="page py-12">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <Flag code={country.code} lg />
            <div>
              <h1 className="h1">{country.name}</h1>
              <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
                {country.region}
              </p>
            </div>
          </div>
          <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
            {t("lastUpdated", { date: country.lastUpdated })}
          </p>
        </div>
        <BrandedButton asChild>
          <Link
            href={`/opportunities?country=${country.code}`}
            className="inline-flex items-center gap-2"
          >
            {t("viewOpportunities", { country: country.name })}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </BrandedButton>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {SECTION_KEYS.map((key) => (
          <section
            key={key}
            className="rounded-[var(--radius-base)] border border-border bg-card p-5"
          >
            <h2 className="h4 mb-2">{t(`sections.${key}`)}</h2>
            <p className="m-0 text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
              {country[key]}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
