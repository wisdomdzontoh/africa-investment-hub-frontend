import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] font-mono font-semibold leading-tight transition-[background,transform,border-color] duration-200 ease-[ease] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-none bg-[var(--accent)] text-white hover:-translate-y-px hover:bg-[var(--accent-bright)]",
        outline:
          "border-[1.5px] border-[var(--ink)] bg-transparent text-[var(--ink)] hover:bg-[var(--ink-hover-tint)]",
        dark: "border-none bg-[var(--ink)] text-white hover:bg-[var(--accent)]",
        accentOutline:
          "border-[1.5px] border-[var(--accent)] bg-transparent text-[var(--accent)] hover:border-[var(--accent-bright)] hover:bg-[var(--accent-tint-06)] hover:text-[var(--accent-bright)]",
        onDark:
          "border-[1.5px] border-[var(--on-dark-border)] bg-transparent text-[var(--on-dark)] hover:border-[color-mix(in_srgb,var(--on-dark)_70%,transparent)] hover:bg-[color-mix(in_srgb,var(--on-dark)_8%,transparent)]",
      },
      size: {
        sm: "px-[18px] py-[10px] text-[13px]",
        md: "px-[22px] py-3 text-[13px]",
        lg: "px-[26px] py-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    href?: string;
  };

export function Button({
  variant,
  size,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export { buttonVariants };
