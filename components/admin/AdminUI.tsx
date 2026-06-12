"use client";

import { Download, Loader2, Search, type LucideIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ds";
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
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-[var(--ink)]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------ stat card ------------------------------- */

const TONES: Record<string, string> = {
  default: "bg-[var(--bg-section)] text-[var(--text-muted)]",
  pending: "bg-[var(--p-warning-bg)] text-[var(--p-warning)]",
  approved: "bg-[var(--p-success-bg)] text-[var(--p-success)]",
  danger: "bg-[var(--p-danger-bg)] text-[var(--p-danger)]",
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
    <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--surface-card)] p-4">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-[var(--radius-icon)]", TONES[tone])}>
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="text-2xl font-bold leading-tight text-[var(--ink)]">{value}</div>
        <div className="truncate text-xs text-[var(--text-muted)]">{label}</div>
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
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] py-2 pl-9 pr-3 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]"
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
        "grid size-8 place-items-center rounded-[var(--radius-md)] border transition-colors disabled:opacity-50",
        variant === "approve" &&
          "border-[var(--accent-border-strong)] text-[var(--accent)] hover:bg-[var(--accent-tint-08)]",
        variant === "reject" &&
          "border-[var(--ink-border-strong)] text-[var(--ink)] hover:bg-[var(--ink-hover-tint)]",
        variant === "default" &&
          "border-[var(--accent-border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
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
    <Button variant="outline" size="sm" disabled={loading} onClick={download} className="gap-1.5">
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Download className="size-4" aria-hidden />
      )}
      {t("exportCsv")}
    </Button>
  );
}
