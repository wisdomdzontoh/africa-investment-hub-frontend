"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Lock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAccount } from "@/lib/api/hooks";
import { dashboardPath, resolvePostAuthRedirect } from "@/lib/auth/paths";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { UserStatus } from "@/types/api";

/** MFA policy (PRD §6.2, FE-07/SEC-03, relaxed by product decision 2026-07-22):
 *  2FA is recommended, not required — users see a one-time prompt they can
 *  skip and enable later from account settings. Set NEXT_PUBLIC_REQUIRE_MFA=true
 *  to restore the hard block (no skip) for high-security deployments. */
const REQUIRE_MFA = process.env.NEXT_PUBLIC_REQUIRE_MFA === "true";

/* ----------------------------- shared chrome ---------------------------- */

/** Reads the role from Clerk's session publicMetadata (set server-side only). */
function clerkRole(user: { publicMetadata?: unknown } | null | undefined): string | undefined {
  const meta = user?.publicMetadata as { role?: string } | undefined;
  return meta?.role;
}

function GateLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-[var(--text-muted)]">
      Loading…
    </div>
  );
}

function GateError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("portal");
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm text-[var(--text-muted)]">{t("loadError")}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-[var(--radius-md)] border border-[var(--accent-border)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        {t("retry")}
      </button>
    </div>
  );
}

/** 2FA enrolment screen. Clerk's profile modal hosts the TOTP/backup-code
 *  setup; `useUser` re-renders the gate the moment `twoFactorEnabled` flips.
 *  With `onSkip` it is a dismissible recommendation; without it (env-forced
 *  policy) it blocks until a second factor is enrolled. */
function MfaGate({ onSkip }: { onSkip?: () => void }) {
  const t = useTranslations("portal");
  const { openUserProfile } = useClerk();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-[var(--accent-tint-08)] text-[var(--accent)]">
        <ShieldCheck className="size-7" aria-hidden />
      </span>
      <div>
        <h1 className="text-xl font-bold tracking-[-0.01em] text-[var(--ink)]">
          {t("mfaTitle")}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-body)]">
          {t("mfaBody")}
        </p>
      </div>
      <button
        type="button"
        onClick={() => openUserProfile()}
        className="rounded-[var(--radius-md)] bg-[var(--accent)] px-5 py-2.5 font-mono text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-bright)]"
      >
        {t("mfaSetup")}
      </button>
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="border-none bg-transparent text-sm font-medium text-[var(--text-muted)] underline-offset-4 transition-colors hover:text-[var(--ink)] hover:underline"
        >
          {t("mfaSkip")}
        </button>
      )}
      <p className="text-xs text-[var(--text-muted)]">{t("mfaHint")}</p>
    </div>
  );
}

/* ------------------------------ portal gate ----------------------------- */

type PortalAuthGateProps = {
  allowedRoles?: Array<"investor" | "project_owner" | "admin">;
  children: React.ReactNode;
};

/** Guards portal (post-onboarding) pages. Pending accounts ARE allowed in —
 *  review state and approval-only features are handled inside the portal. */
