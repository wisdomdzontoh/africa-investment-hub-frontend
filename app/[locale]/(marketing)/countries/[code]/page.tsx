import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Card } from "@/components/ds";
import { Flag } from "@/components/common/Flag";
import { getPublishedCountryContent } from "@/lib/api/public-content";
import { getCountryDetail } from "@/lib/data/countries";

// Static fallback key → CMS section field. CMS text wins when published and
// non-empty; the static guide remains until admins take a country live (FE-02).
const SECTIONS = [
  ["climate", "investment_climate"],
  ["laws", "investment_laws"],
  ["tax", "tax_system"],
  ["registration", "business_registration"],
  ["licensing", "licensing_requirements"],
  ["ownership", "foreign_ownership_rules"],
  ["repatriation", "repatriation_policy"],
  ["immigration", "immigration_requirements"],
] as const;

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const [country, cms] = await Promise.all([
    getCountryDetail(code),
    getPublishedCountryContent(code, locale),
  ]);
  if (!country) notFound();

  const t = await getTranslations("countries.detail");

  const lastUpdated = cms?.last_updated_at
    ? new Date(cms.last_updated_at).toLocaleDateString(locale, { dateStyle: "medium" })
    : country.lastUpdated;
  const contacts = cms?.key_contacts?.filter((c) => c.organization || c.name) ?? [];

  return (
    <div className="page py-[clamp(2.5rem,5vw,4rem)]">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <Flag code={country.code} lg />
            <div>
              <h1 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[var(--ink)]">
                {country.name}
              </h1>
              <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
                {country.region}
              </p>
            </div>
          </div>
          <p className="font-mono text-[var(--text-xs)] text-[var(--text-muted)]">
            {t("lastUpdated", { date: lastUpdated })}
          </p>
        </div>
        <Button href={`/opportunities?country=${country.code}`} className="gap-2">
          {t("viewOpportunities", { country: country.name })}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {SECTIONS.map(([staticKey, cmsKey]) => {
          const text = cms?.[cmsKey]?.trim() || country[staticKey];
          return (
            <Card key={staticKey} hoverLift={false} padding="20px">
              <h2 className="mb-2 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
                {t(`sections.${staticKey}`)}
              </h2>
              <p className="m-0 whitespace-pre-line text-[var(--text-sm)] leading-relaxed text-[var(--text-body)]">
                {text}
              </p>
            </Card>
          );
        })}

        <Card hoverLift={false} padding="20px">
          <h2 className="mb-2 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
            {t("sections.contacts")}
          </h2>
          {contacts.length > 0 ? (
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {contacts.map((c, i) => (
                <li key={i} className="text-[var(--text-sm)] leading-relaxed">
                  <span className="font-medium text-[var(--ink)]">
                    {c.organization ?? c.name}
                  </span>
                  {c.organization && c.name ? (
                    <span className="text-[var(--text-body)]"> — {c.name}</span>
                  ) : null}
                  {c.role ? (
                    <span className="text-[var(--text-muted)]"> · {c.role}</span>
                  ) : null}
                  {c.email ? (
                    <>
                      {" "}
                      <a
                        href={`mailto:${c.email}`}
                        className="text-[var(--accent)] no-underline hover:underline"
                      >
                        {c.email}
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-[var(--text-sm)] leading-relaxed text-[var(--text-body)]">
              {country.contacts}
            </p>
          )}
        </Card>

        <Card hoverLift={false} padding="20px">
          <h2 className="mb-2 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
            {t("sections.news")}
          </h2>
          <p className="m-0 text-[var(--text-sm)] leading-relaxed text-[var(--text-body)]">
            {country.news}
          </p>
        </Card>
      </div>
    </div>
  );
}
