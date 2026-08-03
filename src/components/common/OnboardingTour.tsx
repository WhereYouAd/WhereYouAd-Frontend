import { useEffect, useRef } from "react";
import { Joyride } from "react-joyride";
import { useLocation, useNavigate } from "react-router-dom";

import { useOnboardingTour } from "@/hooks/common/useOnboardingTour";

import OnboardingTooltip from "@/components/common/OnboardingTooltip";

interface IOnboardingTourProps {
  autoStart?: boolean;
}

export default function OnboardingTour({
  autoStart = false,
}: IOnboardingTourProps) {
  const { run, startTour, handleEvent, steps, myRole } = useOnboardingTour();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tourStarted = useRef(false);

  useEffect(() => {
    if (!autoStart || tourStarted.current) return;
    if ((myRole === "ADMIN" || myRole === null) && pathname !== "/workspace") {
      navigate("/workspace", { replace: true });
      return;
    }
    if (myRole === "MEMBER" && pathname !== "/dashboard") {
      navigate("/dashboard", { replace: true });
      return;
    }
    tourStarted.current = true;
    startTour();
  }, [autoStart, myRole, pathname, navigate, startTour]);

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
