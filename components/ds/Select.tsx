"use client";

import { cn } from "@/lib/utils";

type SelectProps = Omit<React.ComponentProps<"select">, "onChange"> & {
  label?: string;
  options?: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
};

export function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  required,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <label className={cn("block", className)} htmlFor={selectId}>
      {label ? (
        <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {label}
          {required ? (
            <span className="text-[var(--accent)]"> *</span>
          ) : null}
        </span>
      ) : null}
      <div className="relative">
        <select
          id={selectId}
          value={value ?? ""}
          required={required}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className={cn(
            "w-full cursor-pointer appearance-none rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] py-3 pr-9 pl-3.5 font-sans text-sm outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]",
            value ? "text-[var(--ink)]" : "text-[var(--text-muted)]",
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[10px] text-[var(--accent)]"
          aria-hidden
        >
          ▾
        </span>
      </div>
    </label>
  );
}
