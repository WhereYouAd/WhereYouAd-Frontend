import { useEffect } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

import useWorkspaceStore from "@/store/useWorkspaceStore";

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 font-body1 border-b-2 -mb-px transition-colors ${
    isActive
      ? "border-primary-500 text-primary-500"
      : "border-transparent text-text-muted hover:text-text-title"
  }`;

export default function WorkspaceManageLayout() {
  const { workspaceId } = useParams();
  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  useEffect(() => {
    const id = workspaceId ? Number(workspaceId) : NaN;
    if (Number.isFinite(id) && id > 0) {
      setSelectedOrgId(id);
    }
  }, [workspaceId, setSelectedOrgId]);

  return (
    <section className="flex w-full min-w-0 flex-col gap-8">
      <nav className="flex border-b border-surface-400">
        <NavLink
          to={`/workspace/${workspaceId}/settings`}
          className={tabLinkClass}
        >
          기본 정보
        </NavLink>
        <NavLink
          to={`/workspace/${workspaceId}/members`}
          className={tabLinkClass}
        >
          멤버 관리
        </NavLink>
        <NavLink
          to={`/workspace/${workspaceId}/billing`}
          className={tabLinkClass}
        >
          플랜 및 결제
        </NavLink>
      </nav>

      <Outlet />
    </section>
  );
}
