// Server-side data layer for the public marketing site. Talks to the live
// backend, which returns ONLY approved projects from the public list endpoint
// and gates confidential fields on the detail endpoint. No auth is required for
// the listing; the detail accepts an optional bearer token so signed-in,
// approved investors receive the gated fields.

import { API_BASE_URL } from "@/lib/api/client";
import type { PaginatedResult, Project, ProjectFilters, RiskLevel } from "@/types";

type ApiProjectCard = {
  id: string;
  title: string;
  sector: string;
  country: string;
  brief_description: string;
  funding_required: string;
  funding_type: string;
  expected_roi_min: string | null;
  expected_roi_max: string | null;
  timeline_to_returns_months: number | null;
  risk_level: RiskLevel | null;
  project_stage: string;
  is_featured: boolean;
  view_count?: number;
};

type ApiProjectDetail = ApiProjectCard & {
  executive_summary: string | null;
  full_description: string | null;
};

export type LiveProjectDetail = Project & {
  execSummary: string | null;
  fullDescription: string | null;
};

function num(v: string | null | undefined): number {
  if (v === null || v === undefined) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function adaptCard(c: ApiProjectCard): Project {
  return {
    id: c.id,
    title: c.title,
    sectorId: c.sector,
    countryCode: c.country.toLowerCase(),
    funding: num(c.funding_required),
    roiMin: c.expected_roi_min ? num(c.expected_roi_min) : 0,
    roiMax: c.expected_roi_max ? num(c.expected_roi_max) : 0,
    risk: c.risk_level ?? "medium",
    timeline: c.timeline_to_returns_months ? `${c.timeline_to_returns_months} mo` : "—",
    stage: c.project_stage,
    featured: c.is_featured,
    views: c.view_count ?? 0,
    summary: c.brief_description,
    fundingType: c.funding_type,
  };
}

async function fetchApproved(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/projects?limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: ApiProjectCard[] };
    return (data.items ?? []).map(adaptCard);
  } catch {
    return [];
  }
}

/* ----------------------- in-memory filter / sort ------------------------ */

function applyFilters(all: Project[], f: ProjectFilters): Project[] {
  return all.filter((p) => {
    if (f.country && p.countryCode !== f.country) return false;
    if (f.sector && p.sectorId !== f.sector) return false;
    if (f.risk && p.risk !== f.risk) return false;
    if (f.stage && p.stage !== f.stage) return false;
    if (f.fundingType && p.fundingType !== f.fundingType) return false;
    if (f.minFunding && p.funding < f.minFunding) return false;
    if (f.maxFunding && p.funding > f.maxFunding) return false;
    return true;
  });
}

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

/* ------------------------------- exports -------------------------------- */

export async function getLiveProjects(
  filters: ProjectFilters = {},
): Promise<PaginatedResult<Project>> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 6;
  const all = await fetchApproved();
  const filtered = sortProjects(applyFilters(all, filters), filters.sort);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), total, page, pageSize, totalPages };
}

export async function getLiveFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await fetchApproved();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getLiveProjectsByCountry(countryCode: string): Promise<Project[]> {
  const all = await fetchApproved();
  return all.filter((p) => p.countryCode === countryCode.toLowerCase());
}

export async function countLiveProjectsByCountry(): Promise<Record<string, number>> {
  const all = await fetchApproved();
  const counts: Record<string, number> = {};
  for (const p of all) counts[p.countryCode] = (counts[p.countryCode] ?? 0) + 1;
  return counts;
}

/** Detail. Pass a bearer token (signed-in user) so the backend returns gated
 *  fields when the caller is an approved investor / the owner / an admin. */
export async function getLiveProjectDetail(
  id: string,
  token?: string | null,
): Promise<LiveProjectDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/projects/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const c = (await res.json()) as ApiProjectDetail;
    return {
      ...adaptCard(c),
      execSummary: c.executive_summary,
      fullDescription: c.full_description,
    };
  } catch {
    return null;
  }
}

export function liveProjectFilterOptions() {
  return {
    stages: ["concept", "pre_revenue", "revenue_generating", "expansion"],
    fundingTypes: ["equity", "debt", "jv", "ppp", "acquisition"],
  };
}
