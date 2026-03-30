import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";

import { useCoreQuery } from "@/hooks/customQuery";

import { getMyWorkspaces, saveSelectedWorkspace } from "@/api/workspace/org";
import ChevronIcon from "@/assets/icon/chevron/chevron-up.svg?react";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function WorkspaceSwitcher({ isCollapsed }: { isCollapsed: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);
  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  const { data: workspaces = [] } = useCoreQuery(
    ["workspaces"],
    getMyWorkspaces,
  );

  const currentWorkspace =
    workspaces.find((w) => w.orgId === selectedOrgId) ||
    workspaces.find((w) => w.isCurrentWorkspace) ||
    workspaces[0];
  const otherWorkspaces = workspaces.filter(
    (w) => w.orgId !== currentWorkspace?.orgId,
  );

  const { mutate: saveWorkspace } = useMutation({
    mutationFn: (orgId: number) => saveSelectedWorkspace(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedWorkspace"] });
    },
    onError: (error) => {
      console.error("워크스페이스 저장 실패:", error);
    },
  });

  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  const renderImage = (workspace: any) => (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-component-sm overflow-hidden bg-bg-disabled/80 text-text-sub font-bold">
      {workspace?.logoUrl ? (
        <img
          src={workspace.logoUrl}
          className="w-full h-full object-cover"
          alt="logo"
        />
      ) : (
        workspace?.name?.[0] || "W"
      )}
    </div>
  );

  // 축소 상태: 이미지만
  if (isCollapsed) {
    return (
      <div className="flex justify-center py-4">
        {renderImage(currentWorkspace)}
      </div>
    );
  }

  return (
    <div className="relative font-body1 mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-component-md p-3 hover:bg-bg-surface transition-colors"
      >
        {/* image */}
        {renderImage(currentWorkspace)}

        {/* name */}
        <span className="flex-1 text-left font-semibold text-text-main truncate">
          {currentWorkspace?.name || "워크스페이스 선택"}
        </span>

        {/* icon */}
        <ChevronIcon
          className={twMerge(
            "h-3 w-3 text-text-sub transition-transform duration-200",
            isOpen ? "rotate-0" : "rotate-180",
          )}
        />
      </button>

      {/* dropdown */}
      {isOpen && (
        <div className="absolute left-1 right-4 top-full z-50 mt-1 flex flex-col gap-1 rounded-component-md bg-white p-2 shadow-Soft border border-bg-surface">
          {otherWorkspaces.map((org) => (
            <button
              key={org.orgId}
              onClick={() => {
                setSelectedOrgId(org.orgId);
                saveWorkspace(org.orgId);
                setIsOpen(false);
              }}
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text-main hover:bg-bg-surface transition-colors"
            >
              {renderImage(org)}
              <span className="truncate">{org.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
