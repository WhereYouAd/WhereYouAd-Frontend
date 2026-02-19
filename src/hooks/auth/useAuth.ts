import { useCoreMutation } from "@/hooks/customQuery";

import {
  login,
  sendEmail,
  sendSMS,
  signUp,
  verifyEmail,
  verifySMS,
} from "@/api/auth/auth";

export const useAuth = () => {
  const useLogin = useCoreMutation(login);
  const useSignUp = useCoreMutation(signUp);
  const useSendCode = useCoreMutation(sendEmail);
  const useCheckCode = useCoreMutation(verifyEmail);
  const useSendSMS = useCoreMutation(sendSMS);
  const useVerifySMS = useCoreMutation(verifySMS);

  return {
    useLogin,
    useSignUp,
    useSendCode,
    useCheckCode,
    useSendSMS,
    useVerifySMS,
  };
};
