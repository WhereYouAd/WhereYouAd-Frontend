import type {
  IBudgetGaugeProps,
  IBudgetSlice,
  IBudgetViewModel,
} from "@/types/dashboard/budget";
import type {
  IBudgetAmountSlice,
  IBudgetResponse,
} from "@/types/dashboard/common";
import type { TProviderType } from "@/types/dashboard/provider";

const WARNING_THRESHOLD = 50;
const DANGER_THRESHOLD = 75;

/** Google/Meta 플랫폼 — 일일 예산 게이지 */
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

function toAmountSlice(
  data: IBudgetResponse,
  slice?: IBudgetAmountSlice,
): IBudgetAmountSlice {
  return (
    slice ?? {
      totalBudget: data.totalBudget,
      totalSpend: data.totalSpend,
    }
  );
}

function toBudgetSlice(
  label: IBudgetSlice["label"],
  amount: IBudgetAmountSlice,
): IBudgetSlice {
  return {
    label,
    totalBudget: amount.totalBudget,
    spent: amount.totalSpend,
  };
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

/** 통합: Google·Meta + Naver (전체 예산 각 1개) */
function mapOverviewBudgetViewModel(data: IBudgetResponse): IBudgetViewModel {
  const googleMeta = toAmountSlice(data, data.googleMeta);
  const naver = data.naver ?? { totalBudget: 0, totalSpend: 0 };

  return {
    slices: [
      toBudgetSlice("Google·Meta", googleMeta),
      toBudgetSlice("NAVER", naver),
    ],
  };
}

/** 플랫폼: Google/Meta → 전체+일일, Naver → 전체만 */
function mapPlatformBudgetViewModel(
  data: IBudgetResponse,
  provider: TProviderType,
): IBudgetViewModel {
  const lifetime = toBudgetSlice(
    "전체 예산",
    toAmountSlice(data, data.lifetime),
  );

  if (!supportsDailyBudget(provider)) {
    return { slices: [lifetime] };
  }

  const daily = toBudgetSlice("일일 예산", toAmountSlice(data, data.daily));

  return { slices: [lifetime, daily] };
}

/**
 * API → UI 변환 (API 스펙 변경 시 여기만 수정)
 *
 * [통합] googleMeta + naver (legacy: googleMeta만 totalBudget/totalSpend fallback)
 * [Google/Meta] lifetime + daily
 * [Naver] lifetime만
 */
export function mapBudgetResponseToViewModel(
  data: IBudgetResponse,
  provider?: TProviderType,
): IBudgetViewModel {
  if (provider === undefined) {
    return mapOverviewBudgetViewModel(data);
  }
  return mapPlatformBudgetViewModel(data, provider);
}

/** useBudget select에서 쓸 최종 형태 */
export function toBudgetQueryData(
  data: IBudgetResponse,
  provider?: TProviderType,
) {
  const viewModel = mapBudgetResponseToViewModel(data, provider);
  const isCompact = viewModel.slices.length > 1;

  const gauges = viewModel.slices.map((slice) =>
    toGaugeProps(slice, isCompact),
  );

  return {
    viewModel,
    gauges,
    statusGauge: gauges[0],
  };
}
