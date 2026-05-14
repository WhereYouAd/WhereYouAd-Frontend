import type { ReactNode } from "react";

import type { TPlatform } from "@/types/ads/campaign";

import InfoCard from "@/components/common/card/InfoCard";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import KakaoLogo from "@/assets/logo/social-logo/circle/kakao-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

interface IPlatformCardProps {
  platforms: TPlatform[];
  className?: string;
}

const LogoMap: Record<TPlatform, ReactNode> = {
  kakao: <KakaoLogo className="h-full w-full text-text-title" />,
  google: <GoogleLogo className="w-full h-full" />,
  naver: <NaverLogo className="w-full h-full" />,
};

export default function PlatformCard({
  platforms,
  className,
}: IPlatformCardProps) {
  return (
    <InfoCard title="연동 플랫폼" className={className}>
      <div className="flex flex-wrap justify-center items-center gap-15">
        {platforms.map((p, idx) => (
          <div
            key={idx}
            className="flex h-12 w-12 items-center justify-center rounded-full shadow-sm overflow-hidden shrink-0"
          >
            {LogoMap[p]}
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
