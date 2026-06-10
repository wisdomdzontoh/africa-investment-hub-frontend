import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { Chip } from "@/components/ds/Chip";

const FOOTER_LINKS = [
  { href: "/contact", key: "sitemap" as const },
  { href: "/contact", key: "terms" as const },
  { href: "/contact", key: "security" as const },
  { href: "/contact", key: "privacy" as const },
] as const;

const TRUST_CHIPS = [
  "manualVerification",
  "ndaGated",
  "noFundsHeld",
] as const;

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="site-footer">
      <div className="page">
        <div className="site-footer-bar">
          <Link href="/" className="site-footer-brand" aria-label="African Investment Hub home">
            <Logo height={34} priority={false} />
          </Link>

          <nav className="site-footer-links" aria-label={t("legal")}>
            {FOOTER_LINKS.map(({ href, key }) => (
              <Link key={key} href={href} className="site-footer-link">
                {t(`links.${key}`)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-footer-bottom">
          <div className="site-footer-meta">
            <p className="site-footer-copy">{t("copyright")}</p>
            <p className="site-footer-disclaimer">{t("disclaimer")}</p>
          </div>

          <div className="site-footer-chips">
            {TRUST_CHIPS.map((key) => (
              <Chip
                key={key}
                className="rounded-[var(--radius-sm)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-body)]"
              >
                {t(`chips.${key}`)}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
