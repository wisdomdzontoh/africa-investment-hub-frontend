"use client";

import { EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Flag } from "@/components/common/Flag";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { DataTable, PortalPage, StatusPill, type Column } from "@/components/portal";
import {
  useFacilitatorMatches,
  type FacilitatorMatch,
} from "@/lib/api/hooks";
import { WORLD_COUNTRIES } from "@/lib/data/world-countries";

function investorCountryName(code: string | null): string | null {
  if (!code) return null;
  return WORLD_COUNTRIES.find((c) => c.code === code.toLowerCase())?.name ?? code.toUpperCase();
}

export default function FacilitatorInterestPage() {
  const t = useTranslations("facilitatorPortal");
  const locale = useLocale();
  const { data, isLoading, isError, refetch } = useFacilitatorMatches();

  const columns: Column<FacilitatorMatch>[] = [
    {
      key: "investor",
      header: t("colInvestor"),
      render: (m) =>
        m.investor ? (
          <span className="inline-flex min-w-0 items-center gap-2">
            {m.investor.country_of_registration ? (
              <Flag code={m.investor.country_of_registration.toLowerCase()} />
            ) : null}
            <span className="min-w-0">
              <span className="block truncate font-medium text-[var(--ink)]">
                {m.investor.company_name ?? t("confidentialInvestor")}
              </span>
              {m.investor.country_of_registration ? (
                <span className="block text-xs text-[var(--text-muted)]">
                  {investorCountryName(m.investor.country_of_registration)}
                </span>
              ) : null}
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-[var(--text-muted)]">
            <EyeOff className="size-4" aria-hidden />
            {t("confidentialInvestor")}
          </span>
        ),
    },
    {
      key: "project",
      header: t("colProject"),
      render: (m) => <span className="line-clamp-1">{m.project_title}</span>,
      className: "text-[var(--text-body)]",
    },
    {
      key: "stage",
      header: t("colStage"),
      render: (m) => <StatusPill status={m.status} />,
    },
    {
      key: "date",
      header: t("colDate"),
      hideOnMobile: true,
      render: (m) =>
        new Date(m.investor_interest_at ?? m.created_at).toLocaleDateString(locale, {
          dateStyle: "medium",
        }),
      className: "whitespace-nowrap text-[var(--text-muted)]",
    },
  ];

  return (
    <PortalPage title={t("interest")} description={t("interestDesc")}>
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          rows={data?.items ?? []}
          rowKey={(m) => m.id}
          isLoading={isLoading}
          empty={<EmptyState compact title={t("interestEmpty")} description={t("interestEmptyHint")} />}
        />
      )}
    </PortalPage>
  );
}
