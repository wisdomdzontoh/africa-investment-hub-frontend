"use client";

import { Download, Search, type LucideIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { BrandedButton } from "@/components/brand/Button";
import { API_BASE_URL } from "@/lib/api/client";
import { cn } from "@/lib/utils";

/* ----------------------------- page header ------------------------------ */

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-strong)]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------ stat card ------------------------------- */

const TONES: Record<string, string> = {
  default: "bg-muted text-muted-foreground",
  pending:
    "bg-[color-mix(in_srgb,var(--warning)_15%,transparent)] text-[var(--orange-deep)]",
  approved:
    "bg-[color-mix(in_srgb,var(--green-600)_15%,transparent)] text-[var(--green-700)]",
  danger: "bg-destructive/10 text-destructive",
};

export function StatCard({
  icon: Icon,
  value,
  label,
  tone = "default",
}: {
  icon: LucideIcon;
  value: number | string;
  label: string;
  tone?: keyof typeof TONES | "default";
}) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-base)] border border-border bg-card p-4">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-[var(--radius-base)]", TONES[tone])}>
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="text-2xl font-semibold leading-tight text-foreground">{value}</div>
        <div className="truncate text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

/* ------------------------------- search --------------------------------- */

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative max-w-sm flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-base)] border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      />
    </div>
  );
}

/* ---------------------------- row action btn ---------------------------- */

export function RowActionButton({
  icon: Icon,
  title,
  onClick,
  disabled,
  variant = "default",
}: {
  icon: LucideIcon;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "approve" | "reject";
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-8 place-items-center rounded-[var(--radius-base)] border transition-colors disabled:opacity-50",
        variant === "approve" &&
          "border-[var(--green-600)]/40 text-[var(--green-700)] hover:bg-[color-mix(in_srgb,var(--green-600)_12%,transparent)]",
        variant === "reject" &&
          "border-destructive/40 text-destructive hover:bg-destructive/5",
        variant === "default" &&
          "border-border text-muted-foreground hover:border-[var(--green-600)]/50 hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}

/* ---------------------------- export CSV -------------------------------- */

export function ExportCsvButton({ path, filename }: { path: string; filename: string }) {
  const t = useTranslations("adminPortal");
  const { getToken } = useAuth();
  const template = process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE;
  const [loading, setLoading] = useState(false);

  async function download() {
    setLoading(true);
    try {
      const token = template ? await getToken({ template }) : await getToken();
      const res = await fetch(`${API_BASE_URL}/v1${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t("exportError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <BrandedButton variant="outline" size="sm" icon={Download} loading={loading} onClick={download}>
      {t("exportCsv")}
    </BrandedButton>
  );
}
