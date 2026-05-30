import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const FOOTER_COLUMNS = [
  {
    titleKey: "platform" as const,
    links: [
      { href: "/opportunities", labelKey: "platformLinks.opportunities" as const },
      { href: "/countries", labelKey: "platformLinks.countries" as const },
      { href: "/why-africa", labelKey: "platformLinks.whyAfrica" as const },
      { href: "/contact", labelKey: "platformLinks.forOwners" as const },
    ],
  },
  {
    titleKey: "services" as const,
    links: [
      { href: "/about", labelKey: "servicesLinks.verification" as const },
      { href: "/about", labelKey: "servicesLinks.diligence" as const },
      { href: "/about", labelKey: "servicesLinks.thirdParty" as const },
      { href: "/about", labelKey: "servicesLinks.monitoring" as const },
    ],
  },
  {
    titleKey: "company" as const,
    links: [
      { href: "/about", labelKey: "companyLinks.about" as const },
      { href: "/about", labelKey: "companyLinks.advisory" as const },
      { href: "/about", labelKey: "companyLinks.partners" as const },
      { href: "/contact", labelKey: "companyLinks.contact" as const },
    ],
  },
  {
    titleKey: "legal" as const,
    links: [
      { href: "/contact", labelKey: "legalLinks.terms" as const },
      { href: "/contact", labelKey: "legalLinks.privacy" as const },
      { href: "/contact", labelKey: "legalLinks.data" as const },
      { href: "/contact", labelKey: "legalLinks.disclosures" as const },
    ],
  },
];

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-16 bg-[var(--surface-footer)] text-[var(--surface-footer-fg)]">
      <div className="page grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <div className="mb-3.5 font-display text-xl font-bold tracking-tight text-white">
            African<span className="text-[var(--orange)]"> Investment</span> Hub
          </div>
          <p className="max-w-[300px] text-[var(--text-sm)] text-white/60">
            {t("tagline")}
          </p>
          <div className="mt-5">
            <LanguageSwitcher variant="dark" />
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.titleKey}>
            <div className="mb-3.5 text-[var(--text-2xs)] font-bold tracking-[0.08em] text-white/45 uppercase">
              {t(col.titleKey)}
            </div>
            <div className="flex flex-col gap-2">
              {col.links.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className="text-[var(--text-sm)] text-white/78 transition-colors hover:text-white"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/12">
        <div className="page flex flex-col gap-2 py-4 text-[var(--text-xs)] text-white/50 sm:flex-row sm:justify-between">
          <span>{t("copyright")}</span>
          <span>{t("disclaimer")}</span>
        </div>
      </div>
    </footer>
  );
}
