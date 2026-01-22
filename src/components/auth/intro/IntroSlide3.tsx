import { useEffect, useState } from "react";
import AiTalk from "@/assets/auth/introSlide/ai_talk.svg?react";

export default function IntroSlide3({ isActive }: { isActive: boolean }) {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (isActive) {
      const bubbleTimer = setTimeout(() => {
        setShowBubble(true);
      }, 1400);

      return () => {
        clearTimeout(bubbleTimer);
      };
    } else {
      setShowBubble(false);
    }
  }, [isActive]);

  const bars = [
    { height: "25%", delay: "0ms", isBlue: false },
    { height: "45%", delay: "100ms", isBlue: false },
    { height: "35%", delay: "200ms", isBlue: false },
    { height: "35%", delay: "300ms", isBlue: false },
    { height: "65%", delay: "400ms", isBlue: false },
    { height: "100%", delay: "550ms", isBlue: true },
    { height: "65%", delay: "650ms", isBlue: false },
  ];

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out bg-brand-300 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      <div className="flex h-full w-full flex-col justify-between pt-[250px] pb-50">
        <div className="w-full flex justify-center px-20">
          <div className="w-full max-w-[540px] flex flex-col items-start text-left">
            <div className="mb-4 text-[28px] font-heading2 text-logo-1">
              AI 성과 요약
            </div>
            <div className="space-y-7 pt-8 font-heading1 text-text-main">
              <p>광고 데이터를 자동으로 분석해</p>
              <p>중요한 성과 변화와 핵심만 정리하고</p>
              <p>빠르게 파악할 수 있도록 제공합니다.</p>
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-1 items-end justify-center pb-20">
          <div key={isActive ? "active" : "inactive"} className="flex h-[300px] items-end gap-5">
            {bars.map((bar, index) => (
              <div
                key={index}
                className={`relative w-[70px] rounded-t-[15px] ${
                  isActive ? "animate-graph-up" : "h-0"
                } ${
                  bar.isBlue
                    ? "bg-gradient-to-b from-logo-1 to-logo-2"
                    : "bg-[#E5E5E5]"
                }`}
                style={
                  {
                    "--target-height": bar.height,
                    animationDelay: bar.delay,
                  } as React.CSSProperties
                }
              >
                {bar.isBlue && (
                  <div
                    className={`absolute bottom-full left-1/2 mb-6 -translate-x-1/2 transition-all duration-700 ease-out ${
                      showBubble
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <AiTalk />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
