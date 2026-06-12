"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAccount, useInvestorNotifications } from "@/lib/api/hooks";

/** Header notification bell. Notifications are investor-scoped today
 *  (`/investors/me/notifications`); other roles see an empty bell until the
 *  generic notifications endpoint lands (NOTIF-02). Polls every 60s. */
export function NotificationBell() {
  const t = useTranslations("portal");
  const { data: account } = useAccount();
  const isInvestor = account?.role === "investor";
  const { data } = useInvestorNotifications(isInvestor);

  const items = isInvestor ? (data?.items ?? []) : [];
  const unread = items.filter((n) => !n.is_read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("notifications")}
          className="relative grid size-9 place-items-center rounded-[var(--radius-md)] text-[var(--text-body)] transition-colors hover:bg-[var(--bg-section)] hover:text-[var(--ink)]"
        >
          <Bell className="size-[18px]" aria-hidden />
          {unread > 0 ? (
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--p-danger)] px-1 font-mono text-[10px] font-bold leading-none text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 overflow-hidden rounded-[var(--radius-card)] border-[var(--accent-border)] p-0"
      >
        <div className="flex items-center justify-between border-b border-[var(--accent-border)] px-4 py-3">
          <span className="text-sm font-semibold text-[var(--ink)]">{t("notifications")}</span>
          {unread > 0 ? (
            <span className="rounded-[var(--radius-pill)] bg-[var(--p-danger-bg)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--p-danger-fg)]">
              {unread}
            </span>
          ) : null}
        </div>

        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
            {t("noNotifications")}
          </p>
        ) : (
          <ul className="max-h-80 divide-y divide-[var(--accent-border)] overflow-y-auto">
            {items.slice(0, 6).map((n) => (
              <li key={n.id} className="flex items-start gap-2.5 px-4 py-3">
                <span
                  className={
                    "mt-1.5 size-2 shrink-0 rounded-full " +
                    (n.is_read ? "bg-[var(--bg-stripe)]" : "bg-[var(--p-info)]")
                  }
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--ink)]">{n.title}</p>
                  <p className="line-clamp-2 text-xs text-[var(--text-muted)]">{n.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {isInvestor ? (
          <Link
            href="/investor/notifications"
            className="block border-t border-[var(--accent-border)] px-4 py-2.5 text-center font-mono text-xs font-semibold text-[var(--accent)] no-underline hover:bg-[var(--bg-section)]"
          >
            {t("viewAll")}
          </Link>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
