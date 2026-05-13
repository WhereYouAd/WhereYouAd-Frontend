import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useControlModal } from "@/hooks/ads/useControlModal";
import { useOverviewCampaignList } from "@/hooks/dashboard/useOverviewCampaignList";

import CampaignTable from "@/components/ads/CampaignTable";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";

import { updateAllCampaignStatus, updateCampaignStatus } from "@/api/ads/ads";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function AdsListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const { data: campaigns = [], isLoading } = useOverviewCampaignList();

  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const [pauseScope, setPauseScope] = useState<"selection" | "all">("all");
  const [resumeScope, setResumeScope] = useState<"selection" | "all">("all");

  const invalidateCampaigns = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["campaigns", orgId] });
  }, [queryClient, orgId]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

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

  const selectedOngoingIds = useMemo(() => {
    return [...selectedIds].filter((id) =>
      campaigns.some((c) => c.projectId === id && c.status === "ON_GOING"),
    );
  }, [selectedIds, campaigns]);

  const selectedPausedIds = useMemo(() => {
    return [...selectedIds].filter((id) =>
      campaigns.some((c) => c.projectId === id && c.status === "PAUSED"),
    );
  }, [selectedIds, campaigns]);

  const ongoingAllCount = useMemo(
    () => campaigns.filter((c) => c.status === "ON_GOING").length,
    [campaigns],
  );

  const pausedAllCount = useMemo(
    () => campaigns.filter((c) => c.status === "PAUSED").length,
    [campaigns],
  );

  const canPause = useMemo(() => {
    if (selectedOngoingIds.length > 0) return true;
    return selectedIds.size === 0 && ongoingAllCount > 0;
  }, [selectedOngoingIds.length, selectedIds.size, ongoingAllCount]);

  const canResume = useMemo(() => {
    if (selectedPausedIds.length > 0) return true;
    return selectedIds.size === 0 && pausedAllCount > 0;
  }, [selectedPausedIds.length, selectedIds.size, pausedAllCount]);

  const bulkStop = useControlModal({
    successMessage: "캠페인 운영 상태가 반영되었습니다.",
    errorMessage: "중단 처리에 실패하였습니다.",
    onSuccess: () => {
      invalidateCampaigns();
      clearSelection();
    },
  });

  const bulkResume = useControlModal({
    successMessage: "캠페인 운영 상태가 반영되었습니다.",
    errorMessage: "재개 처리에 실패하였습니다.",
    onSuccess: () => {
      invalidateCampaigns();
      clearSelection();
    },
  });

  const openPauseModal = () => {
    const scope = selectedOngoingIds.length > 0 ? "selection" : "all";
    setPauseScope(scope);
    bulkStop.openModal();
  };

  const openResumeModal = () => {
    const scope = selectedPausedIds.length > 0 ? "selection" : "all";
    setResumeScope(scope);
    bulkResume.openModal();
  };

  const pauseDetailItems = useMemo(() => {
    const rows =
      pauseScope === "selection"
        ? campaigns.filter((c) => selectedOngoingIds.includes(c.projectId))
        : campaigns.filter((c) => c.status === "ON_GOING");
    return rows.map((c) => ({ id: c.projectId, label: c.name }));
  }, [pauseScope, campaigns, selectedOngoingIds]);

  const resumeDetailItems = useMemo(() => {
    const rows =
      resumeScope === "selection"
        ? campaigns.filter((c) => selectedPausedIds.includes(c.projectId))
        : campaigns.filter((c) => c.status === "PAUSED");
    return rows.map((c) => ({ id: c.projectId, label: c.name }));
  }, [resumeScope, campaigns, selectedPausedIds]);

  const handleCampaignClick = (id: number) => {
    navigate(`/ads/${orgId}/${id}`);
  };

  const handleCampaignGroupClick = () => {
    navigate("/ads/campaignGroup");
  };

  if (isLoading) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <p className="font-body1 text-text-placeholder">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col">
      <Card className="flex flex-col overflow-hidden p-0">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-surface-400/45 bg-surface-200/45 px-4 py-3 tablet:px-3 tablet:py-2.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
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
            ) : (
              <span className="font-caption text-text-muted tablet:hidden">
                캠페인을 선택하면 일부만 중단·재개할 수 있어요
              </span>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              size="small"
              variant="dangerSoft"
              onClick={openPauseModal}
              disabled={!canPause || bulkStop.isLoading}
            >
              중단
            </Button>
            <Button
              type="button"
              size="small"
              variant="outline"
              className="border-info-blue text-info-blue hover:bg-info-blue/5"
              onClick={openResumeModal}
              disabled={!canResume || bulkResume.isLoading}
            >
              재개
            </Button>
            <Button
              type="button"
              size="small"
              variant="gradient"
              onClick={handleCampaignGroupClick}
            >
              캠페인 연결 설정
            </Button>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <CampaignTable
            embedded
            campaigns={campaigns}
            onRowClick={(id) => handleCampaignClick(id)}
            selectedProjectIds={selectedIds}
            onToggleProject={toggleProject}
            onToggleSelectAllVisible={toggleSelectAllVisible}
          />
        </div>
      </Card>

      <Modal
        isOpen={bulkStop.isOpen}
        onClose={bulkStop.closeModal}
        title="캠페인 운영 중단"
      >
        <ModalContent
          icon={<WarnCircleIcon className="h-7 w-7 text-info-red" />}
          title={
            pauseScope === "all"
              ? "운영 중인 캠페인을 모두 중단할까요?"
              : "선택한 캠페인을 중단할까요?"
          }
          description={
            pauseScope === "all"
              ? `운영 중인 ${ongoingAllCount}개 캠페인의 광고 노출이 즉시 중단됩니다.`
              : `선택한 ${selectedOngoingIds.length}개 캠페인의 광고 노출이 즉시 중단됩니다.`
          }
          detailItems={pauseDetailItems}
          detailListTitle="중단 대상 캠페인"
          buttonText="중단하기"
          onConfirm={() =>
            bulkStop.handleConfirm(async () => {
              if (!orgId) return;
              if (pauseScope === "all") {
                await updateAllCampaignStatus(orgId, "PAUSED");
              } else {
                await Promise.all(
                  selectedOngoingIds.map((projectId) =>
                    updateCampaignStatus(orgId, projectId, "PAUSED"),
                  ),
                );
              }
            })
          }
          isLoading={bulkStop.isLoading}
          variant="danger"
        />
      </Modal>

      <Modal
        isOpen={bulkResume.isOpen}
        onClose={bulkResume.closeModal}
        title="캠페인 운영 재개"
      >
        <ModalContent
          icon={<WarnCircleIcon className="h-7 w-7 text-info-blue" />}
          title={
            resumeScope === "all"
              ? "중단된 캠페인을 모두 재개할까요?"
              : "선택한 캠페인을 재개할까요?"
          }
          description={
            resumeScope === "all"
              ? `중단된 ${pausedAllCount}개 캠페인의 광고 노출이 즉시 재개됩니다.`
              : `선택한 ${selectedPausedIds.length}개 캠페인의 광고 노출이 즉시 재개됩니다.`
          }
          detailItems={resumeDetailItems}
          detailListTitle="재개 대상 캠페인"
          buttonText="재개하기"
          onConfirm={() =>
            bulkResume.handleConfirm(async () => {
              if (!orgId) return;
              if (resumeScope === "all") {
                await updateAllCampaignStatus(orgId, "ON_GOING");
              } else {
                await Promise.all(
                  selectedPausedIds.map((projectId) =>
                    updateCampaignStatus(orgId, projectId, "ON_GOING"),
                  ),
                );
              }
            })
          }
          isLoading={bulkResume.isLoading}
          variant="primary"
        />
      </Modal>
    </section>
  );
}
