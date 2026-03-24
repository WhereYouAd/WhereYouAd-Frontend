import LogoGoogleAds from "@/assets/logo/social-logo/circle/googleAds-circle.svg?react";
import LogoKakao from "@/assets/logo/social-logo/circle/kakao-circle.svg?react";
import LogoNaver from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

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
    icon: LogoGoogleAds,
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

const CAROUSEL_ITEMS = [...PLATFORMS, ...PLATFORMS];

export default function IntroAdManagement({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ease-out bg-brand-300 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
      }`}
    >
      <div className="flex h-full w-full flex-col justify-center gap-16">
        <div className="w-full flex justify-center px-20">
          <div
            key={isActive ? "text-active" : "text-inactive"}
            className={`w-full max-w-150 flex flex-col items-start text-left ${isActive ? "animate-slide-fade-up" : "opacity-0"}`}
          >
            <span className="mb-6 inline-block rounded-full bg-status-blue/10 px-4 py-1.5 font-label text-status-blue">
              통합 관리
            </span>
            <h2 className="font-heading1 text-text-main whitespace-pre-line">
              흩어진 광고 성과를{"\n"}
              한곳에서 관리하세요
            </h2>
            <p className="mt-4 font-body1 text-text-sub whitespace-pre-line">
              여러 매체의 광고 데이터를{"\n"}
              실시간으로 모아서 보여드려요
            </p>
          </div>
        </div>

        <div className="flex w-full justify-center pt-16" aria-hidden="true">
          <div className="w-full overflow-hidden h-60 flex items-center">
            <div
              className="flex w-max gap-8 px-4 animate-scroll"
              style={{
                animationPlayState: isActive ? "running" : "paused",
              }}
            >
              {CAROUSEL_ITEMS.map((platform, index) => (
                <div
                  key={`${platform.id}-${index}`}
                  className={`flex h-40 w-40 items-center justify-center rounded-full shadow-Soft ${platform.bgColor}`}
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
