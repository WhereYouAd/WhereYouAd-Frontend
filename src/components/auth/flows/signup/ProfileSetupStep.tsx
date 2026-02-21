import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { stripPhoneHyphens } from "@/utils/formatPhoneNumber";
import { signupProfileSchema } from "@/utils/validation";

import { useAuth } from "@/hooks/auth/useAuth";

import CommonAuthInput from "@/components/auth/common/CommonAuthInput";
import Button from "@/components/common/button/Button";

import useAuthStore from "@/store/useAuthStore";
import useModalStore, { MODAL_TYPES } from "@/store/useModalStore";

type TSignupProfileFormValues = z.infer<typeof signupProfileSchema>;

export default function ProfileSetupStep() {
  const navigate = useNavigate();
  const { email, password, resetAuth } = useAuthStore();
  const { openModal } = useModalStore();
  const { useSignUp } = useAuth();

  useEffect(() => {
    if (!email || !password) {
      navigate("/signup", { replace: true });
    }
  }, [email, password, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<TSignupProfileFormValues>({
    mode: "onChange",
    resolver: zodResolver(signupProfileSchema),
  });

  const onSubmit: SubmitHandler<TSignupProfileFormValues> = (data) => {
    useSignUp.mutate(
      {
        email,
        password,
        name: data.name,
        phone_number: stripPhoneHyphens(data.phoneNum),
      },
      {
        onSuccess: () => {
          toast.success("회원가입이 완료되었습니다!", {
            description: `${data.name}님, 환영합니다!`,
          });
          resetAuth();
          navigate("/login");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "회원가입에 실패했습니다.",
          );
        },
      },
    );
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-130 px-6 pb-12">
        <h1 className="text-start font-heading2 text-text-main mb-10">
          <span className="block">사용자의</span>
          <span className="block">기본 정보를 입력해 주세요</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
          <CommonAuthInput
            title="이름"
            placeholder="이름을 입력해 주세요"
            {...register("name")}
            error={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <CommonAuthInput
            title="전화번호"
            placeholder="전화번호를 입력하세요"
            type="tel"
            {...register("phoneNum")}
            error={!!errors.phoneNum}
            errorMessage={errors.phoneNum?.message}
          />

          <div
            className="flex items-center mt-3 pl-1 w-full justify-between cursor-pointer"
            onClick={() => {
              openModal(MODAL_TYPES.PRIVACY, {
                initialState: {
                  privacy: watch("terms") || false,
                  marketing: watch("marketing") || false,
                },
                onAgree: (agreements) => {
                  setValue("marketing", agreements.marketing);
                  if (agreements.privacy) {
                    setValue("terms", true, { shouldValidate: true });
                  } else {
                    setValue("terms", false, { shouldValidate: true });
                  }
                },
              });
            }}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox pointer-events-none"
                checked={watch("terms")}
                readOnly
              />
              <span className="font-body2 text-text-main flex items-center gap-2">
                <span className="text-brand-700 font-body2">(필수)</span>
                개인정보 수집 및 이용 동의
              </span>
            </div>
            <button
              type="button"
              className="text-text-sub underline hover:text-text-main font-body2 whitespace-nowrap"
            >
              내용 보기
            </button>
          </div>

          <div className="mt-8">
            <Button
              size="big"
              fullWidth
              type="submit"
              variant="gradient"
              disabled={!isValid || useSignUp.isPending}
            >
              회원 가입
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
