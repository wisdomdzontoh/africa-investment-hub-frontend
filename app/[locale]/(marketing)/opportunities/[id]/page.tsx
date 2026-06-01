import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, Lock } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { BrandedButton } from "@/components/brand/Button";
import { BrandedCard } from "@/components/brand/Card";
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
  // when they're an approved investor / the owner / an admin.
  const { userId, getToken } = await auth();
  const signedIn = !!userId;
  const token = signedIn
    ? await getToken({ template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE })
    : null;

  const project = await getLiveProjectDetail(id, token);
  if (!project) notFound();

  const t = await getTranslations("opportunities.detail");
  const country = getCountry(project.countryCode);
  // The backend only releases these fields to verified investors / owner / admin.
  const hasDetail = !!(project.execSummary || project.fullDescription);

  return (
    <div className="page py-12">
      <Link
        href="/opportunities"
        className="mb-6 inline-flex items-center gap-2 text-[var(--text-sm)] font-semibold text-[var(--green-600)] no-underline hover:underline"
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
          <h1 className="h1">{project.title}</h1>
          <p className="lead mt-4">{project.summary}</p>

          <h2 className="h3 mt-8">{t("fullDetail")}</h2>
          <BrandedCard pad className="relative mt-3 overflow-hidden">
            {hasDetail ? (
              <div className="flex flex-col gap-4">
                {project.execSummary && (
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">{t("summary")}</h3>
                    <p className="text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
                      {project.execSummary}
                    </p>
                  </div>
                )}
                {project.fullDescription && (
                  <p className="text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
                    {project.fullDescription}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div style={{ filter: "blur(5px)", userSelect: "none" }} aria-hidden>
                  <p className="text-[var(--text-sm)] leading-relaxed text-[var(--text-muted)]">
                    Detailed project documentation including financial models, legal structure,
                    management team credentials, and third-party verification reports are available
                    to verified investors.
                  </p>
                </div>
                <div className="gate">
                  <span className="gate-lock">
                    <Lock size={16} />
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
                      <div className="mt-3 flex gap-2">
                        <BrandedButton asChild size="sm">
                          <Link href={`/sign-in?redirect_url=/${locale}/opportunities/${id}`}>
                            {t("signInCta")}
                          </Link>
                        </BrandedButton>
                        <BrandedButton asChild size="sm" variant="outline">
                          <Link href="/sign-up">{t("createAccount")}</Link>
                        </BrandedButton>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </BrandedCard>
        </div>

        <aside>
          <BrandedCard className="sticky top-24">
            <div className="flex justify-center px-4 pt-4">
              <SectorGlyph id={project.sectorId} size={56} />
            </div>
            <div className="proj-stats mt-2 border-t-0 bg-transparent">
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
            <div className="space-y-3 px-4 pb-4">
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-[var(--text-muted)]">{t("stats.stage")}</span>
                <span className="font-semibold capitalize">{project.stage.replace(/_/g, " ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-sm)] text-[var(--text-muted)]">{t("stats.risk")}</span>
                <RiskBadge level={project.risk} />
              </div>
              <div className="flex items-center justify-between text-[var(--text-sm)]">
                <span className="text-[var(--text-muted)]">{t("stats.views")}</span>
                <span className="flex items-center gap-1 font-semibold">
                  <Eye size={14} aria-hidden />
                  {project.views.toLocaleString()}
                </span>
              </div>
            </div>
          </BrandedCard>
        </aside>
      </div>
    </div>
  );
}
