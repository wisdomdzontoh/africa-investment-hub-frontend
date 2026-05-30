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
      ? "border-transparent bg-[color-mix(in_srgb,var(--gold-500)_18%,white)] text-[color-mix(in_srgb,var(--gold-500)_80%,black)]"
      : tone === "verified"
        ? "border-transparent bg-[color-mix(in_srgb,var(--success)_14%,white)] text-[var(--success)]"
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
