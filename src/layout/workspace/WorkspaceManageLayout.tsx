import { useEffect, useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useCoreQuery } from "@/hooks/customQuery";

import { getMyWorkspaces, saveSelectedWorkspace } from "@/api/workspace/org";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function WorkspaceManageLayout() {
  const { workspaceId } = useParams();
  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  const queryClient = useQueryClient();
  const setMyRole = useWorkspaceStore((s) => s.setMyRole);
  const { data: workspaces } = useCoreQuery(["my-workspaces"], getMyWorkspaces);

  const { mutate: saveWorkspace } = useMutation({
    mutationFn: (orgId: number) => saveSelectedWorkspace(orgId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-workspaces"] }),
        queryClient.invalidateQueries({ queryKey: ["savedWorkspace"] }),
      ]);
    },
    onError: () => {
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
