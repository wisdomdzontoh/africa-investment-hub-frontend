"use client";

import { Compass, GitMerge, LayoutDashboard, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PortalAuthGate } from "@/components/auth/PortalAuthGate";
import { PortalShell } from "@/components/portal";

export default function InvestorLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("investorPortal");

  // Notifications moved to the header bell — not in the sidebar nav.
  const nav = [
    {
      items: [
        { href: "/investor", label: t("overview"), icon: LayoutDashboard, exact: true },
        { href: "/investor/opportunities", label: t("browse"), icon: Compass },
        { href: "/investor/matches", label: t("matches"), icon: GitMerge },
        { href: "/investor/profile", label: t("profile"), icon: UserRound },
      ],
    },
  ];

  return (
    <PortalAuthGate allowedRoles={["investor", "admin"]}>
      <PortalShell title={t("title")} homeHref="/investor" nav={nav}>
        {children}
      </PortalShell>
    </PortalAuthGate>
  );
}
