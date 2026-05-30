"use client";

import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PortalAuthGate } from "@/components/auth/PortalAuthGate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PortalAuthGate allowedRoles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </PortalAuthGate>
  );
}
