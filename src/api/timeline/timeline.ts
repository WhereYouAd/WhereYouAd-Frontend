import type { ICommonResponse } from "@/types/common/common";
import {
  type ITimelineDetail,
  type ITimelineListItem,
  type ITimelineListParams,
  type ITimelineMutationResponse,
  type ITimelineUpsertRequest,
  type TTimelineEmptyResponse,
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
  params: ITimelineListParams = {},
): Promise<ITimelineListItem[]> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<ITimelineListItem[]>
  >(`/api/org/${orgId}/timeline`, {
    params: {
      ...(params.status ? { status: params.status } : {}),
      ...(params.sort ? { sort: params.sort } : {}),
    },
  });
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

//타임라인 수정 API
export const updateTimeline = async (
  orgId: number,
  timelineId: number,
  body: ITimelineUpsertRequest,
): Promise<ITimelineMutationResponse> => {
  const { data } = await axiosInstance.put<
    ICommonResponse<ITimelineMutationResponse>
  >(`/api/org/${orgId}/timeline/${timelineId}`, body);
  return data.data;
};

//타임라인 삭제 API
export const deleteTimeline = async (
  orgId: number,
  timelineId: number,
): Promise<TTimelineEmptyResponse> => {
  const { data } = await axiosInstance.delete<
    ICommonResponse<TTimelineEmptyResponse>
  >(`/api/org/${orgId}/timeline/${timelineId}`);
  return data.data;
};

//타임라인 AI 요약 요청 API
export const requestTimelineSummary = async (
  orgId: number,
  timelineId: number,
): Promise<TTimelineEmptyResponse> => {
  const { data } = await axiosInstance.post<
    ICommonResponse<TTimelineEmptyResponse>
  >(
    `/api/org/${orgId}/timeline/${timelineId}/summary`,
    {},
    {
      validateStatus: (status) =>
        status === 202 || (status >= 200 && status < 300),
    },
  );
  return data.data;
};
