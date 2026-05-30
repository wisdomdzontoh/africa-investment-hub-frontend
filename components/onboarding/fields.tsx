"use client";

import { CircleAlert } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { formatMoneyInput, parseNumeric } from "@/lib/onboarding/format";

/* ----------------------------- field shell ------------------------------ */

type ShellProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function FieldShell({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: ShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-destructive">
          <CircleAlert className="size-3 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-[var(--radius-base)] border bg-background px-3 py-2.5 text-sm text-foreground " +
  "transition-colors placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 " +
  "focus:ring-[var(--ring)] focus:ring-offset-1 focus:ring-offset-background disabled:opacity-60";

function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext();
  // Supports dotted/array paths shallowly (e.g. previous_projects).
  const segs = name.split(".");
  let node: unknown = errors;
  for (const s of segs) {
    if (node && typeof node === "object" && s in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[s];
    } else {
      node = undefined;
      break;
    }
  }
  const msg = (node as { message?: unknown } | undefined)?.message;
  return typeof msg === "string" ? msg : undefined;
}

/* ------------------------------ text input ------------------------------ */

type TextFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  type?: "text" | "email" | "tel" | "url";
  maxLength?: number;
  mono?: boolean;
};

export function TextField({
  name,
  label,
  required,
  placeholder,
  hint,
  type = "text",
  maxLength,
  mono,
}: TextFieldProps) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <input
        id={name}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(inputBase, mono && "font-mono", error ? "border-destructive" : "border-border")}
        {...register(name)}
      />
    </FieldShell>
  );
}

/* ----------------------------- number input ----------------------------- */

export function NumberField({
  name,
  label,
  required,
  placeholder,
  hint,
  min,
  max,
}: TextFieldProps & { min?: number; max?: number }) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <input
        id={name}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(inputBase, "font-mono", error ? "border-destructive" : "border-border")}
        {...register(name, {
          setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
        })}
      />
    </FieldShell>
  );
}

/* ------------------------------ money input ----------------------------- */
/** Stores a plain number in form state; displays grouped USD while typing. */
export function MoneyField({
  name,
  label,
  required,
  placeholder,
  hint,
}: TextFieldProps) {
  const { control } = useFormContext();
  const error = useFieldError(name);
  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const display =
            field.value === undefined || field.value === null
              ? ""
              : formatMoneyInput(String(field.value));
          return (
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <input
                id={name}
                inputMode="numeric"
                value={display}
                placeholder={placeholder}
                aria-invalid={!!error}
                className={cn(
                  inputBase,
                  "pl-7 font-mono",
                  error ? "border-destructive" : "border-border",
                )}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(parseNumeric(e.target.value))}
              />
            </div>
          );
        }}
      />
    </FieldShell>
  );
}

/* ----------------------------- textarea --------------------------------- */

export function TextareaField({
  name,
  label,
  required,
  placeholder,
  hint,
  rows = 4,
  maxLength,
}: TextFieldProps & { rows?: number }) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <textarea
        id={name}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(
          inputBase,
          "min-h-24 resize-y",
          error ? "border-destructive" : "border-border",
        )}
        {...register(name)}
      />
    </FieldShell>
  );
}

/* ------------------------------ native select --------------------------- */

type Option = { value: string; label: string };

export function SelectField({
  name,
  label,
  required,
  hint,
  placeholder,
  options,
}: TextFieldProps & { options: Option[] }) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <select
        id={name}
        aria-invalid={!!error}
        className={cn(inputBase, error ? "border-destructive" : "border-border")}
        {...register(name)}
      >
        <option value="" disabled>
          {placeholder ?? "Select"}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
