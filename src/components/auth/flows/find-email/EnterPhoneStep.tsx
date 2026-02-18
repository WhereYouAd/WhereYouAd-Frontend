import { useEffect, useState } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { findEmailSchema } from "@/utils/validation";

import { useAuth } from "@/hooks/auth/useAuth";
import { useTimer } from "@/hooks/common/useTimer";

import CommonAuthInput from "@/components/auth/common/CommonAuthInput";
import Button from "@/components/common/button/Button";

import useAuthStore from "@/store/useAuthStore";

interface IEnterPhoneStepProps {
  onNext: () => void;
}

type TFindEmailFormValues = z.infer<typeof findEmailSchema>;

export default function EnterPhoneStep({ onNext }: IEnterPhoneStepProps) {
  const navigate = useNavigate();
  const { setEmail } = useAuthStore();
  const { useSendSMS, useVerifySMS } = useAuth();
  const { mutate: sendSMSMutate } = useSendSMS;
  const { mutate: verifySMSMutate } = useVerifySMS;

  const [sendCode, setSendCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const { formattedTime, isExpired, restart } = useTimer(180);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isValid },
  } = useForm<TFindEmailFormValues>({
    mode: "onBlur",
    resolver: zodResolver(findEmailSchema),
  });

  const watchedPhone = useWatch({ control, name: "phoneNum" });
  const watchedCode = useWatch({ control, name: "code" });

  const postSendCode = async () => {
    const isPhoneValid = await trigger("phoneNum");
    if (isPhoneValid && watchedPhone) {
      const phoneNumber = watchedPhone.replace(/-/g, "");
      sendSMSMutate(
        { phoneNumber },
        {
          onSuccess: () => {
            setSendCode(true);
            restart();
            toast.success("인증번호가 발송되었습니다.");
          },
          onError: () => {
            toast.error("인증번호 발송에 실패했습니다.");
          },
        },
      );
    }
  };

  const onSubmit: SubmitHandler<TFindEmailFormValues> = async (formData) => {
    const phoneNumber = formData.phoneNum.replace(/-/g, "");
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
        onError: () => {
          setCodeError("인증번호가 올바르지 않습니다.");
        },
      },
    );
  };

  useEffect(() => {
    setCodeError("");
  }, [watchedCode, watchedPhone]);

  useEffect(() => {
    setSendCode(false);
  }, [watchedPhone]);

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-130 px-6 pb-12">
        <h1 className="text-start font-heading2 text-text-main mb-10">
          <p>이메일 찾기를 위해</p>
          <p>휴대폰 인증을 진행할게요</p>
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
                className="shrink-0 h-13.5! border border-brand-400 text-status-blue bg-white hover:bg-gray-50 px-4 rounded-15 font-body2 whitespace-nowrap"
                onClick={postSendCode}
                type="button"
              >
                인증번호 받기
              </Button>
            </div>
          ) : (
            <CommonAuthInput
              type="text"
              value={watchedPhone || ""}
              readOnly
              className="w-full h-13.5 px-5 border rounding-15 text-body1 text-text-main bg-white border-brand-400 focus:outline-none focus:border-brand-400"
            />
          )}

          <CommonAuthInput
            placeholder={
              sendCode
                ? "문자로 발송된 6자리 인증번호"
                : "인증번호를 입력하세요"
            }
            type="text"
            timer={sendCode ? formattedTime : undefined}
            {...register("code")}
            disabled={isExpired && sendCode}
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
            disabled={!isValid || (isExpired && sendCode)}
          >
            다음으로
          </Button>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="font-body2 text-text-placeholder underline underline-offset-4 hover:text-text-auth-sub"
            onClick={() => navigate("/find-pw")}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
}
