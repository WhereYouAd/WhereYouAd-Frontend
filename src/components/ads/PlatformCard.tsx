import type { ReactNode } from "react";

import type { TPlatform } from "@/types/ads/campaign";

import InfoCard from "@/components/common/card/InfoCard";

import GoogleLogo from "@/assets/icon/ads/google-logo.svg?react";
import KakaoLogo from "@/assets/icon/ads/kakao-logo.svg?react";
import NaverLogo from "@/assets/icon/ads/naver-logo.svg?react";

interface IPlatformCardProps {
  platforms: TPlatform[];
  className?: string;
}

const LogoMap: Record<TPlatform, ReactNode> = {
  kakao: <KakaoLogo className="w-full h-full" />,
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
