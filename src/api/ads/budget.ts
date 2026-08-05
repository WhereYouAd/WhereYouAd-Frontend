import type {
  IMetaGoogleBudgetUpdateData,
  INaverBudgetUpdateData,
  INaverBudgetUpdateRequest,
  TMetaGoogleBudgetUpdateRequest,
} from "@/types/ads/budget";
import type { ICommonResponse } from "@/types/common/common";

import { axiosInstance } from "@/lib/axiosInstance";

/**
 * Meta 캠페인 예산 수정
 * PATCH /api/meta/campaigns/{adCampaignId}/budget
 * — daily / lifetime 중 하나만 수정 가능, 기존 유형과 동일해야 함
 */
export async function updateMetaCampaignBudget(
  adCampaignId: number,
  body: TMetaGoogleBudgetUpdateRequest,
): Promise<IMetaGoogleBudgetUpdateData> {
  const { data } = await axiosInstance.patch<
    ICommonResponse<IMetaGoogleBudgetUpdateData>
  >(`/api/meta/campaigns/${adCampaignId}/budget`, body);
  return data.data;
}

/**
 * Naver 캠페인 예산 수정
 * PUT /api/naver/{connectionId}/campaigns/{campaignId}/budget
 */
export async function updateNaverCampaignBudget(
  connectionId: number,
  campaignId: string,
  body: INaverBudgetUpdateRequest,
): Promise<INaverBudgetUpdateData> {
  const { data } = await axiosInstance.put<
    ICommonResponse<INaverBudgetUpdateData>
  >(`/api/naver/${connectionId}/campaigns/${campaignId}/budget`, body);
  return data.data;
}

/**
 * Google 캠페인 예산 수정
 * PATCH /api/google/campaigns/{adCampaignId}/budget
 */
export async function updateGoogleCampaignBudget(
  adCampaignId: number,
  body: TMetaGoogleBudgetUpdateRequest,
): Promise<IMetaGoogleBudgetUpdateData> {
  const { data } = await axiosInstance.patch<
    ICommonResponse<IMetaGoogleBudgetUpdateData>
  >(`/api/google/campaigns/${adCampaignId}/budget`, body);
  return data.data;
}
