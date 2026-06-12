"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ds";
import { Link, useRouter } from "@/i18n/navigation";
import { type Column, DataTable, PortalPage, StatusPill } from "@/components/portal";
import { useMyProjects } from "@/lib/api/hooks";
import { getCountry } from "@/lib/data/countries";
import { getSector } from "@/lib/data/sectors";
import type { FacilitatorProject } from "@/types/api";

export default function FacilitatorProjectsPage() {
  const t = useTranslations("facilitatorPortal");
  const router = useRouter();
  const { data: projects, isLoading } = useMyProjects();

  const columns: Column<FacilitatorProject>[] = [
    {
      key: "title",
      header: t("titleField"),
      render: (p) => <span className="font-medium text-[var(--ink)]">{p.title}</span>,
    },
    {
      key: "sector",
      header: t("sector"),
      hideOnMobile: true,
      render: (p) => getSector(p.sector).name,
    },
    {
      key: "country",
      header: t("country"),
      hideOnMobile: true,
      render: (p) => getCountry(p.country)?.name ?? p.country.toUpperCase(),
    },
    { key: "status", header: t("statusCol"), render: (p) => <StatusPill status={p.status} /> },
    {
      key: "created_at",
      header: t("submittedCol"),
      align: "right",
      hideOnMobile: true,
      render: (p) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {new Date(p.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <PortalPage
      title={t("projects")}
      description={t("projectsDesc")}
      actions={
        <Button href="/facilitator/projects/new" size="sm" className="gap-1.5">
          <Plus size={16} aria-hidden />
          {t("newProject")}
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={projects ?? []}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        onRowClick={(p) => router.push(`/facilitator/projects/${p.id}`)}
        empty={
          <span className="text-sm text-[var(--text-muted)]">
            {t("noProjects")}{" "}
            <Link href="/facilitator/projects/new" className="font-semibold text-[var(--accent)]">
              {t("createFirst")}
            </Link>
          </span>
        }
      />
    </PortalPage>
  );
}
