"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ds/Button";
import { useAccount } from "@/lib/api/hooks";
import { dashboardPath } from "@/lib/auth/paths";
import { cn } from "@/lib/utils";

/**
 * Auth-reactive half of the utility cluster. There's no server-side account/role
 * endpoint in this app yet (role lives behind an authenticated client fetch — see
 * lib/api/hooks.ts `useAccount`), so this stays a client component matching the
 * existing app-wide pattern, and renders a neutral fixed-size skeleton while
 * Clerk resolves rather than flashing the signed-out buttons first.
 */
export function HeaderAuthActions() {
  const t = useTranslations("nav");
  const { isLoaded, isSignedIn } = useAuth();
  const { data: account } = useAccount(isSignedIn === true);

  if (!isLoaded) {
    return <div className="h-9 w-56 animate-pulse rounded-full bg-[var(--bg-section)]" />;
  }

  if (!isSignedIn) {
    return (
      <>
        <Link
          href="/sign-in"
          className="hidden text-sm font-medium text-[var(--ink)] no-underline transition-colors hover:text-[var(--accent)] min-[1280px]:inline-block"
        >
          {t("signIn")}
        </Link>
        <Link
          href="/contact?intent=advisor"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "hidden !rounded-full min-[1280px]:inline-flex",
          )}
        >
          {t("talkToAdvisor")}
        </Link>
        <Link href="/sign-up" className={cn(buttonVariants({ variant: "dark", size: "sm" }), "!rounded-full")}>
          {t("getStarted")}
        </Link>
      </>
    );
  }

  const portalHref = account ? dashboardPath(account.role) : "/onboarding";
  return (
    <>
      <Link
        href={portalHref}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "hidden !rounded-full min-[1280px]:inline-flex",
        )}
      >
        {t("dashboard")}
      </Link>
      <UserButton />
    </>
  );
}
