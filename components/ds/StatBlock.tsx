import { cn } from "@/lib/utils";

type StatBlockProps = React.ComponentProps<"div"> & {
  value: React.ReactNode;
  label?: React.ReactNode;
  caption?: React.ReactNode;
  onDark?: boolean;
};

export function StatBlock({
  value,
  label,
  caption,
  onDark = true,
  className,
  ...props
}: StatBlockProps) {
  return (
    <div className={cn("text-center", className)} {...props}>
      <div
        className={cn(
          "text-[length:var(--text-stat-size)] leading-[1.1] font-bold tracking-[-0.02em]",
          onDark ? "text-[var(--on-dark)]" : "text-[var(--ink)]",
        )}
      >
        {value}
      </div>
      {label ? (
        <div
          className={cn(
            "my-2.5 text-sm font-semibold",
            onDark ? "text-[var(--accent-bright)]" : "text-[var(--accent)]",
          )}
        >
          {label}
        </div>
      ) : null}
      {caption ? (
        <div
          className={cn(
            "text-[13px] leading-normal",
            onDark ? "text-[var(--on-dark-50)]" : "text-[var(--text-muted)]",
          )}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
}
