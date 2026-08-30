import type { TStatus } from "@/types/ads/campaign";

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
