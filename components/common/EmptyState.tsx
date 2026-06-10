import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
};

/**
 * Neutral empty state for lists/grids that resolved successfully but have
 * no results (e.g. filtered opportunities, no notifications).
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-base)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-sunken)]/40 text-center",
        compact ? "gap-2.5 p-6" : "gap-3.5 p-12",
        className,
      )}
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--accent-tint-10)] text-[var(--accent)]">
        <Icon className="size-6" aria-hidden />
      </span>
      <div className="space-y-1.5">
        <h3 className="h3">{title}</h3>
        {description && (
          <p className="lead mx-auto max-w-md text-[var(--text-sm)]">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
