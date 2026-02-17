import LogoGoogle from "@/assets/auth/introSlide/logo_goole.svg?react";
import LogoKakao from "@/assets/auth/introSlide/logo_kakao.svg?react";
import LogoNaver from "@/assets/auth/introSlide/logo_naver.svg?react";

const PLATFORMS = [
  {
    id: "kakao",
    icon: LogoKakao,
    bgColor: "bg-social-kakao",
    className: "text-social-text-kakao",
    size: "w-32 h-32",
  },
  {
    id: "google",
    icon: LogoGoogle,
    bgColor: "bg-social-google",
    className: "",
    size: "w-32 h-32",
  },
  {
    id: "naver",
    icon: LogoNaver,
    bgColor: "bg-social-naver",
    className: "text-white",
    size: "w-32 h-32",
  },
];

const CAROUSEL_ITEMS = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS, ...PLATFORMS];

export default function IntroAdManagement({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out bg-brand-300 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      <div className="flex h-full w-full flex-col justify-center gap-[18vh]">
        <div className="w-full flex justify-center px-20">
          <div className="w-full max-w-150 flex flex-col items-start text-left">
            <span className="mb-6 inline-block rounded-full bg-logo-1/10 px-4 py-1.5 text-sm font-bold text-logo-2">
              통합 관리
            </span>
            <h2 className="font-heading1 text-4xl font-bold leading-tight text-text-main whitespace-pre-line">
              흩어진 광고 성과를{"\n"}
              한곳에서 관리하세요
            </h2>
            <p className="mt-6 text-xl text-text-sub font-medium leading-relaxed whitespace-pre-line">
              여러 매체의 광고 데이터를{"\n"}
              실시간으로 모아서 보여드려요
            </p>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <div className="w-full overflow-hidden py-10">
            <div className="flex w-max animate-scroll gap-8 px-4">
              {CAROUSEL_ITEMS.map((platform, index) => (
                <div
                  key={`${platform.id}-${index}`}
                  className={`flex h-40 w-40 items-center justify-center rounded-full shadow-lg ${platform.bgColor}`}
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
