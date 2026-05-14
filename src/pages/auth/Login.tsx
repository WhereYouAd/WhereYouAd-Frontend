import { type SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { loginSchema } from "@/utils/validation";

import { useAuth } from "@/hooks/auth/useAuth";
import { useSocialLogin } from "@/hooks/auth/useSocialLogin";

import AuthFormShell from "@/components/auth/common/AuthFormShell";
import CommonAuthInput from "@/components/auth/common/CommonAuthInput";
import Button from "@/components/common/button/Button";

import NaverIcon from "@/assets/logo/social-logo/circle/naver-circle.svg?react";
import GoogleIcon from "@/assets/logo/social-logo/plain/google.svg?react";
import KakaoIcon from "@/assets/logo/social-logo/plain/kakao.svg?react";

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

  const navigate = useNavigate();
  const { useLogin } = useAuth();
  const { handleSocialLogin } = useSocialLogin();

  const onSubmit: SubmitHandler<TLoginFormValues> = (data) => {
    useLogin.mutate(data, {
      onSuccess: () => {
        navigate("/dashboard", { replace: true });
      },
      onError: (error) => {
        toast.error(error.message ?? "로그인에 실패했습니다.");
      },
    });
  };

  return (
    <AuthFormShell variant="page">
      <h1 className="text-center font-heading2 text-text-title mb-10">
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
          className="block w-full text-center mt-3 font-caption text-text-body underline underline-offset-4 hover:text-text-auth-sub"
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
            className="w-14 h-14 rounded-full flex items-center justify-center bg-[#FEE500] shadow-Soft hover:scale-110 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            aria-label="카카오로 로그인"
            onClick={() => handleSocialLogin("kakao")}
          >
            <KakaoIcon className="w-7 h-auto" aria-hidden />
          </button>

          <button
            type="button"
            className="w-14 h-14 rounded-full p-0 overflow-hidden shadow-Soft hover:scale-110 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            aria-label="네이버로 로그인"
            onClick={() => handleSocialLogin("naver")}
          >
            <NaverIcon className="w-full h-full block" aria-hidden />
          </button>

          <button
            type="button"
            className="w-14 h-14 rounded-full flex items-center justify-center bg-surface-100 border border-surface-300 hover:scale-110 transition-transform duration-200 shadow-Soft"
            aria-label="구글로 로그인"
            onClick={() => toast.error("준비중입니다.")}
          >
            <GoogleIcon className="w-6 h-auto" />
          </button>
        </div>

        <div className="w-full mt-12 flex items-center gap-4 px-10">
          <div className="flex-1 h-px bg-surface-300" />
          <span className="font-body2 text-text-placeholder select-none">
            또는
          </span>
          <div className="flex-1 h-px bg-surface-300" />
        </div>

        <Link
          to="/signup"
          state={{ step: 1 }}
          className="mt-6 font-body2 text-text-placeholder underline underline-offset-4 hover:text-text-auth-sub"
        >
          이메일로 회원가입
        </Link>
      </div>
    </AuthFormShell>
  );
}
