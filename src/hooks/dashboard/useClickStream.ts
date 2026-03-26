import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import type { IClickStreamItem } from "@/types/dashboard/overview";

import useAuthStore from "@/store/useAuthStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useClickStream(mode: "real" | "dummy" = "dummy") {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
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
