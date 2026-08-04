import type { TPlatformBudgetType } from "@/types/ads/budget";
import type { TProvider } from "@/types/ads/campaign";

import {
  buildMetaGoogleBudgetPayload,
  buildNaverBudgetPayload,
} from "@/utils/ads/budgetEdit";

import { useCoreMutation } from "@/hooks/customQuery";

import {
  updateGoogleCampaignBudget,
  updateMetaCampaignBudget,
  updateNaverCampaignBudget,
} from "@/api/ads/budget";
import { QUERY_KEYS } from "@/lib/queryKeys";

/** Step 6 모달 submit → mutation 변수 */
export interface IUpdatePlatformBudgetVariables {
  providerType: TProvider;
  adCampaignId?: number;
  activeBudgetType?: TPlatformBudgetType;
  naverConnectionId?: number;
  naverCampaignId?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
}

export function useUpdatePlatformBudget(orgId: number, projectId: number) {
  return useCoreMutation<void, IUpdatePlatformBudgetVariables>(
    async (vars) => {
      switch (vars.providerType) {
        case "META": {
          if (!vars.adCampaignId || !vars.activeBudgetType) {
            throw new Error("Meta 예산 수정 정보가 부족합니다.");
          }
          await updateMetaCampaignBudget(
            vars.adCampaignId,
            buildMetaGoogleBudgetPayload(vars.activeBudgetType, vars),
          );
          return;
        }
        case "GOOGLE": {
          if (!vars.adCampaignId || !vars.activeBudgetType) {
            throw new Error("Google 예산 수정 정보가 부족합니다.");
          }
          await updateGoogleCampaignBudget(
            vars.adCampaignId,
            buildMetaGoogleBudgetPayload(vars.activeBudgetType, vars),
          );
          return;
        }
        case "NAVER": {
          if (!vars.naverConnectionId || !vars.naverCampaignId) {
            throw new Error("Naver 예산 수정 정보가 부족합니다.");
          }
          if (vars.dailyBudget === undefined) {
            throw new Error("일일 예산을 입력해 주세요.");
          }
          await updateNaverCampaignBudget(
            vars.naverConnectionId,
            vars.naverCampaignId,
            buildNaverBudgetPayload(vars.dailyBudget),
          );
          return;
        }
        default:
          throw new Error("지원하지 않는 플랫폼입니다.");
      }
    },
    {
      invalidateKeys: [QUERY_KEYS.campaign.detail(orgId, projectId)],
    },
  );
}
