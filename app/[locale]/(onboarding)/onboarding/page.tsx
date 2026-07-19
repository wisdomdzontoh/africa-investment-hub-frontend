"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, SectionLabel } from "@/components/ds";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { RoleScene } from "@/components/onboarding/RoleScene";
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
  const reducedMotion = useReducedMotion();
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

  // One orchestrated load sequence: copy → journey → panels → trust note.
  const container = {
    hidden: {},
    show: reducedMotion
      ? {}
      : { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const item = {
    hidden: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 0.6, 0.2, 1] as const },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-page)]">
      {/* Page chrome consistent with the wizard (logo · language · exit). */}
      <OnboardingHeader exitLabel={t("exit")} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Hero copy stays at a readable measure; panels use the full width. */}
          <motion.div variants={item} className="max-w-2xl">
            <SectionLabel dot>{t("eyebrow")}</SectionLabel>
            <h1 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
              {t("title")}
            </h1>
            <p className="mt-3 text-[var(--text-body)]">{t("subtitle")}</p>
          </motion.div>

          <motion.div variants={item}>
            <JourneyStrip />
          </motion.div>

          {resumeRole && (
            <motion.div variants={item}>
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
            </motion.div>
          )}

          <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2">
            <motion.div variants={item} className="flex">
              <RoleScene
                variant="investor"
                preselected={intentRole === "investor"}
                pending={setRole.isPending}
                onSelect={() => choose("investor")}
              />
            </motion.div>
            <motion.div variants={item} className="flex">
              <RoleScene
                variant="project_owner"
                preselected={intentRole === "project_owner"}
                pending={setRole.isPending}
                onSelect={() => choose("project_owner")}
              />
            </motion.div>
          </div>

          {/* Trust note — verification is the product's spine (PRD §1). */}
          <motion.p
            variants={item}
            className="mt-8 flex items-center justify-center gap-2 text-center font-mono text-[var(--text-meta-size)] text-[var(--text-muted)]"
          >
            <ShieldCheck size={14} aria-hidden className="text-[var(--accent)]" />
            {t("verifiedNote")}
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
