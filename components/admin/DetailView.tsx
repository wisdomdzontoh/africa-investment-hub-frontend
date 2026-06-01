import { FileText } from "lucide-react";
import { BrandedCard } from "@/components/brand/Card";
import type { Document } from "@/types/api";

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <BrandedCard className="p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </BrandedCard>
  );
}

export function DetailGrid({ children }: { children: React.ReactNode }) {
  return <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">{children}</dl>;
}

export function Field({
  label,
  value,
  full,
}: {
  label: string;
  value?: React.ReactNode;
  full?: boolean;
}) {
  const empty = value === undefined || value === null || value === "";
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{empty ? "—" : value}</dd>
    </div>
  );
}

export function TagList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <span>—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <span
          key={it}
          className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs capitalize text-foreground"
        >
          {it}
        </span>
      ))}
    </div>
  );
}

export function DocumentList({ documents, emptyLabel }: { documents: Document[]; emptyLabel: string }) {
  if (!documents || documents.length === 0)
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  return (
    <ul className="flex flex-col gap-2">
      {documents.map((doc, i) => (
        <li
          key={doc.r2_key ?? i}
          className="flex items-center gap-2.5 rounded-[var(--radius-base)] border border-border bg-background px-3 py-2"
        >
          <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{doc.filename}</p>
            <p className="text-xs capitalize text-muted-foreground">{doc.type.replace(/_/g, " ")}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
