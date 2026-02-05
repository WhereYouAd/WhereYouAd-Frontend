import { useCoreMutation } from "@/hooks/customQuery";

import { login, sendEmail, signUp, verifyEmail } from "@/api/auth/auth";

export const useAuth = () => {
  const useSendCode = useCoreMutation(sendEmail);
  const useCheckCode = useCoreMutation(verifyEmail);
  const useSignUp = useCoreMutation(signUp);
  const useLogin = useCoreMutation(login);

  return {
    useSendCode,
    useCheckCode,
    useSignUp,
    useLogin,
  };
};
