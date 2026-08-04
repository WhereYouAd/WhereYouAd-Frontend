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

  const slices: IBudgetSlice[] = [
    {
      label: "전체 예산",
      totalBudget: budget.lifetime.totalBudget,
      spent: budget.lifetime.totalSpend,
    },
  ];

  if (supportsDailyBudget(provider) && budget.daily) {
    slices.push({
      label: "일일 예산",
      totalBudget: budget.daily.totalBudget,
      spent: budget.daily.totalSpend,
    });
  }

  return buildBudgetGaugesFromSlices(slices, { showInsight: true });
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

    if (supportsDailyBudget(providerType)) {
      item.daily = {
        totalBudget: 50_000,
        totalSpend: 12_000 + index * 2_000,
      };
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
