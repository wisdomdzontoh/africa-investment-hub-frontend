import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { Chip } from "./Chip";

type ProjectCardProps = {
  title: string;
  sector?: string;
  country?: string;
  funding?: React.ReactNode;
  roi?: React.ReactNode;
  timeline?: React.ReactNode;
  risk?: "low" | "medium" | "high";
  summary?: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

const metaLabelClass =
  "font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]";

export function ProjectCard({
  title,
  sector,
  country,
  funding,
  roi,
  timeline,
  risk = "low",
  summary,
  ctaLabel = "View opportunity",
  onCta,
  className,
  style,
}: ProjectCardProps) {
  return (
    <Card
      padding="28px"
      className={cn("flex flex-col gap-4", className)}
      style={style}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {sector ? <Chip>{sector}</Chip> : null}
          {country ? <Chip>{country}</Chip> : null}
        </div>
        <Badge risk={risk} />
      </div>

      <div>
        <div className="mb-2 text-lg leading-snug font-semibold text-[var(--ink)]">
          {title}
        </div>
        {summary ? (
          <div className="text-sm leading-relaxed text-[var(--text-body)]">
            {summary}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-3 border-y border-[var(--bg-section)] py-3.5">
        <div>
          <div className={metaLabelClass}>Funding</div>
          <div className="mt-1 text-[15px] font-semibold text-[var(--ink)]">
            {funding}
          </div>
        </div>
        <div>
          <div className={metaLabelClass}>ROI</div>
          <div className="mt-1 text-[15px] font-semibold text-[var(--ink)]">
            {roi}
          </div>
        </div>
        <div>
          <div className={metaLabelClass}>Timeline</div>
          <div className="mt-1 text-[15px] font-semibold text-[var(--ink)]">
            {timeline}
          </div>
        </div>
      </div>

      <Button variant="dark" size="sm" onClick={onCta}>
        {ctaLabel}
      </Button>
    </Card>
  );
}
