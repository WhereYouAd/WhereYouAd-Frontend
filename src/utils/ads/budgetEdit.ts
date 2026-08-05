import { z } from "zod";

import type {
  INaverBudgetUpdateRequest,
  TMetaGoogleBudgetUpdateRequest,
  TPlatformBudgetType,
} from "@/types/ads/budget";
import type { IPlatformProjectBudget } from "@/types/ads/campaign";

/** 예산 수정 불가 사유 — canSubmitPlatformBudgetEdit 반환값 */
export type TBudgetEditBlockReason =
  | "MISSING_PLATFORM_BUDGET"
  | "NOT_EDITABLE"
  | "MISSING_META_CONTEXT"
  | "MISSING_GOOGLE_CONTEXT"
  | "MISSING_NAVER_CONTEXT";

export const BUDGET_EDIT_BLOCK_MESSAGES: Record<
  TBudgetEditBlockReason,
  string
> = {
  MISSING_PLATFORM_BUDGET: "예산 정보를 불러올 수 없습니다.",
  NOT_EDITABLE: "예산을 수정할 권한이 없습니다.",
  MISSING_META_CONTEXT: "예산 수정에 필요한 Meta 정보가 없습니다.",
  MISSING_GOOGLE_CONTEXT: "예산 수정에 필요한 Google 정보가 없습니다.",
  MISSING_NAVER_CONTEXT: "예산 수정에 필요한 Naver 정보가 없습니다.",
};

const positiveBudget = z
  .number({ message: "숫자를 입력해 주세요." })
  .int("정수만 입력할 수 있습니다.")
  .min(1, "1원 이상 입력해 주세요.");

/** Meta / Google DAILY / Naver 일일 */
export const dailyBudgetFormSchema = z.object({
  dailyBudget: positiveBudget,
});

/** Meta / Google LIFETIME */
export const lifetimeBudgetFormSchema = z.object({
  lifetimeBudget: positiveBudget,
});

/** Naver */
export const naverBudgetFormSchema = z.object({
  dailyBudget: positiveBudget,
});

export type TDailyBudgetFormValues = z.infer<typeof dailyBudgetFormSchema>;
export type TLifetimeBudgetFormValues = z.infer<
  typeof lifetimeBudgetFormSchema
>;
export type TNaverBudgetFormValues = z.infer<typeof naverBudgetFormSchema>;

export type TBudgetEditFormValues =
  | TDailyBudgetFormValues
  | TLifetimeBudgetFormValues
  | TNaverBudgetFormValues;

export type TBudgetEditModalFormValues = {
  dailyBudget?: number;
  lifetimeBudget?: number;
};

/**
 * platformBudget → API 호출 가능 여부
 * BE 필드 없거나 mock이면 ok: false → 수정 버튼 disabled
 */
export function canSubmitPlatformBudgetEdit(
  budget: IPlatformProjectBudget | undefined,
): { ok: true } | { ok: false; reason: TBudgetEditBlockReason } {
  if (!budget) {
    return { ok: false, reason: "MISSING_PLATFORM_BUDGET" };
  }

  if (budget.canEditBudget === false) {
    return { ok: false, reason: "NOT_EDITABLE" };
  }

  switch (budget.providerType) {
    case "META":
      if (!budget.adCampaignId || !budget.activeBudgetType) {
        return { ok: false, reason: "MISSING_META_CONTEXT" };
      }
      return { ok: true };

    case "GOOGLE":
      if (!budget.adCampaignId || !budget.activeBudgetType) {
        return { ok: false, reason: "MISSING_GOOGLE_CONTEXT" };
      }
      return { ok: true };

    case "NAVER":
      if (!budget.naverConnectionId || !budget.naverCampaignId) {
        return { ok: false, reason: "MISSING_NAVER_CONTEXT" };
      }
      if (!budget.daily) {
        return { ok: false, reason: "MISSING_PLATFORM_BUDGET" };
      }
      return { ok: true };

    default:
      return { ok: false, reason: "MISSING_PLATFORM_BUDGET" };
  }
}

/** Meta / Google — activeBudgetType에 맞는 필드 하나만 body에 */
export function buildMetaGoogleBudgetPayload(
  activeBudgetType: TPlatformBudgetType,
  values: { dailyBudget?: number; lifetimeBudget?: number },
): TMetaGoogleBudgetUpdateRequest {
  if (activeBudgetType === "DAILY") {
    return { dailyBudget: values.dailyBudget! };
  }
  return { lifetimeBudget: values.lifetimeBudget! };
}

/** Naver — useDailyBudget 항상 true */
export function buildNaverBudgetPayload(
  dailyBudget: number,
): INaverBudgetUpdateRequest {
  return { useDailyBudget: true, dailyBudget };
}

/**
 * 모달 — provider + activeBudgetType에 맞는 zod schema
 */
export function resolveBudgetEditFormSchema(budget: IPlatformProjectBudget) {
  switch (budget.providerType) {
    case "META":
    case "GOOGLE":
      return budget.activeBudgetType === "LIFETIME"
        ? lifetimeBudgetFormSchema
        : dailyBudgetFormSchema;
    case "NAVER":
      return naverBudgetFormSchema;
    default:
      return dailyBudgetFormSchema;
  }
}

/** 모달 input — 필드명·라벨 (게이지 라벨과 동일) */
export function resolveBudgetEditFieldMeta(budget: IPlatformProjectBudget): {
  fieldName: "dailyBudget" | "lifetimeBudget";
  label: string;
} {
  if (budget.providerType === "NAVER") {
    return { fieldName: "dailyBudget", label: "일일 예산" };
  }
  if (budget.activeBudgetType === "LIFETIME") {
    return { fieldName: "lifetimeBudget", label: "전체 예산" };
  }
  return { fieldName: "dailyBudget", label: "일일 예산" };
}

/** platformBudget → 폼 defaultValues */
export function resolveBudgetEditDefaultValues(
  budget: IPlatformProjectBudget,
): TBudgetEditModalFormValues {
  const { fieldName } = resolveBudgetEditFieldMeta(budget);

  if (fieldName === "lifetimeBudget") {
    return { lifetimeBudget: budget.lifetime.totalBudget };
  }

  if (budget.providerType === "NAVER") {
    return { dailyBudget: budget.daily?.totalBudget ?? 0 };
  }

  const dailyAmount = budget.daily?.totalBudget ?? budget.lifetime.totalBudget;

  return { dailyBudget: dailyAmount };
}

/** budget + form values → mutation variables */
export function buildUpdatePlatformBudgetVariables(
  budget: IPlatformProjectBudget,
  values: TBudgetEditModalFormValues,
): {
  providerType: IPlatformProjectBudget["providerType"];
  adCampaignId?: number;
  activeBudgetType?: TPlatformBudgetType;
  naverConnectionId?: number;
  naverCampaignId?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
} {
  const base = {
    providerType: budget.providerType,
    adCampaignId: budget.adCampaignId,
    activeBudgetType: budget.activeBudgetType,
    naverConnectionId: budget.naverConnectionId,
    naverCampaignId: budget.naverCampaignId,
  };

  if (values.lifetimeBudget !== undefined) {
    return { ...base, lifetimeBudget: values.lifetimeBudget };
  }

  return { ...base, dailyBudget: values.dailyBudget };
}
