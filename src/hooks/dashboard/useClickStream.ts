import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import type { IClickStreamItem } from "@/types/dashboard/overview";

import useAuthStore from "@/store/useAuthStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useClickStream(mode: "real" | "dummy" = "dummy") {
  // TODO: 테스트용 - 더미 데이터가 orgId 1에만 있어서 임시 고정, 테스트 후 원래대로 복구할 예정
  // const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  useWorkspaceStore((s) => s.selectedOrgId);
  const orgId = 1;
  const accessToken = useAuthStore((s) => s.accessToken);
  const [data, setData] = useState<IClickStreamItem | null>(null);
  const [suspectDetail, setSuspectDetail] =
    useState<IClickStreamItem["suspectDetail"]>(null);

  useEffect(() => {
    if (!orgId || !accessToken) return;

    const controller = new AbortController();

    fetchEventSource(`/api/dashboard/${orgId}/clicks/stream?mode=${mode}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
      onmessage(event) {
        if (event.event === "org-click-update") {
          const wrapper = JSON.parse(event.data);
          const parsed: IClickStreamItem = wrapper.data ?? wrapper;
          setData(parsed);
          if (parsed.suspectDetail) {
            setSuspectDetail(parsed.suspectDetail);
          }
        }
      },
    });

    return () => controller.abort();
  }, [orgId, accessToken, mode]);

  return { data, suspectDetail };
}
