"use client";

import { UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { AdminPageHeader, SearchInput } from "@/components/admin/AdminUI";
import { Button } from "@/components/ds";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { DataTable, StatusPill, type Column } from "@/components/portal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAccount,
  useAdminUsers,
  useInviteAdmin,
  useSetUserRole,
  useSetUserStatus,
} from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import type { UserAccount, UserRole } from "@/types/api";

const ROLES: UserRole[] = ["investor", "project_owner", "admin"];

export default function AdminUsersPage() {
  const t = useTranslations("adminPortal");
  const locale = useLocale();
  const { data, isLoading, isError, refetch } = useAdminUsers();
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

  const columns: Column<UserAccount>[] = [
    {
      key: "user",
      header: t("colUser"),
      render: (user) => (
        <span className="inline-flex items-center gap-2">
          <span className="font-medium text-[var(--ink)]">{user.email ?? user.id}</span>
          {me?.id === user.id ? (
            <span className="rounded-[var(--radius-pill)] bg-[var(--bg-section)] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-[var(--text-muted)]">
              {t("you")}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      key: "role",
      header: t("role"),
      render: (user) => (
        <select
          value={user.role}
          disabled={me?.id === user.id || setRole.isPending}
          onChange={(e) => changeRole(user.id, e.target.value as UserRole)}
          onClick={(e) => e.stopPropagation()}
          aria-label={t("role")}
          className="rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-2.5 py-1.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)] disabled:opacity-60"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {t(`roles.${r}`)}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "status",
      header: t("colStatus"),
      render: (user) => <StatusPill status={user.status} label={t(`filter.${user.status}`)} />,
    },
    {
      key: "joined",
      header: t("colJoined"),
      hideOnMobile: true,
      render: (user) =>
        new Date(user.created_at).toLocaleDateString(locale, { dateStyle: "medium" }),
      className: "whitespace-nowrap text-[var(--text-muted)]",
    },
    {
      key: "actions",
      header: t("colActions"),
      align: "right",
      render: (user) => {
        if (me?.id === user.id) return null;
        const suspended = user.status === "suspended";
        return (
          <Button
            size="sm"
            variant="outline"
            disabled={setStatus.isPending}
            onClick={() => toggleSuspend(user.id, suspended)}
            className={
              suspended
                ? ""
                : "border-[var(--p-danger)]/40 text-[var(--p-danger)] hover:bg-[var(--p-danger-bg)]"
            }
          >
            {suspended ? t("reactivate") : t("suspend")}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title={t("usersTitle")}
        subtitle={t("usersSubtitle")}
        action={<InviteAdminDialog />}
      />

      <div className="mb-4 flex justify-end">
        <SearchInput value={query} onChange={setQuery} placeholder={t("searchUsers")} />
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(u) => u.id}
          isLoading={isLoading}
          empty={
            <EmptyState
              compact
              title={t("empty")}
              description={query ? t("noSearchResults") : undefined}
            />
          }
        />
      )}
    </div>
  );
}

/** Invite a new administrator by email (Clerk invitation, role=admin). */
function InviteAdminDialog() {
  const t = useTranslations("adminPortal");
  const invite = useInviteAdmin();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await invite.mutateAsync(email.trim());
      toast.success(t("inviteSent"));
      setEmail("");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <UserPlus className="size-3.5" aria-hidden />
        {t("inviteAdmin")}
      </Button>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{t("inviteAdminTitle")}</DialogTitle>
            <DialogDescription>{t("inviteAdminBody")}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label
              htmlFor="invite-email"
              className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]"
            >
              {t("inviteEmail")}
            </label>
            <input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={invite.isPending || !email.trim()}>
              {invite.isPending ? t("inviteSending") : t("inviteSend")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
