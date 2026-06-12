import type { UserAccount, UserRole } from "@/types/api";

// IMPORTANT: these return LOCALE-LESS paths. They are meant to be passed to
// next-intl's <Link> / useRouter, which prepend the active locale. Prefixing
// the locale here as well produces a double prefix (e.g. /en/en/investor).

export function dashboardPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "project_owner":
      return "/facilitator";
    case "investor":
    default:
      return "/investor";
  }
}

export function resolvePostAuthRedirect(account: UserAccount | undefined): string {
  if (!account) {
    return "/onboarding";
  }

  if (account.role === "admin") {
    return dashboardPath("admin");
  }

  // Onboarding finished → straight to the role dashboard, even while the
  // account is still pending review (the dashboard surfaces the review state
  // and gates approval-only features). Unfinished → resume onboarding.
  if (account.onboarding_complete) {
    return dashboardPath(account.role);
  }

  return "/onboarding";
}
