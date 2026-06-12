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
    <div className="inline-flex flex-wrap gap-1 rounded-[var(--radius-md)] border border-[var(--accent-border)] bg-[var(--surface-card)] p-1">
      {STATUS_FILTERS.map((f) => {
        const active = filter === f;
        return (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-[var(--accent-tint-08)] font-medium text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--ink)]",
            )}
          >
            {t(`filter.${f}`)}
            {counts && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-semibold",
                  active ? "bg-[var(--accent-tint-10)] text-[var(--accent)]" : "bg-[var(--bg-section)] text-[var(--text-muted)]",
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
