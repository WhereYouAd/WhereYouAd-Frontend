import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useAuthStore from "@/store/useAuthStore";

export default function RedirectPage() {
  const navigate = useNavigate();
  const { login, setSocialId, setEmail } = useAuthStore();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const accessToken = getCookie("access_token");

    if (accessToken) {
      // TODO: Zustand 로그인 상태 업데이트 - 추후 내 정보 조회 API 연동 시 수정
      login("social@user.com", accessToken);

      toast.success("소셜 로그인되었습니다.");
      navigate("/", { replace: true });
    } else {
      console.error("No access token found in cookies.");
      toast.error("소셜 로그인에 실패했습니다. 다시 시도해주세요.");
      navigate("/login", { replace: true });
    }
  }, [navigate, login, setEmail, setSocialId]);

  return (
    <div className="relative flex justify-center items-center h-screen w-full bg-white">
      <div className="relative flex justify-center h-75 min-w-70 w-112.5 max-w-[96vw]">
        <div className="absolute top-80 text-[20px] text-gray-500 font-medium animate-pulse">
          로그인 중...
        </div>
      </div>
    </div>
  );
}
