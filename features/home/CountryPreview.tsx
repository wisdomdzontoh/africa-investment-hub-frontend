import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button, Chip, SectionLabel } from "@/components/ds";
import { Flag } from "@/components/common/Flag";
import { getCountries } from "@/lib/data/countries";

export async function CountryPreview() {
  const t = await getTranslations("home.countries");
  const countries = (await getCountries()).slice(0, 12);

  return (
    <section className="bg-[var(--bg-section)] py-[clamp(3rem,7vw,7.5rem)]">
      <div className="page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>{t("eyebrow")}</SectionLabel>
            <h2 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-xl text-[var(--text-body)]">{t("sub")}</p>
          </div>
          <Button href="/countries" variant="outline" size="sm">
            {t("openGuide")} →
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {countries.map((c) => (
            <Link key={c.code} href={`/countries/${c.code}`} className="no-underline">
              <Chip className="inline-flex items-center gap-2.5 px-3.5 py-2.5">
                <Flag code={c.code} lg />
                <span className="text-left leading-tight">
                  <span className="block text-sm font-semibold text-[var(--ink)]">
                    {c.name}
                  </span>
                  <span className="block text-[10px] text-[var(--text-muted)]">
                    {t("opportunities", { count: c.opps })}
                  </span>
                </span>
              </Chip>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
