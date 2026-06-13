import { AlertCircle } from "lucide-react";
import { cloneElement, useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared control classes for native inputs/textareas/selects so every form
 * across the app (contact, onboarding) shares one focus/invalid/disabled look.
 * Apply `aria-invalid` on the control to trigger the error styling.
 */
export const fieldControl = cn(
  "w-full rounded-[var(--radius-base)] border border-[var(--input)] bg-[var(--card)] px-3.5 py-2.5",
  "text-[var(--text-sm)] text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/70",
  "shadow-[var(--shadow-xs)] transition-[border-color,box-shadow] outline-none",
  "hover:border-[var(--border-strong)]",
  "focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_28%,transparent)]",
  "aria-[invalid=true]:border-[var(--destructive)] aria-[invalid=true]:ring-[color-mix(in_srgb,var(--destructive)_22%,transparent)]",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

type FieldProps = {
  label: string;
  children: React.ReactElement<{ id?: string; "aria-describedby"?: string }>;
  error?: string;
  hint?: string;
  required?: boolean;
  /** Optional explicit id; otherwise generated and wired to the control. */
  htmlFor?: string;
  className?: string;
};

export function Field({
  label,
  children,
  error,
  hint,
  required,
  htmlFor,
  className,
}: FieldProps) {
  const generatedId = useId();
  const id = htmlFor ?? children.props.id ?? generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  const control = cloneElement(children, {
    id,
    "aria-describedby": describedBy,
    ...(error ? { "aria-invalid": true } : {}),
  });

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-center gap-1 text-[var(--text-sm)] font-semibold text-[var(--text-strong)]">
        {label}
        {required && (
          <span className="text-[var(--destructive)]" aria-hidden>
            *
          </span>
        )}
      </label>
      {hint && !error && (
        <p id={hintId} className="text-[var(--text-xs)] text-[var(--text-muted)]">
          {hint}
        </p>
      )}
      {control}
      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1.5 text-[var(--text-xs)] font-medium text-[var(--destructive)]"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
