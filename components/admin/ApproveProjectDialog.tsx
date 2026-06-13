"use client";

import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ds";
import { RowActionButton } from "@/components/admin/AdminUI";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const RISK_LEVELS = ["low", "medium", "high"] as const;
type RiskLevel = (typeof RISK_LEVELS)[number];

type Props = {
  /** Called with the chosen risk level when the admin confirms approval. */
  onConfirm: (riskLevel: RiskLevel) => void | Promise<void>;
  pending?: boolean;
  triggerIcon?: LucideIcon;
  triggerTitle?: string;
  triggerLabel?: string;
};

/** Approving a project requires the admin to assign a risk level (the backend
 *  rejects approval without it). This modal makes that explicit. */
export function ApproveProjectDialog({
  onConfirm,
  pending,
  triggerIcon,
  triggerTitle,
  triggerLabel,
}: Props) {
  const t = useTranslations("adminPortal");
  const [open, setOpen] = useState(false);
  const [risk, setRisk] = useState<RiskLevel | null>(null);

  const confirm = async () => {
    if (!risk) return;
    await onConfirm(risk);
    setOpen(false);
    setRisk(null);
  };

  return (
    <>
      {triggerLabel ? (
        <Button disabled={pending} onClick={() => setOpen(true)}>
          {triggerLabel}
        </Button>
      ) : (
        triggerIcon && (
          <RowActionButton
            icon={triggerIcon}
            title={triggerTitle ?? ""}
            variant="approve"
            disabled={pending}
            onClick={() => setOpen(true)}
          />
        )
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("approveTitle")}</DialogTitle>
            <DialogDescription>{t("approveDescription")}</DialogDescription>
          </DialogHeader>
          <fieldset className="py-2">
            <legend className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
              {t("riskLevelLabel")}
            </legend>
            <div className="flex gap-2">
              {RISK_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRisk(level)}
                  aria-pressed={risk === level}
                  className={cn(
                    "flex-1 rounded-[var(--radius-md)] border px-3 py-2.5 text-sm font-medium capitalize transition-colors",
                    risk === level
                      ? "border-[var(--accent)] bg-[var(--accent-tint-08)] text-[var(--accent)]"
                      : "border-[var(--ink-border)] text-[var(--text-body)] hover:border-[var(--accent)]",
                  )}
                >
                  {t(`riskOptions.${level}`)}
                </button>
              ))}
            </div>
          </fieldset>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button size="sm" disabled={pending || !risk} onClick={confirm}>
              {t("confirmApprove")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
