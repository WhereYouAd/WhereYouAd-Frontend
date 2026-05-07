import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { footerNav, mainNav } from "@/constants/sidebarNav";

import { isPathMatch, normalizePathname } from "@/utils/navigation/pathMatch";

import { useCoreQuery } from "@/hooks/customQuery";

import Sidebar from "@/components/sidebar/Sidebar";

import { getMyInfo } from "@/api/auth/auth";
import { getMyWorkspaces, getSavedWorkspace } from "@/api/workspace/org";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function MainLayout() {
  useCoreQuery(["myInfo"], getMyInfo);
  const location = useLocation();
  const [headerRight, setHeaderRight] = useState<ReactNode | null>(null);

  const allNav = [...mainNav, ...footerNav];

  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  const savedWorkspaceQuery = useCoreQuery(
    ["savedWorkspace"],
    getSavedWorkspace,
  );
  const { data: savedData } = savedWorkspaceQuery;
  const { data: workspaces } = useCoreQuery(["my-workspaces"], getMyWorkspaces);
  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);

  useEffect(() => {
    if (!workspaces?.length || !savedWorkspaceQuery.isFetched) return;
    if (selectedOrgId !== null) return;

    const savedId = savedData?.orgId;
    const isExist = workspaces.some((w) => w.orgId === savedId);

    // 1. 현재 워크스페이스 조회 API 데이터
    if (savedId !== undefined && isExist) {
      setSelectedOrgId(savedId);
    }
    // 2. isCurrentWorkspace 또는 첫 번째
    else {
      const currentOrg = workspaces.find((w) => w.isCurrentWorkspace);
      setSelectedOrgId(currentOrg?.orgId || workspaces[0].orgId);
    }
  }, [
    workspaces,
    savedWorkspaceQuery.isFetched,
    savedData,
    setSelectedOrgId,
    selectedOrgId,
  ]);

  const pathname = normalizePathname(location.pathname);
  const { parentLabel, currentLabel } = useMemo(() => {
    for (const parent of allNav) {
      const children = parent.children ?? [];
      const exactChild = children.find((c) =>
        c.path ? normalizePathname(c.path) === pathname : false,
      );
      if (exactChild) {
        return { parentLabel: parent.label, currentLabel: exactChild.label };
      }

      const matchChild = children.find((c) =>
        c.path ? isPathMatch(pathname, c.path) : false,
      );
      if (matchChild) {
        return { parentLabel: parent.label, currentLabel: matchChild.label };
      }

      if (parent.path && isPathMatch(pathname, parent.path)) {
        return { parentLabel: parent.label, currentLabel: parent.label };
      }
    }

    return { parentLabel: "", currentLabel: "" };
  }, [pathname]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-gray-50">
      <div className="flex h-full shrink-0">
        <Sidebar />
      </div>
      <main className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-30 border-b border-bg-surface bg-white">
          <div className="flex h-14 items-center justify-between px-6 tablet:px-4">
            <div className="flex min-w-0 items-center gap-2">
              {parentLabel ? (
                <>
                  <span className="truncate font-body1 text-text-sub">
                    {parentLabel}
                  </span>
                  <span className="text-text-placeholder" aria-hidden="true">
                    /
                  </span>
                </>
              ) : null}
              <span className="truncate font-body1 text-[18px] font-semibold text-text-main">
                {currentLabel || parentLabel || " "}
              </span>
            </div>

            <div className="flex items-center gap-2">{headerRight}</div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-400 min-w-0 flex-1 px-8 py-6 tablet:px-6">
          <Outlet context={{ setHeaderRight }} />
        </div>
      </main>
    </div>
  );
}
