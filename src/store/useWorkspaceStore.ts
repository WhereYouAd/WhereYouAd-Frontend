import { create } from "zustand";

import type { TMemberRole } from "@/types/workspace/workspace";

interface IWorkspaceState {
  selectedOrgId: number | null;
  myRole: TMemberRole | null;
  setSelectedOrgId: (orgId: number) => void;
  setMyRole: (role: TMemberRole) => void;
}

const useWorkspaceStore = create<IWorkspaceState>((set) => ({
  selectedOrgId: null,
  myRole: null,
  setSelectedOrgId: (orgId) => set({ selectedOrgId: orgId }),
  setMyRole: (role) => set({ myRole: role }),
}));

export default useWorkspaceStore;
