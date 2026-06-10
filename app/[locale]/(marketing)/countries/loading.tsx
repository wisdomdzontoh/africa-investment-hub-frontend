import {
  ChipGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/common/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function CountriesLoading() {
  return (
    <div className="page py-[var(--section-y-sm)]">
      <PageHeaderSkeleton />
      <Skeleton className="mt-6 h-11 w-full max-w-md rounded-[var(--radius-base)]" />
      <div className="mt-8">
        <ChipGridSkeleton count={16} />
      </div>
    </div>
  );
}
