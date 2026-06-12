"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ds";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  /** Secondary action rendered after the retry button (e.g. a "go back" link). */
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
};

/**
 * Presentational error state with a clear message and a recovery action.
 * Used by route `error.tsx` boundaries and by data-driven sections that
 * surface a TanStack Query error.
 */
export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
  action,
  className,
  compact,
}: ErrorStateProps) {
  const t = useTranslations("common");

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-base)] border border-border bg-card text-center",
        compact ? "gap-3 p-6" : "gap-4 p-10",
        className,
      )}
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--destructive)_12%,white)] text-[var(--destructive)]">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <div className="space-y-1.5">
        <h3 className="h3">{title ?? t("errorTitle")}</h3>
        <p className="lead mx-auto max-w-md text-[var(--text-sm)]">
          {description ?? t("errorBody")}
        </p>
      </div>
      {(onRetry || action) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2.5">
          {onRetry && (
            <Button onClick={onRetry} className="gap-1.5">
              <RotateCw className="size-4" aria-hidden />
              {retryLabel ?? t("tryAgain")}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
