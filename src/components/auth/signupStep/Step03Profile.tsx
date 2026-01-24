import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { nameSchema, phoneSchema } from "@/utils/validation";

import CommonAuthInput from "@/components/auth/CommonAuthInput";
import Button from "@/components/common/Button";

import useAuthStore from "@/store/useAuthStore";

const step03Schema = z.object({
  name: nameSchema,
  phoneNum: phoneSchema,
});

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
    mode: "onBlur",
    resolver: zodResolver(step03Schema),
  });

  const onSubmit: SubmitHandler<TStep03FormValues> = (data) => {
    // 최종 회원가입 데이터
    const finalSignupData = {
      email,
      password,
      ...data,
    };

    console.log("Final Signup Data:", finalSignupData);

    toast.success("회원가입이 완료되었습니다!", {
      description: `이름: ${data.name}, 전화번호: ${data.phoneNum}`,
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

          <div className="flex items-center gap-2 mt-4 ml-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-3 h-3 accent-brand-500" />
              <span className="font-body2 text-text-main underline">
                개인정보 처리방침 동의
              </span>
            </label>
          </div>

          <div className="mt-10">
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
