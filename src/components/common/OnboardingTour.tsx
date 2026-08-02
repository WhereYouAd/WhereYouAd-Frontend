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
      styles={{
        spotlight: {
          style: { transition: "d 280ms cubic-bezier(0.4, 0, 0.2, 1)" },
        },
        overlay: { transition: "opacity 200ms ease-out" },
      }}
      options={{
        overlayColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
    />
  );
}
