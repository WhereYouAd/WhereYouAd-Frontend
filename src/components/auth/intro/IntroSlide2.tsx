import LogoGoogle from "@/assets/auth/introSlide/logo_goole.svg?react";
import LogoKakao from "@/assets/auth/introSlide/logo_kakao.svg?react";
import LogoNaver from "@/assets/auth/introSlide/logo_naver.svg?react";

const PLATFORMS = [
  {
    id: "kakao",
    icon: LogoKakao,
    bgColor: "bg-[#FEE500]",
    className: "text-[#3A1D1D]",
    size: "w-45 h-45",
  },
  {
    id: "google",
    icon: LogoGoogle,
    bgColor: "bg-white",
    className: "",
    size: "w-45 h-45",
  },
  {
    id: "naver",
    icon: LogoNaver,
    bgColor: "bg-[#03C75A]",
    className: "text-white",
    size: "w-45 h-45",
  },
];

const CAROUSEL_ITEMS = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS, ...PLATFORMS];

export default function IntroSlide2({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out bg-brand-300 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      <div className="flex h-full w-full flex-col justify-center gap-[22vh]">
        <div className="w-full flex justify-center px-20">
          <div className="w-full max-w-150 flex flex-col items-start text-left">
            <div className="mb-4 font-heading2 text-logo-1">
              통합 광고 성과 관리
            </div>
            <div className="space-y-7 pt-8 font-heading1 text-text-main">
              <p>흩어진 광고 데이터를 하나로!</p>
              <p>광고 현황을 통합적으로 관리하고</p>
              <p>성과 변화를 직관적으로 확인하세요.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <div className="w-full overflow-hidden">
            <div className="flex w-max animate-scroll gap-6 px-3">
              {CAROUSEL_ITEMS.map((platform, index) => (
                <div
                  key={`${platform.id}-${index}`}
                  className={`flex h-50 w-50 items-center justify-center rounded-full ${platform.bgColor}`}
                >
                  <platform.icon
                    className={`${platform.className} ${platform.size}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
