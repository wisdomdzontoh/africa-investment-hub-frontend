import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  approved:
    "border-[var(--green-600)]/40 bg-[color-mix(in_srgb,var(--green-600)_12%,transparent)] text-[var(--green-700)]",
  pending:
    "border-[var(--warning)]/40 bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] text-[var(--orange-deep)]",
  rejected: "border-destructive/40 bg-destructive/5 text-destructive",
  suspended: "border-destructive/40 bg-destructive/5 text-destructive",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        STYLES[status] ?? "border-border bg-muted text-muted-foreground",
      )}
    >
      {label ?? status}
    </span>
  );
}
