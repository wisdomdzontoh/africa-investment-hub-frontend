import { cn } from "@/lib/utils";

// Portal semantic mapping (extended palette). Inside the app, green = approved
// reads clearer than the marketing "red = trust". Tokens come from the .portal
// theme layer (styles/portal-theme.css).
const TONES: Record<string, string> = {
  approved: "bg-[var(--p-success-bg)] text-[var(--p-success-fg)]",
  live: "bg-[var(--p-success-bg)] text-[var(--p-success-fg)]",
  in_review: "bg-[var(--p-info-bg)] text-[var(--p-info-fg)]",
  pending: "bg-[var(--p-warning-bg)] text-[var(--p-warning-fg)]",
  draft: "bg-[var(--p-warning-bg)] text-[var(--p-warning-fg)]",
  rejected: "bg-[var(--p-danger-bg)] text-[var(--p-danger-fg)]",
  suspended: "bg-[var(--p-danger-bg)] text-[var(--p-danger-fg)]",
};

export function StatusPill({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] capitalize",
        TONES[status] ?? "bg-[var(--bg-section)] text-[var(--text-muted)]",
        className,
      )}
    >
      {(label ?? status).replace(/_/g, " ")}
    </span>
  );
}
