import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type { TAcceptInvitationResponse } from "@/types/workspace/workspace";

import { buildPathWithReturnUrl } from "@/utils/auth/returnUrl";

import { useCoreMutation } from "@/hooks/customQuery";

import Button from "@/components/common/button/Button";
import ErrorLayout from "@/components/common/error/ErrorLayout";

import { acceptInvitation, saveSelectedWorkspace } from "@/api/workspace/org";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useAuthStore from "@/store/useAuthStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

type TInviteUiStatus =
  | "loading"
  | "needLogin"
  | "invalidToken"
  | "error"
  | "success";

const LOGIN_REDIRECT_SECONDS = 3;

function getInviteErrorCopy(error: IApiErrorResponse | null): {
  title: string;
  description: string;
} {
  const message = error?.message ?? "";
  const code = error?.code ?? "";

  if (
    code.includes("EXPIRED") ||
    code.includes("ORG_INVITATION_400") ||
    message.includes("만료") ||
    message.includes("유효하지 않") ||
    message.toLowerCase().includes("expired") ||
    message.toLowerCase().includes("invalid")
  ) {
    return {
      title: "초대 링크가 만료되었거나\n유효하지 않습니다",
      description:
        "초대 링크가 만료되었거나 더 이상 사용할 수 없습니다.\n워크스페이스 관리자에게 다시 초대를 요청해 주세요",
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

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const nav = useNavigate();

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isTokenInitialized = useAuthStore((s) => s.isTokenInitialized);
  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  const [uiStatus, setUiStatus] = useState<TInviteUiStatus>("loading");
  const [acceptError, setAcceptError] = useState<IApiErrorResponse | null>(
    null,
  );
  const [countdown, setCountdown] = useState(LOGIN_REDIRECT_SECONDS);
  const processedRef = useRef<string | null>(null);

  const { mutate: acceptInvite } = useCoreMutation(acceptInvitation, {
    invalidateKeys: [QUERY_KEYS.workspace.list()],
    userOnSuccess: async (data: TAcceptInvitationResponse) => {
      try {
        await saveSelectedWorkspace(data.orgId);
        setSelectedOrgId(data.orgId);
        toast.success(data.message || "초대를 수락했습니다");
        setUiStatus("success");
        nav("/dashboard", { replace: true });
      } catch (err) {
        setAcceptError(err as IApiErrorResponse);
        setUiStatus("error");
      }
    },
    userOnError: (err) => {
      setAcceptError(err);
      setUiStatus("error");
    },
  });

  const acceptInviteRef = useRef(acceptInvite);
  acceptInviteRef.current = acceptInvite;

  useEffect(() => {
    if (!isTokenInitialized) return;

    if (!token) {
      setUiStatus("invalidToken");
      return;
    }

    if (!isLoggedIn) {
      setUiStatus("needLogin");
      return;
    }

    if (processedRef.current === token) return;
    processedRef.current = token;
    setAcceptError(null);
    setUiStatus("loading");
    acceptInviteRef.current(token);
  }, [isTokenInitialized, isLoggedIn, token]);

  useEffect(() => {
    if (uiStatus !== "needLogin" || !token) return;

    setCountdown(LOGIN_REDIRECT_SECONDS);

    const interval = window.setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const timer = window.setTimeout(() => {
      nav(buildPathWithReturnUrl("/login", `/invite/${token}`), {
        replace: true,
      });
    }, LOGIN_REDIRECT_SECONDS * 1000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [uiStatus, token, nav]);

  const invalidTokenError: IApiErrorResponse = {
    status: "error",
    code: "INVALID_TOKEN",
    message: "유효하지 않은 초대 링크입니다",
    method: "POST",
    requestURI: "/api/org/invitations",
  };

  if (uiStatus === "invalidToken" || uiStatus === "error") {
    const copy = getInviteErrorCopy(
      uiStatus === "invalidToken" ? invalidTokenError : acceptError,
    );
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

  if (uiStatus === "needLogin") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="relative flex h-screen w-full flex-col items-center justify-center gap-5 bg-surface-100"
      >
        <span
          className="h-12 w-12 animate-spin rounded-full border-4 border-primary-400 border-t-transparent"
          aria-hidden
        />
        <p className="text-center font-heading3 text-text-title">
          로그인이 필요합니다
        </p>
        <p className="text-center font-body1 text-text-muted">
          {countdown}초 후 로그인 페이지로 이동합니다
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-surface-100">
      <p className="animate-pulse font-body1 text-text-muted">
        {uiStatus === "success"
          ? "워크스페이스로 이동 중..."
          : "초대를 확인하는 중..."}
      </p>
    </div>
  );
}
