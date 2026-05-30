import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandedButton } from "@/components/brand/Button";
import { Flag } from "@/components/common/Flag";
import { SectionHead } from "@/components/common/SectionHead";
import { getCountries } from "@/lib/data/countries";

export async function CountryPreview() {
  const t = await getTranslations("home.countries");
  const countries = (await getCountries()).slice(0, 12);

  return (
    <section className="page py-12 pb-6">
      <SectionHead
        eyebrow={t("eyebrow")}
        title={t("title")}
        sub={t("sub")}
        action={
          <BrandedButton asChild variant="secondary">
            <Link href="/countries" className="inline-flex items-center gap-2">
              {t("openGuide")}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </BrandedButton>
        }
      />
      <div className="country-grid mt-7">
        {countries.map((c) => (
          <Link
            key={c.code}
            href={`/countries/${c.code}`}
            className="country-chip no-underline"
          >
            <Flag code={c.code} lg />
            <div className="text-left leading-tight">
              <div className="text-[var(--text-sm)] font-semibold text-[var(--text-strong)]">
                {c.name}
              </div>
              <div className="text-[var(--text-2xs)] text-[var(--text-muted)]">
                {t("opportunities", { count: c.opps })}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
