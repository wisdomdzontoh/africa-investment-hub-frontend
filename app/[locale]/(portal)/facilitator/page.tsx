"use client";

import { Briefcase, CheckCircle2, Clock, Plus, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, Card } from "@/components/ds";
import { Link } from "@/i18n/navigation";
import {
  Checklist,
  type ChecklistStep,
  PortalPage,
  StatCard,
  StatusPill,
} from "@/components/portal";
import { useAccount, useMyProjects } from "@/lib/api/hooks";
import { getSector } from "@/lib/data/sectors";

export default function FacilitatorOverviewPage() {
  const t = useTranslations("facilitatorPortal");
  const { data: account } = useAccount();
  const { data: projects } = useMyProjects();

  const status = account?.status ?? "pending";
  const list = projects ?? [];
  const live = list.filter((p) => p.status === "approved").length;
  const inReview = list.filter((p) => p.status === "pending").length;

  const ck = (k: string) => t(`checklist.${k}`);
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
  const verifyState: ChecklistStep["state"] =
    status === "approved" ? "done" : status === "rejected" || status === "suspended" ? "blocked" : "review";
  const steps: ChecklistStep[] = [
    mk(ck("accountCreated"), "done"),
    mk(ck("projectSubmitted"), list.length > 0 ? "done" : "pending"),
    mk(ck("verification"), verifyState),
    mk(ck("projectLive"), live > 0 ? "done" : "pending"),
  ];

  return (
    <PortalPage
      title={t("overview")}
      description={t("overviewDesc")}
      actions={
        <Button href="/facilitator/projects/new" size="sm" className="gap-1.5">
          <Plus size={16} aria-hidden />
          {t("newProject")}
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("statusLabel")} icon={ShieldCheck} value={<StatusPill status={status} />} />
        <StatCard label={t("projectCount")} icon={Briefcase} value={list.length} />
        <StatCard label={t("kpiLive")} icon={CheckCircle2} value={live} />
        <StatCard label={t("kpiInReview")} icon={Clock} value={inReview} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card hoverLift={false}>
          <h2 className="mb-2 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
            {ck("title")}
          </h2>
          <Checklist steps={steps} />
        </Card>

        <Card hoverLift={false}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
              {t("projects")}
            </h2>
            <Link
              href="/facilitator/projects"
              className="font-mono text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              {t("backToProjects")}
            </Link>
          </div>
          {list.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">
              {t("noProjects")}{" "}
              <Link href="/facilitator/projects/new" className="font-semibold text-[var(--accent)]">
                {t("createFirst")}
              </Link>
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-[var(--accent-border)]">
              {list.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link
                    href={`/facilitator/projects/${p.id}`}
                    className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                  >
                    {p.title}
                  </Link>
                  <span className="shrink-0 text-xs text-[var(--text-muted)]">
                    {getSector(p.sector).name}
                  </span>
                  <StatusPill status={p.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PortalPage>
  );
}
