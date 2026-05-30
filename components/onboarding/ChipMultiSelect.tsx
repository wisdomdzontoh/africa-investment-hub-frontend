"use client";

import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FieldShell } from "@/components/onboarding/fields";

type Option = { value: string; label: string };

type Props = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  options: Option[];
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Show only the first N until "show all" is toggled (for long lists). */
  collapseAfter?: number;
};

export function ChipMultiSelect({
  name,
  label,
  required,
  hint,
  options,
  searchable,
  searchPlaceholder,
  collapseAfter,
}: Props) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control, defaultValue: [] });
  const selected: string[] = Array.isArray(field.value) ? field.value : [];
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
    if (collapseAfter && !expanded && !q) return base.slice(0, collapseAfter);
    return base;
  }, [options, query, collapseAfter, expanded]);

  const toggle = (value: string) => {
    field.onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
    );
  };

  return (
    <FieldShell label={label} required={required} hint={hint} error={fieldState.error?.message as string}>
      {searchable && (
        <div className="relative mb-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder ?? "Search…"}
            className="w-full rounded-[var(--radius-base)] border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {filtered.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => toggle(o.value)}
              aria-pressed={on}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                on
                  ? "border-[var(--green-600)] bg-[color-mix(in_srgb,var(--green-600)_12%,transparent)] font-medium text-[var(--green-700)]"
                  : "border-border bg-background text-foreground hover:border-[var(--green-600)]/50",
              )}
            >
              {on && <Check className="size-3.5" aria-hidden />}
              {o.label}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No matches.</p>
        )}
      </div>
      {collapseAfter && !query && options.length > collapseAfter && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 w-fit text-xs font-medium text-[var(--green-700)] hover:underline"
        >
          {expanded ? "Show fewer" : `Show all ${options.length}`}
        </button>
      )}
      {selected.length > 0 && (
        <p className="mt-0.5 text-xs text-muted-foreground">{selected.length} selected</p>
      )}
    </FieldShell>
  );
}
