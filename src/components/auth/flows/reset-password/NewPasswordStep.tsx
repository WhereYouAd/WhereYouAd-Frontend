import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/hooks/auth/useAuth";

import PasswordForm from "@/components/auth/common/PasswordForm";

import useAuthStore from "@/store/useAuthStore";

export default function NewPasswordStep() {
  const navigate = useNavigate();
  const { email } = useAuthStore();
  const { useResetPassword } = useAuth();

  const handleSubmit = (password: string) => {
    useResetPassword.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("비밀번호가 변경되었습니다.", {
            description: "로그인 페이지로 이동합니다.",
          });
          navigate("/login", { replace: true });
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "비밀번호 변경에 실패했습니다.",
          );
        },
      },
    );
  };

  return (
    <PasswordForm
      title={
        <>
          새로운 비밀번호를
          <br />
          입력해 주세요
        </>
      }
      buttonText="비밀번호 변경하기"
      onSubmit={handleSubmit}
      disabled={useResetPassword.isPending}
    />
  );
}
