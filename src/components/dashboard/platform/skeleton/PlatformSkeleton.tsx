import { twMerge } from "tailwind-merge";

import {
  Skeleton,
  SkeletonCircle,
} from "@/components/common/skeleton/Skeleton";

// 성과 우수 플랫폼
export function TopPerformanceListSkeleton() {
  return (
    <div className="flex flex-col gap-5 w-full mt-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 w-full">
          <Skeleton className="h-4 w-4 shrink-0" /> {/* 순위 숫자 */}
          <SkeletonCircle className="h-8 w-8 shrink-0" /> {/* 로고 */}
          <Skeleton className="h-4 flex-1" /> {/* 이름 */}
          <Skeleton className="h-6 w-20" /> {/* 수치 */}
        </div>
      ))}
    </div>
  );
}

// 개별 플랫폼 상세 카드
export function PlatformDetailCardSkeleton() {
  return (
    <div className="flex flex-col gap-8 rounded-3xl border border-surface-100/40 bg-surface-100/80 p-7">
      <div className="flex items-center gap-3">
        <SkeletonCircle className="w-10 h-10" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-2xl bg-surface-100/40 p-5"
          >
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-15 w-30" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 광고 소재 현황
export function AdStatusChartSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center p-3">
      <Skeleton className="w-full h-20 rounded-2xl" />
    </div>
  );
}

//플랫폼별 성과 효율
export function PerformanceEfficiencyChartSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center w-full px-5">
      <Skeleton className="w-full h-35 rounded-2xl mb-2" />
    </div>
  );
}

export function BadgeSkeleton({ className }: { className?: string }) {
  return <Skeleton className={twMerge("w-14 h-6 rounded-lg", className)} />;
}

/** compact BudgetGaugeChart 1칸 */
function PlatformBudgetGaugeCompactSkeleton({
  mergedBudgetHeader = true,
}: {
  mergedBudgetHeader?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex flex-col">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Skeleton
            className={twMerge("h-4", mergedBudgetHeader ? "w-36" : "w-20")}
          />
          <Skeleton className="h-6 w-12 shrink-0 rounded-lg" />
        </div>
        {!mergedBudgetHeader && (
          <div className="mb-2 flex items-baseline gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        )}
        <Skeleton className="mt-2 h-8 w-24" />
      </div>
      <Skeleton className="mb-3 h-3 w-full rounded-full" />
      <div className="mb-3 flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-surface-300 px-5 py-4">
        <Skeleton className="size-5 shrink-0 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </div>
    </div>
  );
}

/** Naver 등 게이지 1개 — showInsight 레이아웃 */
export function PlatformSingleBudgetGaugeSkeleton() {
  return (
    <div className="flex flex-1 flex-col pt-1">
      <div className="flex shrink-0 flex-col">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-6 w-12 shrink-0 rounded-lg" />
        </div>
        <Skeleton className="mt-3 h-8 w-24" />
        <Skeleton className="mb-3 h-3 w-full rounded-full" />
        <div className="mb-6 flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-surface-300 px-5 py-4">
        <Skeleton className="size-5 shrink-0 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </div>
    </div>
  );
}

/** Google/Meta — compact 게이지 2개 로딩 (최종 레이아웃 높이 유지) */
export function PlatformDualBudgetGaugeSkeleton({
  mergedBudgetHeader = true,
}: {
  mergedBudgetHeader?: boolean;
} = {}) {
  return (
    <div className="flex flex-1 flex-col pt-2">
      <PlatformBudgetGaugeCompactSkeleton
        mergedBudgetHeader={mergedBudgetHeader}
      />
      <div className="mt-5 border-t border-surface-300 pt-5">
        <PlatformBudgetGaugeCompactSkeleton
          mergedBudgetHeader={mergedBudgetHeader}
        />
      </div>
    </div>
  );
}
