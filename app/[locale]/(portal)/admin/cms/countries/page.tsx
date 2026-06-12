"use client";

import { Globe, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminPageHeader, SearchInput } from "@/components/admin/AdminUI";
import { Button } from "@/components/ds";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { DataTable, StatusPill, type Column } from "@/components/portal";
import { useRouter } from "@/i18n/navigation";
import { useCmsCountries } from "@/lib/api/hooks";
import { COUNTRIES } from "@/lib/data/countries";
import type { CmsCountrySummary } from "@/types/api";

export default function AdminCmsCountriesPage() {
  const t = useTranslations("adminPortal");
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useCmsCountries();
  const [query, setQuery] = useState("");
  const [newCode, setNewCode] = useState("");

  const existing = useMemo(() => new Set((data ?? []).map((c) => c.country_code)), [data]);
  const rows = (data ?? []).filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.country_name.toLowerCase().includes(q) ||
      c.country_code.toLowerCase().includes(q) ||
      (c.region ?? "").toLowerCase().includes(q)
    );
  });

  const columns: Column<CmsCountrySummary>[] = [
    {
      key: "code",
      header: t("cms.colCode"),
      render: (c) => <span className="font-mono text-xs font-semibold">{c.country_code}</span>,
    },
    { key: "country_name", header: t("cms.colName") },
    {
      key: "region",
      header: t("cms.colRegion"),
      hideOnMobile: true,
      render: (c) => c.region ?? "—",
      className: "text-[var(--text-muted)]",
    },
    {
      key: "published",
      header: t("colStatus"),
      render: (c) => (
        <StatusPill
          status={c.is_published ? "live" : "draft"}
          label={c.is_published ? t("cms.published") : t("cms.draft")}
        />
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title={t("cms.countriesTitle")}
        subtitle={t("cms.countriesSubtitle")}
        action={
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (newCode) router.push(`/admin/cms/countries/${newCode}`);
            }}
          >
            <label htmlFor="new-country" className="sr-only">
              {t("cms.addCountry")}
            </label>
            <select
              id="new-country"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-2.5 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]"
            >
              <option value="">{t("cms.pickCountry")}</option>
              {COUNTRIES.filter((c) => !existing.has(c.code.toUpperCase())).map((c) => (
                <option key={c.code} value={c.code.toUpperCase()}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm" disabled={!newCode} className="gap-1.5">
              <Plus className="size-3.5" aria-hidden />
              {t("cms.addCountry")}
            </Button>
          </form>
        }
      />

      <div className="mb-4 flex justify-end">
        <SearchInput value={query} onChange={setQuery} placeholder={t("cms.searchCountries")} />
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(c) => c.country_code}
          isLoading={isLoading}
          onRowClick={(c) => router.push(`/admin/cms/countries/${c.country_code}`)}
          empty={
            <EmptyState
              compact
              icon={Globe}
              title={t("cms.noCountriesTitle")}
              description={t("cms.noCountriesBody")}
            />
          }
        />
      )}
    </div>
  );
}
