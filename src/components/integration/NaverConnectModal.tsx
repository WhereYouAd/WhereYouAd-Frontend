import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";

import type { IApiErrorResponse } from "@/types/common/common";
import type { INaverCredentialsResponseData } from "@/types/integration/naver";

import { naverConnectSchema } from "@/utils/validation";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";

import { connectNaverAccount } from "@/api/integration/naver";

type TNaverConnectFormValues = z.infer<typeof naverConnectSchema>;

interface INaverConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: number;
}

export default function NaverConnectModal({
  isOpen,
  onClose,
  orgId,
}: INaverConnectModalProps) {
  const queryClient = useQueryClient();

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
    }
  }, [isOpen, reset]);

  const connectMutation = useMutation<
    INaverCredentialsResponseData,
    IApiErrorResponse,
    TNaverConnectFormValues
  >({
    mutationFn: (body) => connectNaverAccount(orgId, body),
    onSuccess: () => {
      toast.success("네이버 광고 계정을 연동했습니다.");
      reset();
      onClose();
      void queryClient.invalidateQueries({
        queryKey: ["platform-connections", orgId],
      });
    },
    onError: (error) => {
      toast.error(error.message ?? "네이버 연동에 실패했습니다.");
    },
  });

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
      title="네이버 광고 연동"
      size="md"
      disableOverlayClick={isSubmitting}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        autoComplete="off"
      >
        <p className="font-body2 text-text-muted">
          네이버 검색 광고 계정의 고객 ID, API Key, Secret Key를 입력해 주세요.
        </p>

        <Input
          label="고객 ID"
          placeholder="네이버 광고 고객 ID"
          disabled={isSubmitting}
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
            {isSubmitting ? "연동 중..." : "연동하기"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
