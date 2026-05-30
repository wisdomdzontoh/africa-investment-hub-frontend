import type { Sector } from "@/types";

// Warm-only palette (orange / terracotta), differentiated by depth.
// No greens, blues, or olives — keeps the design system consistent.
export const SECTORS: Sector[] = [
  { id: "construction", name: "Construction", icon: "hard-hat", color: "#7C2D12" },
  { id: "agriculture", name: "Agriculture", icon: "wheat", color: "#B45309" },
  { id: "renewable", name: "Renewable Energy", icon: "sun", color: "#EA580C" },
  { id: "farming", name: "Farming", icon: "sprout", color: "#C2410C" },
  { id: "infrastructure", name: "Infrastructure", icon: "route", color: "#92400E" },
  { id: "realestate", name: "Real Estate", icon: "building-2", color: "#DB5413" },
  { id: "manufacturing", name: "Manufacturing", icon: "factory", color: "#9A3412" },
  { id: "technology", name: "Technology", icon: "cpu", color: "#F97316" },
  { id: "tourism", name: "Tourism", icon: "palmtree", color: "#FB8C3C" },
  { id: "mining", name: "Mining", icon: "pickaxe", color: "#5A2310" },
];

export function getSector(id: string): Sector {
  return SECTORS.find((s) => s.id === id) ?? SECTORS[0];
}

export async function getSectors(): Promise<Sector[]> {
  return SECTORS;
}
