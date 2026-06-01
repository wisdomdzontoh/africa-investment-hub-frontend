import type { Sector } from "@/types";

// Red-only palette (vermilion → crimson → oxblood), differentiated by depth.
// No greens, blues, or olives — keeps the design system consistent.
export const SECTORS: Sector[] = [
  { id: "construction", name: "Construction", icon: "hard-hat", color: "#7E211B" },
  { id: "agriculture", name: "Agriculture", icon: "wheat", color: "#A02A20" },
  { id: "renewable", name: "Renewable Energy", icon: "sun", color: "#D24A39" },
  { id: "farming", name: "Farming", icon: "sprout", color: "#C0392B" },
  { id: "infrastructure", name: "Infrastructure", icon: "route", color: "#5E1814" },
  { id: "realestate", name: "Real Estate", icon: "building-2", color: "#CB4232" },
  { id: "manufacturing", name: "Manufacturing", icon: "factory", color: "#8F261C" },
  { id: "technology", name: "Technology", icon: "cpu", color: "#E07E66" },
  { id: "tourism", name: "Tourism", icon: "palmtree", color: "#EDA993" },
  { id: "mining", name: "Mining", icon: "pickaxe", color: "#5E1814" },
];

export function getSector(id: string): Sector {
  return SECTORS.find((s) => s.id === id) ?? SECTORS[0];
}

export async function getSectors(): Promise<Sector[]> {
  return SECTORS;
}
