import type { ReactElement, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { TMemberRole } from "@/types/workspace/workspace";

import useWorkspaceStore from "@/store/useWorkspaceStore";

interface IRoleGuardProps {
  children: ReactNode;
  allowedRoles: TMemberRole[];
}

function RoleGuard({
  children,
  allowedRoles,
}: IRoleGuardProps): ReactElement | null {
  const myRole = useWorkspaceStore((s) => s.myRole);

  //워크스페이스 초기화 전(null)에 랜더 보류
  if (myRole === null) {
    return null;
  }

  //허용되지 않는 역할 -> 대시보드로 리다이렉트
  if (!allowedRoles.includes(myRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default RoleGuard;
