import { create } from "zustand";

import type { TTimelineSort } from "@/types/timeline/api";
import type { TTimelineStatusFilter } from "@/constants/timeline/filterSort";

interface ITimelineUiState {
  statusFilter: TTimelineStatusFilter;
  sort: TTimelineSort;
  setStatusFilter: (statusFilter: TTimelineStatusFilter) => void;
  setSort: (sort: TTimelineSort) => void;
}

const useTimelineStore = create<ITimelineUiState>((set) => ({
  statusFilter: "ALL",
  sort: "DISPLAY_ORDER",
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSort: (sort) => set({ sort }),
}));

export default useTimelineStore;
