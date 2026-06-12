"use client";

import { ArrowLeft, FileText, Pencil, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, Card } from "@/components/ds";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Link } from "@/i18n/navigation";
import { PortalPage, StatusPill } from "@/components/portal";
import {
  useDeleteProjectDocument,
  useMyProject,
  useUploadProjectDocuments,
} from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { fmtMoney } from "@/lib/format";
import { getCountry } from "@/lib/data/countries";
import { getSector } from "@/lib/data/sectors";
import type { Document } from "@/types/api";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const DOC_TYPES = ["business_plan", "financial_model", "pitch_deck", "additional"] as const;

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[var(--ink)]">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-36 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
        />
      ))}
    </div>
  );
}

export default function ProjectDetailPage() {
  const t = useTranslations("facilitatorPortal");
  const params = useParams<{ id: string }>();
  const { data: project, isLoading, isError, refetch } = useMyProject(params.id);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !project) {
    return (
      <ErrorState
        title={t("notFound")}
        description={t("notFoundDesc")}
        onRetry={() => refetch()}
        action={
          <Button href="/facilitator/projects" variant="outline" size="sm">
            {t("backToProjects")}
          </Button>
        }
      />
    );
  }

  const stageKey = `stageOptions.${project.project_stage}`;
  const fundingKey = `fundingOptions.${project.funding_type}`;
  const roi =
    project.expected_roi_min || project.expected_roi_max
      ? `${project.expected_roi_min ?? "—"}% – ${project.expected_roi_max ?? "—"}%`
      : null;

  return (
    <PortalPage
      title={project.title}
      actions={
        <div className="flex items-center gap-2.5">
          <StatusPill status={project.status} />
          <Button
            href={`/facilitator/projects/${project.id}/edit`}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Pencil className="size-3.5" aria-hidden />
            {t("editProject")}
          </Button>
        </div>
      }
    >
      <Link
        href="/facilitator/projects"
        className="-mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] no-underline hover:underline"
      >
        <ArrowLeft size={15} aria-hidden />
        {t("backToProjects")}
      </Link>

      <Card hoverLift={false}>
        <dl className="grid gap-5 sm:grid-cols-3">
          <Fact label={t("sector")} value={getSector(project.sector).name} />
          <Fact
            label={t("country")}
            value={getCountry(project.country)?.name ?? project.country.toUpperCase()}
          />
          <Fact label={t("statusCol")} value={<StatusPill status={project.status} />} />
          <Fact label={t("stageLabel")} value={t(stageKey)} />
          <Fact label={t("fundingTypeLabel")} value={t(fundingKey)} />
          <Fact label={t("fundingRequired")} value={fmtMoney(Number(project.funding_required))} />
          {project.min_investment ? (
            <Fact label={t("minInvestment")} value={fmtMoney(Number(project.min_investment))} />
          ) : null}
          {roi ? <Fact label={t("expectedRoi")} value={roi} /> : null}
          {project.timeline_to_returns_months != null ? (
            <Fact
              label={t("timelineToReturns")}
              value={t("monthsValue", { months: project.timeline_to_returns_months })}
            />
          ) : null}
        </dl>
      </Card>

      <Card hoverLift={false}>
        <h2 className="mb-2 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
          {t("briefDescription")}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-body)]">
          {project.brief_description}
        </p>
        {project.executive_summary ? (
          <>
            <h3 className="mt-5 mb-2 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
              {t("executiveSummary")}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-body)]">
              {project.executive_summary}
            </p>
          </>
        ) : null}
        {project.use_of_funds ? (
          <>
            <h3 className="mt-5 mb-2 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
              {t("useOfFunds")}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-body)]">
              {project.use_of_funds}
            </p>
          </>
        ) : null}
      </Card>

      <DocumentsCard projectId={project.id} documents={project.documents} />
    </PortalPage>
  );
}

function DocumentsCard({ projectId, documents }: { projectId: string; documents: Document[] }) {
  const t = useTranslations("facilitatorPortal");
  const qc = useQueryClient();
  const upload = useUploadProjectDocuments();
  const deleteDoc = useDeleteProjectDocument();
  const fileRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<string>("business_plan");
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Document | null>(null);

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(t("docs.typeError"));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error(t("docs.sizeError"));
      return;
    }
    setUploading(true);
    try {
      await upload(projectId, [{ docType, file }]);
      await qc.invalidateQueries({ queryKey: ["projects", "mine", projectId] });
      toast.success(t("docs.uploaded"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("docs.uploadError"));
    } finally {
      setUploading(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteDoc.mutateAsync({ projectId, r2Key: pendingDelete.r2_key });
      toast.success(t("docs.deleted"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("docs.deleteError"));
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <Card hoverLift={false}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
          {t("docs.title")}
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="doc-type" className="sr-only">
            {t("docs.typeLabel")}
          </label>
          <select
            id="doc-type"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            disabled={uploading}
            className="rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-2.5 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]"
          >
            {DOC_TYPES.map((d) => (
              <option key={d} value={d}>
                {t(`docs.types.${d}`)}
              </option>
            ))}
          </select>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={onFileSelected}
          />
          <Button
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="gap-1.5"
          >
            <Upload className="size-3.5" aria-hidden />
            {uploading ? t("docs.uploading") : t("docs.upload")}
          </Button>
        </div>
      </div>
      <p className="mb-4 text-xs text-[var(--text-muted)]">{t("docs.hint")}</p>

      {documents.length === 0 ? (
        <EmptyState
          compact
          icon={FileText}
          title={t("docs.emptyTitle")}
          description={t("docs.emptyBody")}
        />
      ) : (
        <ul className="divide-y divide-[var(--accent-border)]">
          {documents.map((doc) => (
            <li key={doc.r2_key} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-08)] text-[var(--accent)]">
                  <FileText className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--ink)]">{doc.filename}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {DOC_TYPES.includes(doc.type as (typeof DOC_TYPES)[number])
                      ? t(`docs.types.${doc.type}`)
                      : doc.type.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingDelete(doc)}
                disabled={deleteDoc.isPending}
                aria-label={t("docs.delete")}
                title={t("docs.delete")}
                className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--p-danger)] hover:text-[var(--p-danger)] disabled:opacity-50"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("docs.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("docs.deleteBody", { filename: pendingDelete?.filename ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("docs.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteDoc.isPending}>
              {t("docs.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
