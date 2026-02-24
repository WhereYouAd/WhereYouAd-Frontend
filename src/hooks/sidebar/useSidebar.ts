import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { mainNav } from "@/constants/sidebarNav";

export const useSidebar = () => {
  const location = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    setIsCollapsed((prev) => {
      const next = !prev;
      if (next) lastPathRef.current = "";
      return next;
    });
    setOpenId(null);
  };

  const handleItemClick = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      setOpenId((prev) => (prev === id ? null : id));
    } else {
      setOpenId(null);
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
