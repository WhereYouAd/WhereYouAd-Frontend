import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

import useWorkspaceStore from "@/store/useWorkspaceStore";

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
    <section className="flex w-full min-w-0 flex-col">
      <Outlet />
    </section>
  );
}
