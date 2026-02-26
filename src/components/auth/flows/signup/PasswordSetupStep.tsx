import PasswordForm from "@/components/auth/common/PasswordForm";

interface IPasswordSetupStepProps {
  onNext: (password: string) => void;
}

export default function PasswordSetupStep({ onNext }: IPasswordSetupStepProps) {
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
      onSubmit={onNext}
    />
  );
}
