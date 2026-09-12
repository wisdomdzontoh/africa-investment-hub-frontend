import { cn } from "@/lib/utils";

type AfriVestLogoProps = {
  className?: string;
  /** Mark + text height in pixels. */
  height?: number;
};

/**
 * Header-only wordmark. The mark is a real inline SVG (crisp at any size); the
 * "AfriVest" text is HTML, not text baked into the SVG, so it renders in the
 * site's actual Inter font instead of falling back to a generic system font
 * the way text inside an externally-referenced .svg file would.
 */
export function AfriVestLogo({ className, height = 30 }: AfriVestLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={height}
        height={height}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        {/* Three-dot cluster mark — two circles side by side, one centred
            above the gap, each slightly overlapping its neighbours. */}
        <circle cx="10" cy="21" r="6.5" fill="var(--accent)" />
        <circle cx="22" cy="21" r="6.5" fill="var(--accent)" />
        <circle cx="16" cy="10" r="6.5" fill="var(--accent)" />
      </svg>
      <span
        className="font-black tracking-[0.015em] text-[var(--ink)]"
        style={{ fontSize: height * 0.62, fontFamily: "var(--font-brand)" }}
      >
        AfriVest
      </span>
    </span>
  );
}
