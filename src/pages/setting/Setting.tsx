import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";

import useAuthStore from "@/store/useAuthStore";

export default function Setting() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return (
    <section className="w-full flex flex-col gap-6">
      <Card title="계정" description="계정 및 보안 설정을 관리합니다.">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-body2 text-text-main font-semibold">로그아웃</p>
            <p className="font-caption text-text-sub">
              현재 계정에서 로그아웃합니다.
            </p>
          </div>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => {
              logout();
              toast.success("로그아웃되었습니다.");
              navigate("/login", { replace: true });
            }}
            className="shrink-0"
          >
            로그아웃
          </Button>
        </div>
      </Card>
    </section>
  );
}
