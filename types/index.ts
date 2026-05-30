export type RiskLevel = "low" | "medium" | "high";

export type Sector = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Country = {
  code: string;
  name: string;
  region: string;
  opps: number;
};

export type CountryDetail = Country & {
  climate: string;
  laws: string;
  tax: string;
  registration: string;
  licensing: string;
  ownership: string;
  repatriation: string;
  immigration: string;
  contacts: string;
  news: string;
  lastUpdated: string;
};

export type Project = {
  id: string;
  title: string;
  sectorId: string;
  countryCode: string;
  funding: number;
  roiMin: number;
  roiMax: number;
  risk: RiskLevel;
  timeline: string;
  stage: string;
  featured: boolean;
  views: number;
  summary: string;
  fundingType?: string;
  detail?: string;
};

export type Match = {
  id: string;
  projectId: string;
  score: number;
  reasons: string[];
};

export type Milestone = {
  id: string;
  title: string;
  status: "completed" | "in_progress" | "pending";
  date: string;
  budget: number;
  actual: number;
};

export type EngagementStep = {
  id: string;
  label: string;
  icon: string;
};

export type HomeStat = {
  value: string;
  label: string;
};

export type InvestorProfile = {
  id: string;
  company: string;
  contact: string;
  countryCode: string;
  country: string;
  submitted: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  ticket: string;
};

export type ProjectFilters = {
  country?: string;
  sector?: string;
  risk?: RiskLevel;
  stage?: string;
  fundingType?: string;
  minFunding?: number;
  maxFunding?: number;
  sort?: "featured" | "funding-desc" | "funding-asc" | "roi-desc" | "views-desc";
  page?: number;
  pageSize?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
