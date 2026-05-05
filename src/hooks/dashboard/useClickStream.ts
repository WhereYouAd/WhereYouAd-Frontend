import { useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import type { IClickStreamItem } from "@/types/dashboard/overview";

import useAuthStore from "@/store/useAuthStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const MAX_RETRIES = 3;
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export function useClickStream(mode: "real" | "dummy" = "dummy") {
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

    fetchEventSource(
      `${BASE_URL}/api/dashboard/${orgId}/clicks/stream?mode=${mode}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
        onopen: async (response) => {
          if (response.ok) {
            retryCountRef.current = 0;
            setIsError(false);
          }
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
          retryCountRef.current += 1;
          if (retryCountRef.current >= MAX_RETRIES) {
            setIsError(true);
            throw err; // 재시도 중단
          }
          // MAX_RETRIES 미만이면 기본 재시도 동작 유지
        },
      },
    );

    return () => controller.abort();
  }, [orgId, accessToken, mode]);

  return { data, suspectDetail, isError };
}
