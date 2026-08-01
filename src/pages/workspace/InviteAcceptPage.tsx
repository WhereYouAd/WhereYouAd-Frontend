import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { buildPathWithReturnUrl } from "@/utils/auth/returnUrl";

import Button from "@/components/common/button/Button";
import ErrorLayout from "@/components/common/error/ErrorLayout";

import { acceptInvitaton, saveSelectedWorkspace } from "@/api/workspace/org";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useAuthStore from "@/store/useAuthStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

type TInviteStatus = "loading" | "success" | "error" | "needLogin";

function getInviteErrorCopy(error: IApiErrorResponse | null): {
  title: string;
  description: string;
} {
  const message = error?.message ?? "";
  const code = error?.code ?? "";

  if (
    code.includes("EXPIRED") ||
    message.includes("만료") ||
    message.toLowerCase().includes("expired")
  ) {
    return {
      title: "초대 링크가 만료 되었습니다",
      description:
        "초대 링크 유효시간(24시간)이 지났습니다.\n워크스페이스 관리자에게 다시 초대를 요청해 주세요",
    };
  }
  if (
    code.includes("ALREADY") ||
    message.includes("이미") ||
    message.toLowerCase().includes("already")
  ) {
    return {
      title: "이미 완료된 초대입니다",
      description: "이미 이 워크스페이스에 참여중이거나 초대 완료한 상태입니다",
    };
  }
  if (
    code.includes("EMAIL") ||
    message.includes("이메일") ||
    message.toLowerCase().includes("email")
  ) {
    return {
      title: "초대 이메일이\n일치하지 않습니다",
      description:
        "초대받은 이메일 계정으로 로그인한 뒤\n다시 링크를 열어주세요",
    };
  }

  return {
    title: "초대를 수락할 수 없습니다",
    description:
      message ||
      "초대 처리 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요",
  };
}

export default function getInviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isTokenInitialized = useAuthStore((s) => s.isTokenInitialized);
  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  const [status, setStatus] = useState<TInviteStatus>("loading");
  const [error, setError] = useState<IApiErrorResponse | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (!isTokenInitialized) return;

    if (!token) {
      setStatus("error");
      setError({
        status: "error",
        code: "INVALID_TOKEN",
        message: "유효하지 않은 초대 링크입니다",
        method: "POST",
        requestURI: "/api/org/invitations",
      });
      return;
    }
    if (!isLoggedIn) {
      setStatus("needLogin");
      return;
    }
    if (processedRef.current) return;
    processedRef.current = true;

    const accept = async () => {
      try {
        const data = await acceptInvitaton(token);
        await saveSelectedWorkspace(data.orgId);
        setSelectedOrgId(data.orgId);

        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.workspace.list(),
        });
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.workspace.saved(),
        });

        toast.success(data.message || "초대를 수락했습니다");
        setStatus("success");
        nav("/dashboard", { replace: true });
      } catch (err) {
        const apiError = err as IApiErrorResponse;
        setError(apiError);
        setStatus("error");
      }
    };
    void accept();
  }, [
    isTokenInitialized,
    isLoggedIn,
    token,
    nav,
    queryClient,
    setSelectedOrgId,
  ]);

  useEffect(() => {
    if (status !== "needLogin" || !token) return;

    const timer = window.setTimeout(() => {
      nav(buildPathWithReturnUrl("/login", `/invite/${token}`), {
        replace: true,
      });
    }, 3500); //약 3.5초로 대기시간설정
    return () => window.clearTimeout(timer);
  }, [status, token, nav]);

  if (status === "error") {
    const copy = getInviteErrorCopy(error);
    return (
      <ErrorLayout
        title={copy.title}
        description={copy.description}
        actions={
          <>
            <Button
              size="big"
              variant="primary"
              fullWidth
              onClick={() => nav("/login", { replace: true })}
            >
              로그인으로 이동
            </Button>
            <Button
              size="big"
              variant="secondary"
              fullWidth
              onClick={() => nav("/", { replace: true })}
            >
              홈으로 이동
            </Button>
          </>
        }
      />
    );
  }

  if (status === "needLogin") {
    return (
      <ErrorLayout
        title="로그인이 필요합니다"
        description="계정 로그인이 되어 있지 않습니다.\n잠시 후 로그인 페이지로 이동합니다"
        actions={
          <Button
            size="big"
            variant="primary"
            fullWidth
            onClick={() =>
              nav(buildPathWithReturnUrl("/login", `/invite/${token}`), {
                replace: true,
              })
            }
          >
            바로 로그인하기
          </Button>
        }
      />
    );
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-surface-100">
      <p className="animate-pulse font-body2 text-text-muted">
        {status === "success"
          ? "워크스페이스로 이동 중..."
          : "초대를 확인하는 중..."}
      </p>
    </div>
  );
}
