export type UserRole = "investor" | "project_owner" | "admin";
export type UserStatus = "pending" | "approved" | "rejected" | "suspended";
export type Locale = "en" | "fr" | "zh";

export type UserAccount = {
  id: string;
  clerk_id: string;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  locale: Locale;
  created_at: string;
  /** True once the user has submitted their role profile (or a project). */
  onboarding_complete: boolean;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type Page<T> = {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
};

export type PresignUploadResponse = {
  upload_url: string;
  r2_key: string;
  expires_in: number;
  method: string;
};

export type InvestorProfile = {
  id: string;
  user_id: string;
  company_name: string;
  country_of_registration: string;
  registered_address: string | null;
  website: string | null;
  contact_name: string | null;
  contact_title: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  investment_countries: string[];
  investment_sectors: string[];
  risk_appetite: string | null;
  created_at: string;
};

export type FacilitatorProject = {
  id: string;
  title: string;
  sector: string;
  country: string;
  brief_description: string;
  funding_required: string;
  status: string;
  created_at: string;
};

export type ProjectDetail = FacilitatorProject & {
  executive_summary: string | null;
  project_stage: string;
  funding_type: string;
  full_description?: string | null;
  min_investment?: string | null;
  existing_funding?: string | null;
  use_of_funds?: string | null;
  expected_roi_min?: string | null;
  expected_roi_max?: string | null;
  timeline_to_returns_months?: number | null;
  risk_level?: string | null;
};

/** Owner's view of their own project (GET /projects/mine/{id}) — any status,
 *  ungated fields, plus uploaded documents. */
export type FacilitatorProjectDetail = ProjectDetail & {
  documents: Document[];
  updated_at: string;
};

/** Project summary embedded in a match (backend `ProjectCard`). */
export type MatchProject = {
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
  risk_level: string | null;
  project_stage: string;
  is_featured: boolean;
  created_at: string;
};

/** Bare match (backend `MatchOut`). `score` is a 0–1 compatibility ratio. */
export type MatchSummary = {
  id: string;
  project_id: string;
  status: string;
  score: number | null;
  explanation: string | null;
  source: string;
  is_confidential: boolean;
  created_at: string;
};

/** Investor match with the embedded project (backend `MatchWithProject`). */
export type MatchItem = MatchSummary & {
  project: MatchProject;
};

/** Admin matches list row (backend `AdminMatchOut`). */
export type AdminMatch = MatchSummary & {
  project_title: string | null;
  investor_company: string | null;
};

/** Deal-room project view (backend `DealRoomProject`). `full_description` and
 *  `documents` are present only when the NDA gate is unlocked. */
export type DealRoomProject = MatchProject & {
  executive_summary: string | null;
  full_description: string | null;
  documents: Document[];
};

/** Per-match deal room (backend `DealRoomOut`). */
export type DealRoom = {
  match: MatchSummary;
  project: DealRoomProject;
  nda_unlocked: boolean;
  can_sign_nda: boolean;
};

export type DueDiligenceItemStatus = "pending" | "submitted" | "approved" | "rejected";

export type DueDiligenceItem = {
  item_id: string;
  category: string;
  title: string;
  status: DueDiligenceItemStatus;
  document_r2_key: string | null;
  filename: string | null;
  signed_off_at?: string | null;
};

export type DueDiligence = {
  id: string;
  match_id: string;
  status: string;
  checklist: DueDiligenceItem[];
  created_at: string;
  updated_at: string;
};

export type RiskAssessment = {
  assessment: Record<string, unknown>;
  admin_notes: string | null;
};

export type MilestoneStatus = "pending" | "in_progress" | "completed" | "overdue";

export type Milestone = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: MilestoneStatus;
  created_at: string;
  updated_at: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export type AdminAnalytics = {
  investors_by_status: Record<string, number>;
  users_by_role: Record<string, number>;
  projects_by_status: Record<string, number>;
  projects_by_sector: Record<string, number>;
  matches_by_status: Record<string, number>;
  total_users: number;
  total_matches: number;
  avg_match_score: number | null;
};

export type AdminInvestor = {
  id: string;
  company_name: string;
  country_of_registration: string;
  status: UserStatus;
  created_at: string;
};

export type AdminProject = {
  id: string;
  title: string;
  sector: string;
  country: string;
  status: string;
  created_at: string;
};

export type Document = {
  type: string;
  filename: string;
  r2_key: string;
  uploaded_at?: string | null;
  content_type?: string | null;
};

export type PreviousProject = {
  project_name: string;
  country?: string | null;
  sector?: string | null;
  year?: number | null;
};

export type AdminInvestorDetail = {
  id: string;
  user_id: string;
  status: UserStatus;
  company_name: string;
  country_of_registration: string;
  registration_number: string | null;
  years_of_operation: number | null;
  registered_address: string | null;
  website: string | null;
  contact_name: string | null;
  contact_title: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  investment_countries: string[];
  investment_sectors: string[];
  investment_types: string[];
  min_ticket_size: string | null;
  max_ticket_size: string | null;
  preferred_deal_size: string | null;
  capital_availability: string | null;
  risk_appetite: string | null;
  target_roi_min: string | null;
  target_roi_max: string | null;
  time_horizon: string | null;
  preferred_ownership_structures: string[];
  exit_strategy: string | null;
  esg_requirements: string | null;
  sectors_excluded: string[];
  political_risk_tolerance: string | null;
  currency_risk_tolerance: string | null;
  previous_projects: PreviousProject[];
  certifications: string | null;
  documents: Document[];
  created_at: string;
};

export type AdminProjectDetail = {
  id: string;
  owner_user_id: string;
  status: string;
  title: string;
  sector: string;
  country: string;
  brief_description: string;
  executive_summary: string | null;
  full_description: string | null;
  project_stage: string;
  funding_required: string;
  funding_type: string;
  min_investment: string | null;
  existing_funding: string | null;
  use_of_funds: string | null;
  expected_roi_min: string | null;
  expected_roi_max: string | null;
  timeline_to_returns_months: number | null;
  projected_revenue_12m: string | null;
  projected_revenue_24m: string | null;
  projected_revenue_36m: string | null;
  current_annual_revenue: string | null;
  risk_level: string | null;
  admin_notes: string | null;
  documents: Document[];
  created_at: string;
};

/* ───────────────────────── Admin CMS (PRD §6.4) ───────────────────────── */

/** Per-locale rich-text value, e.g. `{ en: "...", fr: "...", zh: "..." }`. */
export type LocaleText = Partial<Record<Locale, string>>;

export type CmsCountrySummary = {
  country_code: string;
  country_name: string;
  region: string | null;
  is_published: boolean;
};

export type CmsKeyContact = {
  name?: string;
  organization?: string;
  role?: string;
  email?: string;
  phone?: string;
};

export type CmsCountryContent = {
  country_code: string;
  country_name: string;
  region: string | null;
  investment_climate: LocaleText | null;
  investment_laws: LocaleText | null;
  tax_system: LocaleText | null;
  business_registration: LocaleText | null;
  licensing_requirements: LocaleText | null;
  foreign_ownership_rules: LocaleText | null;
  repatriation_policy: LocaleText | null;
  immigration_requirements: LocaleText | null;
  key_contacts: CmsKeyContact[];
  recent_news: Record<string, unknown>[];
  is_published: boolean;
};

export type CmsCountryUpsert = Partial<
  Omit<CmsCountryContent, "country_code" | "is_published">
> & {
  /** True publishes (and reindexes the AI knowledge base); false saves a draft. */
  publish?: boolean;
};

export type CmsHomepageStat = { value: string; label: LocaleText };
export type CmsPartnerLogo = { name: string; logo_url?: string; website?: string };
export type CmsTeamMember = {
  name: string;
  role?: LocaleText;
  bio?: LocaleText;
  photo_url?: string;
};
export type CmsAdvisor = { name: string; role?: LocaleText; organization?: string };

export type CmsHomepageContent = {
  stats: CmsHomepageStat[];
  process_steps: Record<string, unknown>[];
  sector_highlights: Record<string, unknown>[];
  partner_logos: CmsPartnerLogo[];
  team_members: CmsTeamMember[];
  advisory_board: CmsAdvisor[];
};

export type AuditLogEntry = {
  id: string;
  actor_user_id: string | null;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};
