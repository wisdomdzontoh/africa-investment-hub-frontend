"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PortalAuthGate, PortalShell } from "@/components/auth/PortalAuthGate";

export default function InvestorLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("investorPortal");

  const nav = [
    { href: "/investor", label: t("overview") },
    { href: "/investor/profile", label: t("profile") },
    { href: "/investor/matches", label: t("matches") },
    { href: "/investor/notifications", label: t("notifications") },
  ];

  return (
    <PortalAuthGate allowedRoles={["investor", "admin"]}>
      <PortalShell title={t("title")} nav={nav}>
        {children}
      </PortalShell>
    </PortalAuthGate>
  );
}
