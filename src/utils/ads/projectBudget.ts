import type {
  IPlatformProjectBudget,
  TPlatform,
  TProvider,
} from "@/types/ads/campaign";
import type { IBudgetGaugeProps, IBudgetSlice } from "@/types/dashboard/budget";
import type { TProviderType } from "@/types/dashboard/provider";

import {
  buildBudgetGaugesFromSlices,
  supportsDailyBudget,
} from "@/utils/dashboard/budget";

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

/** project detail — 플랫폼별 BudgetGaugeChart props */
export function mapPlatformProjectBudgetToGauges(
  budget: IPlatformProjectBudget,
): IBudgetGaugeProps[] {
  const provider = budget.providerType as TProviderType;
  const slice = resolvePlatformBudgetDisplaySlice(budget, provider);

  return buildBudgetGaugesFromSlices([slice], { showInsight: true });
}

/** Meta/Google: activeBudgetType 기준 1개 · Naver: 일일 예산만 */
function resolvePlatformBudgetDisplaySlice(
  budget: IPlatformProjectBudget,
  provider: TProviderType,
): IBudgetSlice {
  if (provider === "NAVER") {
    const daily = budget.daily ?? { totalBudget: 0, totalSpend: 0 };
    return {
      label: "일일 예산",
      totalBudget: daily.totalBudget,
      spent: daily.totalSpend,
    };
  }

  const activeType =
    budget.activeBudgetType ?? (budget.daily ? "DAILY" : "LIFETIME");

  if (activeType === "DAILY" && budget.daily) {
    return {
      label: "일일 예산",
      totalBudget: budget.daily.totalBudget,
      spent: budget.daily.totalSpend,
    };
  }

  return {
    label: "전체 예산",
    totalBudget: budget.lifetime.totalBudget,
    spent: budget.lifetime.totalSpend,
  };
}

/** API 미준비 시 dev placeholder */
export function buildPlaceholderPlatformBudgets(
  providers: TPlatform[],
): IPlatformProjectBudget[] {
  return providers.map((platform, index) => {
    const providerType = platformToProviderType(platform);
    const totalBudget = 1_000_000 + index * 200_000;
    const totalSpend = Math.round(totalBudget * (0.2 + index * 0.15));

    const item: IPlatformProjectBudget = {
      providerType,
      adCampaignId: 1000 + index,
      adCampaignName: `${providerType} 매체 캠페인 (mock)`,
      lifetime: { totalBudget, totalSpend },
    };

    if (providerType === "NAVER") {
      item.daily = {
        totalBudget: 50_000,
        totalSpend: 12_000 + index * 2_000,
      };
      item.naverConnectionId = 1;
      item.naverCampaignId = `mock-campaign-${index}`;
      item.canEditBudget = true;
    } else if (supportsDailyBudget(providerType)) {
      item.daily = {
        totalBudget: 50_000,
        totalSpend: 12_000 + index * 2_000,
      };
      item.activeBudgetType = index % 2 === 0 ? "DAILY" : "LIFETIME";
      item.canEditBudget = true;
    }

    return item;
  });
}

/** API 응답 + fallback (platformBudgets 없으면 mock) */
export function resolvePlatformBudgets(input: {
  providers: TPlatform[];
  platformBudgets?: IPlatformProjectBudget[];
}): IPlatformProjectBudget[] {
  if (input.platformBudgets?.length) return input.platformBudgets;
  if (input.providers.length === 0) return [];
  return buildPlaceholderPlatformBudgets(input.providers);
}
