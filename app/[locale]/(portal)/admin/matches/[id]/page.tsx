"use client";

import { ArrowLeft, FileText } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { DetailGrid, DetailSection, Field } from "@/components/admin/DetailView";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ds";
import { ErrorState } from "@/components/common/ErrorState";
import { Link } from "@/i18n/navigation";
import { DueDiligenceSection, MilestonesSection } from "@/components/portal";
import { useDealRoom } from "@/lib/api/hooks";
import { API_BASE_URL } from "@/lib/api/client";
import { displayMoney } from "@/lib/onboarding/format";

function humanize(s: string) {
  const v = s.replace(/_/g, " ");
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export default function AdminMatchDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const t = useTranslations("adminPortal");
  const { data, isLoading, isError, refetch } = useDealRoom(id);

  if (isLoading) {
    return (
      <div
        className="h-96 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
        aria-busy="true"
      />
    );
  }
  if (isError || !data) {
    return (
      <div>
        <Link
          href="/admin/matches"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> {t("matchesNavTitle")}
        </Link>
        <ErrorState title={t("notFound")} onRetry={() => refetch()} />
      </div>
    );
  }

  const { match, project } = data;

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/admin/matches"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> {t("matchesNavTitle")}
      </Link>

      <AdminPageHeader
        title={project.title}
        subtitle={`${project.sector} · ${project.country.toUpperCase()}`}
        action={<StatusBadge status={match.status} label={humanize(match.status)} />}
      />

      <DetailSection title={t("matchSecOverview")}>
        <DetailGrid>
          <Field
            label={t("matchScoreCol")}
            value={match.score != null ? `${Math.round(match.score * 100)}%` : undefined}
          />
          <Field label={t("fFundingRequired")} value={displayMoney(project.funding_required)} />
          <Field
            label={t("matchConfidential")}
            value={match.is_confidential ? t("matchConfidentialYes") : t("matchConfidentialNo")}
          />
        </DetailGrid>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`${API_BASE_URL}/v1/matches/${match.id}/nda.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--ink-border)] px-3 py-1.5 text-sm font-medium text-[var(--ink)] no-underline transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <FileText className="size-3.5" aria-hidden />
            {t("matchNdaPdf")}
          </a>
          <Button href={`/admin/projects/${project.id}`} variant="outline" size="sm">
            {t("matchViewProject")}
          </Button>
        </div>
      </DetailSection>

      <DueDiligenceSection matchId={match.id} canSignOff />
      <MilestonesSection projectId={project.id} />
    </div>
  );
}
