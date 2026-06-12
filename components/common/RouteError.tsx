"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ds";
import { ErrorState } from "@/components/common/ErrorState";
import { Link } from "@/i18n/navigation";

export type RouteErrorProps = {
  error: Error & { digest?: string };
  /** Next 16 preferred recovery (re-fetch + re-render). */
  unstable_retry?: () => void;
  /** Legacy reset (clears error state only). */
  reset?: () => void;
  /** Where the secondary "back" action points. */
  homeHref?: string;
};

/**
 * Shared fallback UI for route-level `error.tsx` boundaries. Centers an
 * ErrorState with a retry action plus a safe escape hatch link.
 */
export function RouteError({
  error,
  unstable_retry,
  reset,
  homeHref = "/",
}: RouteErrorProps) {
  const t = useTranslations("common");

  useEffect(() => {
    // Surface to the console (Sentry picks these up in production).
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="page flex min-h-[60vh] items-center justify-center py-[var(--section-y)]">
      <ErrorState
        className="w-full max-w-xl"
        onRetry={retry}
        action={
          <Link
            href={homeHref}
            className={buttonVariants({ variant: "outline", size: "md" })}
          >
            {t("goHome")}
          </Link>
        }
      />
    </div>
  );
}
