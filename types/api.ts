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
  contact_name: string | null;
  contact_email: string | null;
  investment_countries: string[];
  investment_sectors: string[];
  risk_appetite: string | null;
  created_at: string;
};

export type ProjectOwnerProject = {
  id: string;
  title: string;
  sector: string;
  country: string;
  brief_description: string;
  funding_required: string;
  status: string;
  created_at: string;
};

export type ProjectDetail = ProjectOwnerProject & {
  executive_summary: string | null;
  project_stage: string;
  funding_type: string;
};

export type MatchItem = {
  id: string;
  investor_id: string;
  project_id: string;
  status: string;
  score: number | null;
  explanation: string | null;
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
  projects_by_status: Record<string, number>;
  projects_by_sector: Record<string, number>;
  matches_by_status: Record<string, number>;
  total_users: number;
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

export type AuditLogEntry = {
  id: string;
  actor_user_id: string | null;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};
