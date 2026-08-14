import { useLayoutEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/lib/queryKeys";
import useAuthStore from "@/store/useAuthStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

type TGoogleOAuthToastType = "success" | "error";

interface IUseGoogleOAuthReturnOptions {
  /** Google OAuth success 직후 초기 sync */
  onConnectSuccess?: (requestOrgId: number) => void;
}

function showGoogleOAuthToast(type: TGoogleOAuthToastType, message: string) {
  if (type === "success") toast.success(message);
  else toast.error(message);
}

/**
 * Google OAuth 완료 후 `/oauth2/google/result?status=` 쿼리 처리.
 * 백엔드 callback이 302로 리다이렉트한 결과 페이지에서 사용.
 *
 * Meta(`useMetaOAuthReturn`)와 동일한 골격.
 * Google만 success 시 FE에서 초기 sync를 트리거(`onConnectSuccess`)
 */
export function useGoogleOAuthReturn(options?: IUseGoogleOAuthReturnOptions) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const isTokenInitialized = useAuthStore((s) => s.isTokenInitialized);

  const processedRef = useRef(false);
  const toastShownRef = useRef(false);
  const onConnectSuccessRef = useRef(options?.onConnectSuccess);
  onConnectSuccessRef.current = options?.onConnectSuccess;

  useLayoutEffect(() => {
    // toast/sync/navigate는 인증 준비 후에만 실행 (이전엔 sync가 토큰 전에 호출될 수 있었음)
    if (processedRef.current || !isTokenInitialized) return;

    const finish = (type: TGoogleOAuthToastType, message: string) => {
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        showGoogleOAuthToast(type, message);

        if (orgId != null) {
          void queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.platform.connections(orgId),
          });
        }

        if (type === "success" && orgId != null) {
          onConnectSuccessRef.current?.(orgId);
        }
      }

      processedRef.current = true;
      navigate("/integrations", { replace: true });
    };

    const oauthError = searchParams.get("error");
    if (oauthError) {
      const description = searchParams.get("error_description");
      finish(
        "error",
        oauthError === "access_denied"
          ? "Google 연동을 취소했습니다."
          : (description ?? "Google 연동에 실패했습니다."),
      );
      return;
    }

    const status = searchParams.get("status");
    if (status == null) {
      finish(
        "error",
        "Google 연동 결과를 확인하지 못했습니다. 연동 페이지에서 다시 시도해 주세요.",
      );
      return;
    }

    const detail = searchParams.get("detail");

    if (status === "success") {
      finish("success", "Google 광고 계정을 연동했습니다.");
      return;
    }

    finish("error", detail ?? "Google 연동에 실패했습니다.");
  }, [isTokenInitialized, navigate, orgId, queryClient, searchParams]);
}
