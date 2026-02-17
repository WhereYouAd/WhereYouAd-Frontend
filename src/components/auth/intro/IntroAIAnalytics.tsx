import React, { useEffect, useState } from "react";

import AiTalk from "@/assets/auth/introSlide/ai_talk.svg?react";

export default function IntroAIAnalytics({ isActive }: { isActive: boolean }) {
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
    { height: "90%", delay: "300ms", isBlue: true },
    { height: "50%", delay: "400ms", isBlue: false },
    { height: "80%", delay: "550ms", isBlue: false },
  ];

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
              AI 성과 분석
            </span>
            <h2 className="font-heading1 text-4xl font-bold leading-tight text-text-main whitespace-pre-line">
              복잡한 데이터 분석,{"\n"}
              AI가 대신 해드릴게요
            </h2>
            <p className="mt-6 text-xl text-text-sub font-medium leading-relaxed whitespace-pre-line">
              광고 성과를 자동으로 분석해서{"\n"}
              중요한 인사이트만 쏙쏙 뽑아드려요
            </p>
          </div>
        </div>

        <div className="flex w-full justify-center px-20">
          <div className="w-full max-w-150 flex justify-start pl-2">
            <div
              key={isActive ? "active" : "inactive"}
              className="flex h-60 items-end gap-3 sm:gap-4 lg:gap-5"
            >
              {bars.map((bar, index) => (
                <div
                  key={index}
                  className={`relative w-12 sm:w-16 rounded-t-2xl transition-all duration-500 ${
                    isActive ? "animate-graph-up" : "h-0"
                  } ${
                    bar.isBlue
                      ? "bg-linear-to-b from-logo-1 to-logo-2"
                      : "bg-chart-inactive"
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
                      className={`absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) z-50 ${
                        showBubble
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-0 translate-y-8 scale-50"
                      }`}
                    >
                      <div className="relative drop-shadow-xl hover:scale-105 transition-transform duration-300">
                        <AiTalk className="w-auto h-auto min-w-45" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
