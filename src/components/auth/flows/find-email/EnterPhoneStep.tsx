import { useEffect, useState } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { stripPhoneHyphens } from "@/utils/formatPhoneNumber";
import { findEmailSchema } from "@/utils/validation";

import { useAuth } from "@/hooks/auth/useAuth";
import { useTimer } from "@/hooks/common/useTimer";

import AuthFormShell from "@/components/auth/common/AuthFormShell";
import CommonAuthInput from "@/components/auth/common/CommonAuthInput";
import Button from "@/components/common/button/Button";

import useAuthStore from "@/store/useAuthStore";

interface IEnterPhoneStepProps {
  onNext: () => void;
}

type TFindEmailFormValues = z.infer<typeof findEmailSchema>;

export default function EnterPhoneStep({ onNext }: IEnterPhoneStepProps) {
  const { setEmail } = useAuthStore();
  const { useSendSMS, useVerifySMS } = useAuth();
  const { mutate: sendSMSMutate, isPending: isSending } = useSendSMS;
  const { mutate: verifySMSMutate, isPending: isVerifying } = useVerifySMS;

  const [sendCode, setSendCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const { formattedTime, isExpired, restart, stop } = useTimer(0, {
    onExpire: () => {
      toast.error("인증 시간이 만료되었습니다. 다시 시도해주세요.");
    },
  });

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors, isValid },
  } = useForm<TFindEmailFormValues>({
    mode: "onBlur",
    resolver: zodResolver(findEmailSchema),
  });

  const watchedPhone = useWatch({ control, name: "phoneNum" });
  const watchedCode = useWatch({ control, name: "code" });

  const sendVerificationSMS = (phoneNumber: string, message: string) => {
    sendSMSMutate(
      { phoneNumber },
      {
        onSuccess: (res) => {
          setSendCode(true);
          restart(res.data.expireIn);
          toast.success(message);
        },
        onError: (error) => {
          toast.error(error.message ?? "인증번호 발송에 실패했습니다.");
        },
      },
    );
  };

  const postSendCode = async () => {
    const isPhoneValid = await trigger("phoneNum");
    if (isPhoneValid && watchedPhone) {
      const phoneNumber = stripPhoneHyphens(watchedPhone);
      sendVerificationSMS(phoneNumber, "인증번호가 발송되었습니다.");
    }
  };

  const handleResendSMS = () => {
    if (watchedPhone) {
      const phoneNumber = stripPhoneHyphens(watchedPhone);
      sendVerificationSMS(phoneNumber, "인증번호가 재발송되었습니다.");
    }
  };

  const handleEditPhone = () => {
    setSendCode(false);
    stop();
    setValue("code", "");
  };

  const onSubmit: SubmitHandler<TFindEmailFormValues> = (formData) => {
    const phoneNumber = stripPhoneHyphens(formData.phoneNum);
    verifySMSMutate(
      { phoneNumber, verificationCode: formData.code },
      {
        onSuccess: (res) => {
          if (res.data.isVerified) {
            setEmail(res.data.email);
            onNext();
          } else {
            setCodeError(res.data.verificationMessage);
          }
        },
        onError: (error) => {
          setCodeError(error.message ?? "인증번호가 올바르지 않습니다.");
        },
      },
    );
  };

  useEffect(() => {
    setCodeError("");
  }, [watchedCode, watchedPhone]);

  return (
    <AuthFormShell variant="step">
      <h1 className="text-start font-heading2 text-text-title mb-10">
        <span className="block">이메일 찾기를 위해</span>
        <span className="block">휴대폰 인증을 진행할게요</span>
      </h1>

      <div className="flex flex-col gap-6">
        {!sendCode ? (
          <div className="flex gap-2 w-full items-start">
            <div className="flex-1">
              <CommonAuthInput
                placeholder="전화번호를 입력하세요"
                type="tel"
                {...register("phoneNum")}
                error={!!errors.phoneNum}
                errorMessage={errors.phoneNum?.message}
              />
            </div>
            <Button
              variant="custom"
              className="shrink-0 h-13.5! border border-primary-400 text-info-blue bg-surface-100 hover:bg-surface-200 px-4 rounded-15 font-body2 whitespace-nowrap"
              onClick={postSendCode}
              type="button"
              disabled={isSending}
            >
              인증번호 받기
            </Button>
          </div>
        ) : (
          <div className="relative w-full">
            <CommonAuthInput
              type="text"
              value={watchedPhone || ""}
              readOnly
              aria-label="입력된 전화번호"
              className="w-full h-13.5 px-5 rounded-2xl border border-primary-400 font-body1 text-text-title bg-surface-100 focus:outline-none focus:border-primary-400"
            />
            <button
              type="button"
              onClick={handleEditPhone}
              aria-label="전화번호 수정"
              className="absolute right-5 top-1/2 -translate-y-1/2 font-body2 text-text-placeholder underline hover:text-text-title"
            >
              수정
            </button>
          </div>
        )}

        <CommonAuthInput
          placeholder={
            sendCode ? "문자로 발송된 6자리 인증번호" : "인증번호를 입력하세요"
          }
          type="text"
          timer={sendCode ? formattedTime : undefined}
          {...register("code")}
          disabled={!sendCode || (isExpired && sendCode)}
          error={!!errors.code || !!codeError || (isExpired && sendCode)}
          errorMessage={
            isExpired && sendCode
              ? "인증 시간이 만료되었습니다."
              : errors.code?.message || codeError
          }
        />
      </div>

      <div className="mt-10">
        <Button
          size="big"
          fullWidth
          onClick={handleSubmit(onSubmit)}
          variant="gradient"
          disabled={!isValid || isVerifying || (isExpired && sendCode)}
        >
          다음으로
        </Button>
      </div>

      {sendCode && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleResendSMS}
            disabled={isSending}
            className="font-body2 text-text-placeholder underline underline-offset-4 hover:text-text-auth-sub disabled:opacity-50"
          >
            인증번호 다시 받기
          </button>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          to="/find-pw"
          className="font-body2 text-text-placeholder underline underline-offset-4 hover:text-text-auth-sub"
        >
          비밀번호 찾기
        </Link>
      </div>
    </AuthFormShell>
  );
}
