import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-block rounded-[var(--radius-badge)] px-2 py-[3px] text-[10px] font-semibold uppercase leading-normal tracking-[0.06em]",
  {
    variants: {
      tone: {
        accent: "bg-[var(--risk-low-bg)] text-[var(--risk-low-fg)]",
        neutral: "bg-[var(--risk-medium-bg)] text-[var(--risk-medium-fg)]",
        ink: "bg-[var(--ink)] text-white",
        solid: "bg-[var(--accent)] text-white",
      },
      risk: {
        low: "bg-[var(--risk-low-bg)] text-[var(--risk-low-fg)]",
        medium: "bg-[var(--risk-medium-bg)] text-[var(--risk-medium-fg)]",
        high: "bg-[var(--risk-high-bg)] text-[var(--risk-high-fg)]",
      },
    },
    defaultVariants: {
      tone: "accent",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    risk?: "low" | "medium" | "high";
  };

export function Badge({ tone, risk, className, children, ...props }: BadgeProps) {
  const label =
    children ?? (risk ? `${risk} risk` : undefined);

  return (
    <span
      className={cn(
        badgeVariants(risk ? { risk } : { tone }),
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}

export { badgeVariants };
