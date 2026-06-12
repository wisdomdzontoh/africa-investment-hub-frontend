import { AlertTriangle, Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChecklistState = "done" | "review" | "pending" | "blocked";
export type ChecklistStep = { label: string; state: ChecklistState; stateLabel: string };

const ICONS = { done: Check, review: Clock, pending: Circle, blocked: AlertTriangle } as const;

const STYLES: Record<ChecklistState, { well: string; pill: string }> = {
  done: {
    well: "bg-[var(--p-success)] text-white",
    pill: "bg-[var(--p-success-bg)] text-[var(--p-success-fg)]",
  },
  review: {
    well: "bg-[var(--p-info-bg)] text-[var(--p-info)]",
    pill: "bg-[var(--p-info-bg)] text-[var(--p-info-fg)]",
  },
  pending: {
    well: "bg-[var(--bg-section)] text-[var(--text-muted)]",
    pill: "bg-[var(--bg-section)] text-[var(--text-muted)]",
  },
  blocked: {
    well: "bg-[var(--p-danger)] text-white",
    pill: "bg-[var(--p-danger-bg)] text-[var(--p-danger-fg)]",
  },
};

/** Visible progress tracker (PRD §6.5 engagement checklist). State is derived
 *  by the caller from account/profile data — this is purely presentational. */
export function Checklist({ steps }: { steps: ChecklistStep[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const Icon = ICONS[step.state];
        const s = STYLES[step.state];
        const last = i === steps.length - 1;
        return (
          <li key={step.label} className="relative flex items-center gap-3 py-3">
            {!last ? (
              <span
                aria-hidden
                className="absolute left-[15px] top-[34px] h-[calc(100%-18px)] w-px bg-[var(--accent-border)]"
              />
            ) : null}
            <span
              className={cn(
                "z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                s.well,
              )}
            >
              <Icon size={16} strokeWidth={step.state === "done" ? 3 : 2} aria-hidden />
            </span>
            <span className="flex-1 text-sm font-medium text-[var(--ink)]">{step.label}</span>
            <span
              className={cn(
                "rounded-[var(--radius-pill)] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.04em]",
                s.pill,
              )}
            >
              {step.stateLabel}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
