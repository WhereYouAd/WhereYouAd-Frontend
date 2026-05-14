import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useSocialLogin } from "@/hooks/auth/useSocialLogin";
import { useStepNavigation } from "@/hooks/common/useStepNavigation";

import AuthFormShell from "@/components/auth/common/AuthFormShell";
import Step01Email from "@/components/auth/flows/signup/EnterEmailStep";
import Step02Password from "@/components/auth/flows/signup/PasswordSetupStep";
import Step03Profile from "@/components/auth/flows/signup/ProfileSetupStep";
import Button from "@/components/common/button/Button";

import MailIcon from "@/assets/icon/common/mail.svg?react";
import NaverIcon from "@/assets/logo/social-logo/circle/naver-circle.svg?react";
import GoogleIcon from "@/assets/logo/social-logo/plain/google.svg?react";
import KakaoIcon from "@/assets/logo/social-logo/plain/kakao.svg?react";
import useAuthStore from "@/store/useAuthStore";

export default function Signup() {
  const location = useLocation();
  const { resetAuth } = useAuthStore();
  const { step, setStep, handleNext } = useStepNavigation(
    location.state?.step || 0,
  );
  const [password, setPassword] = useState("");

  useEffect(() => {
    return () => {
      resetAuth();
    };
  }, [resetAuth]);

  const { handleSocialLogin } = useSocialLogin();

  if (step === 1) {
    return <Step01Email onNext={handleNext} />;
  }
  if (step === 2) {
    return (
      <Step02Password
        onNext={(pw) => {
          setPassword(pw);
          handleNext();
        }}
      />
    );
  }
  if (step === 3) {
    return <Step03Profile password={password} />;
  }

  return (
    <AuthFormShell variant="social">
      <div className="flex w-full flex-col gap-10">
        <Button
          fullWidth
          size="big"
          variant="gradient"
          leftIcon={<MailIcon className="w-6.5 h-6.5" />}
          onClick={() => setStep(1)}
          className="font-heading4 shadow-Soft transition-all"
        >
          이메일로 시작하기
        </Button>

        <Button
          fullWidth
          size="big"
          variant="custom"
          leftIcon={<GoogleIcon className="w-6 h-6" />}
          onClick={() => handleSocialLogin("google")}
          className="bg-surface-100 border border-surface-300 text-text-title font-heading4 shadow-Soft hover:bg-surface-200"
        >
          구글 로그인
        </Button>

        <Button
          fullWidth
          size="big"
          variant="custom"
          leftIcon={<KakaoIcon className="w-6 h-6 shrink-0" aria-hidden />}
          onClick={() => handleSocialLogin("kakao")}
          className="bg-surface-100 border border-surface-300 text-text-title font-heading4 shadow-Soft hover:bg-surface-200"
        >
          카카오 로그인
        </Button>

        <Button
          fullWidth
          size="big"
          variant="custom"
          leftIcon={<NaverIcon className="w-6 h-6 shrink-0" aria-hidden />}
          onClick={() => handleSocialLogin("naver")}
          className="bg-surface-100 border border-surface-300 text-text-title font-heading4 shadow-Soft hover:bg-surface-200"
        >
          네이버 로그인
        </Button>
      </div>

      <div className="font-body2 text-text-body mt-15 flex gap-2">
        <span>이미 사용자 계정이 있다면?</span>
        <Link
          to="/login"
          className="text-text-body underline hover:text-text-auth-sub"
        >
          로그인하기
        </Link>
      </div>
    </AuthFormShell>
  );
}
