import { useEffect, useState } from "react";

import IntroSlide1 from "./intro/IntroSlide1";
import IntroSlide2 from "./intro/IntroSlide2";
import IntroSlide3 from "./intro/IntroSlide3";

export default function OnboardingIntro() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const getIndicatorColor = (index: number) => {
    const isDarkBackground = currentSlide === 0;
    const isActive = index === currentSlide;

    if (isDarkBackground) {
      return isActive ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60";
    } else {
      return isActive
        ? "w-8 bg-logo-1"
        : "w-2.5 bg-logo-1/40 hover:bg-logo-1/60";
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden text-white">
      {/* 슬라이드 패널 */}
      <IntroSlide1 isActive={currentSlide === 0} />
      <IntroSlide2 isActive={currentSlide === 1} />
      <IntroSlide3 isActive={currentSlide === 2} />

      {/* 인디케이터 */}
      <div className="absolute bottom-12 z-20 flex gap-3">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${getIndicatorColor(
              index,
            )}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
