import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ds";
import { cn } from "@/lib/utils";

type Tone = "brand" | "success" | "warning" | "info" | "danger" | "neutral";

const CHIP: Record<Tone, string> = {
  brand: "bg-[var(--p-primary-bg)] text-[var(--p-primary)]",
  success: "bg-[var(--p-success-bg)] text-[var(--p-success)]",
  warning: "bg-[var(--p-warning-bg)] text-[var(--p-warning)]",
  info: "bg-[var(--p-info-bg)] text-[var(--p-info)]",
  danger: "bg-[var(--p-danger-bg)] text-[var(--p-danger)]",
  neutral: "bg-[var(--bg-section)] text-[var(--text-muted)]",
};

const GRAD: Record<Tone, string> = {
  brand: "var(--p-grad-primary)",
  success: "var(--p-grad-success)",
  warning: "var(--p-grad-warning)",
  info: "var(--p-grad-info)",
  danger: "var(--p-grad-primary)",
  neutral: "none",
};

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  caption?: string;
  tone?: Tone;
  /** Wash the card with a subtle tone gradient (portal flourish). */
  gradient?: boolean;
  /** Optional trend delta: positive = success, negative = danger. */
  trend?: { value: string; dir: "up" | "down" };
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  caption,
  tone = "brand",
  gradient,
  trend,
  className,
}: StatCardProps) {
  const TrendIcon = trend?.dir === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card
      hoverLift={false}
      padding="20px"
      className={cn("flex flex-col gap-3", className)}
      style={gradient ? { backgroundImage: GRAD[tone] } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {label}
        </span>
        {Icon ? (
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-icon)]", CHIP[tone])}>
            <Icon size={18} aria-hidden />
          </span>
        ) : null}
      </div>
      <div className="flex items-end gap-2">
        <div className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-bold leading-none tracking-[-0.02em] text-[var(--ink)]">
          {value}
        </div>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 pb-1 font-mono text-xs font-semibold",
              trend.dir === "down" ? "text-[var(--p-danger-fg)]" : "text-[var(--p-success-fg)]",
            )}
          >
            <TrendIcon size={13} aria-hidden />
            {trend.value}
          </span>
        ) : null}
      </div>
      {caption ? <p className="text-xs leading-relaxed text-[var(--text-muted)]">{caption}</p> : null}
    </Card>
  );
}
