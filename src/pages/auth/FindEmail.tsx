import { useState } from "react";

import Step01Phone from "@/components/auth/findEmailStep/Step01Phone";
import Step02Email from "@/components/auth/findEmailStep/Step02Email";

export default function FindEmail() {
  const [step, setStep] = useState<number>(1);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <>
      {step === 1 && <Step01Phone onNext={handleNextStep} />}
      {step === 2 && <Step02Email />}
    </>
  );
}
