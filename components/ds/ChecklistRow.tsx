import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

type ChecklistRowProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  state?: "done" | "pending" | "approved";
  trailing?: React.ReactNode;
  divider?: boolean;
};

export function ChecklistRow({
  label,
  state = "done",
  trailing,
  divider = true,
  className,
  ...props
}: ChecklistRowProps) {
  let right = trailing;
  if (!right) {
    if (state === "done") {
      right = (
        <span className="font-bold text-[var(--accent)]" aria-label="Done">
          ✓
        </span>
      );
    } else if (state === "pending") {
      right = <Badge tone="neutral">Pending</Badge>;
    } else if (state === "approved") {
      right = <Badge tone="solid">Approved</Badge>;
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-2.25",
        divider ? "border-b border-[var(--bg-section)]" : "border-none",
        className,
      )}
      {...props}
    >
      <span className="text-[13px] text-[var(--ink)]">{label}</span>
      {right}
    </div>
  );
}
