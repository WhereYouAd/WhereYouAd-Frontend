import { NavLink, Outlet, useParams } from "react-router-dom";

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 font-body1 border-b-2 -mb-px transition-colors ${
    isActive
      ? "border-primary-500 text-primary-500"
      : "border-transparent text-text-muted hover:text-text-title"
  }`;

export default function WorkspaceManageLayout() {
  const { workspaceId } = useParams();

  return (
    <section className="w-full flex flex-col gap-8">
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
      </nav>

      <Outlet />
    </section>
  );
}
