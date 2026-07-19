"use client";

import { ArrowRight, Check, Clock3 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, Card } from "@/components/ds";
import { cn } from "@/lib/utils";
import styles from "./RoleScene.module.css";

type RoleVariant = "investor" | "project_owner";

const SCENES: Record<
  RoleVariant,
  {
    img: string;
    imgWidth: number;
    imgHeight: number;
    tagKey: string;
    titleKey: string;
    descKey: string;
    needKeys: [string, string, string];
    ctaKey: string;
  }
> = {
  investor: {
    img: "/illustrations/investor-finance.svg",
    imgWidth: 312,
    imgHeight: 180,
    tagKey: "investorTag",
    titleKey: "investorTitle",
    descKey: "investorDesc",
    needKeys: ["investorNeed1", "investorNeed2", "investorNeed3"],
    ctaKey: "continueAsInvestor",
  },
  project_owner: {
    img: "/illustrations/facilitator-building.svg",
    imgWidth: 228,
    imgHeight: 190,
    tagKey: "ownerTag",
    titleKey: "ownerTitle",
    descKey: "ownerDesc",
    needKeys: ["ownerNeed1", "ownerNeed2", "ownerNeed3"],
    ctaKey: "continueAsOwner",
  },
};

/** Decorative line-art layer: the investor's world is a smooth yield curve;
 *  the facilitator's is a stepped build — floors going up. Both draw in. */
function SceneAccent({ variant }: { variant: RoleVariant }) {
  const isInvestor = variant === "investor";
  const line = isInvestor
    ? "M 16 190 C 110 186 156 148 208 118 C 262 87 318 62 384 34"
    : "M 16 196 H 112 V 152 H 208 V 108 H 304 V 64 H 384";
  const dots: Array<[number, number]> = isInvestor
    ? [
        [122, 166],
        [244, 98],
        [384, 34],
      ]
    : [
        [112, 152],
        [208, 108],
        [384, 64],
      ];
  return (
    <svg
      viewBox="0 0 400 220"
      preserveAspectRatio="none"
      aria-hidden
      className="absolute inset-0 size-full"
    >
      <path
        d={`M 16 200 H 384`}
        stroke="var(--accent)"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeDasharray="2 7"
        strokeLinecap="round"
        fill="none"
        className={styles.baseline}
      />
      <path
        d={line}
        stroke="var(--accent)"
        strokeOpacity="0.55"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className={styles.drawPath}
      />
      {dots.map(([x, y], i) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={i === dots.length - 1 ? 6 : 4.5}
          fill="var(--accent)"
          className={cn(styles.dot, [styles.dot1, styles.dot2, styles.dot3][i])}
        />
      ))}
      {/* Terminal marker pings when the pointer shows intent. */}
      <circle
        cx={dots[2][0]}
        cy={dots[2][1]}
        r="6"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        className={styles.ping}
      />
    </svg>
  );
}

export function RoleScene({
  variant,
  preselected,
  pending,
  onSelect,
}: {
  variant: RoleVariant;
  preselected: boolean;
  pending: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations("onboarding");
  const scene = SCENES[variant];

  return (
    <Card
      hoverLift
      padding="0"
      className={cn(
        styles.panel,
        "relative flex w-full flex-col overflow-hidden",
        preselected && "border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-tint-08)]",
      )}
    >
      <div className={cn(styles.scene, "flex h-48 items-end justify-center sm:h-56")}>
        <SceneAccent variant={variant} />
        <Image
          src={scene.img}
          alt=""
          width={scene.imgWidth}
          height={scene.imgHeight}
          unoptimized
          priority
          className={cn(styles.sceneImg, "relative h-[82%] w-auto")}
        />
        {preselected ? (
          <span className="absolute right-3 top-3 rounded-[var(--radius-pill)] bg-[var(--status-solid-bg)] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[var(--tracking-badge)] text-[var(--status-solid-fg)]">
            {t("preselected")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div>
          <span className="font-mono text-[var(--text-eyebrow-size)] font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[var(--accent)]">
            {t(scene.tagKey)}
          </span>
          <h2 className="mt-1.5 text-[22px] font-bold leading-tight tracking-[-0.01em] text-[var(--ink)]">
            {t(scene.titleKey)}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)]">
            {t(scene.descKey)}
          </p>
        </div>

        <div className="flex-1">
          <span className="font-mono text-[var(--text-label-size)] font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[var(--text-muted)]">
            {t("needsLabel")}
          </span>
          <ul className="mt-2.5 flex list-none flex-col gap-2 p-0">
            {scene.needKeys.map((key) => (
              <li key={key} className="flex items-start gap-2.5 text-sm text-[var(--text-body)]">
                <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--accent-tint-10)] text-[var(--accent)]">
                  <Check size={11} strokeWidth={3} aria-hidden />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <p className="flex items-center gap-1.5 font-mono text-[var(--text-meta-size)] text-[var(--text-muted)]">
          <Clock3 size={13} aria-hidden />
          {t("timeMeta")}
        </p>

        {/* Stretched-target pattern: the button's ::after covers the whole
            panel, so one interactive element makes the full card clickable. */}
        <Button
          onClick={onSelect}
          disabled={pending}
          className="w-full gap-2 after:absolute after:inset-0 after:content-['']"
        >
          {t(scene.ctaKey)}
          <ArrowRight size={16} aria-hidden className={styles.ctaArrow} />
        </Button>
      </div>
    </Card>
  );
}
