import { useStepNavigation } from "@/hooks/common/useStepNavigation";

import Step01Phone from "@/components/auth/flows/find-email/EnterPhoneStep";
import Step02Email from "@/components/auth/flows/find-email/ShowEmailResultStep";

export default function FindEmail() {
  const { step, handleNext } = useStepNavigation(1);

  return (
    <>
      {step === 1 && <Step01Phone onNext={handleNext} />}
      {step === 2 && <Step02Email />}
    </>
  );
}
