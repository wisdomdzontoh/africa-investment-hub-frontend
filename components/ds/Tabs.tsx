"use client";

import { cn } from "@/lib/utils";

type TabsProps = {
  items?: string[];
  active?: number;
  onChange?: (index: number) => void;
  className?: string;
};

/** Segmented tab bar on a dark panel. Phones get a 2×2 grid (a single row
 *  can't shrink below the labels' text width and overflows the viewport);
 *  ≥sm it is one row with hairline dividers. */
export function Tabs({ items = [], active = 0, onChange, className }: TabsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-1 sm:flex sm:items-stretch sm:gap-0", className)}>
      {items.map((label, i) => (
        <div key={label} className="flex min-w-0 items-stretch sm:flex-1">
          {i > 0 ? (
            <span
              className="my-3 hidden w-px shrink-0 bg-[var(--on-dark-divider)] sm:block"
              aria-hidden
            />
          ) : null}
          <button
            type="button"
            onClick={() => onChange?.(i)}
            className={cn(
              "min-w-0 flex-1 rounded-[var(--radius-icon)] border-none px-3 py-3.5 font-sans text-sm font-semibold transition-[background,color] duration-200 ease-[ease]",
              active === i
                ? "bg-[var(--accent-tint-16)] text-[var(--accent-bright)]"
                : "bg-transparent text-[var(--on-dark-85)]",
            )}
          >
            {label}
          </button>
        </div>
      ))}
    </div>
  );
}
