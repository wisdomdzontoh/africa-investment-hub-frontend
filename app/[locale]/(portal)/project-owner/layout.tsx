"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PortalAuthGate, PortalShell } from "@/components/auth/PortalAuthGate";

export default function ProjectOwnerLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("ownerPortal");

  const nav = [
    { href: "/project-owner", label: t("overview") },
    { href: "/project-owner/projects", label: t("projects") },
    { href: "/project-owner/projects/new", label: t("newProject") },
  ];

  return (
    <PortalAuthGate allowedRoles={["project_owner", "admin"]}>
      <PortalShell title={t("title")} nav={nav}>
        {children}
      </PortalShell>
    </PortalAuthGate>
  );
}
