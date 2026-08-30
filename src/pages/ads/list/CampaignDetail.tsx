import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import type {
  IAd,
  IPlatformBudgetSummary,
  TPlatform,
} from "@/types/ads/campaign";

import { AD_PLATFORM_ORDER, groupAdsByPlatform } from "@/utils/ads/adPlatform";
import {
  groupPlatformBudgetsByPlatform,
  providerTypeToPlatform,
  resolvePlatformBudgets,
} from "@/utils/ads/projectBudget";

import { useAdList } from "@/hooks/ads/useAdList";
import {
  type IBulkOperableCopy,
  useBulkOperableControl,
} from "@/hooks/ads/useBulkOperableControl";
import { useCampaignDetail } from "@/hooks/ads/useCampaignDetail";
import { useUpdateAdStatus } from "@/hooks/ads/useUpdateAdStatus";

import AdListTable from "@/components/ads/AdListTable";
import BulkStatusActionModals from "@/components/ads/BulkStatusActionModals";
import CampaignPlatformSection from "@/components/ads/CampaignPlatformSection";
import EditPlatformBudgetModal from "@/components/ads/EditPlatformBudgetModal";
import {
  CampaignDetailAdsSectionSkeleton,
  CampaignDetailPageSkeleton,
} from "@/components/ads/skeleton/AdsSkeleton";
import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import AreaErrorFallback from "@/components/common/error/AreaErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";

import type { TMainLayoutOutletContext } from "@/layout/main/MainLayout";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const AD_BULK_COPY: IBulkOperableCopy = {
  entityName: "광고 소재",
  entityObject: "광고 소재를",
  pauseModalTitle: "광고 소재 중단",
  resumeModalTitle: "광고 소재 재개",
  pauseDetailListTitle: "중단 대상 광고",
  resumeDetailListTitle: "재개 대상 광고",
  successMessage: "광고 소재 운영 상태가 반영되었습니다.",
  pauseErrorMessage: "중단 처리에 실패했습니다.",
  resumeErrorMessage: "재개 처리에 실패했습니다.",
  exposureNoun: "노출",
};

const getAdId = (ad: IAd) => ad.id;
const getAdLabel = (ad: IAd) => ad.name;
const getAdStatus = (ad: IAd) => ad.status;

const PLATFORM_WORDMARK: Record<TPlatform, string> = {
  naver: "NAVER",
  meta: "META",
  google: "GOOGLE",
};

const platformSectionBlockClass =
  "flex flex-col gap-6 px-6 py-6 tablet:px-5 tablet:py-5 mobile:gap-4 mobile:px-4 mobile:py-4";

const platformSectionDividerClass = "border-t border-surface-400/75";

function providerWordmark(provider: string): string {
  const key = provider.toLowerCase() as TPlatform;
  if (key === "naver" || key === "meta" || key === "google") {
    return PLATFORM_WORDMARK[key];
  }
  return provider.toUpperCase();
}

