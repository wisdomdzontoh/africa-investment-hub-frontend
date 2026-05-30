"use client";

import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { BrandedButton } from "@/components/brand/Button";
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
  triggerIcon: LucideIcon;
  triggerTitle: string;
};

/** Reject action with a reason captured in a modal (reason is logged + emailed). */
export function RejectDialog({ onConfirm, pending, triggerIcon, triggerTitle }: Props) {
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
      <RowActionButton
        icon={triggerIcon}
        title={triggerTitle}
        variant="reject"
        disabled={pending}
        onClick={() => setOpen(true)}
      />
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
          className="w-full rounded-[var(--radius-base)] border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
        <DialogFooter>
          <DialogClose asChild>
            <BrandedButton size="sm" variant="ghost">
              {t("cancel")}
            </BrandedButton>
          </DialogClose>
          <BrandedButton
            size="sm"
            loading={pending}
            onClick={confirm}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {t("confirmReject")}
          </BrandedButton>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
