import { useState } from "react";

import Step01VerifyEmail from "@/components/auth/findPwStep/Step01VerifyEmail";
import Step02ResetPassword from "@/components/auth/findPwStep/Step02ResetPassword";

export default function FindPw() {
  const [step, setStep] = useState<number>(1);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <>
      {step === 1 && <Step01VerifyEmail onNext={handleNextStep} />}
      {step === 2 && <Step02ResetPassword />}
    </>
  );
}
