import type { ReactNode } from "react";
import { useState } from "react";

import ChevronDown from "@/assets/icon/chevron/chevron-down.svg?react";
import GoogleAdsPlain from "@/assets/logo/social-logo/plain/google_ads.png";
import MetaPlain from "@/assets/logo/social-logo/plain/meta.svg?react";
import GoogleWordmark from "@/assets/logo/social-logo/wordmark/google-wordmark.svg?react";
import KakaoWordmark from "@/assets/logo/social-logo/wordmark/kakao-wordmark.svg?react";
import NaverWordmarkPng from "@/assets/logo/social-logo/wordmark/naver-wordmark.png";

type TPlatform = {
  id: string;
  label: string;
  content: ReactNode;
  offsetClass?: string;
};

const PLATFORMS: TPlatform[] = [
  {
    id: "naver",
    label: "Naver",
    content: (
      <img
        src={NaverWordmarkPng}
        alt="Naver"
        className="h-[13px] w-auto object-contain"
      />
    ),
  },
  {
    id: "kakao",
    label: "Kakao",
    content: <KakaoWordmark className="h-[18px] w-auto" />,
  },
  {
    id: "google",
    label: "Google",
    content: <GoogleWordmark className="h-[23px] w-auto" />,
  },
  {
    id: "meta",
    label: "Meta",
    content: <MetaPlain className="h-[35px] w-auto" />,
    offsetClass: "-ml-2",
  },
  {
    id: "googleads",
    label: "Google Ads",
    content: (
      <img
        src={GoogleAdsPlain}
        alt="Google Ads"
        className="h-[40px] w-auto object-contain"
      />
    ),
    offsetClass: "-ml-2",
  },
];

export default function GuidePlatform() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "googleads",
    "meta",
    "naver",
  ]);

  function togglePlatform(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  }

  return (
    <div className="w-full h-[360px] md:h-[420px] bg-transparent font-sans">
      <div className="h-full rounded-[28px] bg-surface-100/65 border border-surface-400/60 backdrop-blur-sm p-5 md:p-6 flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          className="h-11 w-full rounded-xl px-4 border border-surface-400/70 bg-surface-100 text-[13px] font-semibold text-text-title flex items-center justify-between hover:bg-primary-100/40 transition-ui-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/30"
        >
          <span>플랫폼 선택</span>
          <span
            aria-hidden
            className={`text-text-muted transition-transform duration-200 ${isMenuOpen ? "rotate-180" : "rotate-0"}`}
          >
            <ChevronDown className="w-4.5 h-4.5" />
          </span>
        </button>

        {isMenuOpen && (
          <div className="bg-surface-100 border border-surface-400/70 rounded-2xl shadow-landing-dropdown overflow-hidden">
            <div>
              {PLATFORMS.map((platform) => {
                const isSelected = selectedIds.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={`w-full h-14 px-4 flex items-center justify-start border-b last:border-b-0 transition-ui-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/25 focus-visible:ring-inset bg-surface-100 border-surface-400/40 ${
                      isSelected ? "" : "hover:bg-surface-100"
                    }`}
                  >
                    <div
                      className={`min-w-0 flex items-center h-6 ${platform.offsetClass ?? ""}`}
                    >
                      {platform.content}
                    </div>
                    <span className="sr-only">{platform.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
