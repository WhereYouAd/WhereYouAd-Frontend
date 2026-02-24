import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { mainNav } from "@/constants/sidebarNav";

export const useSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    setIsCollapsed((prev) => !prev);
    setOpenId(null);
  };

  const handleItemClick = (id: string, hasChildren: boolean, path?: string) => {
    if (hasChildren) {
      setOpenId((prev) => (prev === id ? null : id));
      if (path) navigate(path);
    } else if (path) {
      navigate(path);
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
