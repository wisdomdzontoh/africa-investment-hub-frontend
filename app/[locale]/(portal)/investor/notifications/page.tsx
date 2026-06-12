"use client";

import { BellOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ds";
import { EmptyState } from "@/components/common/EmptyState";
import { PortalPage } from "@/components/portal";
import { useInvestorNotifications } from "@/lib/api/hooks";

export default function InvestorNotificationsPage() {
  const t = useTranslations("investorPortal");
  const { data, isLoading } = useInvestorNotifications();

  const items = data?.items ?? [];

  return (
    <PortalPage title={t("notifications")} description={t("notificationsDesc")}>
      {isLoading ? (
        <p className="text-[var(--text-muted)]">{t("loading")}</p>
      ) : items.length === 0 ? (
        <EmptyState icon={BellOff} title={t("noNotifications")} />
      ) : (
        <div className="grid gap-3">
          {items.map((n) => (
            <Card
              key={n.id}
              hoverLift={false}
              padding="18px 20px"
              className="flex items-start gap-3"
            >
              <span
                className={
                  "mt-1.5 size-2 shrink-0 rounded-full " +
                  (n.is_read ? "bg-[var(--bg-stripe)]" : "bg-[var(--accent)]")
                }
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[var(--ink)]">{n.title}</p>
                  {!n.is_read ? (
                    <span className="shrink-0 rounded-[var(--radius-pill)] bg-[var(--accent-tint-10)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--accent)]">
                      {t("unreadLabel")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-body)]">{n.body}</p>
                <p className="mt-1.5 font-mono text-[11px] text-[var(--text-muted)]">
                  {new Date(n.created_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PortalPage>
  );
}
