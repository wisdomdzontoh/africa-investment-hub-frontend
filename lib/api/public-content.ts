// Server-side data layer for CMS-managed public content (PRD §6.1).
// The backend caches these responses in Redis; we additionally use ISR so a
// page render normally never waits on the API.

import { API_BASE_URL } from "@/lib/api/client";
import type { CmsHomepageContent, Locale, LocaleText } from "@/types/api";

export async function getHomepageContent(): Promise<CmsHomepageContent | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/content/homepage`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as CmsHomepageContent;
  } catch {
    return null;
  }
}

/** Resolve a `{en, fr, zh}` CMS value for the active locale (en fallback). */
export function resolveLocaleText(
  text: LocaleText | null | undefined,
  locale: string,
): string {
  if (!text) return "";
  return text[locale as Locale] ?? text.en ?? Object.values(text)[0] ?? "";
}

/** Published, locale-resolved country page content (admin CMS, PRD §6.1). */
export type PublicCountryContent = {
  country_code: string;
  country_name: string;
  region: string | null;
  investment_climate: string | null;
  investment_laws: string | null;
  tax_system: string | null;
  business_registration: string | null;
  licensing_requirements: string | null;
  foreign_ownership_rules: string | null;
  repatriation_policy: string | null;
  immigration_requirements: string | null;
  key_contacts: { name?: string; organization?: string; role?: string; email?: string }[];
  recent_news: Record<string, unknown>[];
  last_updated_at: string | null;
};

/** Returns null when the country has no *published* CMS content (404). */
export async function getPublishedCountryContent(
  code: string,
  locale: string,
): Promise<PublicCountryContent | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/countries/${code.toUpperCase()}`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicCountryContent;
  } catch {
    return null;
  }
}
