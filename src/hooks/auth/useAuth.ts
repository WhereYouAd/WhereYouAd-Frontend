import { useCoreMutation } from "@/hooks/customQuery";

import { login, sendEmail, signUp, verifyEmail } from "@/api/auth/auth";

export const useAuth = () => {
  const useLogin = useCoreMutation(login);
  const useSignUp = useCoreMutation(signUp);
  const useSendCode = useCoreMutation(sendEmail);
  const useCheckCode = useCoreMutation(verifyEmail);

  return {
    useLogin,
    useSignUp,
    useSendCode,
    useCheckCode,
  };
};
