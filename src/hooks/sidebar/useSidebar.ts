import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { mainNavSidebar } from "@/utils/navigation/mainNavSidebar";
import { normalizePathname } from "@/utils/navigation/pathMatch";

import useSidebarStore from "@/store/useSidebarStore";

export const useSidebar = () => {
  const location = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const setIsCollapsed = useSidebarStore((s) => s.setIsCollapsed);

  const lastPathRef = useRef("");
  const pathname = normalizePathname(location.pathname);

  const { childIdToParentId } = mainNavSidebar;

  useEffect(() => {
    if (isCollapsed) return;
    const parentId = mainNavSidebar.resolveParentId(pathname);

    if (pathname !== lastPathRef.current) {
      setOpenId(parentId ?? null);
      lastPathRef.current = pathname;
    }
  }, [pathname, isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) lastPathRef.current = "";
    setOpenId(null);
  };

  const toggleOpenId = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleItemClick = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleOpenId(id);
    } else {
      const parentId = childIdToParentId.get(id) ?? null;

      if (!parentId || parentId !== openId) {
        setOpenId(null);
      }
    }
  };

  return {
    isCollapsed,
    openId,
    setOpenId,
    pathname,
    toggleSidebar,
    handleItemClick,
    toggleOpenId,
  };
};
