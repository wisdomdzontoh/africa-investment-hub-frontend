import { Gauge, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

const CONFIG: Record<
  RiskLevel,
  { icon: typeof ShieldCheck; className: string; key: "low" | "medium" | "high" }
> = {
  low: { icon: ShieldCheck, className: "risk-low", key: "low" },
  medium: { icon: Gauge, className: "risk-medium", key: "medium" },
  high: { icon: TriangleAlert, className: "risk-high", key: "high" },
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  const t = useTranslations("common.risk");
  const config = CONFIG[level] ?? CONFIG.medium;
  const Icon = config.icon;
  const label = t(config.key);

  return (
    <span
      className={cn(
        "badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[var(--text-xs)] font-semibold",
        config.className,
        className,
      )}
      aria-label={label}
    >
      <Icon size={12} aria-hidden />
      {label}
    </span>
  );
}
