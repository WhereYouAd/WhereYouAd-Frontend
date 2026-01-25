import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { step03Schema } from "@/utils/validation";

import CommonAuthInput from "@/components/auth/CommonAuthInput";
import Button from "@/components/common/Button";

import useAuthStore from "@/store/useAuthStore";

type TStep03FormValues = z.infer<typeof step03Schema>;

export default function SignupProfile() {
  const navigate = useNavigate();
  const { email, password } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<TStep03FormValues>({
    mode: "onChange",
    resolver: zodResolver(step03Schema),
  });

  const onSubmit: SubmitHandler<TStep03FormValues> = (data) => {
    // 최종 회원가입 데이터 (예시)
    const finalSignupData = {
      email,
      password,
      ...data,
    };

    console.log("Final Signup Data:", finalSignupData);

    toast.success("회원가입이 완료되었습니다!", {
      description: `이름: ${data.name}, 환영합니다!`,
    });
    navigate("/auth/login");
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-130 px-6 pb-12">
        <h1 className="text-start font-heading2 text-text-main mb-10">
          <p>사용자의</p>
          <p>기본 정보를 입력해 주세요</p>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
          <CommonAuthInput
            title="이름"
            placeholder="이름을 입력해 주세요"
            {...register("name")}
            error={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <Controller
            control={control}
            name="phoneNum"
            render={({ field: { onChange, value } }) => (
              <CommonAuthInput
                title="전화번호"
                placeholder="전화번호를 입력하세요"
                type="phoneNum"
                value={value || ""}
                onChange={onChange}
                error={!!errors.phoneNum}
                errorMessage={errors.phoneNum?.message}
              />
            )}
          />

          <div className="flex items-center mt-3 pl-1 w-full justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox"
                {...register("terms")}
              />
              <span className="font-body2 text-text-main flex items-center gap-2">
                <span className="text-brand-700 font-body2">(필수)</span>
                개인정보 수집 및 이용 동의
              </span>
            </div>
            <button
              type="button" // form submit 방지
              className="text-text-sub underline hover:text-text-main font-body2 whitespace-nowrap"
              onClick={() => toast.info("개인정보 처리방침 내용입니다.")}
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
              disabled={!isValid}
            >
              회원 가입
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
