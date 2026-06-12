import { cn } from "@/lib/utils";

type PortalPageProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/** Standard portal page scaffold: header (eyebrow/title/description + actions)
 *  over the page content. Keeps every portal screen visually consistent. */
export function PortalPage({
  title,
  description,
  eyebrow,
  actions,
  children,
  className,
}: PortalPageProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-[-0.02em] text-[var(--ink)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--text-body)]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
