import { forwardRef, useEffect, useMemo, useState } from "react";
import {
  Controller,
  type Resolver,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { IPlatformProjectBudget } from "@/types/ads/campaign";

import {
  buildUpdatePlatformBudgetVariables,
  dailyBudgetFormSchema,
  resolveBudgetEditDefaultValues,
  resolveBudgetEditFieldMeta,
  resolveBudgetEditFormSchema,
  type TBudgetEditModalFormValues,
} from "@/utils/ads/budgetEdit";
import {
  extractBudgetInputDigits,
  formatBudgetInputDisplay,
  parseBudgetInput,
} from "@/utils/ads/formatBudgetInput";
import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";

import { useUpdatePlatformBudget } from "@/hooks/ads/useUpdatePlatformBudget";

import Button from "@/components/common/button/Button";
import Input, { type IInputProps } from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";

interface IBudgetAmountInputProps extends Omit<
  IInputProps,
  "value" | "onChange" | "onBlur" | "type" | "inputMode"
> {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur?: () => void;
}

/** 포커스 중: 숫자만 편집, blur: 천 단위 콤마 표시 */
const BudgetAmountInput = forwardRef<HTMLInputElement, IBudgetAmountInputProps>(
  function BudgetAmountInput(
    { value, onChange, onBlur, onFocus, ...props },
    ref,
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const [editText, setEditText] = useState("");

    useEffect(() => {
      if (isFocused) return;
      setEditText(
        value === undefined || Number.isNaN(value) ? "" : String(value),
      );
    }, [isFocused, value]);

    const displayValue = isFocused ? editText : formatBudgetInputDisplay(value);

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        {...props}
        value={displayValue}
        onFocus={(event) => {
          setIsFocused(true);
          setEditText(
            value === undefined || Number.isNaN(value) ? "" : String(value),
          );
          onFocus?.(event);
        }}
        onBlur={() => {
          setIsFocused(false);
          const parsed = parseBudgetInput(editText);
          onChange(parsed);
          onBlur?.();
        }}
        onChange={(event) => {
          const digits = extractBudgetInputDigits(event.target.value);
          setEditText(digits);
          onChange(parseBudgetInput(digits));
        }}
      />
    );
  },
);

const PROVIDER_LABEL: Record<IPlatformProjectBudget["providerType"], string> = {
  META: "Meta",
  GOOGLE: "Google",
  NAVER: "NAVER",
};

interface IEditPlatformBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: IPlatformProjectBudget | null;
  orgId: number;
  projectId: number;
}

export default function EditPlatformBudgetModal({
  isOpen,
  onClose,
  budget,
  orgId,
  projectId,
}: IEditPlatformBudgetModalProps) {
  const { mutate, isPending } = useUpdatePlatformBudget(orgId, projectId);

  const schema = useMemo(
    () =>
      budget ? resolveBudgetEditFormSchema(budget) : dailyBudgetFormSchema,
    [budget],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TBudgetEditModalFormValues>({
    mode: "onChange",
    resolver: zodResolver(schema) as Resolver<TBudgetEditModalFormValues>,
  });

  const fieldMeta = budget ? resolveBudgetEditFieldMeta(budget) : null;
  const budgetFieldName = fieldMeta?.fieldName ?? "dailyBudget";
  const fieldError =
    budgetFieldName === "lifetimeBudget"
      ? errors.lifetimeBudget
      : errors.dailyBudget;

  useEffect(() => {
    if (!isOpen || !budget) return;
    reset(resolveBudgetEditDefaultValues(budget));
  }, [isOpen, budget, reset]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const onSubmit: SubmitHandler<TBudgetEditModalFormValues> = (values) => {
    if (!budget) return;

    mutate(buildUpdatePlatformBudgetVariables(budget, values), {
      onSuccess: () => {
        toast.success("예산이 수정되었습니다.");
        onClose();
      },
      onError: (error) => {
        toast.error(error.message ?? "예산 수정에 실패했습니다.");
      },
    });
  };

  if (!budget) return null;

  const currentBudgetAmount =
    fieldMeta?.fieldName === "lifetimeBudget"
      ? budget.lifetime.totalBudget
      : budget.providerType === "NAVER"
        ? (budget.daily?.totalBudget ?? 0)
        : (budget.daily?.totalBudget ?? budget.lifetime.totalBudget);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      padding="lg"
      title={`${PROVIDER_LABEL[budget.providerType]} 예산 수정`}
      disableOverlayClick={isPending}
    >
      <div className="flex w-full flex-col items-start">
        <h2 className="mb-2 font-heading3 text-text-title">
          {PROVIDER_LABEL[budget.providerType]} 예산 수정
        </h2>
        {budget.adCampaignName ? (
          <p className="mb-1 max-w-full truncate font-body2 text-text-muted">
            {budget.adCampaignName}
          </p>
        ) : null}
        <p className="mb-5 font-body2 text-text-muted">
          현재 {fieldMeta?.label}: {M.spend.format(currentBudgetAmount)}
        </p>

        <form
          key={`${budget.providerType}-${budget.activeBudgetType ?? "daily"}`}
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-8"
          noValidate
        >
          <Controller
            name={budgetFieldName}
            control={control}
            render={({ field: { onChange, value, onBlur, ref } }) => (
              <BudgetAmountInput
                ref={ref}
                label={fieldMeta?.label}
                autoComplete="off"
                placeholder="금액을 입력해 주세요"
                disabled={isPending}
                error={!!fieldError}
                helperText={fieldError?.message}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <div className="flex w-full gap-3">
            <Button
              type="button"
              size="big"
              variant="outline"
              fullWidth
              disabled={isPending}
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              size="big"
              variant="primary"
              fullWidth
              isLoading={isPending}
              disabled={isPending}
            >
              {isPending ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
