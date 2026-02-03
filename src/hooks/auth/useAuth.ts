import { useCoreMutation } from "@/hooks/customQuery";

import { sendEmail, signUp, verifyEmail } from "@/api/auth/auth";

export const useAuth = () => {
  const useSendCode = useCoreMutation(sendEmail);
  const useCheckCode = useCoreMutation(verifyEmail);
  const useSignUp = useCoreMutation(signUp);

  return {
    useSendCode,
    useCheckCode,
    useSignUp,
  };
};
