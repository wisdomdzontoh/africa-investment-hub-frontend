import {
  CardGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/common/Skeletons";

export default function OpportunitiesLoading() {
  return (
    <div className="page py-[var(--section-y-sm)]">
      <PageHeaderSkeleton />
      <div className="mt-8 grid gap-6 lg:grid-cols-[16rem_1fr]">
        <div className="hidden lg:block">
          <div className="space-y-4 rounded-[var(--radius-base)] border border-border bg-card p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-9 w-full animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
        <CardGridSkeleton count={6} />
      </div>
    </div>
  );
}
