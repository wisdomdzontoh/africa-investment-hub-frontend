"use client";

import { ScrollText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { DataTable, type Column } from "@/components/portal";
import { useAdminAuditLog } from "@/lib/api/hooks";
import type { AuditLogEntry } from "@/types/api";

export default function AdminAuditLogPage() {
  const t = useTranslations("adminPortal");
  const locale = useLocale();
  const { data, isLoading, isError, refetch } = useAdminAuditLog();

  const items = data?.items ?? [];
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });

  const columns: Column<AuditLogEntry>[] = [
    {
      key: "action",
      header: t("auditAction"),
      render: (entry) => (
        <span className="rounded-[var(--radius-pill)] bg-[var(--bg-section)] px-2 py-0.5 font-mono text-xs font-medium text-[var(--ink)]">
          {entry.action}
        </span>
      ),
    },
    {
      key: "target",
      header: t("auditTarget"),
      render: (entry) =>
        entry.target_type ? (
          <span className="text-[var(--text-muted)]">
            {entry.target_type}
            {entry.target_id ? (
              <span className="font-mono text-xs"> · {entry.target_id.slice(0, 8)}</span>
            ) : null}
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "when",
      header: t("auditWhen"),
      render: (entry) => fmt(entry.created_at),
      className: "whitespace-nowrap text-[var(--text-muted)]",
    },
  ];

  return (
    <div>
      <AdminPageHeader title={t("auditLogTitle")} subtitle={t("auditLogSubtitle")} />
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          rowKey={(e) => e.id}
          isLoading={isLoading}
          empty={<EmptyState compact icon={ScrollText} title={t("empty")} />}
        />
      )}
    </div>
  );
}
