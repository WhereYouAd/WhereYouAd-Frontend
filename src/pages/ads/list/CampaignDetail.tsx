import { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import type { TPlatform } from "@/types/ads/campaign";

import { useAdList } from "@/hooks/ads/useAdList";
import { useCampaignDetail } from "@/hooks/ads/useCampaignDetail";
import { useControlModal } from "@/hooks/ads/useControlModal";

import AdListTable from "@/components/ads/AdListTable";
import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";

import { updateAdStatus } from "@/api/ads/ads";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import type { TMainLayoutOutletContext } from "@/layout/main/MainLayout";

const PLATFORM_WORDMARK: Record<TPlatform, string> = {
  naver: "NAVER",
  kakao: "KAKAO",
  google: "GOOGLE",
};

function providerWordmark(provider: string): string {
  const key = provider.toLowerCase() as TPlatform;
  if (key === "naver" || key === "kakao" || key === "google") {
    return PLATFORM_WORDMARK[key];
  }
  return provider.toUpperCase();
}

export default function CampaignDetail() {
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();
  const orgIdNum = orgId ? Number(orgId) : null;
  const projectIdNum = projectId ? Number(projectId) : null;

  const { data, isLoading } = useCampaignDetail();

  const { ads, isAdLoading, refetchAds } = useAdList(orgIdNum, projectIdNum);

  const { setCampaignDetailHeaderTitle } =
    useOutletContext<TMainLayoutOutletContext>();

  const adsList = ads ?? [];

  const [selectedAdIds, setSelectedAdIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const [pauseScope, setPauseScope] = useState<"selection" | "all">("all");
  const [resumeScope, setResumeScope] = useState<"selection" | "all">("all");

  const clearAdSelection = useCallback(() => {
    setSelectedAdIds(new Set());
  }, []);

  const toggleAd = useCallback((adId: number) => {
    setSelectedAdIds((prev) => {
      const next = new Set(prev);
      if (next.has(adId)) next.delete(adId);
      else next.add(adId);
      return next;
    });
  }, []);

  const operableIds = useMemo(
    () => adsList.filter((a) => a.status !== "OVER").map((a) => a.id),
    [adsList],
  );

  const toggleSelectAllVisible = useCallback(() => {
    setSelectedAdIds((prev) => {
      const allOn =
        operableIds.length > 0 && operableIds.every((id) => prev.has(id));
      if (allOn) {
        const next = new Set(prev);
        operableIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...operableIds]);
    });
  }, [operableIds]);

  const selectedOngoingIds = useMemo(
    () =>
      [...selectedAdIds].filter((id) =>
        adsList.some((a) => a.id === id && a.status === "ON_GOING"),
      ),
    [selectedAdIds, adsList],
  );

  const selectedPausedIds = useMemo(
    () =>
      [...selectedAdIds].filter((id) =>
        adsList.some((a) => a.id === id && a.status === "PAUSED"),
      ),
    [selectedAdIds, adsList],
  );

  const ongoingAllCount = useMemo(
    () => adsList.filter((a) => a.status === "ON_GOING").length,
    [adsList],
  );

  const pausedAllCount = useMemo(
    () => adsList.filter((a) => a.status === "PAUSED").length,
    [adsList],
  );

  const canPauseAds = useMemo(() => {
    if (selectedOngoingIds.length > 0) return true;
    return selectedAdIds.size === 0 && ongoingAllCount > 0;
  }, [selectedOngoingIds.length, selectedAdIds.size, ongoingAllCount]);

  const canResumeAds = useMemo(() => {
    if (selectedPausedIds.length > 0) return true;
    return selectedAdIds.size === 0 && pausedAllCount > 0;
  }, [selectedPausedIds.length, selectedAdIds.size, pausedAllCount]);

  const bulkAdPause = useControlModal({
    successMessage: "광고 소재 운영 상태가 반영되었습니다.",
    errorMessage: "중단 처리에 실패했습니다.",
    onSuccess: () => {
      void refetchAds();
      clearAdSelection();
    },
  });

  const bulkAdResume = useControlModal({
    successMessage: "광고 소재 운영 상태가 반영되었습니다.",
    errorMessage: "재개 처리에 실패했습니다.",
    onSuccess: () => {
      void refetchAds();
      clearAdSelection();
    },
  });

  const openAdPauseModal = () => {
    const scope = selectedOngoingIds.length > 0 ? "selection" : "all";
    setPauseScope(scope);
    bulkAdPause.openModal();
  };

  const openAdResumeModal = () => {
    const scope = selectedPausedIds.length > 0 ? "selection" : "all";
    setResumeScope(scope);
    bulkAdResume.openModal();
  };

  const pauseAdDetailItems = useMemo(() => {
    const rows =
      pauseScope === "selection"
        ? adsList.filter((a) => selectedOngoingIds.includes(a.id))
        : adsList.filter((a) => a.status === "ON_GOING");
    return rows.map((a) => ({ id: a.id, label: a.name }));
  }, [pauseScope, adsList, selectedOngoingIds]);

  const resumeAdDetailItems = useMemo(() => {
    const rows =
      resumeScope === "selection"
        ? adsList.filter((a) => selectedPausedIds.includes(a.id))
        : adsList.filter((a) => a.status === "PAUSED");
    return rows.map((a) => ({ id: a.id, label: a.name }));
  }, [resumeScope, adsList, selectedPausedIds]);

  useEffect(() => {
    if (!setCampaignDetailHeaderTitle) return;
    if (data?.name) {
      setCampaignDetailHeaderTitle(data.name);
      return () => {
        setCampaignDetailHeaderTitle(null);
      };
    }
    setCampaignDetailHeaderTitle(null);
    return undefined;
  }, [data?.name, setCampaignDetailHeaderTitle]);

  if (isLoading) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <p className="font-body1 text-text-placeholder">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-text-placeholder">
        정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col gap-8">
      <Card className="px-6 py-8 tablet:px-5 tablet:py-7">
        <header className="flex w-full flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <h1 className="min-w-0 break-words font-heading2 text-text-title">
                {data.name}
              </h1>
              <Badge
                variant={data.status === "ON_GOING" ? "infoBlue" : "surface"}
              >
                {data.status === "ON_GOING"
                  ? "운영 중"
                  : data.status === "PAUSED"
                    ? "중단"
                    : "종료"}
              </Badge>
            </div>
            <span className="shrink-0 text-right font-caption text-text-muted">
              {data.createdAt.replaceAll("-", ".")} 등록
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 tablet:gap-x-10 tablet:gap-y-4">
            <div className="min-w-0">
              <p className="mb-1 font-caption text-text-placeholder">
                캠페인 예산
              </p>
              <p className="font-body1 tabular-nums leading-snug text-text-title">
                {data.budget.toLocaleString()}원
              </p>
            </div>
            <div className="min-w-0">
              <p className="mb-2 font-caption text-text-placeholder">
                연결 플랫폼
              </p>
              <div
                className="flex flex-wrap items-center gap-2"
                aria-label="연결된 광고 플랫폼"
              >
                {data.providers.map((provider) => (
                  <span
                    key={provider}
                    className="inline-flex items-center rounded-lg border border-surface-400/60 bg-surface-200/70 px-2.5 py-1 font-body2 font-medium tracking-wide text-text-title"
                  >
                    {providerWordmark(provider)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {data.description ? (
            <div>
              <p className="mb-2 font-caption text-text-placeholder">
                캠페인 설명
              </p>
              <p className="font-body1 leading-relaxed whitespace-pre-line text-text-body">
                {data.description}
              </p>
            </div>
          ) : null}
        </header>
      </Card>

      {isAdLoading ? (
        <Card className="flex flex-col overflow-hidden p-0">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-surface-400/45 bg-surface-100 px-4 py-4 tablet:px-3 tablet:py-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-2.5 tablet:pl-2">
              <p className="font-caption text-text-placeholder">광고</p>
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-heading3 text-text-title">광고 모아보기</h2>
              </div>
            </div>
          </div>
          <div className="py-20 text-center font-body2 text-text-placeholder">
            연결된 광고를 불러오는 중입니다...
          </div>
        </Card>
      ) : (
        <Card className="flex flex-col overflow-hidden p-0">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-surface-400/45 bg-surface-100 px-4 py-4 tablet:px-3 tablet:py-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-2.5 tablet:pl-2">
              <p className="font-caption text-text-placeholder">광고</p>
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-heading3 text-text-title">광고 모아보기</h2>
                {selectedAdIds.size > 0 ? (
                  <>
                    <span className="font-caption text-text-muted">
                      {selectedAdIds.size}개 선택
                    </span>
                    <button
                      type="button"
                      onClick={clearAdSelection}
                      className="font-caption text-text-muted underline decoration-surface-400 underline-offset-2 transition-colors hover:text-text-title"
                    >
                      선택 해제
                    </button>
                  </>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                size="small"
                variant="dangerSoft"
                onClick={openAdPauseModal}
                disabled={!canPauseAds || bulkAdPause.isLoading}
              >
                중단
              </Button>
              <Button
                type="button"
                size="small"
                variant="outline"
                className="border-info-blue text-info-blue hover:bg-info-blue/5"
                onClick={openAdResumeModal}
                disabled={!canResumeAds || bulkAdResume.isLoading}
              >
                재개
              </Button>
            </div>
          </div>

          <div className="min-h-0 min-w-0 flex-1">
            <AdListTable
              embedded
              ads={adsList}
              refetchAds={refetchAds}
              selectedAdIds={selectedAdIds}
              onToggleAd={toggleAd}
              onToggleSelectAllVisible={toggleSelectAllVisible}
            />
          </div>
        </Card>
      )}

      <Modal
        isOpen={bulkAdPause.isOpen}
        onClose={bulkAdPause.closeModal}
        title="광고 소재 중단"
      >
        <ModalContent
          icon={<WarnCircleIcon className="h-7 w-7 text-info-red" />}
          title={
            pauseScope === "all"
              ? "운영 중인 광고 소재를 모두 중단할까요?"
              : "선택한 광고 소재를 중단할까요?"
          }
          description={
            pauseScope === "all"
              ? `운영 중인 ${ongoingAllCount}개 광고 소재의 노출이 즉시 중단됩니다.`
              : `선택한 ${selectedOngoingIds.length}개 광고 소재의 노출이 즉시 중단됩니다.`
          }
          detailItems={pauseAdDetailItems}
          detailListTitle="중단 대상 광고"
          buttonText="중단하기"
          onConfirm={() =>
            bulkAdPause.handleConfirm(async () => {
              if (orgIdNum == null || projectIdNum == null) return;
              const ids =
                pauseScope === "all"
                  ? adsList
                      .filter((a) => a.status === "ON_GOING")
                      .map((a) => a.id)
                  : selectedOngoingIds;
              await Promise.all(
                ids.map((adContentId) =>
                  updateAdStatus(orgIdNum, projectIdNum, adContentId, "PAUSED"),
                ),
              );
            })
          }
          isLoading={bulkAdPause.isLoading}
          variant="danger"
        />
      </Modal>

      <Modal
        isOpen={bulkAdResume.isOpen}
        onClose={bulkAdResume.closeModal}
        title="광고 소재 재개"
      >
        <ModalContent
          icon={<WarnCircleIcon className="h-7 w-7 text-info-blue" />}
          title={
            resumeScope === "all"
              ? "중단된 광고 소재를 모두 재개할까요?"
              : "선택한 광고 소재를 재개할까요?"
          }
          description={
            resumeScope === "all"
              ? `중단된 ${pausedAllCount}개 광고 소재의 노출이 즉시 재개됩니다.`
              : `선택한 ${selectedPausedIds.length}개 광고 소재의 노출이 즉시 재개됩니다.`
          }
          detailItems={resumeAdDetailItems}
          detailListTitle="재개 대상 광고"
          buttonText="재개하기"
          onConfirm={() =>
            bulkAdResume.handleConfirm(async () => {
              if (orgIdNum == null || projectIdNum == null) return;
              const ids =
                resumeScope === "all"
                  ? adsList
                      .filter((a) => a.status === "PAUSED")
                      .map((a) => a.id)
                  : selectedPausedIds;
              await Promise.all(
                ids.map((adContentId) =>
                  updateAdStatus(
                    orgIdNum,
                    projectIdNum,
                    adContentId,
                    "ON_GOING",
                  ),
                ),
              );
            })
          }
          isLoading={bulkAdResume.isLoading}
          variant="primary"
        />
      </Modal>
    </section>
  );
}
