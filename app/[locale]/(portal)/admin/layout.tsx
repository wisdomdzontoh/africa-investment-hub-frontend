"use client";

import {
  BarChart3,
  Briefcase,
  Globe,
  GitMerge,
  Home,
  LayoutDashboard,
  ScrollText,
  UserCog,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PortalAuthGate } from "@/components/auth/PortalAuthGate";
import { PortalShell } from "@/components/portal";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("adminPortal");

  const nav = [
    {
      label: t("navOperations"),
      items: [
        { href: "/admin", label: t("overview"), icon: LayoutDashboard, exact: true },
        { href: "/admin/investors", label: t("investors"), icon: Users },
        { href: "/admin/projects", label: t("projects"), icon: Briefcase },
        { href: "/admin/matches", label: t("navMatches"), icon: GitMerge },
        { href: "/admin/users", label: t("users"), icon: UserCog },
        { href: "/admin/audit-log", label: t("auditLog"), icon: ScrollText },
      ],
    },
    {
      label: t("navInsights"),
      items: [
        { href: "/admin/analytics", label: t("navAnalytics"), icon: BarChart3 },
      ],
    },
    {
      label: t("navContent"),
      items: [
        { href: "/admin/cms/countries", label: t("navCountries"), icon: Globe },
        { href: "/admin/cms/homepage", label: t("navHomepage"), icon: Home },
      ],
    },
  ];

  return (
    <PortalAuthGate allowedRoles={["admin"]}>
      <PortalShell
        title={t("title")}
        badge={t("consoleLabel")}
        homeHref="/admin"
        nav={nav}
        soonLabel={t("soon")}
      >
        {children}
      </PortalShell>
    </PortalAuthGate>
  );
}
