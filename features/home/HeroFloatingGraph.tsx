"use client";

import { Check, FileText, MapPin, Ruler } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useIsDesktop } from "@/hooks/use-desktop";
import { Chip } from "@/components/ds";

/**
 * Decorative pipeline graph for the hero: 8 nodes standing for real steps in
 * the deal pipeline (intake → verification → matching → NDA → due diligence
 * → monitoring), joined by an orthogonal SVG connector graph. Every node and
 * every connector endpoint shares one 0–100 percentage coordinate space, so
 * the two layers (HTML nodes, SVG paths) stay aligned at any width between
 * 1024–1920px without hardcoded pixel offsets.
 */

type NodeId = "brief" | "avatarsTop" | "landTitle" | "verified" | "nda" | "fieldTeam" | "surveyor" | "diligence";

const POS: Record<NodeId, { x: number; y: number }> = {
  brief: { x: 6, y: 10 },
  avatarsTop: { x: 50, y: 4 },
  landTitle: { x: 92, y: 14 },
  verified: { x: 95, y: 34 },
  nda: { x: 93, y: 56 },
  fieldTeam: { x: 88, y: 78 },
  surveyor: { x: 50, y: 96 },
  diligence: { x: 7, y: 82 },
};

// Order doubles as the mount stagger order (top-left → top-centre → top-right
// → down the right edge → bottom-right → bottom-centre → bottom-left).
const NODE_ORDER: NodeId[] = [
  "brief",
  "avatarsTop",
  "landTitle",
  "verified",
  "nda",
  "fieldTeam",
  "surveyor",
  "diligence",
];

type Connector = {
  path: string;
  accent?: boolean;
};

const CONNECTORS: Connector[] = [
  // intake → matched into the advisor/consultant cluster (accent — the hot path)
  { path: "M6,13 L6,4 L47,4", accent: true },
  // cluster → routed to land-title verification (accent — the hot path)
  { path: "M53,4 L92,4 L92,11", accent: true },
  // land-title check → confirmed on site
  { path: "M92,17 L95,17 L95,31" },
  // verified on site → NDA signed (accent — the hot handoff)
  { path: "M95,37 L93,37 L93,53", accent: true },
  // NDA signed → field team
  { path: "M93,59 L88,59 L88,75" },
  // intake → due diligence, down the left margin
  { path: "M4,14 L4,79 L7,79" },
  // due diligence → quantity surveyor, along the bottom
  { path: "M10,85 L10,93 L47,93" },
  // quantity surveyor → field team
  { path: "M53,93 L85,93 L85,81" },
];

/** The dot always sits at the connector's terminal point — deriving it from
 *  the path string keeps the two in sync instead of duplicating coordinates. */
function endPoint(path: string): { x: number; y: number } {
  const matches = [...path.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)];
  const [, x, y] = matches[matches.length - 1];
  return { x: Number(x), y: Number(y) };
}

// Illustrated (not photographic) placeholder avatars — generated, not photos
// of real people, so the graph never implies specific real individuals are
// platform staff or investors. Downloaded once into /public/avatars.
function GenericAvatar({ src, size = 28 }: { src: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 overflow-hidden rounded-full border-2 border-[var(--bg-page)] bg-[var(--accent-tint-08)]"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt="" width={size} height={size} className="size-full object-cover" />
    </span>
  );
}

function Card({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "flex items-center gap-2.5 rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--surface-card)] px-3.5 py-2.5 shadow-[var(--shadow-card-hover)] " +
        (className ?? "")
      }
      style={style}
    >
      {children}
    </div>
  );
}

export function HeroFloatingGraph() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const t = useTranslations("home.hero.nodes");

  // Renders nothing (not just visually hidden) below 1024px and on the
  // server, so mobile pays zero DOM/paint/animation cost for this layer.
  if (!isDesktop) return null;

  const nodeVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" as const, delay: i * 0.06 },
    }),
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        {CONNECTORS.map((c, i) => (
          <motion.path
            key={c.path}
            d={c.path}
            fill="none"
            stroke={c.accent ? "var(--accent)" : "var(--ink-border)"}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: reduced ? 0 : 0.15 + i * 0.04 }}
          />
        ))}
      </svg>

      {CONNECTORS.map((c) => {
        const dot = endPoint(c.path);
        return (
          <motion.span
            key={c.path}
            className="absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              background: c.accent ? "var(--accent)" : "var(--ink-border-strong)",
            }}
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: reduced ? 0 : 0.6 }}
          />
        );
      })}

      {NODE_ORDER.map((id, i) => {
        const pos = POS[id];
        return (
          <motion.div
            key={id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            custom={i}
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={nodeVariants}
          >
            {id === "brief" && (
              <div className="relative max-w-[190px]">
                <Card className="flex-col items-start gap-2">
                  <Chip active className="text-[10px]">
                    {t("brief.tag")}
                  </Chip>
                  <div className="flex items-center gap-2.5">
                    <span className="text-left text-[13px] font-semibold leading-snug text-[var(--ink)]">
                      {t("brief.text")}
                    </span>
                    <GenericAvatar src="/avatars/investor-brief.svg" size={26} />
                  </div>
                </Card>
                <span
                  aria-hidden
                  className="absolute -bottom-[6px] left-7 size-3 rotate-45 rounded-[2px] border-b border-r border-[var(--accent-border)] bg-[var(--surface-card)]"
                />
              </div>
            )}

            {id === "avatarsTop" && (
              <div className="flex items-center">
                <GenericAvatar src="/avatars/advisor-a.svg" size={30} />
                <div className="-ml-2">
                  <GenericAvatar src="/avatars/advisor-b.svg" size={30} />
                </div>
                <div className="-ml-2">
                  <GenericAvatar src="/avatars/advisor-c.svg" size={30} />
                </div>
              </div>
            )}

            {id === "landTitle" && (
              <Card className="flex-col items-start gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-section)] text-[var(--text-muted)]">
                    <MapPin size={13} aria-hidden />
                  </span>
                  <Chip className="text-[10px]">{t("landTitle.tag")}</Chip>
                </div>
                <span className="pl-8 text-xs text-[var(--text-muted)]">
                  {t("landTitle.sub")}
                </span>
              </Card>
            )}

            {id === "verified" && (
              <Card>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                  <Check size={13} aria-hidden />
                </span>
                <span className="whitespace-nowrap text-[13px] font-semibold text-[var(--ink)]">
                  {t("verified")}
                </span>
              </Card>
            )}

            {id === "nda" && (
              <Card>
                <GenericAvatar src="/avatars/nda-signer.svg" size={24} />
                <span className="whitespace-nowrap text-[13px] font-semibold text-[var(--ink)]">
                  {t("nda")}
                </span>
              </Card>
            )}

            {id === "fieldTeam" && (
              <div className="flex items-center">
                <GenericAvatar src="/avatars/field-a.svg" size={28} />
                <div className="-ml-2">
                  <GenericAvatar src="/avatars/field-b.svg" size={28} />
                </div>
              </div>
            )}

            {id === "surveyor" && (
              <Card>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-section)] text-[var(--text-muted)]">
                  <Ruler size={13} aria-hidden />
                </span>
                <Chip className="text-[10px]">{t("surveyor.tag")}</Chip>
              </Card>
            )}

            {id === "diligence" && (
              <Card>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-tint-08)] text-[var(--accent)]">
                  <FileText size={13} aria-hidden />
                </span>
                <span className="whitespace-nowrap text-[13px] font-semibold text-[var(--ink)]">
                  {t("diligence")}
                </span>
              </Card>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
