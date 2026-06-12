"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAccount } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/portal/AppHeader";
import { AppSidebar, type PortalNavGroup } from "@/components/portal/AppSidebar";
import type { UserStatus } from "@/types/api";

type PortalShellProps = {
  title: string;
  homeHref: string;
  nav: PortalNavGroup[];
  soonLabel?: string;
  /** Retained for API compatibility; the role badge now lives in the sidebar footer. */
  badge?: string;
  children: React.ReactNode;
};

function ReviewBanner({ status }: { status: UserStatus }) {
  const t = useTranslations("portal");
  if (status === "approved") return null;
  const stopped = status === "rejected" || status === "suspended";

  return (
    <div
      className={cn(
        "mb-6 flex items-start gap-3 rounded-[var(--radius-card)] border px-4 py-3",
        stopped
          ? "border-[var(--p-danger-border)] bg-[var(--p-danger-bg)]"
          : "border-[var(--p-warning-border)] bg-[var(--p-warning-bg)]",
      )}
    >
      <Clock
        className={cn("mt-0.5 size-4 shrink-0", stopped ? "text-[var(--p-danger-fg)]" : "text-[var(--p-warning-fg)]")}
        aria-hidden
      />
      <div>
        <p className="text-sm font-semibold text-[var(--ink)]">
          {stopped ? t("rejectedTitle") : t("reviewTitle")}
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          {stopped ? t("rejectedBody") : t("reviewBody")}
        </p>
      </div>
    </div>
  );
}

export function PortalShell({ title, homeHref, nav, soonLabel, children }: PortalShellProps) {
  const { data: account } = useAccount();
  const showBanner = !!account && account.role !== "admin" && account.status !== "approved";

  return (
    <div className="portal">
      <SidebarProvider>
        <AppSidebar homeHref={homeHref} title={title} nav={nav} soonLabel={soonLabel} />
        <SidebarInset className="bg-[var(--bg-page)]">
          <AppHeader title={title} homeHref={homeHref} nav={nav} />
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {showBanner && account ? <ReviewBanner status={account.status} /> : null}
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
