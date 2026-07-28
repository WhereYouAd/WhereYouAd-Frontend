import type { ReactElement, ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";

import type { TMemberRole } from "@/types/workspace/workspace";

import { useCoreQuery } from "@/hooks/customQuery";

import { getMyWorkspaces, getSavedWorkspace } from "@/api/workspace/org";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

interface IRoleGuardProps {
  children: ReactNode;
  allowedRoles: TMemberRole[];
}

function RoleGuard({
  children,
  allowedRoles,
}: IRoleGuardProps): ReactElement | null {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);
  const {
    data: workspaces,
    isPending: isWorkspacesPending,
    isError: isWorkspacesError,
  } = useCoreQuery(QUERY_KEYS.workspace.list(), getMyWorkspaces);
  const { isFetched: isSavedWorkspaceFetched } = useCoreQuery(
    QUERY_KEYS.workspace.saved(),
    getSavedWorkspace,
  );

  // 워크스페이스 목록·저장 워크스페이스 조회 완료 전 -> 렌더 보류
  if (isWorkspacesPending || !isSavedWorkspaceFetched) {
    return null;
  }
  if (isWorkspacesError || !workspaces?.length) {
    return <Navigate to="/dashboard" replace />;
  }

  // URL에 workspaceId가 있는 경우 -> URL 기준 워크스페이스의 role로 판정
  if (workspaceId) {
    const targetWorkspace = workspaces.find(
      (w) => w.orgId === Number(workspaceId),
    );

    // URL의 workspaceId가 내 워크스페이스 목록에 없는 경우 -> 대시보드로
    if (!targetWorkspace) {
      return <Navigate to="/dashboard" replace />;
    }

    if (!allowedRoles.includes(targetWorkspace.myRole)) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // /integrations 등 workspaceId 없는 라우트
  // MainLayout에서 selectedOrgId 초기화 완료 전까지 보류
  if (selectedOrgId === null) {
    return null;
  }

  const selectedWorkspace = workspaces.find((w) => w.orgId === selectedOrgId);
  if (!selectedWorkspace || !allowedRoles.includes(selectedWorkspace.myRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default RoleGuard;
