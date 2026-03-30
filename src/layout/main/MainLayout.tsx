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

  const { data: workspaces } = useCoreQuery(["workspaces"], getMyWorkspaces);
  const { data: savedData } = useCoreQuery(
    ["savedWorkspace"],
    getSavedWorkspace,
  );

  useEffect(() => {
    if (!workspaces || workspaces.length === 0) return;

    const savedId = savedData?.orgId;
    const isExist = workspaces.some((w) => w.orgId === savedId);

    if (savedId !== undefined && isExist) {
      setSelectedOrgId(savedId);
    } else {
      const currentOrg = workspaces.find((w) => w.isCurrentWorkspace);
      setSelectedOrgId(currentOrg?.orgId || workspaces[0].orgId);
    }
  }, [workspaces, savedData, setSelectedOrgId]);
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
