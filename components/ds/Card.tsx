import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "box-border rounded-[var(--radius-card)] transition-[transform,box-shadow] duration-150 ease-[ease]",
  {
    variants: {
      variant: {
        light:
          "border border-[var(--accent-border)] bg-[var(--surface-card)]",
        tinted:
          "border border-[var(--accent-border)] bg-[var(--bg-section)]",
        dark: "border-none bg-[var(--surface-dark)]",
      },
      hoverLift: {
        true: "hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "dark",
        hoverLift: true,
        className: "hover:shadow-[var(--shadow-dark-hover)]",
      },
    ],
    defaultVariants: {
      variant: "light",
      hoverLift: true,
    },
  },
);

type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    padding?: string;
  };

export function Card({
  variant,
  hoverLift,
  padding = "32px",
  className,
  style,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, hoverLift }), className)}
      style={{ padding, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export { cardVariants };
