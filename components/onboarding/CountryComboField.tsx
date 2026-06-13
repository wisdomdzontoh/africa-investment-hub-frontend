"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FieldShell } from "@/components/onboarding/fields";

type Option = { value: string; label: string };

type Props = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options: Option[];
};

/** Accessible-ish searchable single select (combobox) for long country lists. */
export function CountryComboField({
  name,
  label,
  required,
  hint,
  placeholder,
  options,
}: Props) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === field.value)?.label ?? "",
    [options, field.value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const error = fieldState.error?.message as string | undefined;

  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <div className="relative">
        <input
          id={name}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${name}-listbox`}
          aria-autocomplete="list"
          aria-invalid={!!error}
          autoComplete="off"
          value={open ? query : selectedLabel}
          placeholder={placeholder ?? "Search country…"}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
            field.onBlur();
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          className={cn(
            "w-full rounded-[var(--radius-base)] border bg-background px-3 py-2.5 pr-9 text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1 focus:ring-offset-background",
            error ? "border-destructive" : "border-border",
          )}
        />
        <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        {open && (
          <ul
            id={`${name}-listbox`}
            role="listbox"
            className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-[var(--radius-base)] border border-border bg-popover p-1 shadow-lg"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">No country found.</li>
            )}
            {filtered.map((o) => {
              const on = o.value === field.value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={on}
                    onMouseDown={(e) => {
                      // mousedown fires before blur — prevents the list closing first
                      e.preventDefault();
                      field.onChange(o.value);
                      if (blurTimer.current) clearTimeout(blurTimer.current);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent",
                      on && "font-medium",
                    )}
                  >
                    {o.label}
                    {on && <Check className="size-4 text-[var(--accent)]" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </FieldShell>
  );
}
