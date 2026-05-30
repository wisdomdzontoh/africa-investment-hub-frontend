"use client";

import { AccountRedirect } from "@/components/auth/PortalAuthGate";

// The dedicated "pending approval" screen has been retired: pending users now
// land in their dashboard (with an under-review banner) once onboarding is
// complete. This route is kept as a safe redirector for any old links.
export default function PendingApprovalPage() {
  return <AccountRedirect />;
}
