import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { step02Schema } from "@/utils/validation";

import Button from "@/components/common/Button";

import CommonAuthInput from "../common/CommonAuthInput";

import useAuthStore from "@/store/useAuthStore";

type TStep02FormValues = z.infer<typeof step02Schema>;

export default function Step02ResetPassword() {
  const navigate = useNavigate();
  const { setPassword } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TStep02FormValues>({
    mode: "onBlur",
    resolver: zodResolver(step02Schema),
  });

  const onSubmit: SubmitHandler<TStep02FormValues> = (data) => {
    setPassword(data.password);
    toast.success("비밀번호가 변경되었습니다.", {
      description: "로그인 페이지로 이동합니다.",
    });
    navigate("/auth/login");
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-130 px-6 pb-12">
        <h1 className="text-start font-heading2 text-text-main mb-10">
          <p>새로운 비밀번호를 </p>
          <p>입력해 주세요</p>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
          <CommonAuthInput
            title="비밀번호"
            placeholder="비밀번호를 입력하세요"
            type="password"
            {...register("password")}
            error={!!errors.password}
            errorMessage={errors.password?.message}
          />
          <CommonAuthInput
            title="비밀번호 확인"
            placeholder="한번 더 입력해 주세요."
            type="password"
            {...register("repassword")}
            error={!!errors.repassword}
            errorMessage={errors.repassword?.message}
          />

          <div className="mt-10">
            <Button
              size="big"
              fullWidth
              type="submit"
              variant="gradient"
              disabled={!isValid}
            >
              비밀번호 변경하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
