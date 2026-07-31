//어댑터 + % 계산
import type {
  IBudgetGaugeProps,
  IBudgetSlice,
  IBudgetViewModel,
} from "@/types/dashboard/budget";
import type { IBudgetResponse } from "@/types/dashboard/common";
import type { TProviderType } from "@/types/dashboard/provider";

const WARNING_THRESHOLD = 50;
const DANGER_THRESHOLD = 75;

/** Google/Meta만 일일 예산 게이지 */
export function supportsDailyBudget(provider?: TProviderType): boolean {
  return provider === "GOOGLE" || provider === "META";
}

export function getSpentPercentage(slice: {
  totalBudget: number;
  spent: number;
}): number {
  if (slice.totalBudget <= 0) return 0;
  return Math.round((slice.spent / slice.totalBudget) * 100);
}

/** 화면 큰 숫자 — 남은 % */
export function getRemainingPercentage(slice: {
  totalBudget: number;
  spent: number;
}): number {
  return Math.max(0, 100 - getSpentPercentage(slice));
}

function toGaugeProps(
  slice: IBudgetSlice,
  compact?: boolean,
): IBudgetGaugeProps {
  return {
    ...slice,
    warningThreshold: WARNING_THRESHOLD,
    dangerThreshold: DANGER_THRESHOLD,
    compact,
  };
}

/**
 * API → UI 변환 (나중에 API 바뀌면 여기만 수정)
 *
 * [현재] 단일 IBudgetResponse 가정
 * [통합] provider 없음 → lifetime 1개, daily 없음
 * [Google/Meta] lifetime + daily (daily는 API 전 임시)
 * [Naver] lifetime만
 */
export function mapBudgetResponseToViewModel(
  data: IBudgetResponse,
  provider?: TProviderType,
): IBudgetViewModel {
  const lifetime: IBudgetSlice = {
    label: "전체 예산",
    totalBudget: data.totalBudget,
    spent: data.totalSpend,
  };

  // TODO: 백엔드 daily 필드 확정 후 교체
  const daily: IBudgetSlice | undefined = supportsDailyBudget(provider)
    ? {
        label: "일일 예산",
        totalBudget: data.totalBudget,
        spent: data.totalSpend,
      }
    : undefined;

  return { lifetime, daily };
}

/** useBudget select에서 쓸 최종 형태 */
export function toBudgetQueryData(
  data: IBudgetResponse,
  provider?: TProviderType,
) {
  const viewModel = mapBudgetResponseToViewModel(data, provider);
  const hasDaily = !!viewModel.daily;

  return {
    viewModel,
    lifetimeGauge: toGaugeProps(viewModel.lifetime, hasDaily),
    dailyGauge: viewModel.daily
      ? toGaugeProps(viewModel.daily, true)
      : undefined,
  };
}
