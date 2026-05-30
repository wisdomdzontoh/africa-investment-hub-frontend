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
          "cursor-pointer transition-[border-color,box-shadow] duration-200 hover:border-[var(--green-600)] hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--green-600)_12%,transparent)]",
        pad && "p-4",
        className,
      )}
      {...props}
    >
      {children}
    </ShadcnCard>
  );
}
