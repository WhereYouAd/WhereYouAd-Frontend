import { type MouseEvent, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  naverSyncSchema,
  type TNaverSyncFormValues,
} from "@/utils/integration/naverSyncSchema";
import { getDefaultNaverSyncDateRange } from "@/utils/integration/platformSync";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";

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

interface INaverSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TNaverSyncFormValues) => void;
  isLoading?: boolean;
}

export default function NaverSyncModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: INaverSyncModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TNaverSyncFormValues>({
    mode: "onChange",
    resolver: zodResolver(naverSyncSchema),
    defaultValues: getDefaultNaverSyncDateRange(),
  });

  useEffect(() => {
    if (!isOpen) return;
    reset(getDefaultNaverSyncDateRange());
  }, [isOpen, reset]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const onFormSubmit: SubmitHandler<TNaverSyncFormValues> = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="네이버 데이터 동기화"
      size="md"
      disableOverlayClick={isLoading}
    >
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        <p className="font-body2 text-text-muted">
          동기화할 기간을 선택해 주세요.
        </p>

        <div className="grid grid-cols-2 gap-4 tablet:grid-cols-1">
          <div
            role="presentation"
            className={!isLoading ? "cursor-pointer" : undefined}
            onClick={openDatePickerFromField}
          >
            <Input
              label="시작일"
              type="date"
              disabled={isLoading}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
              inputClassName="cursor-pointer"
              {...register("startDate")}
            />
          </div>
          <div
            role="presentation"
            className={!isLoading ? "cursor-pointer" : undefined}
            onClick={openDatePickerFromField}
          >
            <Input
              label="종료일"
              type="date"
              disabled={isLoading}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
              inputClassName="cursor-pointer"
              {...register("endDate")}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            size="big"
            className="flex-1"
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            type="submit"
            size="big"
            className="flex-1"
            disabled={!isValid || isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "동기화 중..." : "동기화"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
