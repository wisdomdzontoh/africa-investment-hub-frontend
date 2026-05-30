"use client";

import type { ReactNode } from "react";
import { OnboardingGate } from "@/components/auth/PortalAuthGate";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <OnboardingGate>{children}</OnboardingGate>;
}
