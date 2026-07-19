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

// Hard cap on server-side fetches to the backend. These run during static
// generation (`next build`), where Next kills any page taking >60s — an
// unreachable or stalled backend must degrade to the empty state, not hang
// the build. Aborted responses are never cached, and Next strips the signal
// on background ISR revalidations, so this only bounds foreground fetches.
const FETCH_TIMEOUT_MS = 8_000;

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

/* --------------------- server-side query construction -------------------- */

// UI sort keys → backend sort params.
const SORT_MAP: Record<string, string> = {
  featured: "featured",
  "funding-desc": "funding_desc",
  "funding-asc": "funding_asc",
  "roi-desc": "highest_roi",
  "views-desc": "most_viewed",
};

function buildListQuery(f: ProjectFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (f.country) params.set("country", f.country.toUpperCase());
  if (f.sector) params.set("sector", f.sector);
  if (f.risk) params.set("risk_level", f.risk);
  if (f.stage) params.set("stage", f.stage);
  if (f.fundingType) params.set("funding_type", f.fundingType);
  if (f.minFunding) params.set("min_funding", String(f.minFunding));
  if (f.maxFunding) params.set("max_funding", String(f.maxFunding));
  params.set("sort", SORT_MAP[f.sort ?? "featured"] ?? "featured");
  return params;
}

async function fetchPage(
  params: URLSearchParams,
): Promise<{ items: Project[]; total: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/projects?${params}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return { items: [], total: 0 };
    const data = (await res.json()) as { items?: ApiProjectCard[]; total?: number | null };
    const items = (data.items ?? []).map(adaptCard);
    return { items, total: data.total ?? items.length };
  } catch {
    return { items: [], total: 0 };
  }
}

/* ------------------------------- exports -------------------------------- */

/** Filtering, sorting, and pagination all run in the backend query —
 *  one fetch per page, no in-memory post-processing (FE-01). */
export async function getLiveProjects(
  filters: ProjectFilters = {},
): Promise<PaginatedResult<Project>> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 6;
  const params = buildListQuery(filters);
  params.set("page", String(page));
  params.set("limit", String(pageSize));
  const { items, total } = await fetchPage(params);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { items, total, page, pageSize, totalPages };
}

export async function getLiveFeaturedProjects(limit = 3): Promise<Project[]> {
  const featured = new URLSearchParams({
    featured: "true",
    sort: "featured",
    limit: String(limit),
  });
  const { items } = await fetchPage(featured);
  if (items.length > 0) return items;
  // No curated picks yet — fall back to the newest approved projects.
  const newest = new URLSearchParams({ sort: "newest", limit: String(limit) });
  return (await fetchPage(newest)).items;
}

export async function getLiveProjectsByCountry(countryCode: string): Promise<Project[]> {
  const params = new URLSearchParams({
    country: countryCode.toUpperCase(),
    sort: "newest",
    limit: "100",
  });
  return (await fetchPage(params)).items;
}

/** Approved-project counts per country — served by a Redis-cached aggregate
 *  endpoint instead of fetching every project. Keys are lowercase codes. */
export async function countLiveProjectsByCountry(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/content/project-counts`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return {};
    const data = (await res.json()) as { counts?: Record<string, number> };
    const counts: Record<string, number> = {};
    for (const [code, count] of Object.entries(data.counts ?? {})) {
      counts[code.toLowerCase()] = count;
    }
    return counts;
  } catch {
    return {};
  }
}

/** Detail. Pass a bearer token (signed-in user) so the backend returns gated
 *  fields when the caller is an approved investor / the facilitator / an admin. */
export async function getLiveProjectDetail(
  id: string,
  token?: string | null,
): Promise<LiveProjectDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/projects/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
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
