"use client";

import { CircleAlert, Pencil, Send } from "lucide-react";
import type { FieldValues } from "react-hook-form";
import { BrandedButton } from "@/components/brand/Button";
import { BrandedCard } from "@/components/brand/Card";
import type { WizardStep } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
  steps: WizardStep<T>[];
  values: T;
  title: string;
  subtitle: string;
  consentLabel: string;
  submitLabel: string;
  submittingLabel: string;
  editLabel: string;
  consent: boolean;
  onConsentChange: (v: boolean) => void;
  submitting: boolean;
  error?: string | null;
  onEdit: (index: number) => void;
  onSubmit: () => void;
};

export function ReviewStep<T extends FieldValues>({
  steps,
  values,
  title,
  subtitle,
  consentLabel,
  submitLabel,
  submittingLabel,
  editLabel,
  consent,
  onConsentChange,
  submitting,
  error,
  onEdit,
  onSubmit,
}: Props<T>) {
  const cards = steps
    .map((s, i) => ({ step: s, index: i, rows: s.summary?.(values) ?? [] }))
    .filter((c) => c.rows.length > 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-[var(--text-strong)]">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {cards.map(({ step, index, rows }) => (
          <BrandedCard key={step.id} pad>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">{step.label}</h2>
              <button
                type="button"
                onClick={() => onEdit(index)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
              >
                <Pencil className="size-3" aria-hidden /> {editLabel}
              </button>
            </div>
            <dl className="flex flex-col gap-1.5">
              {rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-3 text-sm">
                  <dt className="text-muted-foreground">{r.label}</dt>
                  <dd
                    className={cn(
                      "text-right font-medium",
                      r.missing ? "text-destructive" : "text-foreground",
                    )}
                  >
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </BrandedCard>
        ))}
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-[var(--radius-base)] border border-border bg-[var(--surface-sunken)]/40 p-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsentChange(e.target.checked)}
          className="mt-0.5 size-4 accent-[var(--accent)]"
        />
        <span className="text-sm text-foreground">{consentLabel}</span>
      </label>

      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-destructive">
          <CircleAlert className="size-4" aria-hidden /> {error}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <BrandedButton
          type="button"
          icon={Send}
          loading={submitting}
          disabled={!consent || submitting}
          onClick={onSubmit}
        >
          {submitting ? submittingLabel : submitLabel}
        </BrandedButton>
      </div>
    </div>
  );
}
