import { getLocale, getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ds";
import { PageHero } from "@/components/marketing/PageHero";
import { getHomepageContent, resolveLocaleText } from "@/lib/api/public-content";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const t = await getTranslations("about");
  const locale = await getLocale();

  const content = await getHomepageContent();
  const team = (content?.team_members ?? []).filter((m) => m.name?.trim());
  const advisory = (content?.advisory_board ?? []).filter((a) => a.name?.trim());

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} eyebrow={t("eyebrow")} />
      <div className="page py-12">
        {/* Mission + trust are narrative — kept as editorial copy (i18n). */}
        <div className="grid gap-5 md:grid-cols-2">
          <Card hoverLift={false} padding="24px">
            <h2 className="h3">{t("mission.title")}</h2>
            <p className="mt-2 text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
              {t("mission.body")}
            </p>
          </Card>
          <Card hoverLift={false} padding="24px">
            <h2 className="h3">{t("trust.title")}</h2>
            <p className="mt-2 text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
              {t("trust.body")}
            </p>
          </Card>
        </div>

        {/* Team — CMS-managed (PRD §6.1, FE-04); static blurb until populated. */}
        <section className="mt-12">
          <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-bold tracking-[-0.01em] text-[var(--ink)]">
            {t("team.title")}
          </h2>
          {team.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member, i) => (
                <Card key={`${member.name}-${i}`} hoverLift={false} padding="20px">
                  <p className="font-semibold text-[var(--ink)]">{member.name}</p>
                  {member.role ? (
                    <p className="mt-0.5 font-mono text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--accent)]">
                      {resolveLocaleText(member.role, locale)}
                    </p>
                  ) : null}
                  {member.bio ? (
                    <p className="mt-2 text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
                      {resolveLocaleText(member.bio, locale)}
                    </p>
                  ) : null}
                </Card>
              ))}
            </div>
          ) : (
            <p className="mt-3 max-w-2xl text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
              {t("team.body")}
            </p>
          )}
        </section>

        {/* Advisory board — CMS-managed; static blurb until populated. */}
        <section className="mt-12">
          <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-bold tracking-[-0.01em] text-[var(--ink)]">
            {t("partners.title")}
          </h2>
          {advisory.length > 0 ? (
            <ul className="mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
              {advisory.map((advisor, i) => (
                <li
                  key={`${advisor.name}-${i}`}
                  className="rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--surface-card)] p-4"
                >
                  <p className="font-semibold text-[var(--ink)]">{advisor.name}</p>
                  <p className="mt-0.5 text-[var(--text-sm)] text-[var(--text-muted)]">
                    {[resolveLocaleText(advisor.role, locale), advisor.organization]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 max-w-2xl text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
              {t("partners.body")}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
