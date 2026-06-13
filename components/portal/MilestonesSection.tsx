"use client";

import { CalendarClock, Flag, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
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
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { StatusPill } from "@/components/portal/StatusPill";
import {
  useCreateMilestone,
  useDeleteMilestone,
  useMilestones,
  useUpdateMilestone,
} from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import type { Milestone, MilestoneStatus } from "@/types/api";

const STATUSES: MilestoneStatus[] = ["pending", "in_progress", "completed", "overdue"];

const controlClass =
  "w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3 py-2 font-sans text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]";
const labelClass =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]";

export function MilestonesSection({
  projectId,
  canManage = false,
}: {
  projectId: string;
  canManage?: boolean;
}) {
  const t = useTranslations("facilitatorPortal");
  const { data, isLoading, isError, refetch } = useMilestones(projectId);
  const [adding, setAdding] = useState(false);

  return (
    <Card hoverLift={false}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
          {t("milestones.title")}
        </h2>
        {canManage ? (
          <Button size="sm" onClick={() => setAdding((v) => !v)} className="gap-1.5">
            <Plus className="size-3.5" aria-hidden />
            {t("milestones.add")}
          </Button>
        ) : null}
      </div>

      {canManage && adding ? (
        <AddMilestoneForm
          projectId={projectId}
          onDone={() => setAdding(false)}
        />
      ) : null}

      {isError ? (
        <ErrorState compact onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-[var(--radius-md)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
            />
          ))}
        </div>
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          compact
          icon={Flag}
          title={t("milestones.emptyTitle")}
          description={canManage ? t("milestones.emptyBody") : t("milestones.emptyViewer")}
        />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {data!.map((m) => (
            <MilestoneRow key={m.id} projectId={projectId} milestone={m} canManage={canManage} />
          ))}
        </ul>
      )}
    </Card>
  );
}

function AddMilestoneForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const t = useTranslations("facilitatorPortal");
  const create = useCreateMilestone(projectId);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<MilestoneStatus>("pending");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await create.mutateAsync({
        title: title.trim(),
        status,
        due_date: dueDate || null,
      });
      toast.success(t("milestones.added"));
      onDone();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("milestones.error"));
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mb-4 grid items-end gap-3 rounded-[var(--radius-md)] border border-[var(--accent-border)] bg-[var(--bg-section)] p-3 sm:grid-cols-[1fr_160px_140px_auto]"
    >
      <div>
        <label htmlFor="ms-title" className={labelClass}>
          {t("milestones.fieldTitle")}
        </label>
        <input
          id="ms-title"
          className={controlClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={255}
        />
      </div>
      <div>
        <label htmlFor="ms-due" className={labelClass}>
          {t("milestones.fieldDue")}
        </label>
        <input
          id="ms-due"
          type="date"
          className={controlClass}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="ms-status" className={labelClass}>
          {t("milestones.fieldStatus")}
        </label>
        <select
          id="ms-status"
          className={controlClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`milestones.status.${s}`)}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" size="sm" disabled={create.isPending || !title.trim()}>
        {create.isPending ? t("milestones.saving") : t("milestones.save")}
      </Button>
    </form>
  );
}

function MilestoneRow({
  projectId,
  milestone,
  canManage,
}: {
  projectId: string;
  milestone: Milestone;
  canManage: boolean;
}) {
  const t = useTranslations("facilitatorPortal");
  const locale = useLocale();
  const update = useUpdateMilestone(projectId);
  const remove = useDeleteMilestone(projectId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function changeStatus(status: MilestoneStatus) {
    try {
      await update.mutateAsync({ milestoneId: milestone.id, body: { status } });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("milestones.error"));
    }
  }

  async function doDelete() {
    try {
      await remove.mutateAsync(milestone.id);
      toast.success(t("milestones.deleted"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("milestones.error"));
    } finally {
      setConfirmDelete(false);
    }
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--accent-border)] p-3">
      <div className="min-w-0">
        <p className="font-medium text-[var(--ink)]">{milestone.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
          {milestone.due_date ? (
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3.5" aria-hidden />
              {new Date(milestone.due_date).toLocaleDateString(locale, { dateStyle: "medium" })}
            </span>
          ) : null}
          {milestone.description ? <span>{milestone.description}</span> : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {canManage ? (
          <select
            aria-label={t("milestones.fieldStatus")}
            value={milestone.status}
            disabled={update.isPending}
            onChange={(e) => changeStatus(e.target.value as MilestoneStatus)}
            className="rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-2 py-1.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`milestones.status.${s}`)}
              </option>
            ))}
          </select>
        ) : (
          <StatusPill status={milestone.status} label={t(`milestones.status.${milestone.status}`)} />
        )}
        {canManage ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={remove.isPending}
            aria-label={t("milestones.delete")}
            title={t("milestones.delete")}
            className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--p-danger)] hover:text-[var(--p-danger)] disabled:opacity-50"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("milestones.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("milestones.deleteBody", { title: milestone.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("milestones.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} disabled={remove.isPending}>
              {t("milestones.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
