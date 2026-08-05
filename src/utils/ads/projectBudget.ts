import type {
  IPlatformProjectBudget,
  TPlatform,
  TProvider,
} from "@/types/ads/campaign";
import type { IBudgetGaugeProps } from "@/types/dashboard/budget";

import { resolveEffectivePlatformBudget } from "@/utils/ads/budgetEdit";
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
  const effective = resolveEffectivePlatformBudget(budget);

  return buildBudgetGaugesFromSlices(
    [
      {
        label: effective.label,
        totalBudget: effective.totalBudget,
        spent: effective.totalSpend,
      },
    ],
    { showInsight: true },
  );
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
