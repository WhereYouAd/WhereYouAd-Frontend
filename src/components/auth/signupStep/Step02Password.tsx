import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { step02Schema } from "@/utils/validation";

import CommonAuthInput from "@/components/auth/CommonAuthInput";
import Button from "@/components/common/Button";

import useAuthStore from "@/store/useAuthStore";

interface IStep02PasswordProps {
  onNext: () => void;
}

type TStep02FormValues = z.infer<typeof step02Schema>;

export default function SignupPassword({ onNext }: IStep02PasswordProps) {
  const { setPassword } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TStep02FormValues>({
    mode: "onBlur",
    resolver: zodResolver(step02Schema),
  });

  const onSubmit: SubmitHandler<TStep02FormValues> = (data) => {
    setPassword(data.password);
    onNext();
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-130 px-6 pb-12">
        <h1 className="text-start font-heading2 text-text-main mb-10">
          <p>로그인에 사용할</p>
          <p>비밀번호를 입력해 주세요</p>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
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
              disabled={!isValid}
            >
              다음으로
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
