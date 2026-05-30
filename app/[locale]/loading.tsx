import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="page py-12">
      <Skeleton className="mb-4 h-10 w-72" />
      <Skeleton className="mb-8 h-5 w-96 max-w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-[var(--radius-base)]" />
        ))}
      </div>
    </div>
  );
}
