import { Skeleton } from "@/components/common/skeleton/Skeleton";

function WorkspaceCardSkeleton() {
  return (
    <li className="flex h-full min-h-52 flex-col rounded-2xl border border-surface-400 bg-surface-100 p-6 shadow-Soft tablet:min-h-48 tablet:p-5">
      <Skeleton className="mb-5 h-16 w-16 rounded-2xl tablet:mb-4 tablet:h-14 tablet:w-14" />
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-4/5" />
      <div className="mt-auto pt-5">
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </li>
  );
}

export default function WorkspaceListLoading() {
  return (
    <section
      role="status"
      aria-label="워크스페이스 목록 불러오는 중"
      className="w-full flex flex-col gap-8"
    >
      <div className="flex items-center justify-between gap-4 tablet:flex-col tablet:items-stretch">
        <Skeleton className="h-15 w-full rounded-2xl" />
        <Skeleton className="h-15 w-56 rounded-2xl tablet:w-full" />
      </div>
      <ul className="grid grid-cols-2 gap-5 tablet:grid-cols-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <WorkspaceCardSkeleton key={i} />
        ))}
      </ul>
    </section>
  );
}
