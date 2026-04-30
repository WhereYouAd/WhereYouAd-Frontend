import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import type { INavItem } from "@/types/navigation/navItem";
import { mainNav } from "@/constants/sidebarNav";

import { isPathMatch, normalizePathname } from "@/utils/navigation/pathMatch";

import useSidebarStore from "@/store/useSidebarStore";

export const useSidebar = () => {
  const location = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const setIsCollapsed = useSidebarStore((s) => s.setIsCollapsed);

  const lastPathRef = useRef("");
  const pathname = normalizePathname(location.pathname);

  const childIdToParentId = useMemo(() => {
    const map = new Map<string, string>();
    for (const parent of mainNav) {
      for (const child of parent.children ?? []) {
        map.set(child.id, parent.id);
      }
    }
    return map;
  }, []);

  const childPathToParentId = useMemo(() => {
    const map = new Map<string, string>();
    for (const parent of mainNav) {
      for (const child of parent.children ?? []) {
        if (child.path) map.set(child.path, parent.id);
      }
    }
    return map;
  }, []);

  const childPathEntries = useMemo(() => {
    return Array.from(childPathToParentId.entries()).sort(
      ([a], [b]) => b.length - a.length,
    );
  }, [childPathToParentId]);

  useEffect(() => {
    if (isCollapsed) return;
    const exact = childPathToParentId.get(pathname);
    const parentId =
      exact ?? childPathEntries.find(([p]) => isPathMatch(pathname, p))?.[1];

    if (parentId && pathname !== lastPathRef.current) {
      setOpenId(parentId);
      lastPathRef.current = pathname;
    }
  }, [pathname, isCollapsed, childPathEntries, childPathToParentId]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) lastPathRef.current = "";
    setOpenId(null);
  };

  const handleItemClick = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      setOpenId((prev) => (prev === id ? null : id));
    } else {
      const parentId = childIdToParentId.get(id) ?? null;

      if (!parentId || parentId !== openId) {
        setOpenId(null);
      }
    }
  };

  const getItemActiveState = useCallback(
    (item: INavItem) => {
      const isChildActive =
        item.children?.some((c) =>
          c.path ? isPathMatch(pathname, c.path) : false,
        ) ?? false;

      const isParentActive =
        (item.path ? isPathMatch(pathname, item.path) : false) || isChildActive;

      return { isChildActive, isParentActive };
    },
    [pathname],
  );

  return {
    isCollapsed,
    openId,
    setOpenId,
    location,
    toggleSidebar,
    handleItemClick,
    getItemActiveState,
  };
};
