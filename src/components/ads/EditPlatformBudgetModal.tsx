import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  type Resolver,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { IPlatformBudgetSummary } from "@/types/ads/campaign";

import {
  buildUpdatePlatformBudgetVariables,
  dailyBudgetFormSchema,
  resolveBudgetEditDefaultValues,
  resolveBudgetEditFieldMeta,
  resolveBudgetEditFormSchema,
  resolveEffectivePlatformBudget,
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

const PROVIDER_LABEL: Record<IPlatformBudgetSummary["provider"], string> = {
  META: "Meta",
  GOOGLE: "Google",
  NAVER: "NAVER",
};

interface IEditPlatformBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClosed?: () => void;
  budget: IPlatformBudgetSummary | null;
  orgId: number;
  projectId: number;
}

export default function EditPlatformBudgetModal({
  isOpen,
  onClose,
  onClosed,
  budget,
  orgId,
  projectId,
}: IEditPlatformBudgetModalProps) {
  const budgetRef = useRef<IPlatformBudgetSummary | null>(null);
  if (budget) budgetRef.current = budget;

  const activeBudget = budget ?? budgetRef.current;

  const { mutate, isPending } = useUpdatePlatformBudget(orgId, projectId);

  const schema = useMemo(
    () =>
      activeBudget
        ? resolveBudgetEditFormSchema(activeBudget)
        : dailyBudgetFormSchema,
    [activeBudget],
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

  const fieldMeta = activeBudget
    ? resolveBudgetEditFieldMeta(activeBudget)
    : null;
  const effectiveBudget = activeBudget
    ? resolveEffectivePlatformBudget(activeBudget)
    : null;
  const budgetFieldName = fieldMeta?.fieldName ?? "dailyBudget";
  const fieldError =
    budgetFieldName === "lifetimeBudget"
      ? errors.lifetimeBudget
      : errors.dailyBudget;

  useEffect(() => {
    if (!isOpen || !activeBudget) return;
    reset(resolveBudgetEditDefaultValues(activeBudget));
  }, [isOpen, activeBudget, reset]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const onSubmit: SubmitHandler<TBudgetEditModalFormValues> = (values) => {
    if (!activeBudget) return;

    mutate(buildUpdatePlatformBudgetVariables(activeBudget, values), {
      onSuccess: () => {
        toast.success("예산이 수정되었습니다.");
        onClose();
      },
      onError: (error) => {
        toast.error(error.message ?? "예산 수정에 실패했습니다.");
      },
    });
  };

  if (!activeBudget) return null;

  const currentBudgetAmount = effectiveBudget?.totalBudget ?? 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onExitComplete={onClosed}
      size="md"
      padding="lg"
      title={`${PROVIDER_LABEL[activeBudget.provider]} 예산 수정`}
      disableOverlayClick={isPending}
    >
      <div className="flex w-full flex-col items-start">
        <p aria-hidden className="mb-2 font-heading3 text-text-title">
          {PROVIDER_LABEL[activeBudget.provider]} 예산 수정
        </p>
        {activeBudget.adCampaignName ? (
          <p className="mb-1 max-w-full truncate font-body2 text-text-muted">
            {activeBudget.adCampaignName}
          </p>
        ) : null}
        <p className="mb-5 font-body2 text-text-muted">
          현재 {fieldMeta?.label}: {M.spend.format(currentBudgetAmount)}
        </p>

        <form
          key={`${activeBudget.provider}-${effectiveBudget?.activeBudgetType ?? "daily"}`}
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
