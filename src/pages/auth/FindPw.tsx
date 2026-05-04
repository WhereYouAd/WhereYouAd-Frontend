import { useStepNavigation } from "@/hooks/common/useStepNavigation";

import Step01VerifyEmail from "@/components/auth/flows/reset-password/EmailVerificationStep";
import Step02ResetPassword from "@/components/auth/flows/reset-password/NewPasswordStep";

export default function FindPw() {
  const { step, handleNext } = useStepNavigation(1);

  return (
    <>
      {step === 1 && <Step01VerifyEmail onNext={handleNext} />}
      {step === 2 && <Step02ResetPassword />}
    </>
  );
}
