"use client";

import { cn } from "@/lib/utils";

type InputProps = Omit<React.ComponentProps<"input">, "onChange"> & {
  label?: string;
  hint?: string;
  onChange?: (value: string) => void;
};

export function Input({
  label,
  hint,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <label className={cn("block", className)} htmlFor={inputId}>
      {label ? (
        <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {label}
          {required ? (
            <span className="text-[var(--accent)]"> *</span>
          ) : null}
        </span>
      ) : null}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={cn(
          "w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3.5 py-3 font-sans text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]",
        )}
        {...props}
      />
      {hint ? (
        <span className="mt-1.5 block text-xs leading-normal text-[var(--text-muted)]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
