import { useEffect } from "react";
import { Joyride } from "react-joyride";

import { useOnboardingTour } from "@/hooks/common/useOnboardingTour";

import OnboardingTooltip from "@/components/common/OnboardingTooltip";

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
      tooltipComponent={OnboardingTooltip}
      options={{
        overlayColor: "rgba(17, 24, 39, 0.5)",
        zIndex: 1000,
      }}
    />
  );
}
