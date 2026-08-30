import { useMemo, useState } from "react";

import type { TStatus } from "@/types/ads/campaign";

import { useControlModal } from "@/hooks/ads/useControlModal";

import type { TModalDetailItem } from "@/components/common/modal/ModalContent";

/** 중단/재개 적용 범위 — 선택 항목만 vs 전체(운영 중·중단 상태 기준) */
export type TBulkScope = "selection" | "all";

/**
 * 훅 내부에서 공통 계산에 쓰는 정규화된 항목.
 * 캠페인(projectId) / 광고 소재(id) 등 원본 타입을 getId·getLabel·getStatus로 맞춘 뒤 사용
 */
export interface IBulkOperableItem {
  id: number;
  status: TStatus;
  label: string;
}

/**
 * 중단/재개 모달·토스트 문구
 * 캠페인 목록 / 캠페인 상세(광고 소재)에서 entityName 등만 바꿔 재사용
 */
export interface IBulkOperableCopy {
  /** "캠페인" | "광고 소재" — 모달 제목·설명에 삽입 */
  entityName: string;
  pauseModalTitle: string;
  resumeModalTitle: string;
  pauseDetailListTitle: string;
  resumeDetailListTitle: string;
  successMessage: string;
  pauseErrorMessage: string;
  resumeErrorMessage: string;
  /** 설명 문구용 — 캠페인: "광고 노출", 광고 소재: "노출" */
  exposureNoun: string;
}

export interface IUseBulkOperableControlParams<T> {
  items: readonly T[];
  selectedIds: ReadonlySet<number>;
  getId: (item: T) => number;
  getLabel: (item: T) => string;
  getStatus: (item: T) => TStatus;
  copy: IBulkOperableCopy;
  /** 중단/재개 성공 후 선택 해제 등 */
  onSuccess?: () => void;
}

/** 캠페인·광고 소재 공통 — 선택/scope 계산, 모달 상태, 대상 목록 */
export function useBulkOperableControl<T>({
  items,
  selectedIds,
  getId,
  getLabel,
  getStatus,
  copy,
  onSuccess,
}: IUseBulkOperableControlParams<T>) {
  const normalizedItems = useMemo<IBulkOperableItem[]>(
    () =>
      items.map((item) => ({
        id: getId(item),
        status: getStatus(item),
        label: getLabel(item),
      })),
    [items, getId, getLabel, getStatus],
  );

  const [pauseScope, setPauseScope] = useState<TBulkScope>("all");
  const [resumeScope, setResumeScope] = useState<TBulkScope>("all");

  const selectedOngoingIds = useMemo(
    () =>
      [...selectedIds].filter((id) =>
        normalizedItems.some(
          (item) => item.id === id && item.status === "ON_GOING",
        ),
      ),
    [selectedIds, normalizedItems],
  );

  const selectedPausedIds = useMemo(
    () =>
      [...selectedIds].filter((id) =>
        normalizedItems.some(
          (item) => item.id === id && item.status === "PAUSED",
        ),
      ),
    [selectedIds, normalizedItems],
  );

  const ongoingAllCount = useMemo(
    () => normalizedItems.filter((item) => item.status === "ON_GOING").length,
    [normalizedItems],
  );

  const pausedAllCount = useMemo(
    () => normalizedItems.filter((item) => item.status === "PAUSED").length,
    [normalizedItems],
  );

  const canPause = useMemo(() => {
    if (selectedOngoingIds.length > 0) return true;
    return selectedIds.size === 0 && ongoingAllCount > 0;
  }, [selectedOngoingIds.length, selectedIds.size, ongoingAllCount]);

  const canResume = useMemo(() => {
    if (selectedPausedIds.length > 0) return true;
    return selectedIds.size === 0 && pausedAllCount > 0;
  }, [selectedPausedIds.length, selectedIds.size, pausedAllCount]);

  const pauseModal = useControlModal({
    successMessage: copy.successMessage,
    errorMessage: copy.pauseErrorMessage,
    onSuccess,
  });

  const resumeModal = useControlModal({
    successMessage: copy.successMessage,
    errorMessage: copy.resumeErrorMessage,
    onSuccess,
  });

  const openPauseModal = () => {
    const scope: TBulkScope =
      selectedOngoingIds.length > 0 ? "selection" : "all";
    setPauseScope(scope);
    pauseModal.openModal();
  };

  const openResumeModal = () => {
    const scope: TBulkScope =
      selectedPausedIds.length > 0 ? "selection" : "all";
    setResumeScope(scope);
    resumeModal.openModal();
  };

  const pauseDetailItems = useMemo((): TModalDetailItem[] => {
    const rows =
      pauseScope === "selection"
        ? normalizedItems.filter((item) => selectedOngoingIds.includes(item.id))
        : normalizedItems.filter((item) => item.status === "ON_GOING");
    return rows.map((item) => ({ id: item.id, label: item.label }));
  }, [pauseScope, normalizedItems, selectedOngoingIds]);

  const resumeDetailItems = useMemo((): TModalDetailItem[] => {
    const rows =
      resumeScope === "selection"
        ? normalizedItems.filter((item) => selectedPausedIds.includes(item.id))
        : normalizedItems.filter((item) => item.status === "PAUSED");
    return rows.map((item) => ({ id: item.id, label: item.label }));
  }, [resumeScope, normalizedItems, selectedPausedIds]);

  return {
    canPause,
    canResume,
    pauseScope,
    resumeScope,
    selectedOngoingIds,
    selectedPausedIds,
    ongoingAllCount,
    pausedAllCount,
    pauseDetailItems,
    resumeDetailItems,
    pauseModal,
    resumeModal,
    openPauseModal,
    openResumeModal,
  };
}
