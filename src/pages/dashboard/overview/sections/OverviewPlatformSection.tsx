import type { IApiErrorResponse } from "@/types/common/common";

import type { useOverviewRoasRankings } from "@/hooks/dashboard/useOverviewRoasRankings";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import { OverviewPlatformRankingSkeleton } from "@/components/dashboard/overview/skeleton/OverviewSkeleton";
import PlatformRoasTable from "@/components/dashboard/platform/PlatformRoasTable";

import ChevronDoubleRightIcon from "@/assets/icon/chevron/chervon-double-right.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

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
          className="group flex h-8 items-center gap-1 rounded-full border-none bg-surface-200/60 px-4 text-text-muted transition-colors hover:bg-surface-200 hover:text-text-body"
        >
          <span className="font-caption">플랫폼 대시보드 살펴보기</span>
          <ChevronDoubleRightIcon className="h-4.5 w-4.5 text-text-muted group-hover:text-text-body" />
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
        <div className="flex items-center justify-center py-16 font-body2 text-info-red">
          {rankingsError?.message ??
            "플랫폼 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
        </div>
      ) : isRankingsLoading ? (
        <OverviewPlatformRankingSkeleton />
      ) : (
        <PlatformRoasTable rankings={rankings ?? []} />
      )}
    </Card>
  );
}
