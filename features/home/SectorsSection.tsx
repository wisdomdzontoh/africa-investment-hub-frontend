"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, SectionLabel } from "@/components/ds";
import { SectorGlyph } from "@/components/common/SectorGlyph";
import { SECTORS } from "@/lib/data/sectors";

// Six featured sectors — an even 2×3 grid on desktop. Every other sector
// remains reachable through the all-sectors chip row below.
const FEATURED = ["renewable", "realestate", "agriculture", "mining", "infrastructure", "technology"] as const;

const SECTOR_NAME = Object.fromEntries(SECTORS.map((s) => [s.id, s.name]));

const SECTOR_IMG: Record<(typeof FEATURED)[number], string> = {
  renewable: "/media/solar-energy.webp",
  realestate: "/media/skyline-nairobi.webp",
  agriculture: "/media/agriculture.webp",
  mining: "/media/mining.webp",
  infrastructure: "/media/port-logistics.webp",
  technology: "/media/business-team.webp",
};

export function SectorsSection() {
  const t = useTranslations("home.sectors");

  return (
    <section className="bg-[var(--bg-section)] py-[clamp(3rem,7vw,7.5rem)]">
      <div className="page">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>{t("eyebrow")}</SectionLabel>
            <h2 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-xl text-[var(--text-body)]">{t("lead")}</p>
          </div>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] no-underline hover:underline"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((id) => (
            <Link
              key={id}
              href={`/opportunities?sector=${id}`}
              className="group block no-underline"
            >
              <Card padding="0" hoverLift className="overflow-hidden">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={SECTOR_IMG[id]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[ease] group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, color-mix(in srgb, var(--ink) 88%, transparent) 0%, color-mix(in srgb, var(--ink) 32%, transparent) 55%, transparent 100%)",
                    }}
                  />
                  <div className="absolute inset-x-4 bottom-4 flex items-center gap-2.5">
                    <SectorGlyph id={id} size={38} />
                    <h3 className="text-lg font-semibold text-white">
                      {SECTOR_NAME[id]}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="m-0 text-sm text-[var(--text-body)]">
                    {t(`featured.${id}`)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
                    {t("exploreSector")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {t("allSectors")}
            </span>
            <span className="h-px flex-1 bg-[var(--accent-border)]" aria-hidden />
          </div>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => (
              <Link key={s.id} href={`/opportunities?sector=${s.id}`} className="no-underline">
                <Card
                  padding="12px 16px"
                  hoverLift
                  className="inline-flex items-center gap-2"
                >
                  <SectorGlyph id={s.id} size={28} />
                  <span className="text-sm font-semibold text-[var(--ink)]">{s.name}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
