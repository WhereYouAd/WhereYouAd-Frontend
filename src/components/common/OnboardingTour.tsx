import { useEffect } from "react";
import Joyride from "react-joyride";

import { useOnboardingTour } from "@/hooks/common/useOnboardingTour";

interface IOnboardingTourProps {
  autoStart?: boolean;
}

export default function OnboardingTour({
  autoStart = false,
}: IOnboardingTourProps) {
  const { run, startTour, handleEvent, steps } = useOnboardingTour();

  useEffect(() => {
    if (autoStart) startTour();
  }, [autoStart, startTour]);

  return (
    <Joyride
      steps={steps}
      run={run}
      onEvent={handleEvent}
      continuous
      scrollToFirstStep
      locale={{
        back: "이전",
        close: "닫기",
        last: "완료",
        next: "다음",
        skip: "건너뛰기",
      }}
      options={{
        primaryColor: "#2f5bea",
        zIndex: 1000,
        showProgress: true,
        buttons: ["back", "close", "primary", "skip"],
      }}
    />
  );
}
