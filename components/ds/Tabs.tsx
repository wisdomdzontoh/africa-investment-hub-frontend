"use client";

import { cn } from "@/lib/utils";

type TabsProps = {
  items?: string[];
  active?: number;
  onChange?: (index: number) => void;
  className?: string;
};

export function Tabs({ items = [], active = 0, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-stretch", className)}>
      {items.map((label, i) => (
        <div key={label} className="flex flex-1 items-stretch">
          {i > 0 ? (
            <span
              className="my-3 w-px shrink-0 bg-[var(--on-dark-divider)]"
              aria-hidden
            />
          ) : null}
          <button
            type="button"
            onClick={() => onChange?.(i)}
            className={cn(
              "flex-1 rounded-[var(--radius-icon)] border-none px-3 py-3.5 font-sans text-sm font-semibold transition-[background,color] duration-200 ease-[ease]",
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
