"use client";

import { Briefcase, Handshake, LayoutDashboard, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PortalAuthGate } from "@/components/auth/PortalAuthGate";
import { PortalShell } from "@/components/portal";

export default function FacilitatorLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("facilitatorPortal");

  const nav = [
    {
      items: [
        { href: "/facilitator", label: t("overview"), icon: LayoutDashboard, exact: true },
        { href: "/facilitator/projects", label: t("projects"), icon: Briefcase },
        { href: "/facilitator/interest", label: t("interest"), icon: Handshake },
        { href: "/facilitator/projects/new", label: t("newProject"), icon: Plus },
      ],
    },
  ];

  // Role value `project_owner` is the stable wire/DB identifier (DEC-2); only
  // user-facing copy/routes are renamed.
  return (
    <PortalAuthGate allowedRoles={["project_owner", "admin"]}>
      <PortalShell title={t("title")} homeHref="/facilitator" nav={nav}>
        {children}
      </PortalShell>
    </PortalAuthGate>
  );
}
