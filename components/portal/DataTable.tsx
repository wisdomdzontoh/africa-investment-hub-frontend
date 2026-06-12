import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  /** Hide below the `sm` breakpoint to keep mobile tables readable. */
  hideOnMobile?: boolean;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  empty?: React.ReactNode;
  skeletonRows?: number;
  className?: string;
};

const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const;

/** Generic DS-styled data table — header (mono caps), hairline row dividers,
 *  hover lift, built-in loading skeleton and empty slot. Sorting/filtering is
 *  driven by the caller (server-side preferred for scale). */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  isLoading,
  empty,
  skeletonRows = 5,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--surface-card)]",
        className,
      )}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--accent-border)]">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]",
                  alignClass[c.align ?? "left"],
                  c.hideOnMobile && "hidden sm:table-cell",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="border-b border-[var(--accent-border)] last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3.5", c.hideOnMobile && "hidden sm:table-cell")}>
                    <span className="block h-3.5 w-[60%] animate-pulse rounded-full bg-[var(--bg-section)]" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center">
                {empty ?? (
                  <span className="text-sm text-[var(--text-muted)]">No records yet.</span>
                )}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-[var(--accent-border)] transition-colors last:border-0",
                  onRowClick && "cursor-pointer hover:bg-[var(--bg-page)]",
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-4 py-3.5 text-[var(--text-body)]",
                      alignClass[c.align ?? "left"],
                      c.hideOnMobile && "hidden sm:table-cell",
                      c.className,
                    )}
                  >
                    {c.render ? c.render(row) : (row as Record<string, React.ReactNode>)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
