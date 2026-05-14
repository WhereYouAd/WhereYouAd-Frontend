import { useNavigate } from "react-router-dom";

import { maskEmail } from "@/utils/maskEmail";

import AuthFormShell from "@/components/auth/common/AuthFormShell";
import Button from "@/components/common/button/Button";

import useAuthStore from "@/store/useAuthStore";

export default function ShowEmailResultStep() {
  const navigate = useNavigate();
  const { email } = useAuthStore();

  return (
    <AuthFormShell variant="step">
      <h1 className="text-start font-heading2 text-text-title mb-10">
        <span className="block">입력하신 정보로</span>
        <span className="block">WYA에 가입된 계정을 찾았어요</span>
      </h1>

      <div className="w-full h-24 bg-surface-200 rounded-2xl flex items-center justify-between px-5 mb-10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-caption text-text-placeholder shrink-0">
            이메일 ID
          </span>
          <span className="font-body1 text-text-title break-all">
            {maskEmail(email)}
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 h-8 rounded-lg border border-surface-400 bg-surface-100 px-2 font-caption text-text-auth-sub transition-colors hover:bg-surface-200"
          onClick={() => navigate("/find-pw")}
        >
          비밀번호 재설정
        </button>
      </div>

      <Button
        size="big"
        fullWidth
        onClick={() => navigate("/login")}
        variant="gradient"
      >
        로그인으로 돌아가기
      </Button>
    </AuthFormShell>
  );
}
