import { useCallback, useState } from "react";

export const useStepNavigation = (initialStep: number) => {
  const [step, setStep] = useState(initialStep);

  const handleNext = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  return { step, setStep, handleNext };
};
