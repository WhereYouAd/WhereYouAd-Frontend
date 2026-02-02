import { useEffect, useState } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { step01Schema } from "@/utils/validation";

import { useAuth } from "@/hooks/auth/useAuth";
import { useTimer } from "@/hooks/useTimer";

import CommonAuthInput from "@/components/auth/common/CommonAuthInput";
import Button from "@/components/common/Button";

import useAuthStore from "@/store/useAuthStore";

interface IStep01EmailProps {
  onNext: () => void;
}

type TStep01FormValues = z.infer<typeof step01Schema>;

export default function SignupEmail({ onNext }: IStep01EmailProps) {
  const { setEmail } = useAuthStore();
  const { useSendCode, useCheckCode } = useAuth();

  const [sendCode, setSendCode] = useState(false);
  const [, setCodeVerify] = useState(false);
  const [codeError, setCodeError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isValid },
  } = useForm<TStep01FormValues>({
    mode: "onBlur",
    resolver: zodResolver(step01Schema),
  });

  const watchedEmail = useWatch({ control, name: "email" });
  const watchedCode = useWatch({ control, name: "code" });

  const { formattedTime, restart, stop, isExpired } = useTimer(180, {
    onExpire: () => {
      toast.error("인증 시간이 만료되었습니다. 다시 시도해주세요.");
    },
  });

  const postSendCode = async () => {
    setCodeVerify(false);
    const isEmailValid = await trigger("email");
    if (isEmailValid && watchedEmail) {
      useSendCode.mutate(
        { email: watchedEmail },
        {
          onSuccess: () => {
            setSendCode(true);
            toast.success("인증번호가 발송되었습니다.");
            restart();
          },
          onError: (error) => {
            toast.error(
              error.response?.data?.message || "메일 발송에 실패했습니다.",
            );
          },
        },
      );
    }
  };

  const onSubmit: SubmitHandler<TStep01FormValues> = async (data) => {
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
    setCodeVerify(false);
    setCodeError("");
  }, [watchedCode, watchedEmail]);

  useEffect(() => {
    setSendCode(false);
    stop();
  }, [watchedEmail, stop]);

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-130 px-6 pb-12">
        <h1 className="text-start font-heading2 text-text-main mb-10">
          <p>회원가입을 위해</p>
          <p>이메일 인증을 진행할게요</p>
        </h1>

        <div className="flex flex-col gap-6">
          {!sendCode ? (
            <div className="flex gap-2 w-full items-start">
              <div className="flex-1">
                <CommonAuthInput
                  placeholder="메일을 입력하세요"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                />
              </div>
              <Button
                variant="custom"
                className="shrink-0 h-13.5! border border-brand-400 text-status-blue bg-white hover:bg-gray-50 px-4 rounded-15 font-body2 whitespace-nowrap"
                onClick={postSendCode}
                type="button"
                disabled={useSendCode.isPending}
              >
                인증번호 받기
              </Button>
            </div>
          ) : (
            <CommonAuthInput
              type="text"
              value={watchedEmail || ""}
              readOnly
              className="w-full h-13.5 px-5 border rounding-15 text-body1 text-text-main bg-white border-brand-400 focus:outline-none focus:border-brand-400"
            />
          )}

          <CommonAuthInput
            placeholder={
              sendCode
                ? "이메일로 발송된 6자리 인증번호"
                : "인증번호를 입력하세요"
            }
            type="text"
            timer={sendCode ? formattedTime : undefined}
            {...register("code")}
            disabled={isExpired}
            error={!!errors.code || !!codeError || (isExpired && sendCode)}
            errorMessage={
              isExpired
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
            disabled={!isValid || useCheckCode.isPending || isExpired}
          >
            다음으로
          </Button>
        </div>

        {sendCode && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSendCode(false);
                stop();
              }}
              className="font-body2 text-text-placeholder underline underline-offset-4 hover:text-text-auth-sub"
            >
              인증번호 다시 받기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
