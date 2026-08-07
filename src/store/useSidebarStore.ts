import { create } from "zustand";

interface ISidebarState {
  isCollapsed: boolean;
  setIsCollapsed: (next: boolean) => void;
  toggleSidebar: () => void;
  /** tablet 이하 off-canvas 열림 */
  isMobileOpen: boolean;
  setIsMobileOpen: (next: boolean) => void;
  closeMobile: () => void;
}

const useSidebarStore = create<ISidebarState>((set) => ({
  isCollapsed: true,
  setIsCollapsed: (next) => set({ isCollapsed: next }),
  toggleSidebar: () => set((prev) => ({ isCollapsed: !prev.isCollapsed })),
  isMobileOpen: false,
  setIsMobileOpen: (next) => set({ isMobileOpen: next }),
  closeMobile: () => set({ isMobileOpen: false }),
}));

export default useSidebarStore;
