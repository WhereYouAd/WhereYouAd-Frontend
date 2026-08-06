import { Skeleton } from "@/components/common/skeleton/Skeleton";

function WorkspaceCardSkeleton() {
  return (
    <li className="relative flex h-full min-h-52 flex-col rounded-2xl border-[1.5px] border-surface-400 bg-surface-100 p-6 shadow-Soft tablet:min-h-48 tablet:p-5">
      <Skeleton className="mb-5 h-18 w-18 shrink-0 rounded-2xl tablet:mb-4 tablet:h-14 tablet:w-14" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="pr-12">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-1.5 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-4/5" />
        </div>

        <div className="mt-auto flex items-center pt-5 pr-8">
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>

      <Skeleton className="absolute right-5 bottom-6 h-5 w-5 rounded-md tablet:bottom-5 tablet:right-4" />
    </li>
  );
}

function WorkspaceCardListSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-5 tablet:grid-cols-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <WorkspaceCardSkeleton key={i} />
      ))}
    </ul>
  );
}

type TProps = {
  /** 페이지 내부 로딩: 카드 그리드만. 라우트 Suspense: 전체 스켈레톤 */
  listOnly?: boolean;
};

export default function WorkspaceListLoading({ listOnly = false }: TProps) {
  if (listOnly) {
    return (
      <div role="status" aria-label="워크스페이스 목록 불러오는 중">
        <WorkspaceCardListSkeleton />
      </div>
    );
  }

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
      <WorkspaceCardListSkeleton />
    </section>
  );
}
