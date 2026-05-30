"use client";

import { useLocale, useTranslations } from "next-intl";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { BrandedCard } from "@/components/brand/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminAuditLog } from "@/lib/api/hooks";

export default function AdminAuditLogPage() {
  const t = useTranslations("adminPortal");
  const locale = useLocale();
  const { data, isLoading } = useAdminAuditLog();

  const items = data?.items ?? [];
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });

  return (
    <div>
      <AdminPageHeader title={t("auditLogTitle")} subtitle={t("auditLogSubtitle")} />
      <BrandedCard className="overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">{t("loading")}</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("auditAction")}</TableHead>
                  <TableHead>{t("auditTarget")}</TableHead>
                  <TableHead>{t("auditWhen")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs font-medium text-foreground">
                        {entry.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.target_type ? (
                        <>
                          {entry.target_type}
                          {entry.target_id ? (
                            <span className="font-mono text-xs"> · {entry.target_id.slice(0, 8)}</span>
                          ) : null}
                        </>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {fmt(entry.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </BrandedCard>
    </div>
  );
}
