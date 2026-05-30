"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { BrandedButton } from "@/components/brand/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Country } from "@/types";
import type { Sector } from "@/types";
import type { ProjectFilters } from "@/types";

type OpportunityFiltersProps = {
  countries: Country[];
  sectors: Sector[];
  stages: string[];
  fundingTypes: string[];
  filters: ProjectFilters;
};

export function OpportunityFilters({
  countries,
  sectors,
  stages,
  fundingTypes,
  filters,
}: OpportunityFiltersProps) {
  const t = useTranslations("opportunities.filters");
  const router = useRouter();

  const update = (patch: Partial<ProjectFilters>) => {
    const params = new URLSearchParams();
    const next = { ...filters, ...patch, page: 1 };
    if (next.country) params.set("country", next.country);
    if (next.sector) params.set("sector", next.sector);
    if (next.risk) params.set("risk", next.risk);
    if (next.stage) params.set("stage", next.stage);
    if (next.fundingType) params.set("fundingType", next.fundingType);
    if (next.sort) params.set("sort", next.sort);
    const qs = params.toString();
    router.push(qs ? `/opportunities?${qs}` : "/opportunities");
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-[var(--radius-base)] border border-border bg-card p-4">
      <FilterSelect
        label={t("country")}
        value={filters.country ?? "all"}
        onChange={(v) => update({ country: v === "all" ? undefined : v })}
        options={[
          { value: "all", label: t("all") },
          ...countries.slice(0, 20).map((c) => ({
            value: c.code,
            label: c.name,
          })),
        ]}
      />
      <FilterSelect
        label={t("sector")}
        value={filters.sector ?? "all"}
        onChange={(v) => update({ sector: v === "all" ? undefined : v })}
        options={[
          { value: "all", label: t("all") },
          ...sectors.map((s) => ({ value: s.id, label: s.name })),
        ]}
      />
      <FilterSelect
        label={t("risk")}
        value={filters.risk ?? "all"}
        onChange={(v) =>
          update({
            risk:
              v === "all" ? undefined : (v as ProjectFilters["risk"]),
          })
        }
        options={[
          { value: "all", label: t("all") },
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ]}
      />
      <FilterSelect
        label={t("stage")}
        value={filters.stage ?? "all"}
        onChange={(v) => update({ stage: v === "all" ? undefined : v })}
        options={[
          { value: "all", label: t("all") },
          ...stages.map((s) => ({ value: s, label: s })),
        ]}
      />
      <FilterSelect
        label={t("sort")}
        value={filters.sort ?? "featured"}
        onChange={(v) =>
          update({ sort: v as ProjectFilters["sort"] })
        }
        options={[
          { value: "featured", label: t("sortFeatured") },
          { value: "funding-desc", label: t("sortFundingDesc") },
          { value: "funding-asc", label: t("sortFundingAsc") },
          { value: "roi-desc", label: t("sortRoi") },
          { value: "views-desc", label: t("sortViews") },
        ]}
      />
      <BrandedButton variant="outline" onClick={() => router.push("/opportunities")}>
        {t("clear")}
      </BrandedButton>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="min-w-[140px] flex-1">
      <div className="label-caps mb-1">{label}</div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
