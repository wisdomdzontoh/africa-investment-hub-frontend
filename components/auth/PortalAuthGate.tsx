"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Clock, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useAccount } from "@/lib/api/hooks";
import { dashboardPath, resolvePostAuthRedirect } from "@/lib/auth/paths";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { UserStatus } from "@/types/api";

/* ----------------------------- shared chrome ---------------------------- */

/** Reads the role from Clerk's session publicMetadata (set server-side only). */
function clerkRole(user: { publicMetadata?: unknown } | null | undefined): string | undefined {
  const meta = user?.publicMetadata as { role?: string } | undefined;
  return meta?.role;
}

function GateLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
      Loading…
    </div>
  );
}

function GateError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("portal");
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm text-muted-foreground">{t("loadError")}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-[var(--radius-base)] border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--green-600)]"
      >
        {t("retry")}
      </button>
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
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-base)] border border-dashed border-border bg-[var(--surface-sunken)]/40 px-6 py-12 text-center">
      <span className="grid size-10 place-items-center rounded-full bg-[color-mix(in_srgb,var(--green-600)_12%,transparent)] text-[var(--green-700)]">
        <Lock className="size-5" aria-hidden />
      </span>
      <p className="font-medium text-foreground">{t("lockedTitle")}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{t("lockedBody")}</p>
    </div>
  );
}

/* ------------------------------- review banner -------------------------- */

function ReviewBanner({ status }: { status: UserStatus }) {
  const t = useTranslations("portal");
  if (status === "approved") return null;
  const rejected = status === "rejected" || status === "suspended";
  return (
    <div
      className={
        "mb-6 flex items-start gap-3 rounded-[var(--radius-base)] border px-4 py-3 " +
        (rejected
          ? "border-destructive/40 bg-destructive/5"
          : "border-[var(--warning)]/40 bg-[color-mix(in_srgb,var(--warning)_8%,transparent)]")
      }
    >
      <Clock
        className={"mt-0.5 size-4 shrink-0 " + (rejected ? "text-destructive" : "text-[var(--warning)]")}
        aria-hidden
      />
      <div>
        <p className="text-sm font-semibold text-foreground">
          {rejected ? t("rejectedTitle") : t("reviewTitle")}
        </p>
        <p className="text-sm text-muted-foreground">
          {rejected ? t("rejectedBody") : t("reviewBody")}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- shell --------------------------------- */

type PortalShellProps = {
  title: string;
  nav: Array<{ href: string; label: string }>;
  children: React.ReactNode;
};

export function PortalShell({ title, nav, children }: PortalShellProps) {
  const t = useTranslations("portal");
  const pathname = usePathname();
  const { data: account } = useAccount();
  const showBanner = !!account && account.role !== "admin" && account.status !== "approved";

  return (
    <div className="min-h-screen bg-[var(--surface-muted)]">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("workspace")}
            </p>
            <h1 className="font-display text-xl font-semibold text-[var(--text-strong)]">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link
              href="/"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              {t("backToSite")}
            </Link>
            <UserButton />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "rounded-md bg-background px-3 py-2 text-sm font-medium text-[var(--text-strong)] shadow-sm"
                  : "rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-background/70 hover:text-foreground"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0">
          {showBanner && account && <ReviewBanner status={account.status} />}
          {children}
        </main>
      </div>
    </div>
  );
}

export function AccountRedirect() {
  const { data: account, isLoading } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(resolvePostAuthRedirect(account));
  }, [account, isLoading, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
      Redirecting…
    </div>
  );
}
