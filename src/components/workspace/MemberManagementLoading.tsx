import { Skeleton, SkeletonCircle } from "../common/skeleton/Skeleton";

function MemberRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-component-md bg-white px-6 py-5 shadow-Soft border border-gray-100 tablet:px-4 tablet:py-4">
      <div className="flex items-center gap-4 min-w-0">
        <SkeletonCircle className="w-12 h-12 shrink-0 tablet:w-10 tablet:h-10" />
        <div className="flex flex-col gap-2 min-w-0">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-44 tablet:w-36" />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-9 w-22 rounded-component-md" />
        <Skeleton className="h-9 w-9 rounded-component-md" />
      </div>
    </div>
  );
}

function PermissionRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  );
}

export default function MemberManagementLoading() {
  return (
    <section
      role="status"
      aria-label="멤버 관리 정보 불러오는 중"
      className="w-full min-w-0 flex flex-col gap-8"
    >
      <div className="flex w-full min-w-0 flex-col gap-10">
        <div className="rounded-component-lg border border-gray-100 bg-white p-6 shadow-Soft">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-10 w-28 rounded-component-md" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <MemberRowSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-component-lg border border-gray-100 bg-white p-6 shadow-Soft">
          <div className="space-y-2 mb-6">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div>
            {Array.from({ length: 9 }).map((_, i) => (
              <PermissionRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
