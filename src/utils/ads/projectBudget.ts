import type { TPlatformBudgetType } from "@/types/ads/budget";
import type {
  IPlatformBudgetSummary,
  TPlatform,
  TProvider,
} from "@/types/ads/campaign";
import type { IBudgetGaugeProps } from "@/types/dashboard/budget";

import {
  buildBudgetGaugesFromSlices,
  supportsDailyBudget,
} from "@/utils/dashboard/budget";

const BUDGET_TYPE_LABEL: Record<
  TPlatformBudgetType,
  "전체 예산" | "일일 예산"
> = {
  TOTAL: "전체 예산",
  DAILY: "일일 예산",
};

export function providerTypeToPlatform(
  provider: TProvider | string,
): TPlatform {
  const key = String(provider).toUpperCase();
  if (key === "GOOGLE") return "google";
  if (key === "META") return "meta";
  if (key === "NAVER") return "naver";
  return "naver";
}

export function platformToProviderType(platform: TPlatform): TProvider {
  return platform.toUpperCase() as TProvider;
}

/**
 * 플랫폼별 표시할 budget rows
 * — Naver: TOTAL 우선, TOTAL 없고 DAILY만 있으면 DAILY 표시
 */
export function filterPlatformBudgetSummariesForDisplay(
  summaries: IPlatformBudgetSummary[],
): IPlatformBudgetSummary[] {
  const hasNaverTotal = summaries.some(
    (row) => row.provider === "NAVER" && row.budgetType === "TOTAL",
  );

  return summaries.filter((row) => {
    if (row.provider !== "NAVER") return true;
    if (row.budgetType === "TOTAL") return true;
    // TOTAL이 있을 때만 DAILY 숨김 (둘 다 오면 전체만)
    if (row.budgetType === "DAILY") return !hasNaverTotal;
    return true;
  });
}

/** project detail — 플랫폼별 게이지 props */
export function mapPlatformBudgetSummariesToGauges(
  summaries: IPlatformBudgetSummary[],
): IBudgetGaugeProps[] {
  const visible = filterPlatformBudgetSummariesForDisplay(summaries);

  return buildBudgetGaugesFromSlices(
    visible.map((row) => ({
      label: BUDGET_TYPE_LABEL[row.budgetType],
      totalBudget: row.budget,
      spent: row.spend,
    })),
    { showInsight: true },
  );
}

/** 수정 모달용 — 플랫폼에서 대표 row 선택 */
export function pickEditablePlatformBudget(
  summaries: IPlatformBudgetSummary[],
): IPlatformBudgetSummary | null {
  if (summaries.length === 0) return null;

  const provider = summaries[0]?.provider;
  if (provider === "NAVER") {
    return (
      summaries.find((row) => row.budgetType === "TOTAL") ??
      summaries[0] ??
      null
    );
  }

  return (
    summaries.find((row) => row.budgetType === "DAILY") ??
    summaries.find((row) => row.budgetType === "TOTAL") ??
    summaries[0] ??
    null
  );
}

/** API 미준비 시(platformBudgets 필드 자체 없음) dev placeholder */
export function buildPlaceholderPlatformBudgets(
  providers: TPlatform[],
): IPlatformBudgetSummary[] {
  const rows: IPlatformBudgetSummary[] = [];

  providers.forEach((platform, index) => {
    const provider = platformToProviderType(platform);
    const totalBudget = 1_000_000 + index * 200_000;
    const totalSpend = Math.round(totalBudget * (0.2 + index * 0.15));

    rows.push({
      provider,
      budgetType: "TOTAL",
      budget: totalBudget,
      spend: totalSpend,
      remainingBudget: Math.max(0, totalBudget - totalSpend),
      remainingPercentage:
        totalBudget > 0
          ? Math.round(((totalBudget - totalSpend) / totalBudget) * 100)
          : 100,
      adCampaignId: 1000 + index,
      adCampaignName: `${provider} 매체 캠페인 (mock)`,
      canEditBudget: false,
    });

    if (supportsDailyBudget(provider)) {
      const dailyBudget = 50_000;
      const dailySpend = 12_000 + index * 2_000;
      rows.push({
        provider,
        budgetType: "DAILY",
        budget: dailyBudget,
        spend: dailySpend,
        remainingBudget: Math.max(0, dailyBudget - dailySpend),
        remainingPercentage: Math.round(
          ((dailyBudget - dailySpend) / dailyBudget) * 100,
        ),
        adCampaignId: 1000 + index,
        adCampaignName: `${provider} 매체 캠페인 (mock)`,
        canEditBudget: false,
      });
    }
  });

  return rows;
}

/** API 응답 우선 — 필드가 있으면(빈 배열 포함) 그대로 사용 */
export function resolvePlatformBudgets(input: {
  providers: TPlatform[];
  platformBudgets?: IPlatformBudgetSummary[];
}): IPlatformBudgetSummary[] {
  if (input.platformBudgets !== undefined) return input.platformBudgets;
  if (input.providers.length === 0) return [];
  return buildPlaceholderPlatformBudgets(input.providers);
}

export function groupPlatformBudgetsByPlatform(
  budgets: IPlatformBudgetSummary[],
): Map<TPlatform, IPlatformBudgetSummary[]> {
  const map = new Map<TPlatform, IPlatformBudgetSummary[]>();
  for (const budget of budgets) {
    const platform = providerTypeToPlatform(budget.provider);
    const list = map.get(platform) ?? [];
    list.push(budget);
    map.set(platform, list);
  }
  return map;
}
