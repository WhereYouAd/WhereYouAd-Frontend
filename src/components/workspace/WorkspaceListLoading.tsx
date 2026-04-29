import { Skeleton } from "@/components/common/skeleton/Skeleton";

function WorkspaceCardSkeleton() {
  return (
    <>
      <li className="flex items-center justify-between rounded-component-md bg-white px-6 py-5 shadow-Soft border border-gray-100 tablet:px-4 tablet:py-4">
        <div className="flex items-center gap-5 min-w-0 tablet:gap-3">
          <Skeleton className="w-24 h-24 shrink-0 rounded-component-sm tablet:h-18 tablet:w-18" />
          <div className="flex flex-col gap-2 min-w-0">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </li>
    </>
  );
}

export default function WorkspaceListLoading() {
  return (
    <section
      role="status"
      aria-label="워크스페이스 목록 불러오는 중"
      className="w-full flex flex-col gap-8"
    >
      <div className="space-y-3">
        <Skeleton className="h-8 w-50" />
        <Skeleton className="h-5 w-60 tablet:w-56" />
      </div>
      <div className="flex items-center justify-between gap-4 tablet:flex-col tablet:items-stretch">
        <Skeleton className="h-15 w-full rounded-component-md" />
        <Skeleton className="h-15 w-56 rounded-component-md tablet:w-full" />
      </div>
      <ul className="space-y-5">
        {Array.from({ length: 7 }).map((_, i) => (
          <WorkspaceCardSkeleton key={i} />
        ))}
      </ul>
    </section>
  );
}
