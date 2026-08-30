import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ICampaign } from "@/types/ads/campaign";

import {
  type IBulkOperableCopy,
  useBulkOperableControl,
} from "@/hooks/ads/useBulkOperableControl";
import { useUpdateCampaignStatus } from "@/hooks/ads/useUpdateCampaignStatus";
import { useOverviewCampaignList } from "@/hooks/dashboard/useOverviewCampaignList";

import BulkStatusActionModals from "@/components/ads/BulkStatusActionModals";
import CampaignTable from "@/components/ads/CampaignTable";
import AdsListPageSkeleton from "@/components/ads/skeleton/AdsSkeleton";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import AreaErrorFallback from "@/components/common/error/AreaErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";

import useWorkspaceStore from "@/store/useWorkspaceStore";

const CAMPAIGN_BULK_COPY: IBulkOperableCopy = {
  entityName: "캠페인",
  entityObject: "캠페인을",
  pauseModalTitle: "캠페인 운영 중단",
  resumeModalTitle: "캠페인 운영 재개",
  pauseDetailListTitle: "중단 대상 캠페인",
  resumeDetailListTitle: "재개 대상 캠페인",
  successMessage: "캠페인 운영 상태가 반영되었습니다.",
  pauseErrorMessage: "중단 처리에 실패하였습니다.",
  resumeErrorMessage: "재개 처리에 실패하였습니다.",
  exposureNoun: "광고 노출",
};

const getCampaignId = (campaign: ICampaign) => campaign.projectId;
const getCampaignLabel = (campaign: ICampaign) => campaign.name;
const getCampaignStatus = (campaign: ICampaign) => campaign.status;

export default function AdsListPage() {
  const navigate = useNavigate();
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const { data: campaigns = [], isLoading } = useOverviewCampaignList();
  const { mutateAsync: mutateCampaignStatus } = useUpdateCampaignStatus(orgId);

  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  useEffect(() => {
    setSelectedIds(new Set());
  }, [orgId]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const bulk = useBulkOperableControl({
    items: campaigns,
    selectedIds,
    getId: getCampaignId,
    getLabel: getCampaignLabel,
    getStatus: getCampaignStatus,
    copy: CAMPAIGN_BULK_COPY,
    onSuccess: clearSelection,
  });

  const toggleProject = useCallback((projectId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  }, []);

  const toggleSelectAllVisible = useCallback(() => {
    const visibleIds = campaigns
      .filter((c) => c.status !== "OVER")
      .map((c) => c.projectId);
    setSelectedIds((prev) => {
      const allOn =
        visibleIds.length > 0 && visibleIds.every((id) => prev.has(id));
      if (allOn) {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...visibleIds]);
    });
  }, [campaigns]);

  const handleCampaignClick = (id: number) => {
    navigate(`/ads/${orgId}/${id}`);
  };

  const handleCampaignGroupClick = () => {
    navigate("/ads/campaignGroup");
  };

  if (isLoading) {
    return <AdsListPageSkeleton />;
  }

  return (
    <section className="flex w-full flex-col">
      <Card className="flex flex-col overflow-hidden p-0">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-surface-400/45 bg-surface-100 px-6 py-4 tablet:px-5 tablet:py-3.5 mobile:flex-col mobile:items-stretch mobile:px-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 mobile:flex-none">
            <p className="font-caption text-text-placeholder">광고</p>
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-heading3 text-text-title">캠페인 목록</h2>
              {selectedIds.size > 0 ? (
                <>
                  <span className="font-caption text-text-muted">
                    {selectedIds.size}개 선택
                  </span>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="font-caption text-text-muted underline decoration-surface-400 underline-offset-2 transition-colors hover:text-text-title"
                  >
                    선택 해제
                  </button>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 mobile:w-full mobile:flex-col mobile:items-stretch">
            <div className="flex items-center gap-2 mobile:w-full">
              <Button
                type="button"
                size="small"
                variant="dangerSoft"
                className="mobile:min-w-0 mobile:flex-1"
                onClick={bulk.openPauseModal}
                disabled={!bulk.canPause || bulk.pauseModal.isLoading}
              >
                중단
              </Button>
              <Button
                type="button"
                size="small"
                variant="outline"
                className="border-info-blue text-info-blue hover:bg-info-blue/5 mobile:min-w-0 mobile:flex-1"
                onClick={bulk.openResumeModal}
                disabled={!bulk.canResume || bulk.resumeModal.isLoading}
              >
                재개
              </Button>
            </div>
            <Button
              type="button"
              size="small"
              variant="gradient"
              className="mobile:w-full"
              onClick={handleCampaignGroupClick}
            >
              통합 캠페인 등록
            </Button>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <ErrorBoundary
            FallbackComponent={AreaErrorFallback}
            resetKeys={[campaigns]}
          >
            <CampaignTable
              embedded
              campaigns={campaigns}
              onRowClick={(id) => handleCampaignClick(id)}
              selectedProjectIds={selectedIds}
              onToggleProject={toggleProject}
              onToggleSelectAllVisible={toggleSelectAllVisible}
            />
          </ErrorBoundary>
        </div>
      </Card>

      <BulkStatusActionModals
        copy={CAMPAIGN_BULK_COPY}
        pauseScope={bulk.pauseScope}
        resumeScope={bulk.resumeScope}
        selectedOngoingCount={bulk.selectedOngoingIds.length}
        selectedPausedCount={bulk.selectedPausedIds.length}
        ongoingAllCount={bulk.ongoingAllCount}
        pausedAllCount={bulk.pausedAllCount}
        pauseDetailItems={bulk.pauseDetailItems}
        resumeDetailItems={bulk.resumeDetailItems}
        pauseModal={bulk.pauseModal}
        resumeModal={bulk.resumeModal}
        onConfirmPause={() =>
          mutateCampaignStatus({
            scope: bulk.pauseScope,
            status: "PAUSED",
            projectIds:
              bulk.pauseScope === "selection"
                ? bulk.selectedOngoingIds
                : undefined,
          })
        }
        onConfirmResume={() =>
          mutateCampaignStatus({
            scope: bulk.resumeScope,
            status: "ON_GOING",
            projectIds:
              bulk.resumeScope === "selection"
                ? bulk.selectedPausedIds
                : undefined,
          })
        }
      />
    </section>
  );
}
