import { useEffect, useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useCoreMutation, useCoreQuery } from "@/hooks/customQuery";

import { getMyWorkspaces, saveSelectedWorkspace } from "@/api/workspace/org";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function WorkspaceManageLayout() {
  const { workspaceId } = useParams();
  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  const setMyRole = useWorkspaceStore((s) => s.setMyRole);
  const { data: workspaces } = useCoreQuery(
    QUERY_KEYS.workspace.list(),
    getMyWorkspaces,
  );

  const { mutate: saveWorkspace } = useCoreMutation(saveSelectedWorkspace, {
    invalidateKeys: [QUERY_KEYS.workspace.list(), QUERY_KEYS.workspace.saved()],
    userOnError: () => {
      toast.error("워크스페이스 변경에 실패했습니다. 다시 시도해 주세요");
    },
  });

  const parsedWorkspaceId = useMemo(() => {
    const id = workspaceId ? Number(workspaceId) : NaN;
    return Number.isFinite(id) && id > 0 ? id : null;
  }, [workspaceId]);

  useEffect(() => {
    if (parsedWorkspaceId === null) return;
    setSelectedOrgId(parsedWorkspaceId);
    saveWorkspace(parsedWorkspaceId);
  }, [parsedWorkspaceId, setSelectedOrgId, saveWorkspace]);

  useEffect(() => {
    if (parsedWorkspaceId == null || !workspaces) return;
    const workspace = workspaces.find((w) => w.orgId === parsedWorkspaceId);
    if (workspace) setMyRole(workspace.myRole);
  }, [parsedWorkspaceId, workspaces, setMyRole]);

  return (
    <section className="flex w-full min-w-0 flex-col">
      <Outlet />
    </section>
  );
}
