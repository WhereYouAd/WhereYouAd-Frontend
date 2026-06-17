import { useEffect } from "react";
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

  useEffect(() => {
    const id = workspaceId ? Number(workspaceId) : NaN;
    if (!Number.isFinite(id) || id <= 0) return;

    //화면용 store 즉시 반영
    setSelectedOrgId(id);

    const workspace = workspaces?.find((w) => w.orgId === id);
    if (workspace) setMyRole(workspace.myRole);

    saveWorkspace(id);
  }, [workspaceId, workspaces, setSelectedOrgId, setMyRole, saveWorkspace]);

  return (
    <section className="flex w-full min-w-0 flex-col">
      <Outlet />
    </section>
  );
}
