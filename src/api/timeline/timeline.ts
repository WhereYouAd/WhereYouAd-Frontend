import type { ICommonResponse } from "@/types/common/common";
import type {
  ITimelineDetail,
  ITimelineListItem,
  ITimelineMutationResponse,
  ITimelineUpsertRequest,
} from "@/types/timeline/api";

import { axiosInstance } from "@/lib/axiosInstance";

//타임라인 상세 조회 API
export const getTimelineDetail = async (
  orgId: number,
  timelineId: number,
): Promise<ITimelineDetail> => {
  const { data } = await axiosInstance.get<ICommonResponse<ITimelineDetail>>(
    `/api/org/${orgId}/timeline/${timelineId}`,
  );
  return data.data;
};

//타임라인 목록 조회 API
export const getTimelineList = async (
  orgId: number,
): Promise<ITimelineListItem[]> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<ITimelineListItem[]>
  >(`/api/org/${orgId}/timeline`);
  return data.data;
};

//타임라인 생성 API
export const createTimeline = async (
  orgId: number,
  body: ITimelineUpsertRequest,
): Promise<ITimelineMutationResponse> => {
  const { data } = await axiosInstance.post<
    ICommonResponse<ITimelineMutationResponse>
  >(`/api/org/${orgId}/timeline`, body, {
    validateStatus: (status) =>
      status === 201 || (status >= 200 && status < 300),
  });
  return data.data;
};
