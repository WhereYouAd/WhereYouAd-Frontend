import { useEffect, useState } from "react";

import IntroSlide2 from "@/components/auth/intro/IntroAdManagement";
import IntroSlide3 from "@/components/auth/intro/IntroAIAnalytics";
import IntroSlide1 from "@/components/auth/intro/IntroLogo";

export default function OnboardingIntro() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);

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
      <IntroSlide1 isActive={currentSlide === 0} />
      <IntroSlide2 isActive={currentSlide === 1} />
      <IntroSlide3 isActive={currentSlide === 2} />
      <div className="absolute bottom-12 z-20 flex gap-3">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-[width,background-color] duration-300 ${getIndicatorColor(
              index,
            )}`}
            aria-label={`${index + 1}번 슬라이드로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
