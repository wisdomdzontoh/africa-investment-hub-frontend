"use client";

import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  note: string;
  continueLabel: string;
  onContinue: () => void;
};

export function SubmittedStep({ title, description, note, continueLabel, onContinue }: Props) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]">
        <CheckCircle2 className="size-9" aria-hidden />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold text-[var(--text-strong)]">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>

      <div className="mt-6 w-full max-w-md rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Clock className="size-4 text-[var(--warning)]" aria-hidden />
          {note}
        </div>
      </div>

      <Button type="button" size="lg" className="mt-6 gap-2" onClick={onContinue}>
        {continueLabel}
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
