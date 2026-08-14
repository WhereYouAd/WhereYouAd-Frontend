import type { INotificationHistoryData } from "./notification";

export const MOCK_NOTIFICATION_HISTORY: INotificationHistoryData = {
  hasNext: false,
  nextCursor: null,
  notifications: [
    {
      userNotificationId: 3,
      title: "클릭수 급감 알림",
      message: "오늘 클릭수가 전일 대비 13% 감소했습니다",
      createdAt: "2026-08-14T04:52:25.364Z",
      type: "CLICKS",
      isRead: false,
    },
    {
      userNotificationId: 2,
      title: "클릭수 급증 알림",
      message: "오늘 클릭수가 전일 대비 49% 증가했습니다",
      createdAt: "2026-08-13T11:20:00.000Z",
      type: "CLICKS",
      isRead: false,
    },
    {
      userNotificationId: 1,
      title: "클릭수 급감 알림",
      message: "오늘 클릭수가 전일 대비 68% 감소했습니다",
      createdAt: "2026-08-12T08:10:00.000Z",
      type: "CLICKS",
      isRead: true,
    },
  ],
};

export const MOCK_NOTIFICATION_HISTORY_EMPTY: INotificationHistoryData = {
  hasNext: false,
  nextCursor: null,
  notifications: [],
};
