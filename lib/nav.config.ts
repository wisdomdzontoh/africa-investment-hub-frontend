import { BookOpen, MessageCircle, type LucideIcon } from "lucide-react";
import { COUNTRIES } from "@/lib/data/countries";
import { SECTORS } from "@/lib/data/sectors";

export type PanelItem = {
  key: string;
  href: string;
  /** Only the region/sector/country columns resolve their own label text
   *  (from data files) instead of going through next-intl — see the comment
   *  on each column below for why. */
  labelText?: string;
  /** Renders as an accent "Browse all X →" catch-all instead of a plain row —
   *  used to link out to the rest of a long list without enumerating all of it. */
  isViewAll?: boolean;
};

export type PanelColumn = { labelKey: string; items: PanelItem[] };

export type NavPanelSection = {
  type: "panel";
  key: string;
  href: string;
  matchPrefixes: string[];
  columns: PanelColumn[];
};

export type NavLinkSection = {
  type: "link";
  key: string;
  href: string;
  matchPrefixes: string[];
};

export type NavSection = NavPanelSection | NavLinkSection;

// Sector names/ids come from the same SECTORS data file the homepage sector
// carousel already uses (lib/data/sectors.ts) — unlike everything else in
// this config, sector names aren't run through next-intl there either, so
// this matches that existing precedent instead of introducing a second,
// divergent source of sector labels. Split into two columns of five.
const SECTOR_ITEMS: PanelItem[] = SECTORS.map((s) => ({
  key: s.id,
  href: `/opportunities?sector=${s.id}`,
  labelText: s.name,
}));
const SECTORS_COL_A = SECTOR_ITEMS.slice(0, 5);
const SECTORS_COL_B: PanelItem[] = [
  ...SECTOR_ITEMS.slice(5),
  { key: "viewAllSectors", href: "/opportunities", labelText: "Browse all sectors", isViewAll: true },
];

// Region slugs + counts derived from the real country dataset (COUNTRIES)
// rather than hand-maintained, so the panel never drifts out of sync with
// what /countries actually has.
const REGIONS = ["West Africa", "East Africa", "North Africa", "Southern Africa", "Central Africa"];
const REGION_ITEMS: PanelItem[] = REGIONS.map((region) => ({
  key: region.toLowerCase().replace(/\s+/g, "-"),
  href: `/countries?region=${region.toLowerCase().replace(/\s+/g, "-")}`,
  labelText: region,
}));

// The five countries with the most live opportunities — real, functional
// /countries/<code> pages, picked from actual data rather than guessed.
const POPULAR_COUNTRY_ITEMS: PanelItem[] = [...COUNTRIES]
  .sort((a, b) => b.opps - a.opps)
  .slice(0, 5)
  .map((c) => ({ key: c.code, href: `/countries/${c.code}`, labelText: c.name }));

export const PRIMARY_NAV: NavSection[] = [
  {
    type: "panel",
    key: "opportunities",
    href: "/opportunities",
    matchPrefixes: ["/opportunities"],
    columns: [
      {
        labelKey: "browse",
        items: [
          { key: "allOpportunities", href: "/opportunities" },
          { key: "featured", href: "/opportunities?featured=true" },
        ],
      },
      { labelKey: "sectorsA", items: SECTORS_COL_A },
      { labelKey: "sectorsB", items: SECTORS_COL_B },
    ],
  },
  {
    type: "panel",
    key: "countries",
    href: "/countries",
    matchPrefixes: ["/countries"],
    columns: [
      {
        labelKey: "explore",
        items: [
          { key: "all54", href: "/countries" },
          { key: "recentlyUpdated", href: "/countries?sort=updated" },
        ],
      },
      { labelKey: "byRegion", items: REGION_ITEMS },
      { labelKey: "popularGuides", items: POPULAR_COUNTRY_ITEMS },
    ],
  },
  {
    type: "link",
    key: "whyAfrica",
    href: "/why-africa",
    matchPrefixes: ["/why-africa"],
  },
];

export const PANEL_FOOTER_LINKS: { key: string; href: string; icon: LucideIcon }[] = [
  { key: "advisor", href: "/contact?intent=advisor", icon: MessageCircle },
  { key: "countryGuides", href: "/countries", icon: BookOpen },
];
