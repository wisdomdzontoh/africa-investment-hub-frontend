import { ArrowRight, Loader2, type LucideIcon } from "lucide-react";
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BrandedButtonProps = React.ComponentProps<typeof ShadcnButton> & {
  icon?: LucideIcon;
  iconRight?: LucideIcon | "arrow-right";
  loading?: boolean;
  asChild?: boolean;
};

export function BrandedButton({
  icon: Icon,
  iconRight,
  loading,
  children,
  className,
  size = "default",
  asChild,
  ...props
}: BrandedButtonProps) {
  const RightIcon = iconRight === "arrow-right" ? ArrowRight : iconRight;

  // Slot (asChild) accepts exactly one child — icons must live inside that child.
  if (asChild) {
    return (
      <ShadcnButton
        asChild
        size={size}
        className={cn("rounded-[var(--radius-base)] font-semibold", className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {children}
      </ShadcnButton>
    );
  }

  return (
    <ShadcnButton
      size={size}
      className={cn("rounded-[var(--radius-base)] font-semibold", className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="spin size-4" aria-hidden />}
      {!loading && Icon && <Icon className="size-4" aria-hidden />}
      {children}
      {!loading && RightIcon && <RightIcon className="size-4" aria-hidden />}
    </ShadcnButton>
  );
}

export { buttonVariants };
