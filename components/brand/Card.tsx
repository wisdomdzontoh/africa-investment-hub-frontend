import { Card as ShadcnCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BrandedCardProps = React.ComponentProps<typeof ShadcnCard> & {
  hover?: boolean;
  pad?: boolean;
};

export function BrandedCard({
  hover,
  pad,
  className,
  children,
  ...props
}: BrandedCardProps) {
  return (
    <ShadcnCard
      className={cn(
        "gap-0 rounded-[var(--radius-base)] border border-border bg-card py-0 shadow-none ring-0",
        hover &&
          "cursor-pointer transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:shadow-[var(--shadow-md)]",
        pad && "p-4",
        className,
      )}
      {...props}
    >
      {children}
    </ShadcnCard>
  );
}
