import type { IApiErrorResponse } from "@/types/common/common";

import type { useOverviewRoasRankings } from "@/hooks/dashboard/useOverviewRoasRankings";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import {
  Skeleton,
  SkeletonCircle,
} from "@/components/common/skeleton/Skeleton";
import PlatformRoasTable, {
  PLATFORM_ROAS_TABLE_COL,
} from "@/components/dashboard/platform/PlatformRoasTable";

import ChevronDoubleRightIcon from "@/assets/icon/chevron/chervon-double-right.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

function PlatformRankingSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-[#F2F4F6]">
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

export function OverviewPlatformSection({
  rankings,
  isRankingsLoading,
  isRankingsError,
  rankingsError,
  onNavigate,
}: {
  rankings: ReturnType<typeof useOverviewRoasRankings>["data"];
  isRankingsLoading: boolean;
  isRankingsError: boolean;
  rankingsError: IApiErrorResponse | null;
  onNavigate: () => void;
}) {
  return (
    <Card
      className="w-full min-w-0 shrink-0"
      title="플랫폼별 비교"
      RightElement={
        <Button
          variant="tertiary"
          onClick={onNavigate}
          className="group flex h-8 items-center gap-1 rounded-full border-none bg-bg-surface/60 px-4 text-text-sub transition-colors hover:bg-bg-surface hover:text-text-auth-sub"
        >
          <span className="font-caption font-semibold">
            플랫폼 대시보드 살펴보기
          </span>
          <ChevronDoubleRightIcon className="h-4.5 w-4.5" />
        </Button>
      }
      description={
        <div className="flex select-none items-center gap-1.5 font-caption text-text-placeholder">
          <WarnCircleIcon
            className="mt-px h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          <span>ROAS 산출: 매출 ÷ 광고비 × 100</span>
        </div>
      }
    >
      {isRankingsError ? (
        <div className="flex items-center justify-center py-16 font-body2 text-status-red">
          {rankingsError?.message ??
            "플랫폼 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
        </div>
      ) : isRankingsLoading ? (
        <PlatformRankingSkeleton />
      ) : (
        <PlatformRoasTable rankings={rankings ?? []} />
      )}
    </Card>
  );
}
