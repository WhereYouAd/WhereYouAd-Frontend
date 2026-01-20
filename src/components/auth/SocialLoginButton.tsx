import Button from "@/components/common/Button";

import GoogleIcon from "@/assets/auth/social/google.svg?react";
import NaverIcon from "@/assets/auth/social/naver.svg?react";
import MailIcon from "@/assets/auth/social/mail.svg?react";
import KakaoIcon from "@/assets/auth/social/kakao.svg?react";

interface ISocialLoginButtonProps {
  provider: "kakao" | "naver" | "google" | "email";
  onClick: () => void;
  className?: string;
}

export default function SocialLoginButton({
  provider,
  onClick,
  className,
}: ISocialLoginButtonProps) {
  const providerConfig = {
    kakao: {
      label: "카카오 로그인",
      icon: <KakaoIcon className="w-[24px] h-[24px]" />,
      variant: "custom" as const,
      className: "bg-[#FEE500] text-[#000000]",
    },
    naver: {
      label: "네이버 로그인",
      icon: <NaverIcon className="w-[24px] h-[24px]" />,
      variant: "custom" as const,
      className: "bg-[#03C75A] text-white",
    },
    google: {
      label: "구글 로그인",
      icon: <GoogleIcon className="w-[24px] h-[24px]" />,
      variant: "custom" as const,

      className: "bg-white border border-gray-200",
    },
    email: {
      label: "이메일로 시작하기",
      icon: <MailIcon className="w-[24px] h-[24px]" />,
      variant: "dark" as const,
      className: "",
    },
  };

  const config = providerConfig[provider];

  return (
    <Button
      variant={config.variant}
      fullWidth
      size="big"
      leftIcon={config.icon}
      onClick={onClick}
      className={`${config.className} ${className || ""}`}
    >
      {config.label}
    </Button>
  );
}
