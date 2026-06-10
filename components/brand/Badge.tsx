import { Star } from "lucide-react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BrandedBadgeProps = React.ComponentProps<typeof ShadcnBadge> & {
  tone?: "neutral" | "featured" | "verified";
  icon?: "star";
};

export function BrandedBadge({
  tone = "neutral",
  icon,
  children,
  className,
  ...props
}: BrandedBadgeProps) {
  const toneClass =
    tone === "featured"
      ? "border-transparent bg-[color-mix(in_srgb,var(--orange-strong)_16%,white)] text-[var(--orange-deep)]"
      : tone === "verified"
        ? "border-transparent bg-[color-mix(in_srgb,var(--orange)_12%,white)] text-[var(--orange-deep)]"
        : "";

  return (
    <ShadcnBadge
      variant={tone === "neutral" ? "secondary" : "outline"}
      className={cn("gap-1 font-semibold", toneClass, className)}
      {...props}
    >
      {icon === "star" && <Star size={12} aria-hidden />}
      {children}
    </ShadcnBadge>
  );
}
