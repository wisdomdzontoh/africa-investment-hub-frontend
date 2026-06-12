"use client";

import { ArrowRight, Briefcase, Clock, GitMerge, UserCog, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminPageHeader, StatCard } from "@/components/admin/AdminUI";
import { Card } from "@/components/ds";
import { ErrorState } from "@/components/common/ErrorState";
import { Link } from "@/i18n/navigation";
import { useAdminAnalytics } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";

function sum(record?: Record<string, number>) {
  if (!record) return 0;
  return Object.values(record).reduce((a, b) => a + b, 0);
}

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[74px] animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const t = useTranslations("adminPortal");
  const { data, isLoading, isError, refetch } = useAdminAnalytics();

  const pendingInvestors = data?.investors_by_status?.pending ?? 0;
  const pendingProjects = data?.projects_by_status?.pending ?? 0;

  return (
    <div>
      <AdminPageHeader title={t("title")} subtitle={t("dashboardSubtitle")} />

      {isLoading ? (
        <OverviewSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
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
            <h2 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
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
            <StatCard
              icon={Briefcase}
              value={Object.keys(data?.projects_by_sector ?? {}).length}
              label={t("sectorsCovered")}
            />
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
    <Link href={href} className="no-underline">
      <Card
        padding="20px"
        className={cn(
          "flex items-center justify-between",
          highlight && "border-[var(--p-warning)]/40 bg-[var(--p-warning-bg)]",
        )}
      >
        <div>
          <p className="text-sm text-[var(--text-muted)]">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-[var(--ink)]">{value}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
          {cta} <ArrowRight className="size-4" aria-hidden />
        </span>
      </Card>
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
    <Card hoverLift={false} padding="20px">
      <h3 className="mb-4 text-sm font-semibold text-[var(--ink)]">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">{t("empty")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map(([status, count]) => (
            <div key={status}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize text-[var(--text-muted)]">
                  {status.replace("_", " ")}
                </span>
                <span className="font-medium text-[var(--ink)]">{count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-section)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${Math.round((count / total) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
