import { useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import type {
  IClickStreamItem,
  TProviderType,
} from "@/types/dashboard/overview";

import { reissueToken } from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const MAX_RETRIES = 3;
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

// 여러 SSE 연결이 동시에 401을 받아도 reissueToken은 1번만 실행되도록 보장
// (AllPlatformTrafficChart에서 3개 연결이 동시에 토큰 만료되는 케이스 대응)
let sseRefreshPromise: Promise<string | null> | null = null;

async function refreshTokenOnce(): Promise<string | null> {
  if (sseRefreshPromise) return sseRefreshPromise;
  sseRefreshPromise = reissueToken()
    .then((r) => r.data?.accessToken ?? null)
    .catch(() => null)
    .finally(() => {
      sseRefreshPromise = null;
    });
  return sseRefreshPromise;
}

export type TUseClickStreamOptions = {
  mode?: "real" | "dummy";
  /** 생략 시 조직 전체 합산 */
  providerType?: TProviderType;
};

export function useClickStream(options: TUseClickStreamOptions = {}) {
  const { mode = "dummy", providerType } = options;

  // TODO: 테스트용 - 더미 데이터가 orgId 1에만 있어서 임시 고정, 테스트 후 원래대로 복구할 예정
  // const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  useWorkspaceStore((s) => s.selectedOrgId);
  const orgId = 1;
  const accessToken = useAuthStore((s) => s.accessToken);
  const [data, setData] = useState<IClickStreamItem | null>(null);
  const [suspectDetail, setSuspectDetail] =
    useState<IClickStreamItem["suspectDetail"]>(null);
  const [isError, setIsError] = useState(false);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!orgId || !accessToken) return;

    const controller = new AbortController();
    retryCountRef.current = 0;

    setData(null);
    setSuspectDetail(null);
    setIsError(false);

    const params = new URLSearchParams({ mode });
    if (providerType) {
      params.set("providerType", providerType);
    }

    fetchEventSource(
      `${BASE_URL}/api/dashboard/${orgId}/clicks/stream?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
        onopen: async (response) => {
          // 401: 토큰 갱신 후 abort → accessToken 변경 → useEffect 재실행 → 새 토큰으로 재연결
          // refreshTokenOnce()로 동시 다발 401(플랫폼별 3개 SSE)에도 reissue는 1회만 실행
          if (response.status === 401) {
            const newToken = await refreshTokenOnce();
            if (
              controller.signal.aborted ||
              useAuthStore.getState().accessToken !== accessToken
            ) {
              return;
            }
            if (newToken) {
              useAuthStore.getState().setAccessToken(newToken);
            } else {
              useAuthStore.getState().logout();
            }
            controller.abort();
            return;
          }

          const contentType = response.headers.get("content-type") ?? "";
          const isSse = contentType.includes("text/event-stream");
          if (!response.ok || !isSse) {
            throw new Error(
              `Invalid SSE response: status=${response.status}, content-type=${contentType}`,
            );
          }
          retryCountRef.current = 0;
          setIsError(false);
        },
        onmessage(event) {
          if (event.event === "org-click-update") {
            try {
              const wrapper = JSON.parse(event.data);
              const parsed: IClickStreamItem = wrapper.data ?? wrapper;
              setData(parsed);
              if (parsed.suspectDetail) {
                setSuspectDetail(parsed.suspectDetail);
              }
            } catch {
              // 파싱 실패 시 해당 이벤트 무시하고 스트림 유지
            }
          }
        },
        onerror(err) {
          // AbortError는 controller.abort() 호출로 인한 정상 종료 — 무시
          if (err instanceof DOMException && err.name === "AbortError") return;

          retryCountRef.current += 1;
          if (retryCountRef.current >= MAX_RETRIES) {
            setIsError(true);
            controller.abort(); // throw 대신 abort → unhandled rejection 방지
            return;
          }
          // MAX_RETRIES 미만이면 기본 재시도 동작 유지
        },
      },
    );

    return () => controller.abort();
  }, [orgId, accessToken, mode, providerType]);

  return { data, suspectDetail, isError };
}
