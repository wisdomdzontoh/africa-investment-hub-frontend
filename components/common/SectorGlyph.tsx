import {
  HardHat,
  Wheat,
  Sun,
  Sprout,
  Route,
  Building2,
  Factory,
  Cpu,
  Palmtree,
  Pickaxe,
  type LucideIcon,
} from "lucide-react";
import { getSector } from "@/lib/data/sectors";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  "hard-hat": HardHat,
  wheat: Wheat,
  sun: Sun,
  sprout: Sprout,
  route: Route,
  "building-2": Building2,
  factory: Factory,
  cpu: Cpu,
  palmtree: Palmtree,
  pickaxe: Pickaxe,
};

export function SectorGlyph({
  id,
  size = 40,
  className,
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const sector = getSector(id);
  const Icon = ICON_MAP[sector.icon] ?? Cpu;

  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-[10px]", className)}
      style={{
        width: size,
        height: size,
        background: `color-mix(in srgb, ${sector.color} 14%, white)`,
        color: sector.color,
      }}
    >
      <Icon size={size * 0.5} aria-hidden />
    </span>
  );
}

export function SectorBadge({
  id,
  size = 12,
  className,
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const sector = getSector(id);
  const Icon = ICON_MAP[sector.icon] ?? Cpu;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[var(--text-xs)] font-semibold",
        className,
      )}
    >
      <Icon size={size} style={{ color: sector.color }} aria-hidden />
      {sector.name}
    </span>
  );
}
