import type { Country, CountryDetail } from "@/types";

export const COUNTRIES: Country[] = [
  { code: "dz", name: "Algeria", region: "North Africa", opps: 18 },
  { code: "ao", name: "Angola", region: "Southern Africa", opps: 11 },
  { code: "bj", name: "Benin", region: "West Africa", opps: 8 },
  { code: "bw", name: "Botswana", region: "Southern Africa", opps: 9 },
  { code: "bf", name: "Burkina Faso", region: "West Africa", opps: 7 },
  { code: "bi", name: "Burundi", region: "East Africa", opps: 6 },
  { code: "cv", name: "Cabo Verde", region: "West Africa", opps: 5 },
  { code: "cm", name: "Cameroon", region: "Central Africa", opps: 14 },
  { code: "cf", name: "Central African Republic", region: "Central Africa", opps: 4 },
  { code: "td", name: "Chad", region: "Central Africa", opps: 5 },
  { code: "km", name: "Comoros", region: "East Africa", opps: 3 },
  { code: "cg", name: "Congo", region: "Central Africa", opps: 8 },
  { code: "cd", name: "DR Congo", region: "Central Africa", opps: 15 },
  { code: "ci", name: "Côte d'Ivoire", region: "West Africa", opps: 16 },
  { code: "dj", name: "Djibouti", region: "East Africa", opps: 6 },
  { code: "eg", name: "Egypt", region: "North Africa", opps: 33 },
  { code: "gq", name: "Equatorial Guinea", region: "Central Africa", opps: 4 },
  { code: "er", name: "Eritrea", region: "East Africa", opps: 3 },
  { code: "sz", name: "Eswatini", region: "Southern Africa", opps: 5 },
  { code: "et", name: "Ethiopia", region: "East Africa", opps: 19 },
  { code: "ga", name: "Gabon", region: "Central Africa", opps: 7 },
  { code: "gm", name: "Gambia", region: "West Africa", opps: 4 },
  { code: "gh", name: "Ghana", region: "West Africa", opps: 29 },
  { code: "gn", name: "Guinea", region: "West Africa", opps: 8 },
  { code: "gw", name: "Guinea-Bissau", region: "West Africa", opps: 3 },
  { code: "ke", name: "Kenya", region: "East Africa", opps: 38 },
  { code: "ls", name: "Lesotho", region: "Southern Africa", opps: 4 },
  { code: "lr", name: "Liberia", region: "West Africa", opps: 6 },
  { code: "ly", name: "Libya", region: "North Africa", opps: 5 },
  { code: "mg", name: "Madagascar", region: "East Africa", opps: 10 },
  { code: "mw", name: "Malawi", region: "East Africa", opps: 7 },
  { code: "ml", name: "Mali", region: "West Africa", opps: 8 },
  { code: "mr", name: "Mauritania", region: "West Africa", opps: 5 },
  { code: "mu", name: "Mauritius", region: "East Africa", opps: 12 },
  { code: "ma", name: "Morocco", region: "North Africa", opps: 24 },
  { code: "mz", name: "Mozambique", region: "East Africa", opps: 13 },
  { code: "na", name: "Namibia", region: "Southern Africa", opps: 9 },
  { code: "ne", name: "Niger", region: "West Africa", opps: 6 },
  { code: "ng", name: "Nigeria", region: "West Africa", opps: 42 },
  { code: "rw", name: "Rwanda", region: "East Africa", opps: 17 },
  { code: "st", name: "São Tomé and Príncipe", region: "Central Africa", opps: 2 },
  { code: "sn", name: "Senegal", region: "West Africa", opps: 14 },
  { code: "sc", name: "Seychelles", region: "East Africa", opps: 6 },
  { code: "sl", name: "Sierra Leone", region: "West Africa", opps: 7 },
  { code: "so", name: "Somalia", region: "East Africa", opps: 4 },
  { code: "za", name: "South Africa", region: "Southern Africa", opps: 51 },
  { code: "ss", name: "South Sudan", region: "East Africa", opps: 5 },
  { code: "sd", name: "Sudan", region: "North Africa", opps: 6 },
  { code: "tz", name: "Tanzania", region: "East Africa", opps: 22 },
  { code: "tg", name: "Togo", region: "West Africa", opps: 6 },
  { code: "tn", name: "Tunisia", region: "North Africa", opps: 13 },
  { code: "ug", name: "Uganda", region: "East Africa", opps: 12 },
  { code: "zm", name: "Zambia", region: "Southern Africa", opps: 10 },
  { code: "zw", name: "Zimbabwe", region: "Southern Africa", opps: 9 },
];

const DETAIL_TEMPLATE = {
  climate:
    "Tropical to arid depending on region. Seasonal rainfall patterns affect logistics planning; coastal zones offer year-round port access.",
  laws:
    "Investment governed by national investment promotion acts aligned with AfCFTA. Bilateral investment treaties with major OECD partners in force.",
  tax:
    "Corporate income tax typically 25–30%. Investment incentives available in priority sectors including reduced rates for export-oriented manufacturing.",
  registration:
    "Company registration via one-stop investment agency. Foreign entities may register subsidiaries or branch offices within 5–10 business days.",
  licensing:
    "Sector-specific licences required for financial services, mining, telecoms, and energy. Environmental impact assessments mandatory for large projects.",
  ownership:
    "100% foreign ownership permitted in most sectors. Restrictions may apply to land ownership; long-term leases (99 years) widely available.",
  repatriation:
    "Free repatriation of capital and dividends subject to tax clearance. Central bank registration required for foreign currency accounts.",
  immigration:
    "Investor visas and work permits available for qualifying ticket sizes. Regional ECOWAS/EAC/SADC mobility agreements may apply.",
  contacts:
    "National investment promotion agency, ministry of trade, and platform-verified local counsel network.",
  news: "Recent reforms streamline digital business registration and expand special economic zone incentives.",
  lastUpdated: "2026-05-01",
};

function buildDetail(country: Country): CountryDetail {
  return {
    ...country,
    ...DETAIL_TEMPLATE,
    climate: `${country.name}: ${DETAIL_TEMPLATE.climate}`,
    lastUpdated: DETAIL_TEMPLATE.lastUpdated,
  };
}

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export async function getCountries(query?: string): Promise<Country[]> {
  if (!query?.trim()) return COUNTRIES;
  const q = query.toLowerCase();
  return COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q),
  );
}

export async function getCountryDetail(code: string): Promise<CountryDetail | null> {
  const country = getCountry(code);
  if (!country) return null;
  return buildDetail(country);
}
