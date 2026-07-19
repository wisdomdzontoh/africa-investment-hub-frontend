"use client";

import { CircleAlert } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatMoneyInput, parseNumeric } from "@/lib/onboarding/format";

/** Comfortable form-control height shared across the wizard. */
export const controlH = "h-10";

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
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
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

export function useFieldError(name: string): string | undefined {
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
      <Input
        id={name}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(controlH, mono && "font-mono")}
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
  suffix,
}: TextFieldProps & { min?: number; max?: number; suffix?: string }) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const registration = register(name, {
    setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
  });
  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      {suffix ? (
        <InputGroup className={controlH}>
          <InputGroupInput
            id={name}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            placeholder={placeholder}
            aria-invalid={!!error}
            className="font-mono"
            {...registration}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>{suffix}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <Input
          id={name}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={cn(controlH, "font-mono")}
          {...registration}
        />
      )}
    </FieldShell>
  );
}

/* ------------------------------ money input ----------------------------- */
/** Stores a plain number in form state; displays grouped USD while typing. */
export function MoneyField({ name, label, required, placeholder, hint }: TextFieldProps) {
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
            <InputGroup className={controlH}>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={name}
                inputMode="numeric"
                value={display}
                placeholder={placeholder}
                aria-invalid={!!error}
                className="font-mono"
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(parseNumeric(e.target.value))}
              />
            </InputGroup>
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
  showCount,
}: TextFieldProps & { rows?: number; showCount?: boolean }) {
  const { register, watch } = useFormContext();
  const error = useFieldError(name);
  const value: string = showCount ? (watch(name) ?? "") : "";
  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <Textarea
        id={name}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={!!error}
        className="min-h-24 resize-y"
        {...register(name)}
      />
      {showCount && maxLength ? (
        <p className="text-right font-mono text-[11px] text-muted-foreground">
          {value.length}/{maxLength}
        </p>
      ) : null}
    </FieldShell>
  );
}

/* ---------------------------- shadcn select ----------------------------- */

type Option = { value: string; label: string };

export function SelectField({
  name,
  label,
  required,
  hint,
  placeholder,
  options,
}: TextFieldProps & { options: Option[] }) {
  const { control } = useFormContext();
  const error = useFieldError(name);
  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? ""}
            onValueChange={(v) => field.onChange(v)}
          >
            <SelectTrigger
              id={name}
              aria-invalid={!!error}
              className={cn("w-full", controlH)}
              onBlur={field.onBlur}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldShell>
  );
}
