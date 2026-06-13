"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { ApproveProjectDialog } from "@/components/admin/ApproveProjectDialog";
import { DetailGrid, DetailSection, DocumentList, Field } from "@/components/admin/DetailView";
import { RejectDialog } from "@/components/admin/RejectDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ds";
import { Link } from "@/i18n/navigation";
import {
  useAdminProject,
  useDocumentDownloader,
  useRunRiskAssessment,
  useSetProjectStatus,
  type ProjectAction,
} from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { displayMoney } from "@/lib/onboarding/format";

export default function AdminProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const t = useTranslations("adminPortal");
  const locale = useLocale();
  const { data: p, isLoading, isError } = useAdminProject(id);
  const setStatus = useSetProjectStatus();
  const runRisk = useRunRiskAssessment(id);
  const getDocUrl = useDocumentDownloader();

  async function act(action: ProjectAction, reason?: string, riskLevel?: string) {
    try {
      await setStatus.mutateAsync({ id, action, reason, risk_level: riskLevel });
      toast.success(t(action === "approve" ? "approved" : "rejected"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  async function assessRisk() {
    try {
      await runRisk.mutateAsync();
      toast.success(t("riskAssessed"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  if (isLoading) return <p className="text-muted-foreground">{t("loading")}</p>;
  if (isError || !p) return <p className="text-muted-foreground">{t("notFound")}</p>;

  const roi =
    p.expected_roi_min || p.expected_roi_max
      ? `${p.expected_roi_min ?? "—"}% – ${p.expected_roi_max ?? "—"}%`
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/admin/projects"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> {t("backToList")}
      </Link>

      <AdminPageHeader
        title={p.title}
        subtitle={`${p.sector} · ${p.country.toUpperCase()} · ${t("submitted")} ${new Date(p.created_at).toLocaleDateString(locale, { dateStyle: "medium" })}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={p.status} label={t(`filter.${p.status}`)} />
            {p.status === "pending" && (
              <>
                <RejectDialog
                  triggerLabel={t("reject")}
                  pending={setStatus.isPending}
                  onConfirm={(reason) => act("reject", reason)}
                />
                <ApproveProjectDialog
                  triggerLabel={t("approve")}
                  pending={setStatus.isPending}
                  onConfirm={(risk) => act("approve", undefined, risk)}
                />
              </>
            )}
          </div>
        }
      />

      <DetailSection title={t("secOverview")}>
        <DetailGrid>
          <Field label={t("fTitle")} value={p.title} />
          <Field label={t("fSector")} value={<span className="capitalize">{p.sector}</span>} />
          <Field label={t("fCountry")} value={p.country.toUpperCase()} />
          <Field label={t("fStage")} value={<span className="capitalize">{p.project_stage.replace(/_/g, " ")}</span>} />
          <Field label={t("fBrief")} value={p.brief_description} full />
          <Field label={t("fExecSummary")} value={p.executive_summary} full />
          <Field label={t("fFullDescription")} value={p.full_description} full />
        </DetailGrid>
      </DetailSection>

      <DetailSection title={t("secFunding")}>
        <DetailGrid>
          <Field label={t("fFundingRequired")} value={displayMoney(p.funding_required)} />
          <Field label={t("fFundingType")} value={<span className="capitalize">{p.funding_type}</span>} />
          <Field label={t("fMinInvestment")} value={displayMoney(p.min_investment)} />
          <Field label={t("fExistingFunding")} value={displayMoney(p.existing_funding)} />
          <Field label={t("fUseOfFunds")} value={p.use_of_funds} full />
        </DetailGrid>
      </DetailSection>

      <DetailSection title={t("secFinancials")}>
        <DetailGrid>
          <Field label={t("fRoi")} value={roi} />
          <Field
            label={t("fTimeline")}
            value={p.timeline_to_returns_months ? `${p.timeline_to_returns_months} mo` : undefined}
          />
          <Field label={t("fCurrentRevenue")} value={displayMoney(p.current_annual_revenue)} />
          <Field label={t("fRev12")} value={displayMoney(p.projected_revenue_12m)} />
          <Field label={t("fRev24")} value={displayMoney(p.projected_revenue_24m)} />
          <Field label={t("fRev36")} value={displayMoney(p.projected_revenue_36m)} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title={t("secRiskNotes")}>
        <DetailGrid>
          <Field
            label={t("fRiskLevel")}
            value={p.risk_level ? <span className="capitalize">{p.risk_level}</span> : undefined}
          />
        </DetailGrid>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={runRisk.isPending}
            onClick={assessRisk}
            className="gap-1.5"
          >
            <Sparkles className="size-3.5" aria-hidden />
            {runRisk.isPending ? t("riskAssessing") : t("runRiskAssessment")}
          </Button>
          <span className="text-xs text-[var(--text-muted)]">{t("riskAdvisoryNote")}</span>
        </div>
        {p.admin_notes ? (
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-[var(--radius-md)] border border-border bg-background p-3 font-mono text-xs leading-relaxed text-[var(--text-body)]">
            {p.admin_notes}
          </pre>
        ) : null}
      </DetailSection>

      <DetailSection title={t("secDocuments")}>
        <DocumentList
          documents={p.documents}
          emptyLabel={t("noDocuments")}
          onDownload={(key) => getDocUrl(`/projects/${id}/documents`, key)}
        />
      </DetailSection>
    </div>
  );
}
