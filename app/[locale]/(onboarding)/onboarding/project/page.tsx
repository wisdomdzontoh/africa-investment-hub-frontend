"use client";

import { Wizard } from "@/components/onboarding/Wizard";
import { useProjectWizardConfig } from "@/features/onboarding/project";

export default function ProjectOnboardingPage() {
  const config = useProjectWizardConfig();
  return <Wizard config={config} />;
}
