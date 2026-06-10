import { cn } from "@/lib/utils";

type ChipProps = React.ComponentProps<"span"> & {
  active?: boolean;
  onClick?: () => void;
};

export function Chip({ active, onClick, className, children, ...props }: ChipProps) {
  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "inline-block select-none rounded-[var(--radius-pill)] border px-2.5 py-1 text-[11px] leading-normal transition-colors duration-150 ease-[ease]",
        active
          ? "cursor-pointer border-[var(--accent)] bg-[var(--accent)] font-semibold text-white"
          : onClick
            ? "cursor-pointer border-[var(--ink-border)] bg-transparent font-medium text-[var(--text-body)] hover:bg-[var(--ink-hover-tint)]"
            : "border-[var(--ink-border)] bg-transparent font-medium text-[var(--text-body)]",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
