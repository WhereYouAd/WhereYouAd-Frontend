import type {
  IBudgetGaugeProps,
  IBudgetSlice,
  IBudgetViewModel,
} from "@/types/dashboard/budget";
import type {
  IBudgetGroup,
  IBudgetResponse,
  TDashboardBudgetType,
} from "@/types/dashboard/common";
import type { TProviderType } from "@/types/dashboard/provider";

const WARNING_THRESHOLD = 50;
const DANGER_THRESHOLD = 75;

/** BudgetGaugeChart showInsight 기본값 */
export const SHOW_BUDGET_GAUGE_INSIGHT = true;

const BUDGET_TYPE_LABEL: Record<TDashboardBudgetType, IBudgetSlice["label"]> = {
  TOTAL: "전체 예산",
  DAILY: "일일 예산",
};

/** Google/Meta 플랫폼 — 일일 예산 게이지 (skeleton·ads용) */
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

export type TBudgetStatus = "안정" | "주의" | "위험";

export function getBudgetStatus(
  percentage: number,
  warningThreshold: number,
  dangerThreshold: number,
): TBudgetStatus {
  if (percentage >= dangerThreshold) return "위험";
  if (percentage >= warningThreshold) return "주의";
  return "안정";
}

export const statusPointClasses: Record<TBudgetStatus, string> = {
  안정: "bg-info-blue",
  주의: "bg-info-yellow",
  위험: "bg-info-red",
};

/** Naver 플랫폼만 DAILY 숨김 (통합 ALL은 TOTAL+DAILY 그대로) */
function filterBudgetGroups(
  groups: IBudgetGroup[],
  provider?: TProviderType,
): IBudgetGroup[] {
  if (provider === "NAVER") {
    return groups.filter((group) => group.budgetType === "TOTAL");
  }
  return groups;
}

function toBudgetSliceFromGroup(group: IBudgetGroup): IBudgetSlice {
  return {
    label: BUDGET_TYPE_LABEL[group.budgetType],
    totalBudget: group.detail.budget,
    spent: group.detail.spend,
  };
}

function toGaugeProps(
  slice: IBudgetSlice,
  { compact = false, showInsight = SHOW_BUDGET_GAUGE_INSIGHT } = {},
): IBudgetGaugeProps {
  return {
    ...slice,
    warningThreshold: WARNING_THRESHOLD,
    dangerThreshold: DANGER_THRESHOLD,
    compact,
    showInsight,
  };
}

/**
 * API → UI 변환
 *
 * [통합] groups 그대로 (TOTAL + DAILY)
 * [Google/Meta] groups 그대로
 * [Naver] TOTAL만
 */
export function mapBudgetResponseToViewModel(
  data: IBudgetResponse,
  provider?: TProviderType,
): IBudgetViewModel {
  const groups = filterBudgetGroups(data.groups, provider);
  return {
    slices: groups.map(toBudgetSliceFromGroup),
  };
}

/** useBudget select에서 쓸 최종 형태 */
export function toBudgetQueryData(
  data: IBudgetResponse,
  provider?: TProviderType,
) {
  const viewModel = mapBudgetResponseToViewModel(data, provider);
  const isCompact = viewModel.slices.length > 1;

  const gauges = viewModel.slices.map((slice) =>
    toGaugeProps(slice, { compact: isCompact, showInsight: true }),
  );

  return {
    viewModel,
    gauges,
  };
}

/** IBudgetSlice[] → BudgetGaugeChart props (ads project 예산 등) */
export function buildBudgetGaugesFromSlices(
  slices: IBudgetSlice[],
  { showInsight = SHOW_BUDGET_GAUGE_INSIGHT } = {},
): IBudgetGaugeProps[] {
  const compact = slices.length > 1;
  return slices.map((slice) => toGaugeProps(slice, { compact, showInsight }));
}
