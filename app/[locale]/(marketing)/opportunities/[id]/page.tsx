import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, Lock } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button, Card } from "@/components/ds";
import { Flag } from "@/components/common/Flag";
import { RiskBadge } from "@/components/common/RiskBadge";
import { SectorBadge, SectorGlyph } from "@/components/common/SectorGlyph";
import { fmtMoney } from "@/lib/format";
import { getCountry } from "@/lib/data/countries";
import { getLiveProjectDetail } from "@/lib/api/public-projects";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Signed-in users get a bearer token so the backend can release gated fields
  // when they're an approved investor / the project facilitator / an admin.
  const { userId, getToken } = await auth();
  const signedIn = !!userId;
  const token = signedIn
    ? await getToken({ template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE })
    : null;

  const project = await getLiveProjectDetail(id, token);
  if (!project) notFound();

  const t = await getTranslations("opportunities.detail");
  const country = getCountry(project.countryCode);
  // The backend only releases these fields to verified investors / facilitator / admin.
  const hasDetail = !!(project.execSummary || project.fullDescription);

  return (
    <div className="page py-[clamp(2.5rem,5vw,4rem)]">
      <Link
        href="/opportunities"
        className="mb-6 inline-flex items-center gap-2 text-[var(--text-sm)] font-semibold text-[var(--accent)] no-underline hover:underline"
      >
        <ArrowLeft size={16} aria-hidden />
        {t("back")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Flag code={project.countryCode} lg />
            <span className="text-[var(--text-sm)] font-semibold text-[var(--text-muted)]">
              {country?.name ?? project.countryCode.toUpperCase()}
            </span>
            <SectorBadge id={project.sectorId} />
          </div>
          <h1 className="text-balance text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[var(--ink)]">
            {project.title}
          </h1>
          <p className="mt-4 max-w-[640px] text-[var(--text-lead-size)] leading-relaxed text-[var(--text-body)]">
            {project.summary}
          </p>

          <h2 className="mt-8 mb-3 text-[clamp(1.25rem,2vw,1.75rem)] font-bold tracking-[-0.01em] text-[var(--ink)]">
            {t("fullDetail")}
          </h2>
          {hasDetail ? (
            <Card hoverLift={false} className="flex flex-col gap-4">
              {project.execSummary && (
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-[var(--ink)]">
                    {t("summary")}
                  </h3>
                  <p className="text-[var(--text-sm)] leading-relaxed text-[var(--text-body)]">
                    {project.execSummary}
                  </p>
                </div>
              )}
              {project.fullDescription && (
                <p className="text-[var(--text-sm)] leading-relaxed text-[var(--text-body)]">
                  {project.fullDescription}
                </p>
              )}
            </Card>
          ) : (
            <Card padding="0" hoverLift={false} className="relative overflow-hidden">
              <div className="p-8 blur-[5px] select-none" aria-hidden>
                <p className="text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
                  Detailed project documentation including financial models, legal
                  structure, management team credentials, and third-party
                  verification reports are available to verified investors.
                </p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[color-mix(in_srgb,var(--surface-card)_72%,transparent)] p-6 text-center backdrop-blur-[2px]">
                <span className="flex size-11 items-center justify-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-08)] text-[var(--accent)]">
                  <Lock size={18} aria-hidden />
                </span>
                {signedIn ? (
                  <p className="max-w-xs text-[var(--text-sm)] text-[var(--text-muted)]">
                    {t("pendingDetail")}
                  </p>
                ) : (
                  <>
                    <p className="max-w-xs text-[var(--text-sm)] text-[var(--text-muted)]">
                      {t("guestDetail")}
                    </p>
                    <div className="mt-1 flex flex-wrap justify-center gap-2">
                      <Button
                        href={`/sign-in?redirect_url=/${locale}/opportunities/${id}`}
                        size="sm"
                      >
                        {t("signInCta")}
                      </Button>
                      <Button href="/sign-up" size="sm" variant="outline">
                        {t("createAccount")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>

        <aside>
          <Card padding="0" hoverLift={false} className="sticky top-24 overflow-hidden">
            <div className="flex justify-center px-4 pt-6">
              <SectorGlyph id={project.sectorId} size={56} />
            </div>
            <div className="proj-stats mt-4 border-t-0 bg-transparent">
              <div>
                <div className="label-caps">{t("stats.funding")}</div>
                <div className="proj-stat-v font-mono">{fmtMoney(project.funding)}</div>
              </div>
              <div>
                <div className="label-caps">{t("stats.roi")}</div>
                <div className="proj-stat-v font-mono">
                  {project.roiMin || project.roiMax
                    ? `${project.roiMin}–${project.roiMax}%`
                    : "—"}
                </div>
              </div>
              <div>
                <div className="label-caps">{t("stats.timeline")}</div>
                <div className="proj-stat-v font-mono">{project.timeline}</div>
              </div>
            </div>
            <div className="space-y-3 px-4 pb-5 pt-4">
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-[var(--text-muted)]">{t("stats.stage")}</span>
                <span className="font-semibold capitalize text-[var(--ink)]">
                  {project.stage.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-sm)] text-[var(--text-muted)]">
                  {t("stats.risk")}
                </span>
                <RiskBadge level={project.risk} />
              </div>
              <div className="flex items-center justify-between text-[var(--text-sm)]">
                <span className="text-[var(--text-muted)]">{t("stats.views")}</span>
                <span className="flex items-center gap-1 font-semibold text-[var(--ink)]">
                  <Eye size={14} aria-hidden />
                  {project.views.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
