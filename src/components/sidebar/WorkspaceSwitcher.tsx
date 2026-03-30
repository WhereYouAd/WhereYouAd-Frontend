import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import type { TWorkspace } from "@/types/workspace/workspace";

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
    ["my-workspaces"],
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
    onSuccess: async (_data, orgId) => {
      // 서버 저장 성공 시에만 UI 상태 업데이트
      setSelectedOrgId(orgId);
      setIsOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-workspaces"] }),
        queryClient.invalidateQueries({ queryKey: ["savedWorkspace"] }),
      ]);
    },
    onError: (error) => {
      console.error("워크스페이스 저장 실패:", error);
      toast.error("워크스페이스 변경에 실패했습니다. 다시 시도해 주세요.");
    },
  });

  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  const renderImage = (workspace: TWorkspace) => (
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

  return (
    <div className="relative font-body1 mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "flex items-center rounded-component-md transition-colors hover:bg-bg-surface",
          isCollapsed
            ? "h-[55px] w-[55px] justify-center p-0 mx-auto"
            : "w-full p-3 gap-3",
        )}
      >
        {/* image */}
        {renderImage(currentWorkspace)}

        {!isCollapsed && (
          <>
            <span className="flex-1 text-left font-semibold text-text-main truncate">
              {currentWorkspace?.name || "워크스페이스 선택"}
            </span>
            <ChevronIcon
              className={twMerge(
                "h-3 w-3 text-text-sub transition-transform duration-200",
                isOpen ? "rotate-0" : "rotate-180",
              )}
            />
          </>
        )}
      </button>

      {/* dropdown */}
      {isOpen && (
        <div
          className={twMerge(
            "absolute z-50 flex flex-col gap-1 rounded-component-md bg-white p-2 shadow-Soft border border-bg-surface",
            // 축소 상태: 오른쪽 옆으로(SubMenu와 동일), 확장 상태: 버튼 아래로
            isCollapsed
              ? "left-full top-0 ml-2 w-52"
              : "left-1 right-1 top-full mt-1",
          )}
        >
          {otherWorkspaces.map((org) => (
            <button
              key={org.orgId}
              onClick={() => {
                saveWorkspace(org.orgId);
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
