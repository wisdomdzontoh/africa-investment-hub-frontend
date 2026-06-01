"use client";

import { Check, Eye, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { AdminFilterTabs, type StatusFilter } from "@/components/admin/AdminFilterTabs";
import { AdminPageHeader, ExportCsvButton, RowActionButton, SearchInput } from "@/components/admin/AdminUI";
import { RejectDialog } from "@/components/admin/RejectDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BrandedCard } from "@/components/brand/Card";
import { Flag } from "@/components/common/Flag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminInvestors, useSetInvestorStatus, type InvestorAction } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { worldCountryName } from "@/lib/data/world-countries";

export default function AdminInvestorsPage() {
  const t = useTranslations("adminPortal");
  const locale = useLocale();
  const { data, isLoading } = useAdminInvestors();
  const setStatus = useSetInvestorStatus();
  const router = useRouter();
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [query, setQuery] = useState("");

  const all = useMemo(() => data?.items ?? [], [data]);
  const counts = useMemo(
    () => ({
      all: all.length,
      pending: all.filter((i) => i.status === "pending").length,
      approved: all.filter((i) => i.status === "approved").length,
      rejected: all.filter((i) => i.status === "rejected").length,
    }),
    [all],
  );

  const rows = all.filter((i) => {
    if (filter !== "all" && i.status !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      i.company_name.toLowerCase().includes(q) ||
      worldCountryName(i.country_of_registration).toLowerCase().includes(q)
    );
  });

  async function act(id: string, action: InvestorAction, reason?: string) {
    try {
      await setStatus.mutateAsync({ id, action, reason });
      toast.success(t(action === "approve" ? "approved" : "rejected"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  return (
    <div>
      <AdminPageHeader
        title={t("investorsTitle")}
        subtitle={t("investorsSubtitle")}
        action={<ExportCsvButton path="/admin/investors.csv" filename="investors.csv" />}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <AdminFilterTabs filter={filter} onChange={setFilter} counts={counts} />
        <SearchInput value={query} onChange={setQuery} placeholder={t("searchInvestors")} />
      </div>

      <BrandedCard className="overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">{t("loading")}</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("colCompany")}</TableHead>
                  <TableHead>{t("colCountry")}</TableHead>
                  <TableHead>{t("colStatus")}</TableHead>
                  <TableHead>{t("colSubmitted")}</TableHead>
                  <TableHead className="text-right">{t("colActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{inv.company_name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{inv.id.slice(0, 8)}</div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        <Flag code={inv.country_of_registration} />
                        {worldCountryName(inv.country_of_registration)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} label={t(`filter.${inv.status}`)} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(inv.created_at).toLocaleDateString(locale, { dateStyle: "medium" })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        <RowActionButton
                          icon={Eye}
                          title={t("view")}
                          onClick={() => router.push(`/admin/investors/${inv.id}`)}
                        />
                        {inv.status === "pending" && (
                          <>
                            <RowActionButton
                              icon={Check}
                              title={t("approve")}
                              variant="approve"
                              disabled={setStatus.isPending}
                              onClick={() => act(inv.id, "approve")}
                            />
                            <RejectDialog
                              triggerIcon={X}
                              triggerTitle={t("reject")}
                              pending={setStatus.isPending}
                              onConfirm={(reason) => act(inv.id, "reject", reason)}
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
      </BrandedCard>
    </div>
  );
}
