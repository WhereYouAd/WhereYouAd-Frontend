import type { ReactElement, ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";

import type { TMemberRole, TWorkspace } from "@/types/workspace/workspace";

import { useCoreQuery } from "@/hooks/customQuery";

import { getMyWorkspaces } from "@/api/workspace/org";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

interface IRoleGuardProps {
  children: ReactNode;
  allowedRoles: TMemberRole[];
}

function resolveRoleFromWorkspaces(
  workspaces: TWorkspace[],
  selectedOrgId: number | null,
  myRoleFromStore: TMemberRole | null,
): TMemberRole | null {
  if (selectedOrgId != null) {
    const selected = workspaces.find((w) => w.orgId === selectedOrgId);
    if (selected) return selected.myRole;
  }

  const current =
    workspaces.find((w) => w.isCurrentWorkspace) ?? workspaces[0] ?? null;
  if (current) return current.myRole;

  return myRoleFromStore;
}

function RoleGuard({
  children,
  allowedRoles,
}: IRoleGuardProps): ReactElement | null {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const myRole = useWorkspaceStore((s) => s.myRole);
  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);
  const {
    data: workspaces,
    isPending,
    isError,
  } = useCoreQuery(QUERY_KEYS.workspace.list(), getMyWorkspaces);

  // 워크스페이스 목록 로드 전 -> 렌더 보류
  if (isPending) {
    return null;
  }
  if (isError || !workspaces?.length) {
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
  // selectedOrgId 초기화를 기다리지 않고 목록에서 역할 판정
  const resolvedRole = resolveRoleFromWorkspaces(
    workspaces,
    selectedOrgId,
    myRole,
  );

  if (resolvedRole === null || !allowedRoles.includes(resolvedRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default RoleGuard;
