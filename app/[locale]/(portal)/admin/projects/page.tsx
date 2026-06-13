"use client";

import { Check, Eye, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { AdminFilterTabs, type StatusFilter } from "@/components/admin/AdminFilterTabs";
import { AdminPageHeader, ExportCsvButton, RowActionButton, SearchInput } from "@/components/admin/AdminUI";
import { ApproveProjectDialog } from "@/components/admin/ApproveProjectDialog";
import { RejectDialog } from "@/components/admin/RejectDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button, Card } from "@/components/ds";
import { Flag } from "@/components/common/Flag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminProjects, useSetProjectStatus, type ProjectAction } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";

export default function AdminProjectsPage() {
  const t = useTranslations("adminPortal");
  const locale = useLocale();
  const { data, isLoading } = useAdminProjects();
  const setStatus = useSetProjectStatus();
  const router = useRouter();
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [query, setQuery] = useState("");

  const all = useMemo(() => data?.items ?? [], [data]);
  const counts = useMemo(
    () => ({
      all: all.length,
      pending: all.filter((p) => p.status === "pending").length,
      approved: all.filter((p) => p.status === "approved").length,
      rejected: all.filter((p) => p.status === "rejected").length,
    }),
    [all],
  );

  const rows = all.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.sector.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q)
    );
  });

  async function act(id: string, action: ProjectAction, reason?: string, riskLevel?: string) {
    try {
      await setStatus.mutateAsync({ id, action, reason, risk_level: riskLevel });
      toast.success(t(action === "approve" ? "approved" : "rejected"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  return (
    <div>
      <AdminPageHeader
        title={t("projectsTitle")}
        subtitle={t("projectsSubtitle")}
        action={
          <div className="flex items-center gap-2">
            <Button href="/admin/projects/new" size="sm" className="gap-1.5">
              <Plus className="size-3.5" aria-hidden />
              {t("addProject")}
            </Button>
            <ExportCsvButton path="/admin/projects.csv" filename="projects.csv" />
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <AdminFilterTabs filter={filter} onChange={setFilter} counts={counts} />
        <SearchInput value={query} onChange={setQuery} placeholder={t("searchProjects")} />
      </div>

      <Card padding="0" hoverLift={false} className="overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[var(--text-muted)]">{t("loading")}</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-[var(--text-muted)]">{t("empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("colProject")}</TableHead>
                  <TableHead>{t("colSector")}</TableHead>
                  <TableHead>{t("colCountry")}</TableHead>
                  <TableHead>{t("colStatus")}</TableHead>
                  <TableHead>{t("colSubmitted")}</TableHead>
                  <TableHead className="text-right">{t("colActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{project.title}</div>
                      <div className="font-mono text-xs text-muted-foreground">{project.id.slice(0, 8)}</div>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">{project.sector}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        <Flag code={project.country} />
                        {project.country.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} label={t(`filter.${project.status}`)} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString(locale, { dateStyle: "medium" })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        <RowActionButton
                          icon={Eye}
                          title={t("view")}
                          onClick={() => router.push(`/admin/projects/${project.id}`)}
                        />
                        {project.status === "pending" && (
                          <>
                            <ApproveProjectDialog
                              triggerIcon={Check}
                              triggerTitle={t("approve")}
                              pending={setStatus.isPending}
                              onConfirm={(risk) => act(project.id, "approve", undefined, risk)}
                            />
                            <RejectDialog
                              triggerIcon={X}
                              triggerTitle={t("reject")}
                              pending={setStatus.isPending}
                              onConfirm={(reason) => act(project.id, "reject", reason)}
                            />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
