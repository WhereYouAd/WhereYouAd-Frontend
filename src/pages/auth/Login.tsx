import { type SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { loginSchema } from "@/utils/validation";

import CommonAuthInput from "@/components/auth/common/CommonAuthInput";
import Button from "@/components/common/Button";

import GoogleIcon from "@/assets/auth/social/google.svg?react";
import KakaoIcon from "@/assets/auth/social/kakao.svg?react";
import NaverIcon from "@/assets/auth/social/naver.svg?react";

type TLoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormValues>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<TLoginFormValues> = (data) => {
    // 임시 로그인 처리
    console.log("Login submit:", data);
    toast.success("로그인 성공!", {
      description: `이메일: ${data.email}`,
    });
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-130 px-6 pt-30 pb-12">
        <h1 className="text-center font-heading1 text-3xl font-bold text-text-main mb-10">
          로그인
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
          <CommonAuthInput
            title="이메일"
            placeholder="이메일을 입력하세요"
            type="email"
            {...register("email")}
            error={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <CommonAuthInput
            title="비밀번호"
            placeholder="비밀번호를 입력하세요"
            type="password"
            {...register("password")}
            error={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <Link
            to="/find-email"
            className="block w-full text-center mt-3 font-caption text-text-sub underline underline-offset-4 hover:text-text-auth-sub"
          >
            이메일/비밀번호를 잊어버렸어요
          </Link>

          <div className="mt-10">
            <Button size="big" fullWidth type="submit" variant="gradient">
              로그인하기
            </Button>
          </div>
        </form>

        <div className="mt-12 flex flex-col items-center">
          <div className="flex items-center gap-12">
            <button
              type="button"
              className="w-14 h-14 rounded-full flex items-center justify-center bg-social-kakao hover:scale-110 transition-transform duration-200 shadow-sm"
              aria-label="카카오로 로그인"
              onClick={() => {
                // 소셜 로그인
              }}
            >
              <KakaoIcon className="w-6 h-auto" />
            </button>

            <button
              type="button"
              className="w-14 h-14 rounded-full flex items-center justify-center bg-social-naver hover:scale-110 transition-transform duration-200 shadow-sm"
              aria-label="네이버로 로그인"
              onClick={() => {
                // 소셜 로그인
              }}
            >
              <NaverIcon className="w-5 h-auto text-white" />
            </button>

            <button
              type="button"
              className="w-14 h-14 rounded-full flex items-center justify-center bg-white border border-gray-100 hover:scale-110 transition-transform duration-200 shadow-sm"
              aria-label="구글로 로그인"
              onClick={() => {
                // 소셜 로그인
              }}
            >
              <GoogleIcon className="w-6 h-auto" />
            </button>
          </div>

          <div className="w-full mt-12 flex items-center gap-4 px-10">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="font-body2 text-text-placeholder text-sm select-none">
              또는
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <Link
            to="/signup"
            state={{ step: 1 }}
            className="mt-6 font-body3 text-text-placeholder underline underline-offset-4 hover:text-text-auth-sub"
          >
            이메일로 회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
