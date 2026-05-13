import { Navigate } from "react-router-dom";

import useWorkspaceStore from "@/store/useWorkspaceStore";

/** 구 URL `/workspace/billing` → 현재 선택 워크스페이스 기준 결제 경로 */
export default function WorkspaceBillingRedirect() {
  const workspaceId = useWorkspaceStore((s) => s.selectedOrgId);
  if (workspaceId == null) {
    return <Navigate to="/workspace" replace />;
  }
  return <Navigate to={`/workspace/${workspaceId}/billing`} replace />;
}
