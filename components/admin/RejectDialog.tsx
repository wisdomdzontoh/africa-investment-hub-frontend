"use client";

import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ds";
import { RowActionButton } from "@/components/admin/AdminUI";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  /** Called with the (optional) reason when the admin confirms rejection. */
  onConfirm: (reason: string) => void | Promise<void>;
  pending?: boolean;
  /** Icon trigger (table rows). */
  triggerIcon?: LucideIcon;
  triggerTitle?: string;
  /** Full-button trigger (detail pages). Takes precedence when set. */
  triggerLabel?: string;
};

/** Reject action with a reason captured in a modal (reason is logged + emailed). */
export function RejectDialog({
  onConfirm,
  pending,
  triggerIcon,
  triggerTitle,
  triggerLabel,
}: Props) {
  const t = useTranslations("adminPortal");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const confirm = async () => {
    await onConfirm(reason.trim());
    setOpen(false);
    setReason("");
  };

  return (
    <>
      {triggerLabel ? (
        <Button
          variant="outline"
          disabled={pending}
          onClick={() => setOpen(true)}
          className="border-[var(--ink-border-strong)] text-[var(--ink)] hover:bg-[var(--ink-hover-tint)]"
        >
          {triggerLabel}
        </Button>
      ) : (
        triggerIcon && (
          <RowActionButton
            icon={triggerIcon}
            title={triggerTitle ?? ""}
            variant="reject"
            disabled={pending}
            onClick={() => setOpen(true)}
          />
        )
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("rejectTitle")}</DialogTitle>
          <DialogDescription>{t("rejectDescription")}</DialogDescription>
        </DialogHeader>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder={t("rejectReasonPlaceholder")}
          className="w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="outline">
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button size="sm" variant="dark" disabled={pending} onClick={confirm}>
            {t("confirmReject")}
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
