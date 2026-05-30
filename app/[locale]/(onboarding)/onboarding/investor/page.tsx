"use client";

import { Wizard } from "@/components/onboarding/Wizard";
import { useInvestorWizardConfig } from "@/features/onboarding/investor";

export default function InvestorOnboardingPage() {
  const config = useInvestorWizardConfig();
  return <Wizard config={config} />;
}
