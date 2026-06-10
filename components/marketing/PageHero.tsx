import { SectionLabel } from "@/components/ds";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  /** "cream" (default) sits on the page surface; "dark" is a #0F0F0F drama band. */
  tone?: "cream" | "dark";
  align?: "left" | "center";
  /** Optional mono meta facts rendered as a · -chained machine-layer line. */
  meta?: string[];
};

/**
 * DS-conformant marketing page header. Flat surfaces only — the cream variant
 * carries the brand's 45° stripe motif on its right edge; the dark variant uses
 * the endorsed red radial glow. No gradients, no decorative shapes.
 */
export function PageHero({
  title,
  subtitle,
  eyebrow,
  children,
  tone = "cream",
  align = "left",
  meta,
}: PageHeroProps) {
  const dark = tone === "dark";
  const centered = align === "center";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        dark
          ? "bg-[var(--surface-dark)]"
          : "border-b border-[var(--accent-border)] bg-[var(--bg-page)]",
      )}
    >
      {dark ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[-40px] bg-[radial-gradient(circle_at_50%_30%,rgba(192,57,43,0.18)_0%,rgba(192,57,43,0)_60%)]"
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[clamp(180px,34%,440px)] opacity-60 [mask-image:linear-gradient(to_left,black,transparent)] bg-[repeating-linear-gradient(45deg,var(--bg-page),var(--bg-page)_11px,var(--bg-stripe)_11px,var(--bg-stripe)_22px)]"
        />
      )}

      <div className="page relative z-10 py-14 sm:py-20">
        <div className={cn("max-w-[760px]", centered && "mx-auto text-center")}>
          {eyebrow && <SectionLabel dot onDark={dark}>{eyebrow}</SectionLabel>}
          <h1
            className={cn(
              "text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.02em]",
              eyebrow && "mt-4",
              dark ? "text-[var(--on-dark)]" : "text-[var(--ink)]",
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mt-4 max-w-[640px] text-[var(--text-lead-size)] leading-relaxed",
                centered && "mx-auto",
                dark ? "text-[var(--on-dark-65)]" : "text-[var(--text-body)]",
              )}
            >
              {subtitle}
            </p>
          )}
          {meta && meta.length > 0 && (
            <div
              className={cn(
                "mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[var(--text-eyebrow-size)] font-medium uppercase tracking-[0.08em]",
                centered && "justify-center",
                dark ? "text-[var(--on-dark-50)]" : "text-[var(--text-muted)]",
              )}
            >
              {meta.map((m, i) => (
                <span key={m} className="inline-flex items-center gap-3">
                  {i > 0 && <span aria-hidden>·</span>}
                  {m}
                </span>
              ))}
            </div>
          )}
          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
    </section>
  );
}
