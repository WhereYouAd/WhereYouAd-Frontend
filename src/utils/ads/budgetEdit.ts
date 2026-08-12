import { z } from "zod";

import type {
  INaverBudgetUpdateRequest,
  TMetaGoogleBudgetUpdateRequest,
  TPlatformBudgetType,
} from "@/types/ads/budget";
import type { IPlatformBudgetSummary } from "@/types/ads/campaign";

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

/** Meta / Google TOTAL — 요청 body 필드명은 lifetimeBudget */
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

/** 게이지/모달/payload 공통 — 실제 표시·수정할 예산 필드 */
export interface IEffectivePlatformBudget {
  activeBudgetType: TPlatformBudgetType;
  fieldName: "dailyBudget" | "lifetimeBudget";
  label: "일일 예산" | "전체 예산";
  totalBudget: number;
  totalSpend: number;
}

/**
 * PlatformBudgetSummary row → 수정/표시용 effective 예산
 * — TOTAL 요청 body는 Meta/Google lifetimeBudget 필드 유지
 */
export function resolveEffectivePlatformBudget(
  budget: IPlatformBudgetSummary,
): IEffectivePlatformBudget {
  if (budget.provider === "NAVER") {
    return {
      activeBudgetType: budget.budgetType,
      fieldName: "dailyBudget",
      label: budget.budgetType === "TOTAL" ? "전체 예산" : "일일 예산",
      totalBudget: budget.budget,
      totalSpend: budget.spend,
    };
  }

  if (budget.budgetType === "DAILY") {
    return {
      activeBudgetType: "DAILY",
      fieldName: "dailyBudget",
      label: "일일 예산",
      totalBudget: budget.budget,
      totalSpend: budget.spend,
    };
  }

  return {
    activeBudgetType: "TOTAL",
    fieldName: "lifetimeBudget",
    label: "전체 예산",
    totalBudget: budget.budget,
    totalSpend: budget.spend,
  };
}

/**
 * platformBudget → API 호출 가능 여부
 * OpenAPI PlatformBudgetSummary에 수정용 ID가 없으면 disabled
 */
export function canSubmitPlatformBudgetEdit(
  budget: IPlatformBudgetSummary | undefined,
): { ok: true } | { ok: false; reason: TBudgetEditBlockReason } {
  if (!budget) {
    return { ok: false, reason: "MISSING_PLATFORM_BUDGET" };
  }

  if (budget.canEditBudget === false) {
    return { ok: false, reason: "NOT_EDITABLE" };
  }

  switch (budget.provider) {
    case "META":
      if (!budget.adCampaignId) {
        return { ok: false, reason: "MISSING_META_CONTEXT" };
      }
      return { ok: true };

    case "GOOGLE":
      if (!budget.adCampaignId) {
        return { ok: false, reason: "MISSING_GOOGLE_CONTEXT" };
      }
      return { ok: true };

    case "NAVER":
      if (!budget.naverConnectionId || !budget.naverCampaignId) {
        return { ok: false, reason: "MISSING_NAVER_CONTEXT" };
      }
      return { ok: true };

    default:
      return { ok: false, reason: "MISSING_PLATFORM_BUDGET" };
  }
}

/** Meta / Google — budgetType에 맞는 필드 하나만 body에 */
export function buildMetaGoogleBudgetPayload(
  activeBudgetType: TPlatformBudgetType,
  values: { dailyBudget?: number; lifetimeBudget?: number },
): TMetaGoogleBudgetUpdateRequest {
  if (activeBudgetType === "DAILY") {
    if (values.dailyBudget === undefined) {
      throw new Error("일일 예산을 입력해 주세요.");
    }
    return { dailyBudget: values.dailyBudget };
  }

  if (values.lifetimeBudget === undefined) {
    throw new Error("전체 예산을 입력해 주세요.");
  }
  return { lifetimeBudget: values.lifetimeBudget };
}

/** Naver — useDailyBudget 항상 true */
export function buildNaverBudgetPayload(
  dailyBudget: number,
): INaverBudgetUpdateRequest {
  return { useDailyBudget: true, dailyBudget };
}

/**
 * 모달 — provider + budgetType에 맞는 zod schema
 */
export function resolveBudgetEditFormSchema(budget: IPlatformBudgetSummary) {
  if (budget.provider === "NAVER") {
    return naverBudgetFormSchema;
  }

  const { fieldName } = resolveEffectivePlatformBudget(budget);
  return fieldName === "lifetimeBudget"
    ? lifetimeBudgetFormSchema
    : dailyBudgetFormSchema;
}

/** 모달 input — 필드명·라벨 (게이지 라벨과 동일) */
export function resolveBudgetEditFieldMeta(budget: IPlatformBudgetSummary): {
  fieldName: "dailyBudget" | "lifetimeBudget";
  label: string;
} {
  const { fieldName, label } = resolveEffectivePlatformBudget(budget);
  return { fieldName, label };
}

/** platformBudget → 폼 defaultValues */
export function resolveBudgetEditDefaultValues(
  budget: IPlatformBudgetSummary,
): TBudgetEditModalFormValues {
  const { fieldName, totalBudget } = resolveEffectivePlatformBudget(budget);

  if (fieldName === "lifetimeBudget") {
    return { lifetimeBudget: totalBudget };
  }

  return { dailyBudget: totalBudget };
}

/** budget + form values → mutation variables */
export function buildUpdatePlatformBudgetVariables(
  budget: IPlatformBudgetSummary,
  values: TBudgetEditModalFormValues,
): {
  providerType: IPlatformBudgetSummary["provider"];
  adCampaignId?: number;
  activeBudgetType?: TPlatformBudgetType;
  naverConnectionId?: number;
  naverCampaignId?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
} {
  const { activeBudgetType } = resolveEffectivePlatformBudget(budget);

  const base = {
    providerType: budget.provider,
    adCampaignId: budget.adCampaignId,
    activeBudgetType,
    naverConnectionId: budget.naverConnectionId,
    naverCampaignId: budget.naverCampaignId,
  };

  if (values.lifetimeBudget !== undefined) {
    return { ...base, lifetimeBudget: values.lifetimeBudget };
  }

  return { ...base, dailyBudget: values.dailyBudget };
}
