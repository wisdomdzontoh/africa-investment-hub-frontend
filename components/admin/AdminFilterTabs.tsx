"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export const STATUS_FILTERS = ["pending", "approved", "rejected", "all"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export function AdminFilterTabs({
  filter,
  onChange,
  counts,
}: {
  filter: StatusFilter;
  onChange: (f: StatusFilter) => void;
  counts?: Record<StatusFilter, number>;
}) {
  const t = useTranslations("adminPortal");
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-[var(--radius-base)] border border-border bg-background p-1">
      {STATUS_FILTERS.map((f) => {
        const active = filter === f;
        return (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[calc(var(--radius-base)-3px)] px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-[color-mix(in_srgb,var(--green-600)_14%,transparent)] font-medium text-[var(--green-700)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`filter.${f}`)}
            {counts && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-semibold",
                  active ? "bg-[var(--green-600)]/15 text-[var(--green-700)]" : "bg-muted text-muted-foreground",
                )}
              >
                {counts[f]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
