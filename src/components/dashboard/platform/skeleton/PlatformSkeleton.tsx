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
    <div className="bg-white/80 p-7 rounded-component-lg border border-white/40 flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <SkeletonCircle className="w-10 h-10" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white/40 p-5 rounded-component-md flex flex-col gap-3"
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
      <Skeleton className="w-full h-20 rounded-component-md" />
    </div>
  );
}

//플랫폼별 성과 효율
export function PerformanceEfficiencyChartSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center w-full px-5">
      <Skeleton className="w-full h-35 rounded-component-md mb-2" />
    </div>
  );
}

// 실시간 트래픽 변화
export function TrafficChartSkeleton() {
  return <Skeleton className="flex-1 h-90 w-full rounded-component-md" />;
}

export function BadgeSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={twMerge("w-14 h-6 rounded-component-sm", className)} />
  );
}
