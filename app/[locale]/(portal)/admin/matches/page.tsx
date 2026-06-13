"use client";

import { GitMerge } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { DataTable, StatusPill, type Column } from "@/components/portal";
import { useRouter } from "@/i18n/navigation";
import { useAdminMatches } from "@/lib/api/hooks";
import type { AdminMatch } from "@/types/api";

function humanize(s: string) {
  const v = s.replace(/_/g, " ");
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export default function AdminMatchesPage() {
  const t = useTranslations("adminPortal");
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useAdminMatches();

  const columns: Column<AdminMatch>[] = [
    {
      key: "project",
      header: t("colProject"),
      render: (m) => (
        <span className="font-medium text-[var(--ink)]">
          {m.project_title ?? m.project_id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: "investor",
      header: t("matchInvestor"),
      hideOnMobile: true,
      render: (m) => m.investor_company ?? "—",
    },
    {
      key: "score",
      header: t("matchScoreCol"),
      hideOnMobile: true,
      render: (m) => (m.score != null ? `${Math.round(m.score * 100)}%` : "—"),
    },
    {
      key: "status",
      header: t("colStatus"),
      render: (m) => <StatusPill status={m.status} label={humanize(m.status)} />,
    },
  ];

  return (
    <div>
      <AdminPageHeader title={t("matchesNavTitle")} subtitle={t("matchesNavSubtitle")} />
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          rows={data?.items ?? []}
          rowKey={(m) => m.id}
          isLoading={isLoading}
          onRowClick={(m) => router.push(`/admin/matches/${m.id}`)}
          empty={<EmptyState compact icon={GitMerge} title={t("matchesNavEmpty")} />}
        />
      )}
    </div>
  );
}