export default function CampaignDetail() {
  const navigate = useNavigate();
  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();
  const orgIdNum = orgId ? Number(orgId) : null;
  const projectIdNum = projectId ? Number(projectId) : null;
  const isOrgMatched =
    selectedOrgId != null && orgIdNum != null && orgIdNum === selectedOrgId;

  useEffect(() => {
    if (selectedOrgId == null || orgIdNum == null) return;
    if (!isOrgMatched) {
      navigate("/ads", { replace: true });
    }
  }, [selectedOrgId, orgIdNum, isOrgMatched, navigate]);

  const { data, isLoading } = useCampaignDetail({ enabled: isOrgMatched });

  const { ads, isAdLoading } = useAdList(
    isOrgMatched ? orgIdNum : null,
    isOrgMatched ? projectIdNum : null,
  );
  const { mutateAsync: mutateAdStatus } = useUpdateAdStatus(
    isOrgMatched ? orgIdNum : null,
    isOrgMatched ? projectIdNum : null,
  );

  const { setCampaignDetailHeaderTitle } =
    useOutletContext<TMainLayoutOutletContext>();

  const adsList = ads ?? [];

  const [selectedAdIds, setSelectedAdIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const [budgetEditTarget, setBudgetEditTarget] =
    useState<IPlatformBudgetSummary | null>(null);
  const [isBudgetEditOpen, setIsBudgetEditOpen] = useState(false);

  const clearAdSelection = useCallback(() => {
    setSelectedAdIds(new Set());
  }, []);

  const bulk = useBulkOperableControl({
    items: adsList,
    selectedIds: selectedAdIds,
    getId: getAdId,
    getLabel: getAdLabel,
    getStatus: getAdStatus,
    copy: AD_BULK_COPY,
    onSuccess: clearAdSelection,
  });

  const toggleAd = useCallback((adId: number) => {
    setSelectedAdIds((prev) => {
      const next = new Set(prev);
      if (next.has(adId)) next.delete(adId);
      else next.add(adId);
      return next;
    });
  }, []);

  const toggleSelectAllVisible = useCallback((targetIds: readonly number[]) => {
    setSelectedAdIds((prev) => {
      const allOn =
        targetIds.length > 0 && targetIds.every((id) => prev.has(id));
      if (allOn) {
        const next = new Set(prev);
        targetIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...targetIds]);
    });
  }, []);

  const platformBudgets = useMemo(
    () =>
      resolvePlatformBudgets({
        providers: data?.providers ?? [],
        platformBudgets: data?.platformBudgets,
      }),
    [data?.providers, data?.platformBudgets],
  );

  const budgetsByPlatform = useMemo(
    () => groupPlatformBudgetsByPlatform(platformBudgets),
    [platformBudgets],
  );

  const platformSections = useMemo(() => {
    if (!data) return [];

    const fromAds = groupAdsByPlatform(adsList, data.providers);
    const seen = new Set(fromAds.map((section) => section.platform));

    // 광고 0개여도 예산 API 있으면 섹션 표시
    for (const budget of platformBudgets) {
      const platform = providerTypeToPlatform(budget.provider);
      if (!seen.has(platform)) {
        fromAds.push({ platform, ads: [] });
        seen.add(platform);
      }
    }

    return fromAds.sort(
      (a, b) =>
        AD_PLATFORM_ORDER.indexOf(a.platform) -
        AD_PLATFORM_ORDER.indexOf(b.platform),
    );
  }, [adsList, data, platformBudgets]);

  useEffect(() => {
    if (!setCampaignDetailHeaderTitle) return;
    if (!isOrgMatched) {
      setCampaignDetailHeaderTitle(null);
      return undefined;
    }
    if (data?.name) {
      setCampaignDetailHeaderTitle(data.name);
      return () => {
        setCampaignDetailHeaderTitle(null);
      };
    }
    setCampaignDetailHeaderTitle(null);
    return undefined;
  }, [data?.name, isOrgMatched, setCampaignDetailHeaderTitle]);

  // 선택 워크스페이스와 URL org 불일치/미확정 시 상세·캐시 노출 방지
  if (!isOrgMatched) {
    return <CampaignDetailPageSkeleton />;
  }

  if (isLoading) {
    return <CampaignDetailPageSkeleton />;
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
      <Card className="px-6 py-8 tablet:px-5 tablet:py-7 mobile:px-4 mobile:py-6">
        <header className="flex w-full flex-col gap-6 mobile:gap-7">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <h1 className="min-w-0 wrap-break-word font-heading2-rsp text-text-title">
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
        <CampaignDetailAdsSectionSkeleton />
      ) : (
        <Card className="flex flex-col overflow-hidden p-0">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-surface-400/75 bg-surface-100 px-6 py-4 tablet:px-5 tablet:py-3.5 mobile:flex-col mobile:items-stretch mobile:px-4">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 mobile:flex-none">
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
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 mobile:w-full">
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
          </div>

          {platformSections.length > 0 ? (
            <div className="flex flex-col">
              {platformSections.map(({ platform, ads: platformAds }, index) => (
                <div
                  key={platform}
                  className={
                    index > 0
                      ? `${platformSectionBlockClass} ${platformSectionDividerClass}`
                      : platformSectionBlockClass
                  }
                >
                  <CampaignPlatformSection
                    platform={platform}
                    platformBudgets={budgetsByPlatform.get(platform)}
                    onEditBudget={(budget) => {
                      setBudgetEditTarget(budget);
                      setIsBudgetEditOpen(true);
                    }}
                  />
                  {platformAds.length > 0 ? (
                    <ErrorBoundary
                      FallbackComponent={AreaErrorFallback}
                      resetKeys={[platformAds]}
                    >
                      <AdListTable
                        embedded
                        hidePlatformColumn
                        ads={platformAds}
                        selectedAdIds={selectedAdIds}
                        onToggleAd={toggleAd}
                        onToggleSelectAllVisible={toggleSelectAllVisible}
                      />
                    </ErrorBoundary>
                  ) : (
                    <p className="py-8 text-center font-body2 text-text-placeholder">
                      이 플랫폼에 연결된 광고 소재가 없습니다.
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-16 text-center font-body1 text-text-placeholder tablet:px-5 mobile:px-4">
              연결된 광고 소재가 없습니다.
            </p>
          )}
        </Card>
      )}

      <BulkStatusActionModals
        copy={AD_BULK_COPY}
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
          mutateAdStatus({
            adContentIds:
              bulk.pauseScope === "all"
                ? adsList
                    .filter((a) => a.status === "ON_GOING")
                    .map((a) => a.id)
                : bulk.selectedOngoingIds,
            status: "PAUSED",
          })
        }
        onConfirmResume={() =>
          mutateAdStatus({
            adContentIds:
              bulk.resumeScope === "all"
                ? adsList.filter((a) => a.status === "PAUSED").map((a) => a.id)
                : bulk.selectedPausedIds,
            status: "ON_GOING",
          })
        }
      />
      {orgIdNum != null && projectIdNum != null ? (
        <EditPlatformBudgetModal
          isOpen={isBudgetEditOpen}
          onClose={() => {
            setIsBudgetEditOpen(false);
          }}
          onClosed={() => {
            setBudgetEditTarget(null);
          }}
          budget={budgetEditTarget}
          orgId={orgIdNum}
          projectId={projectIdNum}
        />
      ) : null}
    </section>
  );
}
