import type { HomeStat } from "@/types";

export const HOME_STATS: HomeStat[] = [
  { value: "1.5B", label: "Population — 60% under age 25" },
  { value: "54", label: "Countries, one free-trade area" },
  { value: "$3.4T", label: "Combined GDP across AfCFTA" },
  { value: "$130B", label: "Annual infrastructure gap" },
];

export async function getHomeStats(): Promise<HomeStat[]> {
  return HOME_STATS;
}

export async function getHomeKpi(): Promise<{ capitalFacilitated: string; dealsClosed: number }> {
  return { capitalFacilitated: "$214M", dealsClosed: 31 };
}
