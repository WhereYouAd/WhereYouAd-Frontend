import { useAuth } from "@/hooks/auth/useAuth";
import { useEmailVerification } from "@/hooks/auth/useEmailVerification";

import CommonAuthInput from "@/components/auth/common/CommonAuthInput";
import Button from "@/components/common/button/Button";

interface IEmailVerificationStepProps {
  onNext: () => void;
}

export default function EmailVerificationStep({
  onNext,
}: IEmailVerificationStepProps) {
  const { useRequestPasswordReset } = useAuth();
  const {
    form: { register },
    watchedEmail,
    sendCode,
    formattedTime,
    isExpired,
    codeError,
    errors,
    isValid,
    isPending,
    handlers: {
      postSendCode,
      handleResendEmail,
      handleEditEmail,
      handleSubmit,
    },
  } = useEmailVerification({ onNext, sendMutation: useRequestPasswordReset });

  return (
    <div className="mx-auto w-full max-w-130 px-6 pb-12">
      <h1 className="text-start font-heading2 text-text-main mb-10">
        <span className="block">비밀번호 찾기를 위해</span>
        <span className="block">이메일 인증을 진행할게요</span>
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
              disabled={isPending}
            >
              인증번호 받기
            </Button>
          </div>
        ) : (
          <div className="relative w-full">
            <CommonAuthInput
              type="text"
              value={watchedEmail || ""}
              readOnly
              className="w-full h-13.5 px-5 border rounded-component-md text-body1 text-text-main bg-white border-brand-400 focus:outline-none focus:border-brand-400"
            />
            <button
              type="button"
              onClick={handleEditEmail}
              aria-label="이메일 수정"
              className="absolute right-5 top-1/2 -translate-y-1/2 font-body2 text-text-placeholder underline hover:text-text-main"
            >
              수정
            </button>
          </div>
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
          disabled={!sendCode || isExpired}
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
          type="button"
          size="big"
          fullWidth
          onClick={handleSubmit}
          variant="gradient"
          disabled={!isValid || isPending || isExpired}
        >
          다음으로
        </Button>
      </div>

      {sendCode && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleResendEmail}
            className="font-body2 text-text-placeholder underline underline-offset-4 hover:text-text-auth-sub"
          >
            인증번호 다시 받기
          </button>
        </div>
      )}
    </div>
  );
}
