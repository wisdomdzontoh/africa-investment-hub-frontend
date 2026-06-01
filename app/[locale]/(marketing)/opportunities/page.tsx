import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { OpportunityFilters } from "@/features/opportunities/OpportunityFilters";
import { ProjectCard } from "@/features/opportunities/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getCountries } from "@/lib/data/countries";
import {
  getLiveProjects,
  liveProjectFilterOptions,
} from "@/lib/api/public-projects";
import { getSectors } from "@/lib/data/sectors";
import type { ProjectFilters, RiskLevel } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Link } from "@/i18n/navigation";
import { BrandedButton } from "@/components/brand/Button";

type SearchParams = Record<string, string | string[] | undefined>;

function parseFilters(searchParams: SearchParams): ProjectFilters {
  const get = (key: string) => {
    const v = searchParams[key];
    return typeof v === "string" ? v : undefined;
  };

  return {
    country: get("country"),
    sector: get("sector"),
    risk: get("risk") as RiskLevel | undefined,
    stage: get("stage"),
    fundingType: get("fundingType"),
    sort: (get("sort") as ProjectFilters["sort"]) ?? "featured",
    page: Number(get("page") ?? "1") || 1,
    pageSize: 6,
  };
}

function buildQuery(filters: ProjectFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.country) params.set("country", filters.country);
  if (filters.sector) params.set("sector", filters.sector);
  if (filters.risk) params.set("risk", filters.risk);
  if (filters.stage) params.set("stage", filters.stage);
  if (filters.fundingType) params.set("fundingType", filters.fundingType);
  if (filters.sort) params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function OpportunitiesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations("opportunities");
  const filters = parseFilters(searchParams);
  const [result, countries, sectors] = await Promise.all([
    getLiveProjects(filters),
    getCountries(),
    getSectors(),
  ]);
  const options = liveProjectFilterOptions();

  return (
    <div className="page py-12">
      <div className="mb-8">
        <h1 className="h1">{t("title")}</h1>
        <p className="lead mt-2 max-w-[640px]">{t("subtitle")}</p>
      </div>

      <OpportunityFilters
        countries={countries}
        sectors={sectors}
        stages={options.stages}
        fundingTypes={options.fundingTypes}
        filters={filters}
      />

      {result.items.length === 0 ? (
        <p className="mt-10 text-[var(--text-muted)]">{t("empty")}</p>
      ) : (
        <>
          <p className="mt-6 text-[var(--text-sm)] text-[var(--text-muted)]">
            {t("showing", {
              from: (result.page - 1) * result.pageSize + 1,
              to: Math.min(result.page * result.pageSize, result.total),
              total: result.total,
            })}
          </p>
          <div className="card-grid-3 mt-6">
            {result.items.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>

          {result.totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                {result.page > 1 && (
                  <PaginationItem>
                    <BrandedButton asChild variant="outline" size="sm">
                      <Link
                        href={`/opportunities${buildQuery(filters, result.page - 1)}`}
                      >
                        Previous
                      </Link>
                    </BrandedButton>
                  </PaginationItem>
                )}
                {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <BrandedButton
                        asChild
                        variant={page === result.page ? "default" : "ghost"}
                        size="sm"
                      >
                        <Link href={`/opportunities${buildQuery(filters, page)}`}>
                          {page}
                        </Link>
                      </BrandedButton>
                    </PaginationItem>
                  ),
                )}
                {result.page < result.totalPages && (
                  <PaginationItem>
                    <BrandedButton asChild variant="outline" size="sm">
                      <Link
                        href={`/opportunities${buildQuery(filters, result.page + 1)}`}
                      >
                        Next
                      </Link>
                    </BrandedButton>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

export default async function OpportunitiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense
      fallback={
        <div className="page py-12">
          <Skeleton className="mb-4 h-10 w-64" />
          <Skeleton className="mb-8 h-24 w-full" />
          <div className="card-grid-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-[var(--radius-base)]" />
            ))}
          </div>
        </div>
      }
    >
      <OpportunitiesContent searchParams={await searchParams} />
    </Suspense>
  );
}
