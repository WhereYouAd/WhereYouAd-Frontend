import { useCoreMutation } from "@/hooks/customQuery";

import {
  login,
  requestPasswordReset,
  resetPassword,
  sendEmail,
  sendSMS,
  signUp,
  verifyEmail,
  verifySMS,
} from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";

export const useAuth = () => {
  const { login: loginAction } = useAuthStore();

  const useLogin = useCoreMutation(login, {
    userOnSuccess: (response, vars) => {
      loginAction(vars.email, response.data.accessToken);
    },
  });
  const useSignUp = useCoreMutation(signUp);
  const useSendCode = useCoreMutation(sendEmail);
  const useCheckCode = useCoreMutation(verifyEmail);
  const useSendSMS = useCoreMutation(sendSMS);
  const useVerifySMS = useCoreMutation(verifySMS);
  const useRequestPasswordReset = useCoreMutation(requestPasswordReset);
  const useResetPassword = useCoreMutation(resetPassword);

  return {
    useLogin,
    useSignUp,
    useSendCode,
    useCheckCode,
    useSendSMS,
    useVerifySMS,
    useRequestPasswordReset,
    useResetPassword,
  };
};
