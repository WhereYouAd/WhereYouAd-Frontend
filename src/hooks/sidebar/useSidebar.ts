import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import { mainNavSidebar } from "@/utils/navigation/mainNavSidebar";
import { normalizePathname } from "@/utils/navigation/pathMatch";

import useSidebarStore from "@/store/useSidebarStore";

export const useSidebar = () => {
  const location = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  const isCollapsedStore = useSidebarStore((s) => s.isCollapsed);
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);
  const closeMobileFromStore = useSidebarStore((s) => s.closeMobile);
  const setIsCollapsed = useSidebarStore((s) => s.setIsCollapsed);
  /** tablet drawer 열림 시 항상 expanded */
  const isCollapsed = isMobileOpen ? false : isCollapsedStore;

  const lastPathRef = useRef("");
  const pathname = normalizePathname(location.pathname);

  const { childIdToParentId } = mainNavSidebar;

  /** drawer 닫힘 시 flyout submenu(openId) 잔류 방지 */
  useLayoutEffect(() => {
    if (!isMobileOpen) {
      setOpenId(null);
    }
  }, [isMobileOpen]);

  const closeMobileDrawer = useCallback(() => {
    setOpenId(null);
    closeMobileFromStore();
  }, [closeMobileFromStore]);

  useEffect(() => {
    if (isCollapsed) return;
    const parentId = mainNavSidebar.resolveParentId(pathname);

    if (pathname !== lastPathRef.current) {
      setOpenId(parentId ?? null);
      lastPathRef.current = pathname;
    }
  }, [pathname, isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsedStore);
    if (!isCollapsedStore) lastPathRef.current = "";
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
    isCollapsedStore,
    isMobileOpen,
    openId,
    setOpenId,
    pathname,
    toggleSidebar,
    handleItemClick,
    toggleOpenId,
    closeMobileDrawer,
  };
};
