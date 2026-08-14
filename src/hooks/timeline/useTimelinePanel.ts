import { useEffect, useState } from "react";

import type { ITimelineSummaryPanelData } from "@/types/timeline/summary";
import type { ITimelineCampaignBar } from "@/types/timeline/ui";

import { buildTimelineSummaryPanel } from "@/utils/timeline/buildTimelineSummaryPanel";

import { useTimelineDetail } from "./useTimelineDetail";

interface IUseTimelinePanelParams {
  bars: ITimelineCampaignBar[];
}

export default function useTimelinePanel({ bars }: IUseTimelinePanelParams) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedBarId, setSelectedBarId] = useState<number | null>(null);
  const [panelData, setPanelData] = useState<ITimelineSummaryPanelData | null>(
    null,
  );

  const { data: detail } = useTimelineDetail(selectedBarId);

  useEffect(() => {
    if (!detail) return;
    setPanelData(buildTimelineSummaryPanel(detail));
  }, [detail]);

  useEffect(() => {
    if (selectedBarId === null) return;
    if (!bars.some((bar) => bar.id === selectedBarId)) {
      setIsPanelOpen(false);
      setSelectedBarId(null);
    }
  }, [bars, selectedBarId]);

  const handleBarClick = (bar: ITimelineCampaignBar) => {
    setSelectedBarId(bar.id);
    setPanelData(null);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedBarId(null);
  };

  return {
    isPanelOpen,
    selectedBarId,
    panelData,
    handleBarClick,
    handlePanelClose,
  };
}
