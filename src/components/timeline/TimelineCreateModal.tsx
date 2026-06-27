import { type MouseEvent, useEffect, useMemo, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import type { TTimelineMetric } from "@/types/timeline/api";
import { TIMELINE_FORM_DEFAULT_VALUES } from "@/types/timeline/form";
import {
  TIMELINE_COMPARISON_PERIOD_OPTIONS,
  TIMELINE_METRIC_OPTIONS,
} from "@/constants/timeline/formOptions";

import {
  timelineCreateSchema,
  type TTimelineCreateFormValues,
} from "@/utils/timeline/timeline";

import Button from "../common/button/Button";
import {
  DropdownMenu,
  type TMenuItem,
} from "../common/dropdownmenu/DropdownMenu";
import Input from "../common/input/Input";
import Modal from "../common/modal/Modal";

import ChevronIcon from "@/assets/icon/chevron/chevron-up.svg?react";

const MOCK_SUBMIT_DELAY_MS = 800;

function openDatePickerFromField(event: MouseEvent<HTMLElement>) {
  const input =
    event.currentTarget.querySelector<HTMLInputElement>('input[type="date"]');
  if (!input || input.disabled) return;

  input.focus();

  if (typeof input.showPicker !== "function") return;

  try {
    input.showPicker();
  } catch {
    /* 일부 브라우저나 보안 컨텍스트에서 showPicker 호출 제한될 수 있음 */
  }
}

interface ITimelineCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TimelineCreateModal({
  isOpen,
  onClose,
}: ITimelineCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TTimelineCreateFormValues>({
    mode: "onChange",
    resolver: zodResolver(timelineCreateSchema),
    defaultValues: TIMELINE_FORM_DEFAULT_VALUES,
  });

  const selectedMetrics = watch("metrics");
  const comparisonPeriodType = watch("comparisonPeriodType");

  const comparisonLabel = useMemo(() => {
    return (
      TIMELINE_COMPARISON_PERIOD_OPTIONS.find(
        (option) => option.value === comparisonPeriodType,
      )?.label ?? "비교 기간 선택"
    );
  }, [comparisonPeriodType]);

  const comparisonMenuItems: TMenuItem[] = useMemo(
    () =>
      TIMELINE_COMPARISON_PERIOD_OPTIONS.map((option) => ({
        label: option.label,
        active: option.value === comparisonPeriodType,
        onClick: () => {
          if (isSubmitting) return;
          setValue("comparisonPeriodType", option.value, {
            shouldValidate: true,
          });
        },
      })),
    [comparisonPeriodType, isSubmitting, setValue],
  );

  useEffect(() => {
    if (!isOpen) {
      reset(TIMELINE_FORM_DEFAULT_VALUES);
      setIsSubmitting(false);
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const toggleMetric = (metric: TTimelineMetric) => {
    const current = selectedMetrics ?? [];
    const next = current.includes(metric)
      ? current.filter((item) => item !== metric)
      : [...current, metric];

    setValue("metrics", next, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<TTimelineCreateFormValues> = async (data) => {
    setIsSubmitting(true);

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, MOCK_SUBMIT_DELAY_MS);
      });
      toast.success("타임라인이 생성되었습니다", {
        description: `"${data.name}" 타임라인을 추가했습니다`,
      });
      reset(TIMELINE_FORM_DEFAULT_VALUES);
      onClose();
    } catch {
      toast.error("타임라인 생성에 실패했습니다. 다시 시도해주세요");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      padding="lg"
      title="타임라인 생성"
      disableOverlayClick={isSubmitting}
    >
      <div className="flex w-full flex-col items-start px-4 pr-8 tablet:pr-10">
        <h2 className="mb-2 font-heading3 text-text-title">타임라인 생성</h2>
        <p className="mb-5 text-start font-body2 text-text-muted">
          분석할 기간과 성과 지표를 설정해 새 타임라인을 만들어보세요
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
          noValidate
        >
          <div className="w-full space-y-7">
            <Input
              label="타임라인 이름"
              placeholder="ex. 6월 봄 프로모션"
              disabled={isSubmitting}
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register("name")}
            />

            <div className="grid grid-cols-1 gap-7 tablet:grid-cols-2">
              <div
                role="presentation"
                className={!isSubmitting ? "cursor-pointer" : undefined}
                onClick={openDatePickerFromField}
              >
                <Input
                  label="시작일"
                  type="date"
                  disabled={isSubmitting}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                  inputClassName="cursor-pointer"
                  {...register("startDate")}
                />
              </div>
              <div
                role="presentation"
                className={!isSubmitting ? "cursor-pointer" : undefined}
                onClick={openDatePickerFromField}
              >
                <Input
                  label="종료일"
                  type="date"
                  disabled={isSubmitting}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                  inputClassName="cursor-pointer"
                  {...register("endDate")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="ml-1 font-body1 text-text-title">성과 지표</span>
              <p className="ml-1 font-caption text-text-muted">
                타임라인에서 추적할 지표를 1개 이상 선택하세요
              </p>
              <Controller
                name="metrics"
                control={control}
                render={() => (
                  <div className="flex flex-wrap gap-3 mt-1">
                    {TIMELINE_METRIC_OPTIONS.map((option) => {
                      const isSelected = selectedMetrics?.includes(
                        option.value,
                      );
                      return (
                        <button
                          type="button"
                          key={option.value}
                          disabled={isSubmitting}
                          aria-pressed={isSelected}
                          onClick={() => toggleMetric(option.value)}
                          className={twMerge(
                            "inline-flex h-8 items-center rounded-full border px-4 font-body2 transition-colors",
                            isSelected
                              ? "border-info-blue/40 bg-info-blue/15 text-info-blue"
                              : "border-text-placeholder/40 bg-surface-200 text-text-muted hover:bg-surface-300",
                            isSubmitting && "cursor-not-allowed opacity-60",
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.metrics ? (
                <p className="ml-1 font-caption text-info-red">
                  {errors.metrics.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <span className="ml-1 font-body1 text-text-title">기간 설정</span>
              <p className="ml-1 font-caption text-text-muted">
                성과를 비교할 기준 기간을 선택하세요
              </p>
              <Controller
                name="comparisonPeriodType"
                control={control}
                render={() => (
                  <DropdownMenu
                    fullWidth
                    aria-label="비교 기간 선택"
                    items={comparisonMenuItems}
                    trigger={(open) => (
                      <div
                        tabIndex={0}
                        className={twMerge(
                          "flex h-14 w-full cursor-pointer items-center justify-between rounded-2xl bg-surface-100 px-5 text-left font-body1 ring-1 ring-surface-400 transition-colors duration-200 ease-out outline-none",
                          "hover:bg-surface-200 hover:ring-surface-400",
                          "focus-visible:ring-2 focus-visible:ring-surface-400",
                          isSubmitting && "cursor-not-allowed opacity-60",
                          errors.comparisonPeriodType
                            ? "ring-2 ring-info-red bg-info-red/5"
                            : "",
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate text-text-title">
                          {comparisonLabel}
                        </span>
                        <ChevronIcon
                          className={twMerge(
                            "h-4 w-4 shrink-0 text-text-muted transition-transform duration-200",
                            open ? "rotate-0" : "rotate-180",
                          )}
                          aria-hidden
                        />
                      </div>
                    )}
                  />
                )}
              />
              {errors.comparisonPeriodType ? (
                <p className="ml-1 font-caption text-info-red">
                  {errors.comparisonPeriodType.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="w-full">
            <Button
              type="submit"
              size="big"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "생성 중..." : "생성하기"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
