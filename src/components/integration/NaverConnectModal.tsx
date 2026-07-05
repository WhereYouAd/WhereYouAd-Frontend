import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { naverConnectSchema } from "@/utils/auth/validation";

import { useCoreMutation } from "@/hooks/customQuery";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";

import {
  connectNaverAccount,
  updateNaverAccount,
} from "@/api/integration/naver";
import { QUERY_KEYS } from "@/lib/queryKeys";

type TNaverConnectMode = "connect" | "reconnect";

interface INaverConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: number;
  mode?: TNaverConnectMode;
  initialCustomerId?: string;
}

type TNaverConnectFormValues = z.infer<typeof naverConnectSchema>;

export default function NaverConnectModal({
  isOpen,
  onClose,
  orgId,
  mode = "connect",
  initialCustomerId,
}: INaverConnectModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TNaverConnectFormValues>({
    mode: "onChange",
    resolver: zodResolver(naverConnectSchema),
    defaultValues: {
      customerId: "",
      apiKey: "",
      secretKey: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }

    if (mode === "reconnect" && initialCustomerId) {
      reset({
        customerId: initialCustomerId,
        apiKey: "",
        secretKey: "",
      });
    }
  }, [isOpen, mode, initialCustomerId, reset]);

  const connectMutation = useCoreMutation<void, TNaverConnectFormValues>(
    (body) =>
      mode === "reconnect"
        ? updateNaverAccount(orgId, body)
        : connectNaverAccount(orgId, body),
    {
      invalidateKeys: [QUERY_KEYS.platform.connections(orgId)],
      userOnSuccess: () => {
        toast.success(
          mode === "reconnect"
            ? "네이버 광고 계정을 재연동했습니다."
            : "네이버 광고 계정을 연동했습니다.",
        );
        reset();
        onClose();
      },
      userOnError: (error) => {
        toast.error(
          error.message ??
            (mode === "reconnect"
              ? "네이버 재연동에 실패했습니다."
              : "네이버 연동에 실패했습니다."),
        );
      },
    },
  );

  const isSubmitting = connectMutation.isPending;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const onSubmit: SubmitHandler<TNaverConnectFormValues> = (values) => {
    connectMutation.mutate(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "reconnect" ? "네이버 광고 재연동" : "네이버 광고 연동"}
      size="md"
      disableOverlayClick={isSubmitting}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        autoComplete="off"
      >
        <p className="font-body2 text-text-muted">
          {mode === "reconnect"
            ? "API Key와 Secret Key를 새로 입력해 주세요."
            : "네이버 검색 광고 계정의 고객 ID, API Key, Secret Key를 입력해 주세요."}
        </p>

        <Input
          label="고객 ID"
          placeholder="네이버 광고 고객 ID"
          disabled={isSubmitting || mode === "reconnect"}
          readOnly={mode === "reconnect"}
          error={!!errors.customerId}
          helperText={errors.customerId?.message}
          {...register("customerId")}
          autoComplete="naver-customer-id"
        />

        <Input
          label="API Key"
          placeholder="API Key"
          disabled={isSubmitting}
          error={!!errors.apiKey}
          helperText={errors.apiKey?.message}
          {...register("apiKey")}
          autoComplete="naver-api-key"
        />

        <Input
          label="Secret Key"
          type="password"
          placeholder="Secret Key"
          disabled={isSubmitting}
          error={!!errors.secretKey}
          helperText={errors.secretKey?.message}
          {...register("secretKey")}
          autoComplete="new-password"
        />

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            size="big"
            className="flex-1"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            size="big"
            className="flex-1"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting
              ? mode === "reconnect"
                ? "재연동 중..."
                : "연동 중..."
              : mode === "reconnect"
                ? "재연동하기"
                : "연동하기"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
