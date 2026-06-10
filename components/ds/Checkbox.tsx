"use client";

import { cn } from "@/lib/utils";

type CheckboxProps = {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
};

export function Checkbox({
  label,
  checked = false,
  onChange,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-2.5",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        onChange?.(!checked);
      }}
    >
      <span
        className={cn(
          "inline-flex size-[18px] shrink-0 items-center justify-center rounded-[var(--radius-badge)] border-[1.5px] text-xs font-bold leading-none transition-[background,border-color] duration-150 ease-[ease]",
          checked
            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
            : "border-[var(--ink-border)] bg-[var(--surface-card)] text-transparent",
        )}
        aria-hidden
      >
        {checked ? "✓" : ""}
      </span>
      {label ? (
        <span className="font-sans text-sm leading-snug text-[var(--ink)]">
          {label}
        </span>
      ) : null}
    </label>
  );
}
