import {
  Skeleton,
  SkeletonCircle,
} from "@/components/common/skeleton/Skeleton";
import { PLATFORM_ROAS_TABLE_COL } from "@/components/dashboard/platform/PlatformRoasTable";

/** KPI StatCard 1칸 */
export function OverviewKpiCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-surface-100/40 bg-surface-100/80 px-7 py-5 shadow-Soft backdrop-blur-sm">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
  );
}

/** 실시간 트래픽 차트 */
export function OverviewTrafficChartSkeleton() {
  return <Skeleton className="min-h-60 w-full flex-1 rounded-2xl" />;
}

/** 예산 게이지 카드 */
export function OverviewBudgetGaugeSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 pt-1">
      <div className="flex shrink-0 flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-3">
        <div className="flex flex-col gap-1 rounded-2xl border border-surface-400/25 bg-surface-200/40 p-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-36" />
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-surface-300 px-5 py-4">
          <Skeleton className="size-5 shrink-0 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/** 플랫폼별 ROAS 랭킹 테이블 */
export function OverviewPlatformRankingSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-surface-200">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={`grid min-h-20 items-stretch gap-x-4 px-4 py-4 @2xl:gap-x-6 ${PLATFORM_ROAS_TABLE_COL}`}
        >
          <div className="flex min-h-0 items-center justify-center">
            <Skeleton className="mx-auto h-4 w-4" />
          </div>
          <div className="flex min-h-0 min-w-0 items-center gap-3">
            <SkeletonCircle className="h-7 w-7 shrink-0" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex h-full min-h-0 min-w-0 items-center justify-center px-2 @2xl:px-3">
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="hidden min-w-0 justify-center pl-1 @2xl:flex @2xl:pl-0">
            <Skeleton className="h-8 w-14" />
          </div>
          <div className="hidden min-w-0 justify-center @2xl:flex">
            <Skeleton className="h-8 w-14" />
          </div>
          <div className="flex min-w-0 flex-col items-end gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 캠페인 미리보기 행 2개 */
export function OverviewCampaignSnapshotSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 pt-0.5">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}
