"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowRight, Building2, Check, Compass, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, SectionLabel } from "@/components/ds";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { useSetAccountRole } from "@/lib/api/hooks";
import { findDraftRole, type ResumableRole } from "@/lib/onboarding/draft";
import { cn } from "@/lib/utils";

const RESUME_PATH: Record<ResumableRole, string> = {
  investor: "/onboarding/investor",
  project_owner: "/onboarding/project",
};

/** Engagement journey (FE-09): where role selection sits in the wider flow. */
function JourneyStrip() {
  const t = useTranslations("onboarding.journey");
  const steps = [
    { key: "account", state: "done" as const },
    { key: "profile", state: "current" as const },
    { key: "verification", state: "upcoming" as const },
    { key: "explore", state: "upcoming" as const },
  ];
  return (
    <ol className="mt-8 flex list-none flex-wrap items-center gap-x-2 gap-y-3 p-0">
      {steps.map((step, i) => (
        <li key={step.key} className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold",
              step.state === "done" && "bg-[var(--accent)] text-white",
              step.state === "current" &&
                "border-2 border-[var(--accent)] bg-[var(--surface-card)] text-[var(--accent)]",
              step.state === "upcoming" &&
                "border border-[var(--ink-border)] bg-[var(--surface-card)] text-[var(--text-muted)]",
            )}
            aria-hidden
          >
            {step.state === "done" ? <Check size={13} strokeWidth={3} /> : i + 1}
          </span>
          <span
            className={cn(
              "text-sm",
              step.state === "current"
                ? "font-semibold text-[var(--ink)]"
                : "text-[var(--text-muted)]",
            )}
          >
            {t(step.key)}
          </span>
          {i < steps.length - 1 ? (
            <span aria-hidden className="mx-1 h-px w-6 bg-[var(--ink-border)]" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const setRole = useSetAccountRole();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [resumeRole, setResumeRole] = useState<ResumableRole | null>(null);

  // Role intent carried over from the sign-up CTA (FE-08).
  const intentParam = searchParams.get("role");
  const intentRole: ResumableRole | null =
    intentParam === "investor"
      ? "investor"
      : intentParam === "facilitator"
        ? "project_owner"
        : null;

  useEffect(() => {
    // localStorage is client-only; reading during render would mismatch SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResumeRole(findDraftRole(user?.id));
  }, [user?.id]);

  async function choose(role: "investor" | "project_owner") {
    try {
      await setRole.mutateAsync(role);
      router.push(role === "investor" ? "/onboarding/investor" : "/onboarding/project");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t("roleError");
      toast.error(message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-page)]">
      {/* Page chrome consistent with the wizard (logo · language · exit). */}
      <header className="border-b border-[var(--accent-border)] bg-[var(--surface-header)]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex" aria-label="African Investment Hub home">
            <Logo height={32} />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--ink)]"
            >
              <X className="size-4" aria-hidden />
              {t("exit")}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero copy stays at a readable measure; cards below use the full width. */}
        <div className="max-w-2xl">
          <SectionLabel dot>{t("eyebrow")}</SectionLabel>
          <h1 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="mt-3 text-[var(--text-body)]">{t("subtitle")}</p>
        </div>

        <JourneyStrip />

      {resumeRole && (
        <Card
          hoverLift={false}
          padding="20px"
          className="mt-8 flex items-center justify-between gap-4 border-[var(--accent)]/40 bg-[var(--accent-tint-06)]"
        >
          <div>
            <h2 className="font-semibold text-[var(--ink)]">{t("resume.title")}</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{t("resume.body")}</p>
          </div>
          <Link href={RESUME_PATH[resumeRole]} className="no-underline">
            <Button className="gap-2">
              {t("resume.button")}
              <ArrowRight size={16} aria-hidden />
            </Button>
          </Link>
        </Card>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card
          hoverLift={false}
          className={cn(
            "flex flex-col gap-4",
            intentRole === "investor" &&
              "border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-tint-08)]",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-08)] text-[var(--accent)]">
              <Compass size={22} aria-hidden />
            </span>
            {intentRole === "investor" ? (
              <span className="rounded-[var(--radius-pill)] bg-[var(--accent-tint-10)] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--accent)]">
                {t("preselected")}
              </span>
            ) : null}
          </div>
          <div className="flex-1">
            <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
              {t("investorTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
              {t("investorDesc")}
            </p>
          </div>
          <Button
            onClick={() => choose("investor")}
            disabled={setRole.isPending}
            className="w-full"
          >
            {t("continueAsInvestor")}
          </Button>
        </Card>

        <Card
          hoverLift={false}
          className={cn(
            "flex flex-col gap-4",
            intentRole === "project_owner" &&
              "border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-tint-08)]",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-08)] text-[var(--accent)]">
              <Building2 size={22} aria-hidden />
            </span>
            {intentRole === "project_owner" ? (
              <span className="rounded-[var(--radius-pill)] bg-[var(--accent-tint-10)] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--accent)]">
                {t("preselected")}
              </span>
            ) : null}
          </div>
          <div className="flex-1">
            <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
              {t("ownerTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
              {t("ownerDesc")}
            </p>
          </div>
          <Button
            onClick={() => choose("project_owner")}
            disabled={setRole.isPending}
            className="w-full"
          >
            {t("continueAsOwner")}
          </Button>
        </Card>
      </div>
      </main>
    </div>
  );
}
