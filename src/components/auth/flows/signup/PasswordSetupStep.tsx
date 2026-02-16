import PasswordForm from "@/components/auth/common/PasswordForm";

import useAuthStore from "@/store/useAuthStore";

interface IPasswordSetupStepProps {
  onNext: () => void;
}

export default function PasswordSetupStep({ onNext }: IPasswordSetupStepProps) {
  const { setPassword } = useAuthStore();

  const handleSubmit = (password: string) => {
    setPassword(password);
    onNext();
  };

  return (
    <PasswordForm
      title={
        <>
          <p>로그인에 사용할</p>
          <p>비밀번호를 입력해 주세요</p>
        </>
      }
      buttonText="다음으로"
      onSubmit={handleSubmit}
    />
  );
}
