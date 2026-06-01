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
    <footer className="relative mt-16 overflow-hidden bg-[var(--surface-footer)] text-[var(--surface-footer-fg)]">
      {/* Brand accent rule — vermilion → crimson bleed across the top edge */}
      <div className="h-1 w-full bg-[linear-gradient(90deg,var(--orange-deep),var(--orange),var(--orange-strong))]" />

      {/* Soft warm glow in the upper-left, deepening toward the lower-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,color-mix(in_srgb,var(--orange)_22%,transparent)_0%,transparent_55%)]"
      />

      <div className="page relative grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <div className="mb-3.5 font-display text-xl font-bold tracking-tight text-white">
            African
            <span className="text-[var(--orange-soft)]"> Investment</span> Hub
          </div>
          <p className="max-w-[300px] text-[var(--text-sm)] leading-relaxed text-white/65">
            {t("tagline")}
          </p>
          <div className="mt-5">
            <LanguageSwitcher variant="dark" />
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.titleKey}>
            <div className="mb-3.5 flex items-center gap-2 text-[var(--text-2xs)] font-bold tracking-[0.08em] text-[var(--orange-soft)]/80 uppercase">
              <span className="h-px w-3 bg-[var(--orange)]/70" />
              {t(col.titleKey)}
            </div>
            <div className="flex flex-col gap-2">
              {col.links.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className="w-fit text-[var(--text-sm)] text-white/75 transition-colors hover:text-[var(--orange-soft)]"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="relative border-t border-white/10">
        <div className="page flex flex-col gap-2 py-4 text-[var(--text-xs)] text-white/55 sm:flex-row sm:justify-between">
          <span>{t("copyright")}</span>
          <span>{t("disclaimer")}</span>
        </div>
      </div>
    </footer>
  );
}
