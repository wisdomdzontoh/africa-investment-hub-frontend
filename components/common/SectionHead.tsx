import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("eyebrow", className)}>{children}</div>;
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div>
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <h2 className="h2">{title}</h2>
        {sub && (
          <p className="lead mt-2 max-w-[560px]">{sub}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function KpiValue({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("kpi-value", className)}>{children}</div>;
}
