"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { AdminPageHeader, SearchInput } from "@/components/admin/AdminUI";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BrandedButton } from "@/components/brand/Button";
import { BrandedCard } from "@/components/brand/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAccount,
  useAdminUsers,
  useSetUserRole,
  useSetUserStatus,
} from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import type { UserRole } from "@/types/api";
import { cn } from "@/lib/utils";

const ROLES: UserRole[] = ["investor", "project_owner", "admin"];

export default function AdminUsersPage() {
  const t = useTranslations("adminPortal");
  const locale = useLocale();
  const { data, isLoading } = useAdminUsers();
  const { data: me } = useAccount();
  const setRole = useSetUserRole();
  const setStatus = useSetUserStatus();
  const [query, setQuery] = useState("");

  const all = useMemo(() => data?.items ?? [], [data]);
  const rows = all.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (u.email ?? "").toLowerCase().includes(q) || u.role.includes(q);
  });

  async function changeRole(userId: string, role: UserRole) {
    try {
      await setRole.mutateAsync({ userId, role });
      toast.success(t("roleUpdated"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  async function toggleSuspend(userId: string, suspended: boolean) {
    try {
      await setStatus.mutateAsync({ userId, status: suspended ? "approved" : "suspended" });
      toast.success(t(suspended ? "reactivated" : "suspended"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  return (
    <div>
      <AdminPageHeader title={t("usersTitle")} subtitle={t("usersSubtitle")} />

      <div className="mb-4 flex justify-end">
        <SearchInput value={query} onChange={setQuery} placeholder={t("searchUsers")} />
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
                  <TableHead>{t("colUser")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead>{t("colStatus")}</TableHead>
                  <TableHead>{t("colJoined")}</TableHead>
                  <TableHead className="text-right">{t("colActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((user) => {
                  const isSelf = me?.id === user.id;
                  const suspended = user.status === "suspended";
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{user.email ?? user.id}</span>
                          {isSelf && (
                            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                              {t("you")}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          value={user.role}
                          disabled={isSelf || setRole.isPending}
                          onChange={(e) => changeRole(user.id, e.target.value as UserRole)}
                          className={cn(
                            "rounded-[var(--radius-base)] border border-border bg-background px-2.5 py-1.5 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-60",
                          )}
                          aria-label={t("role")}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {t(`roles.${r}`)}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} label={t(`filter.${user.status}`)} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString(locale, { dateStyle: "medium" })}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          {!isSelf && (
                            <BrandedButton
                              size="sm"
                              variant="outline"
                              disabled={setStatus.isPending}
                              onClick={() => toggleSuspend(user.id, suspended)}
                              className={suspended ? "" : "border-destructive/40 text-destructive hover:bg-destructive/5"}
                            >
                              {suspended ? t("reactivate") : t("suspend")}
                            </BrandedButton>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </BrandedCard>
    </div>
  );
}
