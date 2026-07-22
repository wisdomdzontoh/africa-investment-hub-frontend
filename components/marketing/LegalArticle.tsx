import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/marketing/PageHero";

/** Shared layout for legal documents (Terms, Privacy). Section content lives
 *  in the `legal.*` message namespaces so every locale carries the full text. */
export async function LegalArticle({
  ns,
  sections,
}: {
  ns: "legal.terms" | "legal.privacy";
  sections: readonly string[];
}) {
  const t = await getTranslations(ns);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <div className="page py-12">
        <article className="mx-auto max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {t("updated")}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-body)]">
            {t("intro")}
          </p>
          {sections.map((key, i) => (
            <section key={key} className="mt-9">
              <h2 className="text-lg font-bold tracking-[-0.01em] text-[var(--ink)]">
                {i + 1}. {t(`sections.${key}.title`)}
              </h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--text-body)]">
                {t(`sections.${key}.body`)}
              </p>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
