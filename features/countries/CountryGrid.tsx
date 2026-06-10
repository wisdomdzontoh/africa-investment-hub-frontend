"use client";

import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/common/EmptyState";
import { Flag } from "@/components/common/Flag";
import { Input } from "@/components/ui/input";
import type { Country } from "@/types";

export function CountryGrid({ countries }: { countries: Country[] }) {
  const t = useTranslations("countries");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return countries;
    const q = query.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q),
    );
  }, [countries, query]);

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="mb-6 max-w-md"
      />
      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={t("empty")}
          action={
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[var(--text-sm)] font-semibold text-[var(--accent)] hover:underline"
            >
              {t("clearSearch")}
            </button>
          }
        />
      ) : (
        <div className="country-grid">
          {filtered.map((c) => (
            <Link
              key={c.code}
              href={`/countries/${c.code}`}
              className="country-chip no-underline"
            >
              <Flag code={c.code} lg />
              <div className="text-left leading-tight">
                <div className="text-[var(--text-sm)] font-semibold text-[var(--text-strong)]">
                  {c.name}
                </div>
                <div className="text-[var(--text-2xs)] text-[var(--text-muted)]">
                  {c.region} · {t("opportunities", { count: c.opps })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
