import { toast } from "sonner";

import useWorkspaceStore from "@/store/useWorkspaceStore";

const WORKSPACE_REQUIRED_MESSAGE = "워크스페이스를 선택해 주세요.";

/** 연동 액션 전 워크스페이스 선택 여부 확인. 없으면 toast 후 null */
export function useRequireOrgId() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const requireOrgId = (): number | null => {
    if (orgId == null) {
      toast.error(WORKSPACE_REQUIRED_MESSAGE);
      return null;
    }
    return orgId;
  };

  return { orgId, requireOrgId };
}
