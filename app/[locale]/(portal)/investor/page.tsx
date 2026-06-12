"use client";

import { Bell, Globe2, Layers, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ds";
import { Link } from "@/i18n/navigation";
import {
  Checklist,
  type ChecklistStep,
  PortalPage,
  StatCard,
  StatusPill,
} from "@/components/portal";
import {
  useAccount,
  useInvestorNotifications,
  useInvestorProfile,
} from "@/lib/api/hooks";

export default function InvestorOverviewPage() {
  const t = useTranslations("investorPortal");
  const { data: account } = useAccount();
  const { data: profile } = useInvestorProfile();
  const { data: notifications } = useInvestorNotifications();

  const status = account?.status ?? "pending";
  const items = notifications?.items ?? [];
  const unread = items.filter((n) => !n.is_read).length;

  // Engagement checklist (PRD §6.5) derived from real account/profile state.
  const ck = (k: string) => t(`checklist.${k}`);
  const verifyState: ChecklistStep["state"] =
    status === "approved"
      ? "done"
      : status === "rejected" || status === "suspended"
        ? "blocked"
        : "review";
  const stateLabel: Record<ChecklistStep["state"], string> = {
    done: ck("stateDone"),
    review: ck("stateReview"),
    pending: ck("statePending"),
    blocked: ck("stateBlocked"),
  };
  const mk = (label: string, state: ChecklistStep["state"]): ChecklistStep => ({
    label,
    state,
    stateLabel: stateLabel[state],
  });
  const steps: ChecklistStep[] = [
    mk(ck("accountCreated"), "done"),
    mk(ck("profileSubmitted"), account?.onboarding_complete ? "done" : "pending"),
    mk(ck("verification"), verifyState),
    mk(ck("explore"), status === "approved" ? "done" : "pending"),
  ];

  return (
    <PortalPage title={t("overview")} description={t("overviewDesc")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("statusLabel")}
          icon={ShieldCheck}
          value={<StatusPill status={status} />}
        />
        <StatCard
          label={t("kpiSectors")}
          icon={Layers}
          value={profile?.investment_sectors.length ?? 0}
        />
        <StatCard
          label={t("kpiMarkets")}
          icon={Globe2}
          value={profile?.investment_countries.length ?? 0}
        />
        <StatCard label={t("kpiUnread")} icon={Bell} value={unread} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card hoverLift={false}>
          <h2 className="mb-2 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
            {ck("title")}
          </h2>
          <Checklist steps={steps} />
        </Card>

        <Card hoverLift={false}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
              {t("recentActivity")}
            </h2>
            <Link
              href="/investor/notifications"
              className="font-mono text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              {t("viewAll")}
            </Link>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t("noNotifications")}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-[var(--accent-border)]">
              {items.slice(0, 4).map((n) => (
                <li key={n.id} className="flex items-start gap-2.5 py-2.5">
                  {!n.is_read ? (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                  ) : (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--bg-stripe)]" aria-hidden />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--ink)]">{n.title}</p>
                    <p className="line-clamp-2 text-xs text-[var(--text-muted)]">{n.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PortalPage>
  );
}
