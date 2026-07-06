import { useLayoutEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/lib/queryKeys";
import useAuthStore from "@/store/useAuthStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const META_OAUTH_STATUSES = [
  "success",
  "partial",
  "denied",
  "invalid_request",
  "error",
] as const;

type TMetaOAuthStatus = (typeof META_OAUTH_STATUSES)[number];

function isMetaOAuthStatus(value: string | null): value is TMetaOAuthStatus {
  return META_OAUTH_STATUSES.includes(value as TMetaOAuthStatus);
}

type TMetaOAuthToastType = "success" | "warning" | "error";

interface IMetaOAuthToast {
  type: TMetaOAuthToastType;
  message: string;
}

function getMetaOAuthToast(
  status: TMetaOAuthStatus,
  detail: string | null,
  searchParams: URLSearchParams,
): IMetaOAuthToast {
  if (status === "success") {
    const campaigns = searchParams.get("adCampaigns");
    const base = "Meta 광고 계정을 연동했습니다.";
    return {
      type: "success",
      message: campaigns ? `${base} (캠페인 ${campaigns}건 동기화)` : base,
    };
  }

  if (status === "partial") {
    const failed = searchParams.get("failedCount");
    return {
      type: "warning",
      message: failed
        ? `Meta 연동은 완료됐지만 일부 계정 동기화에 실패했습니다. (${failed}건)`
        : "Meta 연동은 완료됐지만 일부 동기화에 실패했습니다.",
    };
  }

  if (status === "denied") {
    return {
      type: "error",
      message: "Meta 연동을 취소했습니다.",
    };
  }

  if (status === "invalid_request") {
    return {
      type: "error",
      message: "잘못된 연동 요청입니다. 다시 시도해 주세요.",
    };
  }

  if (detail === "no_ad_account") {
    return {
      type: "error",
      message:
        "연동 가능한 Meta 광고 계정이 없습니다. Meta Ads Manager에서 계정을 만든 뒤 다시 시도해 주세요.",
    };
  }

  if (detail === "meta_oauth_failed") {
    return {
      type: "error",
      message: "Meta 연동에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return {
    type: "error",
    message: detail ?? "Meta 연동에 실패했습니다.",
  };
}

function showMetaOAuthToast(type: TMetaOAuthToastType, message: string) {
  if (type === "success") toast.success(message);
  else if (type === "warning") toast.warning(message);
  else toast.error(message);
}

/**
 * Meta OAuth 완료 후 `/oauth2/meta/result?status=` 쿼리 처리.
 * 백엔드 callback이 302로 리다이렉트한 결과 페이지에서 사용.
 */
export function useMetaOAuthReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const isTokenInitialized = useAuthStore((s) => s.isTokenInitialized);
  const processedRef = useRef(false);
  const toastShownRef = useRef(false);

  useLayoutEffect(() => {
    if (processedRef.current) return;

    const finish = (type: TMetaOAuthToastType, message: string) => {
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        showMetaOAuthToast(type, message);

        if (orgId != null) {
          void queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.platform.connections(orgId),
          });
        }
      }

      if (!isTokenInitialized) return;

      processedRef.current = true;
      navigate("/integrations", { replace: true });
    };

    const oauthError = searchParams.get("error");
    if (oauthError) {
      const description = searchParams.get("error_description");
      finish(
        "error",
        oauthError === "access_denied"
          ? "Meta 연동을 취소했습니다."
          : (description ?? "Meta 연동에 실패했습니다."),
      );
      return;
    }

    const status = searchParams.get("status");
    if (!isMetaOAuthStatus(status)) {
      finish(
        "error",
        "Meta 연동 결과를 확인하지 못했습니다. 연동 페이지에서 다시 시도해 주세요.",
      );
      return;
    }

    const detail = searchParams.get("detail");
    const { type, message } = getMetaOAuthToast(status, detail, searchParams);
    finish(type, message);
  }, [isTokenInitialized, navigate, orgId, queryClient, searchParams]);
}
