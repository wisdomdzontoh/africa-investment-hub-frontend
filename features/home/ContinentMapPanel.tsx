"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const MAP = [
  "....xxxxxxx.....",
  "..xxxxxxxxxxx...",
  ".xxxxxxxxxxxxx..",
  ".xxxxxxxxxxxxx..",
  "xxxxxxxxxxxxxx..",
  "xxxxxxxxxxxxxxx.",
  "xxxxxxxxxxxxxxxx",
  ".xxxxxxxxxxxxxx.",
  "..xxxxxxxxxxxx..",
  "....xxxxxxxxxx..",
  "....xxxxxxxxx...",
  "....xxxxxxxxxx..",
  ".....xxxxxxxxx.x",
  ".....xxxxxxxx..x",
  ".....xxxxxxxx...",
  "......xxxxxx....",
  "......xxxxx.....",
  ".......xxx......",
];

const NODES: [number, number][] = [
  [1, 4],
  [2, 11],
  [5, 1],
  [6, 4],
  [6, 12],
  [8, 11],
  [9, 7],
  [12, 8],
  [14, 6],
  [16, 7],
];

export function ContinentMapPanel() {
  const t = useTranslations("home.hero.map");

  const dots: React.ReactNode[] = [];
  MAP.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== "x") continue;
      const ni = NODES.findIndex((n) => n[0] === r && n[1] === c);
      dots.push(
        <div
          key={`${r}-${c}`}
          className="flex items-center justify-center"
          style={{ gridRow: r + 1, gridColumn: c + 1 }}
        >
          <div
            className={
              ni > -1
                ? "size-[9px] animate-[nodePulse_2.6s_ease-in-out_infinite] rounded-full bg-[var(--accent-bright)] shadow-[0_0_10px_rgba(192,57,43,0.9)]"
                : "size-[7px] rounded-full bg-[var(--map-dot)]"
            }
            style={ni > -1 ? { animationDelay: `${ni * 0.33}s` } : undefined}
          />
        </div>,
      );
    }
  });

  return (
    <div className="page relative mt-16 overflow-hidden rounded-[var(--radius-panel)] bg-[var(--surface-dark)] px-8 py-14 sm:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-40px] bg-[radial-gradient(circle_at_50%_45%,rgba(192,57,43,0.15)_0%,rgba(192,57,43,0)_60%)]"
      />
      <div className="relative flex justify-center [perspective:1000px]">
        <div
          className="grid [grid-template-columns:repeat(16,24px)] [grid-template-rows:repeat(18,24px)] [transform-style:preserve-3d] [transform:rotateX(14deg)_rotateY(-9deg)]"
        >
          {dots}
        </div>
      </div>

      <div className="absolute top-[18%] right-[7%] flex max-w-[220px] items-center gap-3 rounded-[10px] bg-white px-[18px] py-3.5 text-left shadow-[var(--shadow-dark-float)]">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[13px] font-bold text-white">
          ✓
        </span>
        <span>
          <span className="block text-[13px] font-semibold text-[var(--ink)]">
            {t("verifiedTitle")}
          </span>
          <span className="block text-xs text-[var(--text-muted)]">
            {t("verifiedSub")}
          </span>
        </span>
      </div>

      <div className="absolute bottom-[14%] left-[7%] flex max-w-[240px] items-center gap-3 rounded-[10px] bg-white px-[18px] py-3.5 text-left shadow-[var(--shadow-dark-float)]">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-tint-10)]">
          <Image
            src="/brand/icons/trend.svg"
            width={16}
            height={16}
            alt=""
            aria-hidden
          />
        </span>
        <span>
          <span className="block text-[13px] font-semibold text-[var(--ink)]">
            {t("matchTitle")}
          </span>
          <span className="block text-xs text-[var(--text-muted)]">
            {t("matchSub")}
          </span>
        </span>
      </div>
    </div>
  );
}
