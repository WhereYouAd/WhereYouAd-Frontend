import { Skeleton } from "@/components/common/skeleton/Skeleton";

function WorkspaceCardSkeleton() {
  return (
    <>
      <li className="flex items-center justify-between rounded-component-md bg-white px-6 py-5 shadow-Soft border border-gray-100 tablet:px-4 tablet:py-4">
        <div className="flex items-center gap-5 min-w-0 tablet:gap-3">
          <Skeleton className="w-24 h-24 shrink-0 rounded-component-sm tablet:h-16 tablet:w-16" />
          <div className="flex flex-col gap-2 min-w-0">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-10 w-10 shrink-0 rounded-component-sm" />
      </li>
    </>
  );
}

export default function WorkspaceListLoading() {
  return (
    <ul
      role="status"
      aria-label="워크스페이스 목록 불러오는 중"
      className="space-y-5"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <WorkspaceCardSkeleton key={i} />
      ))}
    </ul>
  );
}
