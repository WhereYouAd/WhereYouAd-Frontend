import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import type { ICampaign } from "@/types/ads/campaign";

import { useOverviewCampaignList } from "@/hooks/dashboard/useOverviewCampaignList";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import { Skeleton } from "@/components/common/skeleton/Skeleton";

import ChevronDoubleRightIcon from "@/assets/icon/chevron/chervon-double-right.svg?react";
import useWorkspaceStore from "@/store/useWorkspaceStore";

function visibleCampaigns(list: ICampaign[]) {
  return list.filter((c) => c.status !== "OVER");
}

const platformShort: Record<string, string> = {
  naver: "Naver",
  google: "Google",
  kakao: "Kakao",
};

const SnapshotRow = memo(function SnapshotRow({
  campaign,
  onOpen,
}: {
  campaign: ICampaign;
  onOpen: (projectId: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(campaign.projectId)}
      className="flex w-full min-w-0 items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-bg-surface/80"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-body2 font-semibold text-text-title">
          {campaign.name}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-placeholder">
          {campaign.providers.length > 0
            ? campaign.providers.map((p) => platformShort[p] ?? p).join(" · ")
            : "플랫폼 미지정"}
        </span>
      </div>
      <span className="shrink-0 font-caption font-semibold tabular-nums text-text-muted">
        {campaign.budgetUsageRate.toFixed(0)}%
      </span>
    </button>
  );
});

type TOverviewCampaignSnapshotCardProps = {
  className?: string;
};

export default memo(function OverviewCampaignSnapshotCard({
  className,
}: TOverviewCampaignSnapshotCardProps) {
  const navigate = useNavigate();
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const {
    data: campaigns = [],
    isPending,
    isError,
    error,
  } = useOverviewCampaignList();

  const { totalVisible, topByBudgetUsage } = useMemo(() => {
    const visible = visibleCampaigns(campaigns);
    const top = [...visible]
      .sort((a, b) => b.budgetUsageRate - a.budgetUsageRate)
      .slice(0, 2);
    return {
      totalVisible: visible.length,
      topByBudgetUsage: top,
    };
  }, [campaigns]);

  const openCampaign = useCallback(
    (projectId: number) => {
      if (orgId == null) return;
      navigate(`/ads/${orgId}/${projectId}`);
    },
    [navigate, orgId],
  );

  if (!orgId) return null;

  return (
    <Card
      className={twMerge("flex w-full min-w-0 flex-col pb-3!", className)}
      title="캠페인 스냅샷"
      description={
        isPending || isError ? undefined : (
          <span className="font-caption text-text-placeholder">
            예산 소진 상위
          </span>
        )
      }
      RightElement={
        <Button
          variant="tertiary"
          type="button"
          onClick={() => navigate("/ads")}
          className="group flex h-8 shrink-0 items-center gap-1 rounded-full border-none bg-bg-surface/60 px-3 hover:bg-bg-surface"
        >
          <span className="font-caption font-semibold text-text-muted group-hover:text-text-body">
            목록
          </span>
          <ChevronDoubleRightIcon className="h-4 w-4 text-text-placeholder" />
        </Button>
      }
    >
      <div className="flex flex-col">
        {isError ? (
          <p className="font-body2 text-status-red">
            {error?.message ??
              "캠페인 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
          </p>
        ) : isPending ? (
          <div className="flex flex-col gap-1.5 pt-0.5">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : totalVisible === 0 ? (
          <p className="font-body2 text-text-placeholder">
            표시할 캠페인이 없습니다. 광고 관리에서 캠페인을 등록해 보세요.
          </p>
        ) : (
          <div className="flex flex-col pt-0.5">
            <div className="flex flex-col divide-y divide-bg-disabled/60 overflow-hidden rounded-lg border border-bg-disabled/25">
              {topByBudgetUsage.map((c) => (
                <SnapshotRow
                  key={c.projectId}
                  campaign={c}
                  onOpen={openCampaign}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});
