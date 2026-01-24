import { useEffect, useState } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { codeSchema, emailSchema } from "@/utils/validation";

import CommonAuthInput from "@/components/auth/CommonAuthInput";
import Button from "@/components/common/Button";

import useAuthStore from "@/store/useAuthStore";

interface IStep01EmailProps {
  onNext: () => void;
}

const step01Schema = z.object({
  email: emailSchema,
  code: codeSchema,
});

type TStep01FormValues = z.infer<typeof step01Schema>;

export default function SignupEmail({ onNext }: IStep01EmailProps) {
  const { setEmail } = useAuthStore();

  const [sendCode, setSendCode] = useState(false);
  const [codeVerify, setCodeVerify] = useState(false);
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

  const postSendCode = async () => {
    setCodeVerify(false);
    const isEmailValid = await trigger("email");
    if (isEmailValid && watchedEmail) {
      setSendCode(true);
      toast.success("인증번호가 발송되었습니다.", {
        description: "테스트용: 아무 번호나 입력하세요",
      });
    }
  };

  const onSubmit: SubmitHandler<TStep01FormValues> = async (data) => {
    setEmail(data.email);
    onNext();
  };

  useEffect(() => {
    setCodeVerify(false);
    setCodeError("");
  }, [watchedCode, watchedEmail]);

  useEffect(() => {
    setSendCode(false);
  }, [watchedEmail]);

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
                className="shrink-0 h-13.5! border border-brand-400 text-status-blue bg-white hover:bg-gray-50 px-4 rounded-15 font-caption whitespace-nowrap"
                onClick={postSendCode}
                type="button"
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
                ? "이메일로 발송된 6자리 인증번호 (123456)"
                : "인증번호를 입력하세요"
            }
            type="text"
            timer={sendCode ? "03:00" : undefined}
            {...register("code")}
            error={!!errors.code || !!codeError}
            errorMessage={errors.code?.message || codeError}
          />
        </div>

        <div className="mt-10">
          <Button
            size="big"
            fullWidth
            onClick={handleSubmit(onSubmit)}
            variant="gradient"
            disabled={!isValid}
          >
            다음으로
          </Button>
        </div>

        {sendCode && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setSendCode(false)}
              className="font-body2 text-text-placeholder underline underline-offset-4"
            >
              인증번호 다시 받기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
