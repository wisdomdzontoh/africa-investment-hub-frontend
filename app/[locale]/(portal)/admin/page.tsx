"use client";

import { ArrowRight, Briefcase, Clock, GitMerge, UserCog, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminPageHeader, StatCard } from "@/components/admin/AdminUI";
import { BrandedCard } from "@/components/brand/Card";
import { Link } from "@/i18n/navigation";
import { useAdminAnalytics } from "@/lib/api/hooks";

function sum(record?: Record<string, number>) {
  if (!record) return 0;
  return Object.values(record).reduce((a, b) => a + b, 0);
}

export default function AdminOverviewPage() {
  const t = useTranslations("adminPortal");
  const { data, isLoading } = useAdminAnalytics();

  const pendingInvestors = data?.investors_by_status?.pending ?? 0;
  const pendingProjects = data?.projects_by_status?.pending ?? 0;

  return (
    <div>
      <AdminPageHeader title={t("title")} subtitle={t("dashboardSubtitle")} />

      {isLoading ? (
        <p className="text-muted-foreground">{t("loading")}</p>
      ) : (
        <div className="flex flex-col gap-8">
          {/* KPIs */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} value={sum(data?.investors_by_status)} label={t("investorsTotal")} />
            <StatCard
              icon={Clock}
              tone="pending"
              value={pendingInvestors + pendingProjects}
              label={t("pendingReview")}
            />
            <StatCard icon={Briefcase} value={sum(data?.projects_by_status)} label={t("projectsTotal")} />
            <StatCard icon={UserCog} value={data?.total_users ?? 0} label={t("usersTotal")} />
          </div>

          {/* Needs attention */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("needsAttention")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <QueueCard
                href="/admin/investors"
                label={t("investorsPending")}
                value={pendingInvestors}
                cta={t("review")}
              />
              <QueueCard
                href="/admin/projects"
                label={t("projectsPending")}
                value={pendingProjects}
                cta={t("review")}
              />
            </div>
          </section>

          {/* Breakdowns */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Breakdown title={t("investorsByStatus")} data={data?.investors_by_status} t={t} />
            <Breakdown title={t("projectsByStatus")} data={data?.projects_by_status} t={t} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard icon={GitMerge} value={sum(data?.matches_by_status)} label={t("matchesTotal")} />
            <StatCard icon={Briefcase} value={Object.keys(data?.projects_by_sector ?? {}).length} label={t("sectorsCovered")} />
          </div>
        </div>
      )}
    </div>
  );
}

function QueueCard({
  href,
  label,
  value,
  cta,
}: {
  href: string;
  label: string;
  value: number;
  cta: string;
}) {
  const highlight = value > 0;
  return (
    <Link href={href}>
      <BrandedCard
        hover
        className={
          "flex items-center justify-between p-5 " +
          (highlight
            ? "border-[var(--warning)]/40 bg-[color-mix(in_srgb,var(--warning)_8%,transparent)]"
            : "")
        }
      >
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{value}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--green-700)]">
          {cta} <ArrowRight className="size-4" aria-hidden />
        </span>
      </BrandedCard>
    </Link>
  );
}

function Breakdown({
  title,
  data,
  t,
}: {
  title: string;
  data?: Record<string, number>;
  t: (k: string) => string;
}) {
  const entries = Object.entries(data ?? {});
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
  return (
    <BrandedCard className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map(([status, count]) => (
            <div key={status}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize text-muted-foreground">{status.replace("_", " ")}</span>
                <span className="font-medium text-foreground">{count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[var(--green-600)]"
                  style={{ width: `${Math.round((count / total) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </BrandedCard>
  );
}
