import { TIMELINE_PAGE_HEIGHT } from "@/constants/timeline/layout";

import { Skeleton } from "@/components/common/skeleton/Skeleton";

export default function TimelineSkeleton() {
  return (
    <section
      className="flex flex-col w-full min-w-0"
      style={{ height: TIMELINE_PAGE_HEIGHT }}
    >
      <div className="flex min-h-0 flex-col flex-1 rounded-2xl border border-surface-400/70 bg-surface-100">
        <div className="flex flex-col gap-4 shrink-0 border-b border-surface-400/80 px-5 py-5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </section>
  );
}
