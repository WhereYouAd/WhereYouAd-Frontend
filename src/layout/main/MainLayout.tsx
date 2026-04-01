import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useCoreQuery } from "@/hooks/customQuery";

import Sidebar from "@/components/sidebar/Sidebar";

import { getMyInfo } from "@/api/auth/auth";
import { getMyWorkspaces, getSavedWorkspace } from "@/api/workspace/org";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function MainLayout() {
  useCoreQuery(["myInfo"], getMyInfo);

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
  return (
    <div className="fixed inset-0 box-border flex overflow-hidden p-5 bg-gray-50 tablet:p-3">
      <Sidebar />
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-400 min-w-0 py-6 px-lg tablet:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
