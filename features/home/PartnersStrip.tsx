import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getHomepageContent } from "@/lib/api/public-content";

/** Credibility logos strip (PRD §6.1, FE-03). CMS-driven — renders nothing
 *  until an admin adds partner logos, so the homepage never shows an empty
 *  section. A logo without an image URL falls back to its name as text. */
export async function PartnersStrip() {
  const content = await getHomepageContent();
  const partners = (content?.partner_logos ?? []).filter((p) => p.name?.trim());
  if (partners.length === 0) return null;

  const t = await getTranslations("home.partners");

  return (
    <section className="border-y border-[var(--accent-border)] bg-[var(--bg-section)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(2.5rem,4vw,4rem)]">
      <div className="page">
        <p className="mb-8 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {t("eyebrow")}
        </p>
        <ul className="flex list-none flex-wrap items-center justify-center gap-x-10 gap-y-6 p-0">
          {partners.map((partner, i) => {
            const inner = partner.logo_url ? (
              <Image
                src={partner.logo_url}
                alt={partner.name}
                width={120}
                height={40}
                className="h-9 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                unoptimized
              />
            ) : (
              <span className="text-base font-semibold text-[var(--text-muted)]">
                {partner.name}
              </span>
            );
            return (
              <li key={`${partner.name}-${i}`}>
                {partner.website ? (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                    aria-label={partner.name}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
