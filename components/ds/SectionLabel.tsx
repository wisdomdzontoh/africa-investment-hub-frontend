import { cn } from "@/lib/utils";

type SectionLabelProps = React.ComponentProps<"span"> & {
  dot?: boolean;
  onDark?: boolean;
};

export function SectionLabel({
  dot,
  onDark,
  className,
  children,
  ...props
}: SectionLabelProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      {dot ? (
        <span
          className={cn(
            "size-[7px] shrink-0 rounded-full",
            onDark ? "bg-[var(--accent-bright)]" : "bg-[var(--accent)]",
          )}
          aria-hidden
        />
      ) : null}
      <span
        className={cn(
          "font-mono text-xs font-medium uppercase tracking-[0.08em]",
          onDark ? "text-[var(--accent-bright)]" : "text-[var(--accent)]",
        )}
      >
        {children}
      </span>
    </span>
  );
}
