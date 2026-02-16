import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PasswordForm from "@/components/auth/common/PasswordForm";

import useAuthStore from "@/store/useAuthStore";

export default function NewPasswordStep() {
  const navigate = useNavigate();
  const { setPassword } = useAuthStore();

  const handleSubmit = (password: string) => {
    setPassword(password);
    toast.success("비밀번호가 변경되었습니다.", {
      description: "로그인 페이지로 이동합니다.",
    });
    navigate("/login");
  };

  return (
    <PasswordForm
      title={
        <>
          <p>새로운 비밀번호를 </p>
          <p>입력해 주세요</p>
        </>
      }
      buttonText="비밀번호 변경하기"
      onSubmit={handleSubmit}
    />
  );
}
