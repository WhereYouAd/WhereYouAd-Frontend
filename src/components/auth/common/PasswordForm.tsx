import { type ReactNode } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { signupPasswordSchema } from "@/utils/validation";

import CommonAuthInput from "@/components/auth/common/CommonAuthInput";
import Button from "@/components/common/button/Button";

type TSignupPasswordFormValues = z.infer<typeof signupPasswordSchema>;

interface IPasswordFormProps {
  title: ReactNode;
  buttonText: string;
  onSubmit: (password: string) => void;
  disabled?: boolean;
}

export default function PasswordForm({
  title,
  buttonText,
  onSubmit,
  disabled,
}: IPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TSignupPasswordFormValues>({
    mode: "onBlur",
    resolver: zodResolver(signupPasswordSchema),
  });

  const handleFormSubmit: SubmitHandler<TSignupPasswordFormValues> = (data) => {
    onSubmit(data.password);
  };

  return (
    <div className="w-full max-w-130 px-6 pb-12">
      <h1 className="text-start font-heading2 text-text-main mb-10">{title}</h1>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-7"
      >
        <CommonAuthInput
          title="비밀번호"
          placeholder="비밀번호를 입력하세요"
          type="password"
          {...register("password")}
          error={!!errors.password}
          errorMessage={errors.password?.message}
        />
        <CommonAuthInput
          title="비밀번호 확인"
          placeholder="한번 더 입력해 주세요."
          type="password"
          {...register("repassword")}
          error={!!errors.repassword}
          errorMessage={errors.repassword?.message}
        />

        <div className="mt-10">
          <Button
            size="big"
            fullWidth
            type="submit"
            variant="gradient"
            disabled={!isValid || disabled}
          >
            {buttonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
