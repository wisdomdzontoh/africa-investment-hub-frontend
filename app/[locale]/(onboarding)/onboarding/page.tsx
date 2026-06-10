"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowRight, Building2, Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, SectionLabel } from "@/components/ds";
import { Logo } from "@/components/brand/Logo";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { useSetAccountRole } from "@/lib/api/hooks";
import { findDraftRole, type ResumableRole } from "@/lib/onboarding/draft";

const RESUME_PATH: Record<ResumableRole, string> = {
  investor: "/onboarding/investor",
  project_owner: "/onboarding/project",
};

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const setRole = useSetAccountRole();
  const { user } = useUser();
  const [resumeRole, setResumeRole] = useState<ResumableRole | null>(null);

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
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Link href="/" className="inline-flex" aria-label="African Investment Hub home">
        <Logo height={36} />
      </Link>

      <div className="mt-10">
        <SectionLabel dot>{t("eyebrow")}</SectionLabel>
        <h1 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
          {t("title")}
        </h1>
        <p className="mt-3 text-[var(--text-body)]">{t("subtitle")}</p>
      </div>

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

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Card hoverLift={false} className="flex flex-col gap-4">
          <span className="flex size-11 items-center justify-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-08)] text-[var(--accent)]">
            <Compass size={22} aria-hidden />
          </span>
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

        <Card hoverLift={false} className="flex flex-col gap-4">
          <span className="flex size-11 items-center justify-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-08)] text-[var(--accent)]">
            <Building2 size={22} aria-hidden />
          </span>
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
    </div>
  );
}
