"use client";

import { GitMerge, Layers, Sparkles, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminPageHeader, StatCard } from "@/components/admin/AdminUI";
import { Card } from "@/components/ds";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { useAdminAnalytics } from "@/lib/api/hooks";

// Match pipeline order for the funnel (mirrors backend MatchStatus ordering).
const FUNNEL_ORDER = [
  "ai_recommended",
  "admin_reviewed",
  "investor_notified",
  "investor_interested",
  "nda_sent",
  "nda_signed",
  "mou_drafted",
  "mou_signed",
  "in_negotiation",
  "due_diligence",
  "closed_won",
];

const STATUS_COLOR: Record<string, string> = {
  approved: "var(--p-success-fg)",
  completed: "var(--p-success-fg)",
  closed_won: "var(--p-success-fg)",
  live: "var(--p-success-fg)",
  pending: "var(--p-primary-fg)",
  draft: "var(--p-primary-fg)",
  in_review: "var(--p-info-fg)",
  in_progress: "var(--p-info-fg)",
  rejected: "var(--p-danger-fg)",
  suspended: "var(--p-danger-fg)",
  closed_lost: "var(--p-danger-fg)",
  dismissed: "var(--p-danger-fg)",
};

const PIE_PALETTE = [
  "var(--accent)",
  "var(--p-info-fg)",
  "var(--p-success-fg)",
  "var(--p-primary-fg)",
  "var(--p-danger-fg)",
  "var(--text-muted)",
];

/** "in_review" → "In review" for chart labels (internal status keys). */
function humanize(key: string): string {
  const s = key.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toData(record: Record<string, number> | undefined) {
  return Object.entries(record ?? {}).map(([key, value]) => ({
    key,
    name: humanize(key),
    value,
  }));
}

export default function AdminAnalyticsPage() {
  const t = useTranslations("adminPortal");
  const { data, isLoading, isError, refetch } = useAdminAnalytics();

  if (isError) {
    return (
      <div>
        <AdminPageHeader title={t("analyticsTitle")} subtitle={t("analyticsSubtitle")} />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div>
        <AdminPageHeader title={t("analyticsTitle")} subtitle={t("analyticsSubtitle")} />
        <div className="grid gap-4" aria-busy="true">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[74px] animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
              />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]" />
        </div>
      </div>
    );
  }

  const funnel = FUNNEL_ORDER.map((key) => ({
    name: humanize(key),
    value: data.matches_by_status?.[key] ?? 0,
  })).filter((d) => d.value > 0);
  const sectors = toData(data.projects_by_sector).sort((a, b) => b.value - a.value);
  const investors = toData(data.investors_by_status);
  const projects = toData(data.projects_by_status);
  const avgScore =
    data.avg_match_score != null ? `${Math.round(data.avg_match_score * 100)}%` : "—";

  return (
    <div>
      <AdminPageHeader title={t("analyticsTitle")} subtitle={t("analyticsSubtitle")} />

      <div className="flex flex-col gap-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} value={data.total_users} label={t("usersTotal")} />
          <StatCard icon={GitMerge} value={data.total_matches} label={t("matchesTotal")} />
          <StatCard icon={Sparkles} value={avgScore} label={t("analyticsAvgScore")} />
          <StatCard
            icon={Layers}
            value={Object.keys(data.projects_by_sector ?? {}).length}
            label={t("sectorsCovered")}
          />
        </div>

        <ChartCard title={t("analyticsFunnel")} empty={funnel.length === 0} emptyLabel={t("empty")}>
          <ResponsiveContainer width="100%" height={Math.max(220, funnel.length * 38)}>
            <BarChart data={funnel} layout="vertical" margin={{ left: 24, right: 16 }}>
              <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: "var(--bg-section)" }} contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t("analyticsSectors")} empty={sectors.length === 0} emptyLabel={t("empty")}>
          <ResponsiveContainer width="100%" height={Math.max(220, sectors.length * 36)}>
            <BarChart data={sectors} layout="vertical" margin={{ left: 24, right: 16 }}>
              <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: "var(--bg-section)" }} contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={t("investorsByStatus")}
            empty={investors.length === 0}
            emptyLabel={t("empty")}
          >
            <StatusDonut data={investors} />
          </ChartCard>
          <ChartCard
            title={t("projectsByStatus")}
            empty={projects.length === 0}
            emptyLabel={t("empty")}
          >
            <StatusDonut data={projects} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

const AXIS_TICK = { fill: "var(--text-muted)", fontSize: 12 } as const;
const TOOLTIP_STYLE = {
  background: "var(--surface-card)",
  border: "1px solid var(--accent-border)",
  borderRadius: 8,
  fontSize: 12,
} as const;

function ChartCard({
  title,
  empty,
  emptyLabel,
  children,
}: {
  title: string;
  empty: boolean;
  emptyLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Card hoverLift={false} padding="20px">
      <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">{title}</h2>
      {empty ? (
        <EmptyState compact title={emptyLabel} />
      ) : (
        children
      )}
    </Card>
  );
}

function StatusDonut({ data }: { data: { key: string; name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.key}
              fill={STATUS_COLOR[entry.key] ?? PIE_PALETTE[i % PIE_PALETTE.length]}
            />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend
          verticalAlign="bottom"
          height={28}
          iconType="circle"
          formatter={(value) => (
            <span style={{ color: "var(--text-body)", fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
