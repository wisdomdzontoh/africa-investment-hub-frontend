"use client";

import { Bookmark, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandedBadge } from "@/components/brand/Badge";
import { BrandedCard } from "@/components/brand/Card";
import { Flag } from "@/components/common/Flag";
import { RiskBadge } from "@/components/common/RiskBadge";
import { SectorBadge, SectorGlyph } from "@/components/common/SectorGlyph";
import { fmtMoney } from "@/lib/format";
import { getCountry } from "@/lib/data/countries";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

type ProjectCardProps = {
  project: Project;
  saved?: boolean;
  onSave?: () => void;
  className?: string;
};

export function ProjectCard({
  project: p,
  saved,
  onSave,
  className,
}: ProjectCardProps) {
  const tc = useTranslations("common");
  const country = getCountry(p.countryCode);

  const stats = [
    { label: tc("funding"), value: fmtMoney(p.funding) },
    { label: tc("roi"), value: `${p.roiMin}–${p.roiMax}%` },
    { label: tc("timeline"), value: p.timeline },
  ];

  return (
    <Link
      href={`/opportunities/${p.id}`}
      className={cn("group block h-full no-underline", className)}
    >
      <BrandedCard hover className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4 pb-0">
          <SectorGlyph id={p.sectorId} size={44} />
          <div className="flex items-center gap-1.5">
            {p.featured && (
              <BrandedBadge tone="featured" icon="star">
                {tc("featured")}
              </BrandedBadge>
            )}
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-[var(--radius-base)] text-[var(--text-muted)] transition-colors hover:bg-muted hover:text-[var(--accent)]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave?.();
              }}
              aria-label="Save opportunity"
            >
              <Bookmark
                size={16}
                style={{
                  color: saved ? "var(--accent)" : undefined,
                  fill: saved ? "var(--accent)" : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-4 pt-3">
          <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <Flag code={p.countryCode} />
              <span className="text-[var(--text-xs)] font-semibold text-[var(--text-muted)]">
                {country?.name}
              </span>
            </span>
            <SectorBadge id={p.sectorId} />
          </div>
          <h3 className="h4 mb-1.5 line-clamp-2 leading-snug transition-colors group-hover:text-[var(--accent)]">
            {p.title}
          </h3>
          <p className="m-0 line-clamp-3 text-[var(--text-sm)] leading-normal text-[var(--text-muted)]">
            {p.summary}
          </p>
        </div>

        {/* Stats band */}
        <div className="mt-4 grid grid-cols-3 border-t border-border bg-[var(--surface-sunken)]">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "px-4 py-3",
                i > 0 && "border-l border-border",
              )}
            >
              <div className="label-caps">{s.label}</div>
              <div className="mt-0.5 font-mono text-[var(--text-sm)] font-bold text-[var(--text-strong)]">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <RiskBadge level={p.risk} />
          <span className="flex items-center gap-1 text-[var(--text-xs)] text-[var(--text-muted)]">
            <Eye size={13} aria-hidden />
            {p.views.toLocaleString()}
          </span>
        </div>
      </BrandedCard>
    </Link>
  );
}
