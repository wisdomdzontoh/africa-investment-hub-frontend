"use client";

import { RouteError, type RouteErrorProps } from "@/components/common/RouteError";

export default function OnboardingError(props: RouteErrorProps) {
  return <RouteError {...props} homeHref="/onboarding" />;
}
