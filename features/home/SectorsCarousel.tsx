"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ds";
import { Flag } from "@/components/common/Flag";
import { SectorGlyph } from "@/components/common/SectorGlyph";
import { SECTORS } from "@/lib/data/sectors";
import { cn } from "@/lib/utils";

// Illustrative — a couple of representative countries and headline focus
// areas per sector, not a live data query. Decorative texture for the card,
// same spirit as the rest of the homepage's example content.
const SECTOR_EXTRA: Record<string, { countries: string[]; tags: string[] }> = {
  construction: { countries: ["ng", "ke"], tags: ["COMMERCIAL", "CIVIL WORKS"] },
  agriculture: { countries: ["gh", "et"], tags: ["CROPS", "AGRIPROCESSING"] },
  renewable: { countries: ["ma", "ke"], tags: ["SOLAR", "WIND", "HYDRO"] },
  farming: { countries: ["tz", "gh"], tags: ["SMALLHOLDER", "COMMERCIAL FARMS"] },
  infrastructure: { countries: ["eg", "ng"], tags: ["ROADS", "PORTS", "LOGISTICS"] },
  realestate: { countries: ["ke", "rw"], tags: ["RESIDENTIAL", "COMMERCIAL"] },
  manufacturing: { countries: ["eg", "za"], tags: ["LIGHT INDUSTRY", "AGRO-PROCESSING"] },
  technology: { countries: ["ke", "ng"], tags: ["FINTECH", "DIGITAL INFRA"] },
  tourism: { countries: ["tz", "ma"], tags: ["HOSPITALITY", "ECO-TOURISM"] },
  mining: { countries: ["cd", "zm"], tags: ["MINERALS", "METALS"] },
};

const CARD_WIDTH = 300;
const CARD_GAP = 20;

type SectorsCarouselProps = {
  activeInLabel: string;
  focusAreasLabel: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaLink: string;
  taglines: Record<string, string>;
};

export function SectorsCarousel({
  activeInLabel,
  focusAreasLabel,
  ctaTitle,
  ctaDesc,
  ctaLink,
  taglines,
}: SectorsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * (CARD_WIDTH + CARD_GAP), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label="Scroll sectors left"
          className="flex size-9 items-center justify-center rounded-full border border-[var(--ink-border)] text-[var(--ink)] transition-colors disabled:opacity-35 hover:not-disabled:border-[var(--accent-border-strong)] hover:not-disabled:text-[var(--accent)]"
        >
          <ArrowLeft size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label="Scroll sectors right"
          className="flex size-9 items-center justify-center rounded-full border border-[var(--ink-border)] bg-[var(--ink)] text-white transition-colors disabled:opacity-35 hover:not-disabled:bg-[var(--accent)]"
        >
          <ArrowRight size={16} aria-hidden />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SECTORS.map((s) => {
          const extra = SECTOR_EXTRA[s.id];
          return (
            <Link
              key={s.id}
              href={`/opportunities?sector=${s.id}`}
              className="shrink-0 snap-start no-underline"
              style={{ width: CARD_WIDTH }}
            >
              <Card hoverLift className="h-full" padding="24px">
                <SectorGlyph id={s.id} size={56} className="rounded-full" />
                <h3 className="mb-1.5 mt-4 text-lg font-semibold text-[var(--ink)]">{s.name}</h3>
                <p className="m-0 text-sm leading-relaxed text-[var(--text-body)]">
                  {taglines[s.id]}
                </p>

                <p className="mb-2 mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  {activeInLabel}
                </p>
                <div className="flex items-center gap-1.5">
                  {extra.countries.map((code) => (
                    <Flag key={code} code={code} />
                  ))}
                </div>

                <div className="my-4 h-px bg-[var(--accent-border)]" />

                <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  {focusAreasLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {extra.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[var(--radius-badge)] bg-[var(--bg-section)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--text-body)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          );
        })}

        <Link
          href="/opportunities"
          className={cn(
            "flex shrink-0 snap-start flex-col items-start justify-between rounded-[var(--radius-card)] p-6 no-underline",
            "border border-[var(--accent-border)] bg-[var(--surface-dark)]",
          )}
          style={{ width: CARD_WIDTH }}
        >
          <div>
            <h3 className="mb-1.5 text-lg font-semibold text-[var(--on-dark)]">{ctaTitle}</h3>
            <p className="m-0 text-sm leading-relaxed text-[var(--on-dark-65)]">{ctaDesc}</p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-bright)]">
            {ctaLink}
            <ArrowRight size={16} aria-hidden />
          </span>
        </Link>
      </div>
    </div>
  );
}
