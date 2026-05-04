import { create } from "zustand";

interface IWorkspaceState {
  selectedOrgId: number | null;
  setSelectedOrgId: (orgId: number) => void;
}

const useWorkspaceStore = create<IWorkspaceState>((set) => ({
  selectedOrgId: null,
  setSelectedOrgId: (orgId) => set({ selectedOrgId: orgId }),
}));

export default useWorkspaceStore;
