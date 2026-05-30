import type { PaginatedResult, Project, ProjectFilters } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Lekki Coastal Logistics Hub",
    sectorId: "infrastructure",
    countryCode: "ng",
    funding: 18000000,
    roiMin: 14,
    roiMax: 19,
    risk: "medium",
    timeline: "36 mo",
    stage: "Revenue-generating",
    fundingType: "Equity + debt",
    featured: true,
    views: 1284,
    summary:
      "A bonded warehousing and last-mile distribution hub serving the Lekki Free Zone, anchored by two signed offtake agreements.",
    detail:
      "Full technical due diligence pack available to verified investors. Includes land title verification, environmental clearance, and anchor tenant contracts.",
  },
  {
    id: "p2",
    title: "Rift Valley Solar + Storage",
    sectorId: "renewable",
    countryCode: "ke",
    funding: 26500000,
    roiMin: 11,
    roiMax: 15,
    risk: "low",
    timeline: "48 mo",
    stage: "Pre-revenue",
    fundingType: "Project finance",
    featured: true,
    views: 2017,
    summary:
      "120 MW solar generation with battery storage and a 20-year power purchase agreement with the national utility.",
    detail:
      "Grid connection agreement signed. EPC contractor shortlisted. Full financial model and sensitivity analysis available post-NDA.",
  },
  {
    id: "p3",
    title: "Accra Affordable Housing Phase II",
    sectorId: "realestate",
    countryCode: "gh",
    funding: 9500000,
    roiMin: 16,
    roiMax: 22,
    risk: "medium",
    timeline: "30 mo",
    stage: "Expansion",
    fundingType: "Equity",
    featured: false,
    views: 864,
    summary:
      "640 mid-income residential units with pre-sales covering 35% of inventory and clean, verified land title.",
  },
  {
    id: "p4",
    title: "Kilimanjaro Specialty Coffee Estate",
    sectorId: "agriculture",
    countryCode: "tz",
    funding: 4200000,
    roiMin: 18,
    roiMax: 27,
    risk: "high",
    timeline: "24 mo",
    stage: "Revenue-generating",
    fundingType: "Equity",
    featured: false,
    views: 521,
    summary:
      "Vertically integrated specialty coffee with export contracts to three European roasters and Rainforest certification.",
  },
  {
    id: "p5",
    title: "Cape Town Cold-Chain Manufacturing",
    sectorId: "manufacturing",
    countryCode: "za",
    funding: 12800000,
    roiMin: 13,
    roiMax: 17,
    risk: "low",
    timeline: "36 mo",
    stage: "Expansion",
    fundingType: "Equity + debt",
    featured: true,
    views: 1392,
    summary:
      "Refrigerated processing and packaging plant supplying retail chains across SADC, with installed base of anchor clients.",
  },
  {
    id: "p6",
    title: "Kigali Fintech Data Centre",
    sectorId: "technology",
    countryCode: "rw",
    funding: 7600000,
    roiMin: 15,
    roiMax: 21,
    risk: "medium",
    timeline: "30 mo",
    stage: "Pre-revenue",
    fundingType: "Equity",
    featured: false,
    views: 967,
    summary:
      "Tier-III carrier-neutral data centre positioned for the regional fintech corridor, backed by government zone incentives.",
  },
  {
    id: "p7",
    title: "Casablanca Green Port Terminal",
    sectorId: "infrastructure",
    countryCode: "ma",
    funding: 42000000,
    roiMin: 10,
    roiMax: 14,
    risk: "low",
    timeline: "60 mo",
    stage: "Pre-revenue",
    fundingType: "Project finance",
    featured: false,
    views: 743,
    summary:
      "Modernised container terminal with shore-power and automated stacking, under a 25-year concession framework.",
  },
  {
    id: "p8",
    title: "Addis Industrial Park Phase III",
    sectorId: "manufacturing",
    countryCode: "et",
    funding: 15000000,
    roiMin: 12,
    roiMax: 18,
    risk: "medium",
    timeline: "42 mo",
    stage: "Expansion",
    fundingType: "Equity",
    featured: false,
    views: 612,
    summary:
      "Light manufacturing cluster targeting textile and agro-processing with export incentives under the national industrial plan.",
  },
  {
    id: "p9",
    title: "Dakar Offshore Wind Pilot",
    sectorId: "renewable",
    countryCode: "sn",
    funding: 31000000,
    roiMin: 9,
    roiMax: 13,
    risk: "medium",
    timeline: "54 mo",
    stage: "Pre-revenue",
    fundingType: "Project finance",
    featured: false,
    views: 891,
    summary:
      "50 MW offshore wind demonstration with feasibility studies complete and grid integration roadmap approved.",
  },
];

function sortProjects(items: Project[], sort?: ProjectFilters["sort"]): Project[] {
  const copy = [...items];
  switch (sort) {
    case "funding-desc":
      return copy.sort((a, b) => b.funding - a.funding);
    case "funding-asc":
      return copy.sort((a, b) => a.funding - b.funding);
    case "roi-desc":
      return copy.sort((a, b) => b.roiMax - a.roiMax);
    case "views-desc":
      return copy.sort((a, b) => b.views - a.views);
    case "featured":
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

function filterProjects(filters: ProjectFilters): Project[] {
  return PROJECTS.filter((p) => {
    if (filters.country && p.countryCode !== filters.country) return false;
    if (filters.sector && p.sectorId !== filters.sector) return false;
    if (filters.risk && p.risk !== filters.risk) return false;
    if (filters.stage && p.stage !== filters.stage) return false;
    if (filters.fundingType && p.fundingType !== filters.fundingType) return false;
    if (filters.minFunding && p.funding < filters.minFunding) return false;
    if (filters.maxFunding && p.funding > filters.maxFunding) return false;
    return true;
  });
}

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export async function getProjects(
  filters: ProjectFilters = {},
): Promise<PaginatedResult<Project>> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 6;
  const filtered = sortProjects(filterProjects(filters), filters.sort);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return PROJECTS.filter((p) => p.featured).slice(0, limit);
}

export async function getProjectById(id: string): Promise<Project | null> {
  return getProject(id) ?? null;
}

export async function getProjectFilterOptions() {
  return {
    stages: [...new Set(PROJECTS.map((p) => p.stage))],
    fundingTypes: [...new Set(PROJECTS.map((p) => p.fundingType).filter(Boolean))] as string[],
  };
}
