import type { ReactElement, ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";

import type { TMemberRole } from "@/types/workspace/workspace";

import { useCoreQuery } from "@/hooks/customQuery";

import { getMyWorkspaces } from "@/api/workspace/org";
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
  const myRole = useWorkspaceStore((s) => s.myRole);
  const {
    data: workspaces,
    isPending,
    isError,
  } = useCoreQuery(QUERY_KEYS.workspace.list(), getMyWorkspaces);

  //URL에 workspaceId가 있는 경우 -> URL 기준 워크스페이스의 role로 판정
  if (workspaceId) {
    //워크스페이스 목록 로드 전 -> 랜더 보류
    if (isPending) {
      return null;
    }
    if (isError || !workspaces) {
      return <Navigate to="/dashboard" replace />;
    }
    const targetWorkspace = workspaces.find(
      (w) => w.orgId === Number(workspaceId),
    );

    //URL의 workspaceId가 내 워크스페이스 목록에 없는 경우 -> 대시보드로
    if (!targetWorkspace) {
      return <Navigate to="/dashboard" replace />;
    }

    if (!allowedRoles.includes(targetWorkspace.myRole)) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  //워크스페이스 초기화 전(null)에 랜더 보류
  if (myRole === null) {
    return null;
  }
  if (!allowedRoles.includes(myRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default RoleGuard;
