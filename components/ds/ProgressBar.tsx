import { cn } from "@/lib/utils";

type ProgressBarProps = React.ComponentProps<"div"> & {
  value?: number;
  label?: React.ReactNode;
  status?: React.ReactNode;
};

export function ProgressBar({
  value = 0,
  label,
  status,
  className,
  ...props
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={className} {...props}>
      {label || status ? (
        <div className="mb-[5px] flex justify-between">
          {label ? (
            <span className="text-[13px] text-[var(--ink)]">{label}</span>
          ) : (
            <span />
          )}
          {status ? (
            <span className="text-xs text-[var(--text-muted)]">{status}</span>
          ) : null}
        </div>
      ) : null}
      <div className="h-1.5 rounded-sm bg-[var(--bg-section)]">
        <div
          className="h-1.5 rounded-sm bg-[var(--accent)] transition-[width] duration-300 ease-[ease]"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
