import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { mainNav } from "@/constants/sidebarNav";

import useSidebarStore from "@/store/useSidebarStore";

export const useSidebar = () => {
  const location = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const setIsCollapsed = useSidebarStore((s) => s.setIsCollapsed);

  const lastPathRef = useRef("");

  useEffect(() => {
    if (isCollapsed) return;
    const activeParent = mainNav.find((item) =>
      item.children?.some((c) => c.path === location.pathname),
    );

    if (activeParent && location.pathname !== lastPathRef.current) {
      setOpenId(activeParent.id);
      lastPathRef.current = location.pathname;
    }
  }, [location.pathname, isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) lastPathRef.current = "";
    setOpenId(null);
  };

  const handleItemClick = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      if (openId !== id) {
        setOpenId(id);
      }
    } else {
      const parentOfClicked = mainNav.find((item) =>
        item.children?.some((child) => child.id === id),
      );

      if (!parentOfClicked || parentOfClicked.id !== openId) {
        setOpenId(null);
      }
    }
  };

  return {
    isCollapsed,
    openId,
    setOpenId,
    location,
    toggleSidebar,
    handleItemClick,
  };
};
