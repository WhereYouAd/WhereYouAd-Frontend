import {
  Skeleton,
  SkeletonCircle,
} from "@/components/common/skeleton/Skeleton";

const SKELETON_COUNT = 3;

export function PlatformIntegrationCardSkeleton() {
  return (
    <div
      className="flex h-full min-h-70 w-full flex-col gap-5 rounded-3xl bg-surface-100 p-8 shadow-Soft mobile:p-6"
      aria-hidden
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonCircle className="h-12 w-12 shrink-0" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-8 w-16 shrink-0 rounded-full" />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-4 w-full max-w-56" />
        <Skeleton className="h-4 w-full max-w-48" />
      </div>

      <div className="flex-1" aria-hidden />

      <div className="mt-auto flex w-full flex-col gap-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function PlatformIntegrationsPageSkeleton() {
  return (
    <ul
      className="grid w-full min-w-0 list-none grid-cols-3 items-stretch gap-6 p-0 m-0 tablet:grid-cols-1"
      aria-busy="true"
      aria-label="플랫폼 연동 목록 로딩 중"
    >
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <li key={i} className="flex h-full min-h-0 w-full min-w-0">
          <PlatformIntegrationCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
