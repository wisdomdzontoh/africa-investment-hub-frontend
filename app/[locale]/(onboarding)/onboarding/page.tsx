"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandedButton } from "@/components/brand/Button";
import { BrandedCard } from "@/components/brand/Card";
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
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-[var(--text-strong)]">
        {t("title")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>

      {resumeRole && (
        <BrandedCard className="mt-8 flex items-center justify-between gap-4 border-[var(--green-600)]/40 bg-[color-mix(in_srgb,var(--green-600)_8%,transparent)] p-5">
          <div>
            <h2 className="font-semibold text-[var(--text-strong)]">{t("resume.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("resume.body")}</p>
          </div>
          <Link href={RESUME_PATH[resumeRole]}>
            <BrandedButton iconRight={ArrowRight}>{t("resume.button")}</BrandedButton>
          </Link>
        </BrandedCard>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <BrandedCard className="flex flex-col gap-4 p-6">
          <h2 className="font-semibold text-[var(--text-strong)]">{t("investorTitle")}</h2>
          <p className="flex-1 text-sm text-muted-foreground">{t("investorDesc")}</p>
          <BrandedButton onClick={() => choose("investor")} disabled={setRole.isPending}>
            {t("continueAsInvestor")}
          </BrandedButton>
        </BrandedCard>

        <BrandedCard className="flex flex-col gap-4 p-6">
          <h2 className="font-semibold text-[var(--text-strong)]">{t("ownerTitle")}</h2>
          <p className="flex-1 text-sm text-muted-foreground">{t("ownerDesc")}</p>
          <BrandedButton onClick={() => choose("project_owner")} disabled={setRole.isPending}>
            {t("continueAsOwner")}
          </BrandedButton>
        </BrandedCard>
      </div>
    </div>
  );
}
