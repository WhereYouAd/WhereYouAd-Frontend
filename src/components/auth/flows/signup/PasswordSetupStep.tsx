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
          로그인에 사용할
          <br />
          비밀번호를 입력해 주세요
        </>
      }
      buttonText="다음으로"
      onSubmit={handleSubmit}
    />
  );
}
