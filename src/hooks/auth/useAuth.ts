import { useCoreMutation } from "@/hooks/customQuery";

import { sendEmail, verifyEmail } from "@/api/auth/auth";

export const useAuth = () => {
  const useSendCode = useCoreMutation(sendEmail);
  const useCheckCode = useCoreMutation(verifyEmail);

  return {
    useSendCode,
    useCheckCode,
  };
};
