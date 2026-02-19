import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { z } from "zod";

import type { IEmailSendRequest, IEmailSendResponse } from "@/types/auth/auth";
import type { ICommonResponse } from "@/types/common/common";

import { signupEmailSchema } from "@/utils/validation";

import { useAuth } from "@/hooks/auth/useAuth";
import { useTimer } from "@/hooks/common/useTimer";

import useAuthStore from "@/store/useAuthStore";

export type TSignupEmailFormValues = z.infer<typeof signupEmailSchema>;

type TSendCodeMutation = UseMutationResult<
  ICommonResponse<IEmailSendResponse>,
  AxiosError<{ message?: string }>,
  IEmailSendRequest
>;

interface IUseEmailVerificationProps {
  onNext: () => void;
  sendMutation?: TSendCodeMutation;
}

export const useEmailVerification = ({
  onNext,
  sendMutation,
}: IUseEmailVerificationProps) => {
  const { setEmail } = useAuthStore();
  const { useSendCode, useCheckCode } = useAuth();
  const activeSendCode = sendMutation ?? useSendCode;

  const [sendCode, setSendCode] = useState(false);
  const [codeError, setCodeError] = useState("");

  const form = useForm<TSignupEmailFormValues>({
    mode: "onBlur",
    resolver: zodResolver(signupEmailSchema),
  });

  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const watchedEmail = useWatch({ control, name: "email" });
  const watchedCode = useWatch({ control, name: "code" });

  const { formattedTime, restart, stop, isExpired } = useTimer(0, {
    onExpire: () => {
      toast.error("인증 시간이 만료되었습니다. 다시 시도해주세요.");
    },
  });

  const handleEditEmail = useCallback(() => {
    setSendCode(false);
    stop();
  }, [stop]);

  const sendVerificationEmail = (email: string, successMessage: string) => {
    activeSendCode.mutate(
      { email },
      {
        onSuccess: (data) => {
          setSendCode(true);
          toast.success(successMessage);
          restart(data.data.expireIn);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "메일 발송에 실패했습니다.",
          );
        },
      },
    );
  };

  const handleResendEmail = () => {
    if (watchedEmail) {
      sendVerificationEmail(watchedEmail, "인증번호가 재발송되었습니다.");
    }
  };

  const postSendCode = async () => {
    const isEmailValid = await trigger("email");
    if (isEmailValid && watchedEmail) {
      sendVerificationEmail(watchedEmail, "인증번호가 발송되었습니다.");
    }
  };

  const onSubmit = async (data: TSignupEmailFormValues) => {
    useCheckCode.mutate(
      { email: data.email, authCode: data.code },
      {
        onSuccess: () => {
          setEmail(data.email);
          onNext();
        },
        onError: (error) => {
          setCodeError(
            error.response?.data?.message || "인증번호가 올바르지 않습니다.",
          );
        },
      },
    );
  };

  useEffect(() => {
    setCodeError("");
  }, [watchedCode, watchedEmail]);

  return {
    form,
    watchedEmail,
    sendCode,
    formattedTime,
    isExpired,
    codeError,
    errors,
    isValid,
    isPending: activeSendCode.isPending || useCheckCode.isPending,
    handlers: {
      postSendCode,
      handleResendEmail,
      handleEditEmail,
      handleSubmit: handleSubmit(onSubmit),
    },
  };
};
