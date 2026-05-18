import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import type { TWorkspace } from "@/types/workspace/workspace";

import { useCoreQuery } from "@/hooks/customQuery";

import { getMyWorkspaces, saveSelectedWorkspace } from "@/api/workspace/org";
import ChevronIcon from "@/assets/icon/chevron/chevron-up.svg?react";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function WorkspaceSwitcher({
  isCollapsed,
  className,
}: {
  isCollapsed: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);
  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  const { data: workspaces, isPending } = useCoreQuery(
    ["my-workspaces"],
    getMyWorkspaces,
  );

  const workspaceList = workspaces ?? [];

  const currentWorkspace = useMemo(
    () =>
      workspaceList.find((w) => w.orgId === selectedOrgId) ||
      workspaceList.find((w) => w.isCurrentWorkspace) ||
      workspaceList[0],
    [selectedOrgId, workspaceList],
  );

  useEffect(() => {
    if (selectedOrgId === null || workspaceList.length === 0) return;

    const exists = workspaceList.some((w) => w.orgId === selectedOrgId);
    if (exists) return;

    const fallback =
      workspaceList.find((w) => w.isCurrentWorkspace) || workspaceList[0];
    setSelectedOrgId(fallback.orgId);
  }, [selectedOrgId, workspaceList, setSelectedOrgId]);

  const { mutate: saveWorkspace } = useMutation({
    mutationFn: (orgId: number) => saveSelectedWorkspace(orgId),
    onSuccess: async (_data, orgId) => {
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

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) setIsOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const currentWorkspaceId = currentWorkspace?.orgId;
  const otherWorkspaces = useMemo(
    () =>
      currentWorkspaceId
        ? workspaceList.filter((w) => w.orgId !== currentWorkspaceId)
        : [],
    [currentWorkspaceId, workspaceList],
  );

  const renderImage = useCallback(
    (workspace: TWorkspace) => (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-200 font-label text-text-body">
        {workspace?.logoUrl ? (
          <img
            src={workspace.logoUrl}
            className="w-full h-full object-cover"
            alt={`${workspace.name} 로고`}
          />
        ) : (
          workspace?.name?.[0] || "W"
        )}
      </div>
    ),
    [],
  );

  const switcherShellClass = twMerge(
    "flex items-center rounded-2xl",
    isCollapsed
      ? "h-[55px] w-[55px] justify-center py-1.5 px-2 mx-auto"
      : "w-full py-1.5 px-2 gap-3",
  );

  if (isPending) {
    return (
      <div className={twMerge("relative mb-4", className)}>
        <div
          className={twMerge(switcherShellClass, "bg-surface-200")}
          aria-busy
          aria-label="워크스페이스 불러오는 중"
        >
          <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-300 animate-pulse" />
          {!isCollapsed && (
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="h-4 max-w-40 w-[55%] rounded bg-surface-300 animate-pulse" />
              <div className="h-3 w-14 rounded bg-surface-300 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentWorkspace) {
    return (
      <div className={twMerge("relative mb-4", className)}>
        <div className={twMerge(switcherShellClass, "text-text-body")}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-200 font-label text-text-body">
            —
          </div>
          {!isCollapsed && (
            <div className="flex min-w-0 flex-1 flex-col items-start">
              <span className="w-full truncate text-left font-label text-text-body">
                워크스페이스 없음
              </span>
              <span className="font-caption w-full truncate text-text-disabled">
                {"\u00A0"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={twMerge("relative mb-4", className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="workspace-list"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          switcherShellClass,
          "transition-colors hover:bg-surface-200",
        )}
      >
        {renderImage(currentWorkspace)}

        {!isCollapsed && (
          <>
            <div className="flex flex-col flex-1 min-w-0 items-start">
              <span className="text-left text-text-title font-label truncate w-full">
                {currentWorkspace?.name || "워크스페이스 선택"}
              </span>
              <span className="text-text-disabled font-caption truncate">
                {currentWorkspace?.myRole === "ADMIN" ? "관리자" : "멤버"}
              </span>
            </div>
            <ChevronIcon
              className={twMerge(
                "h-3 w-3 text-text-body transition-transform duration-200",
                isOpen ? "rotate-0" : "rotate-180",
              )}
            />
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id="workspace-list"
            className={twMerge(
              "absolute z-50 flex flex-col rounded-2xl bg-surface-100 p-2 shadow-Soft border border-surface-300 origin-top",
              isCollapsed
                ? "left-full top-0 ml-2 w-58"
                : "left-1 -right-5 top-full mt-1",
            )}
            initial={
              isCollapsed
                ? { opacity: 0, x: -10, scale: 0.98 }
                : { opacity: 0, y: -6, scale: 0.98 }
            }
            animate={
              isCollapsed
                ? { opacity: 1, x: 0, scale: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              isCollapsed
                ? { opacity: 0, x: -10, scale: 0.98 }
                : { opacity: 0, y: -6, scale: 0.98 }
            }
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div className="flex-1 overflow-y-auto max-h-100">
              {otherWorkspaces.map((org, index) => (
                <div key={org.orgId}>
                  {index !== 0 && (
                    <div className="my-1 border-t border-surface-300" />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      saveWorkspace(org.orgId);
                    }}
                    className="group flex w-full items-center gap-3 rounded-2xl px-2 py-1.5 font-body2 text-text-title hover:bg-surface-200 transition-colors"
                  >
                    {renderImage(org)}
                    <div className="flex flex-col flex-1 min-w-0 items-start">
                      <span className="truncate w-full text-left font-body2 text-text-title">
                        {org.name}
                      </span>
                      <span className="font-caption text-text-disabled mt-0.5">
                        {org.myRole === "ADMIN" ? "관리자" : "멤버"}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-1 pt-1 border-t border-surface-300">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/workspace?create=1");
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-2 py-1.5 font-body2 text-text-body hover:bg-surface-200 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-surface-400 text-text-muted">
                  +
                </div>
                <span className="font-body2 text-text-body">
                  새 워크스페이스
                </span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
