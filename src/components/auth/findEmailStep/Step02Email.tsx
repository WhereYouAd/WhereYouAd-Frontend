import { useNavigate } from "react-router-dom";

import { maskEmail } from "@/utils/maskEmail";

import Button from "@/components/common/Button";

import useAuthStore from "@/store/useAuthStore";

export default function Step02Email() {
  const navigate = useNavigate();
  const { email } = useAuthStore();

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-130 px-6 pb-12">
        <h1 className="text-start font-heading2 text-text-main mb-10">
          <p>입력하신 정보로</p>
          <p>WYA에 가입된 계정을 찾았어요</p>
        </h1>

        <div className="w-full h-24 bg-gray-50 rounded-2xl flex items-center justify-between px-5 mb-10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-caption text-text-placeholder shrink-0">
              이메일 ID
            </span>
            <span className="font-body1 text-text-main break-all">
              {maskEmail(email)}
            </span>
          </div>
          <button
            type="button"
            className="shrink-0 h-8 px-2 border border-gray-200 bg-white rounded-lg text-xs text-text-sub hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/auth/find-pw")}
          >
            비밀번호 재설정
          </button>
        </div>

        <Button
          size="big"
          fullWidth
          onClick={() => navigate("/auth/login")}
          variant="gradient"
        >
          로그인으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
