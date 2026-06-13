"use client";

import type { LucideIcon } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FieldShell } from "@/components/onboarding/fields";

type Option = { value: string; label: string; icon?: LucideIcon };

type Props = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  options: Option[];
};

/** Segmented single-select control (e.g. risk appetite). */
export function RadioSegment({ name, label, required, hint, options }: Props) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <FieldShell label={label} required={required} hint={hint} error={fieldState.error?.message as string}>
      <div
        role="radiogroup"
        className="grid grid-cols-2 gap-2 sm:auto-cols-fr sm:grid-flow-col"
      >
        {options.map((o) => {
          const on = field.value === o.value;
          const Icon = o.icon;
          return (
            <button
              type="button"
              role="radio"
              aria-checked={on}
              key={o.value}
              onClick={() => field.onChange(o.value)}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-[var(--radius-base)] border px-4 py-2.5 text-sm font-medium transition-colors",
                on
                  ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]"
                  : "border-border bg-background text-foreground hover:border-[var(--accent)]/50",
              )}
            >
              {Icon && <Icon className="size-4" aria-hidden />}
              {o.label}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

type OwnershipProps = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  options: { value: string; label: string }[];
};

/** Multi-select grid of ownership structures (radio-styled, multiple). */
export function CheckGrid({ name, label, required, hint, options }: OwnershipProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control, defaultValue: [] });
  const selected: string[] = Array.isArray(field.value) ? field.value : [];
  const toggle = (v: string) =>
    field.onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);

  return (
    <FieldShell label={label} required={required} hint={hint} error={fieldState.error?.message as string}>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              type="button"
              role="checkbox"
              aria-checked={on}
              key={o.value}
              onClick={() => toggle(o.value)}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-base)] border px-3 py-2.5 text-left text-sm transition-colors",
                on
                  ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
                  : "border-border bg-background hover:border-[var(--accent)]/50",
              )}
            >
              <span
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-full border",
                  on ? "border-[var(--accent)]" : "border-border",
                )}
              >
                {on && <span className="size-2 rounded-full bg-[var(--accent)]" />}
              </span>
              <span className="text-foreground">{o.label}</span>
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}
