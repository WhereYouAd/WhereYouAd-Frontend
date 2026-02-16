import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { useSocialLogin } from "@/hooks/auth/useSocialLogin";
import { useStepNavigation } from "@/hooks/common/useStepNavigation";

import Step01Email from "@/components/auth/signupStep/Step01Email";
import Step02Password from "@/components/auth/signupStep/Step02Password";
import Step03Profile from "@/components/auth/signupStep/Step03Profile";
import Button from "@/components/common/button/Button";

import GoogleIcon from "@/assets/auth/social/google.svg?react";
import KakaoIcon from "@/assets/auth/social/kakao.svg?react";
import MailIcon from "@/assets/auth/social/mail.svg?react";
import NaverIcon from "@/assets/auth/social/naver.svg?react";
import useAuthStore from "@/store/useAuthStore";

export default function Signup() {
  const location = useLocation();
  const { resetAuth } = useAuthStore();
  const { step, setStep, handleNext } = useStepNavigation(
    location.state?.step || 0,
  );

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
    return <Step02Password onNext={handleNext} />;
  }
  if (step === 3) {
    return <Step03Profile />;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col gap-10">
        <Button
          fullWidth
          size="big"
          variant="gradient"
          leftIcon={<MailIcon className="w-6 h-6" />}
          onClick={() => setStep(1)}
          className="font-heading3 shadow-md hover:shadow-lg transition-all"
        >
          이메일로 시작하기
        </Button>

        <Button
          fullWidth
          size="big"
          variant="custom"
          leftIcon={<GoogleIcon className="w-6 h-6" />}
          onClick={() => handleSocialLogin("google")}
          className="bg-white border border-gray-100 text-text-main font-heading3 shadow-sm hover:bg-gray-50"
        >
          구글 로그인
        </Button>

        <Button
          fullWidth
          size="big"
          variant="custom"
          leftIcon={<KakaoIcon className="w-6 h-6" />}
          onClick={() => handleSocialLogin("kakao")}
          className="bg-social-kakao text-text-main font-heading3 shadow-sm hover:opacity-90"
        >
          카카오 로그인
        </Button>

        <Button
          fullWidth
          size="big"
          variant="custom"
          leftIcon={<NaverIcon className="w-5 h-5 text-white" />}
          onClick={() => handleSocialLogin("naver")}
          className="bg-social-naver text-white font-heading3 shadow-sm hover:opacity-90"
        >
          네이버 로그인
        </Button>
      </div>

      <div className="font-body3 text-text-sub mt-15 flex gap-2">
        <span>이미 사용자 계정이 있다면?</span>
        <Link
          to="/login"
          className="text-text-sub underline hover:text-text-auth-sub"
        >
          로그인하기
        </Link>
      </div>
    </div>
  );
}
