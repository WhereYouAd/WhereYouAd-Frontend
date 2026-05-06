import { create } from "zustand";

interface ISidebarState {
  isCollapsed: boolean;
  setIsCollapsed: (next: boolean) => void;
  toggleSidebar: () => void;
}

const useSidebarStore = create<ISidebarState>((set) => ({
  isCollapsed: true,
  setIsCollapsed: (next) => set({ isCollapsed: next }),
  toggleSidebar: () => set((prev) => ({ isCollapsed: !prev.isCollapsed })),
}));

export default useSidebarStore;
