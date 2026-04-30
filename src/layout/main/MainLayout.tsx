import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { mainNav } from "@/constants/sidebarNav";

import { useCoreQuery } from "@/hooks/customQuery";

import Sidebar from "@/components/sidebar/Sidebar";

import { getMyInfo } from "@/api/auth/auth";
import { getMyWorkspaces, getSavedWorkspace } from "@/api/workspace/org";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function MainLayout() {
  useCoreQuery(["myInfo"], getMyInfo);
  const location = useLocation();
  const [headerRight, setHeaderRight] = useState<ReactNode | null>(null);

  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  const savedWorkspaceQuery = useCoreQuery(
    ["savedWorkspace"],
    getSavedWorkspace,
  );
  const { data: savedData } = savedWorkspaceQuery;
  const { data: workspaces } = useCoreQuery(["my-workspaces"], getMyWorkspaces);
  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);

  useEffect(() => {
    // 모두 완료되었을 때 시작
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

  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  const { parentLabel, currentLabel } = useMemo(() => {
    for (const parent of mainNav) {
      const children = parent.children ?? [];
      const exactChild = children.find((c) => c.path === pathname);
      if (exactChild) {
        return { parentLabel: parent.label, currentLabel: exactChild.label };
      }

      const matchChild = children.find((c) =>
        c.path ? pathname.startsWith(c.path) : false,
      );
      if (matchChild) {
        return { parentLabel: parent.label, currentLabel: matchChild.label };
      }

      if (parent.path && pathname.startsWith(parent.path)) {
        return { parentLabel: parent.label, currentLabel: parent.label };
      }
    }

    return { parentLabel: "", currentLabel: "" };
  }, [pathname]);

  useEffect(() => {
    setHeaderRight(null);
  }, [pathname]);

  return (
    <div className="fixed inset-0 box-border flex overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white border-b border-bg-surface">
          <div className="h-14 px-6 tablet:px-4 flex items-center justify-between">
            <div className="min-w-0 flex items-center gap-2">
              {parentLabel ? (
                <>
                  <span className="font-body1 text-text-sub truncate">
                    {parentLabel}
                  </span>
                  <span className="text-text-placeholder" aria-hidden="true">
                    /
                  </span>
                </>
              ) : null}
              <span className="font-body1 text-[18px] text-text-main font-semibold truncate">
                {currentLabel || parentLabel || " "}
              </span>
            </div>

            <div className="flex items-center gap-2">{headerRight}</div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-400 min-w-0 py-6 px-lg tablet:px-6">
          <Outlet context={{ setHeaderRight }} />
        </div>
      </main>
    </div>
  );
}
