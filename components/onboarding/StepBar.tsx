"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepMeta = { id: string; label: string; badge: string };

type Props = {
  steps: StepMeta[];
  current: number;
  /** Allow jumping back to already-visited steps. */
  onJump: (index: number) => void;
};

export function StepBar({ steps, current, onJump }: Props) {
  const pct = Math.round((current / (steps.length - 1 || 1)) * 100);

  return (
    <div className="mb-6">
      {/* Desktop: node rail */}
      <div className="hidden items-center md:flex">
        {steps.map((s, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          return (
            <div key={s.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={i > current}
                onClick={() => i <= current && onJump(i)}
                className={cn(
                  "group flex items-center gap-2",
                  i > current ? "cursor-default" : "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-colors",
                    state === "done" &&
                      "border-[var(--green-600)] bg-[var(--green-600)] text-white",
                    state === "active" &&
                      "border-[var(--green-600)] bg-[color-mix(in_srgb,var(--green-600)_12%,transparent)] text-[var(--green-700)]",
                    state === "todo" && "border-border bg-background text-muted-foreground",
                  )}
                >
                  {state === "done" ? <Check className="size-4" aria-hidden /> : s.badge}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-sm",
                    state === "todo" ? "text-muted-foreground" : "font-medium text-foreground",
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "mx-3 h-px flex-1 transition-colors",
                    i < current ? "bg-[var(--green-600)]" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: compact progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {steps[current]?.label}
          </span>
          <span className="text-muted-foreground">
            Step {current + 1} of {steps.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-[var(--green-600)] transition-all duration-300"
            style={{ width: `${Math.max(pct, 8)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