export function PortalAuthGate({ allowedRoles, children }: PortalAuthGateProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { data: account, isLoading, isError, refetch } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  // Local state unlocks instantly on skip; unsafeMetadata persists the choice
  // across devices so the prompt is shown at most once per account.
  const [mfaSkipped, setMfaSkipped] = useState(false);
  const mfaPromptDismissed =
    mfaSkipped ||
    Boolean(
      (user?.unsafeMetadata as { mfaPromptDismissed?: boolean } | undefined)
        ?.mfaPromptDismissed,
    );

  const skipMfaPrompt = () => {
    setMfaSkipped(true);
    void user
      ?.update({
        unsafeMetadata: { ...user.unsafeMetadata, mfaPromptDismissed: true },
      })
      .catch(() => {
        // Persisting the dismissal is best-effort; the session unlock above
        // already happened and the worst case is one repeat prompt.
      });
  };

  // Admin is assigned out-of-band in Clerk; trust publicMetadata so admins are
  // recognised immediately, before the backend account catches up to the JWT.
  const isAdmin = clerkRole(user) === "admin" || account?.role === "admin";
  const effectiveRole = isAdmin ? "admin" : account?.role;

  useEffect(() => {
    if (!isLoaded || isLoading) return;
    if (!isSignedIn) {
      router.replace(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isError || !account) return;
    // Onboarding must be finished before entering the portal (admins skip it).
    if (!isAdmin && !account.onboarding_complete) {
      router.replace("/onboarding");
      return;
    }
    if (allowedRoles && effectiveRole && !allowedRoles.includes(effectiveRole)) {
      router.replace(dashboardPath(effectiveRole));
    }
  }, [account, allowedRoles, effectiveRole, isAdmin, isError, isLoaded, isLoading, isSignedIn, pathname, router]);

  if (!isLoaded || isLoading) return <GateLoading />;
  if (isSignedIn && isError && !account) return <GateError onRetry={refetch} />;
  if (!isSignedIn || !account) return null;
  if (!isAdmin && !account.onboarding_complete) return null;
  if (allowedRoles && effectiveRole && !allowedRoles.includes(effectiveRole)) return null;
  if (user && !user.twoFactorEnabled) {
    if (REQUIRE_MFA) return <MfaGate />;
    if (!mfaPromptDismissed) return <MfaGate onSkip={skipMfaPrompt} />;
  }
  return <>{children}</>;
}

/* --------------------------- onboarding gate ---------------------------- */

/** Guards onboarding pages. Sends users who have already finished onboarding
 *  (or admins) to their dashboard, so returning users are never re-onboarded. */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { data: account, isLoading, isError, refetch } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  // Admins never onboard — recognise them from Clerk metadata immediately.
  const isAdmin = clerkRole(user) === "admin" || account?.role === "admin";

  useEffect(() => {
    if (!isLoaded || isLoading) return;
    if (!isSignedIn) {
      router.replace(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isAdmin) {
      router.replace(dashboardPath("admin"));
      return;
    }
    if (isError || !account) return;
    if (account.onboarding_complete) {
      router.replace(dashboardPath(account.role));
    }
  }, [account, isAdmin, isError, isLoaded, isLoading, isSignedIn, pathname, router]);

  if (!isLoaded || isLoading) return <GateLoading />;
  if (isAdmin) return null;
  if (isSignedIn && isError && !account) return <GateError onRetry={refetch} />;
  if (!isSignedIn || !account) return null;
  if (account.onboarding_complete) return null;
  return <>{children}</>;
}

/* --------------------------- approval gating ---------------------------- */

/** Wraps an approval-only feature. Pending/rejected accounts see a locked
 *  state instead of the content (and we avoid firing gated API calls). */
export function ApprovalRequired({
  status,
  children,
}: {
  status: UserStatus | undefined;
  children: React.ReactNode;
}) {
  const t = useTranslations("portal");
  if (status === "approved") return <>{children}</>;
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-dashed border-[var(--accent-border)] bg-[var(--bg-section)] px-6 py-12 text-center">
      <span className="grid size-10 place-items-center rounded-full bg-[var(--accent-tint-08)] text-[var(--accent)]">
        <Lock className="size-5" aria-hidden />
      </span>
      <p className="font-medium text-[var(--ink)]">{t("lockedTitle")}</p>
      <p className="max-w-sm text-sm text-[var(--text-muted)]">{t("lockedBody")}</p>
    </div>
  );
}

/* ------------------------------ redirect -------------------------------- */

export function AccountRedirect() {
  const { data: account, isLoading } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(resolvePostAuthRedirect(account));
  }, [account, isLoading, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-[var(--text-muted)]">
      Redirecting…
    </div>
  );
}
