import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useTimelineDetail } from "./useTimelineDetail";

export function useTimelineEditModal() {
  const [editTimelineId, setEditTimelineId] = useState<number | null>(null);

  const {
    data: editDetail,
    isLoading: isEditDetailLoading,
    isError: isEditDetailError,
    error: editDetailError,
  } = useTimelineDetail(editTimelineId);

  const editInitialValues = useMemo(() => {
    if (!editDetail) return undefined;
    return {
      name: editDetail.name,
      startDate: editDetail.startDate,
      endDate: editDetail.endDate,
      metrics: editDetail.metrics,
      comparisonPeriodType: editDetail.comparisonPeriodType,
    };
  }, [editDetail]);

  useEffect(() => {
    if (editTimelineId == null || !isEditDetailError) return;
    toast.error(
      editDetailError?.message ??
        "타임라인 정보를 불러오지 못했습니다. 다시 시도해주세요",
    );
    setEditTimelineId(null);
  }, [editTimelineId, isEditDetailError, editDetailError]);

  useEffect(() => {
    if (editTimelineId == null || !isEditDetailLoading) return;
    toast.info("타임라인 정보를 불러오는 중...");
  }, [editTimelineId, isEditDetailLoading]);

  const openEditModal = (id: number) => setEditTimelineId(id);
  const closeEditModal = () => setEditTimelineId(null);

  return {
    editTimelineId,
    editInitialValues,
    isEditOpen: editTimelineId != null && editInitialValues != null,
    openEditModal,
    closeEditModal,
  };
}
