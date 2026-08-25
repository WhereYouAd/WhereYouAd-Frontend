import type { INotificationHistoryData } from "@/types/notification/notification";

/** 모두 읽음 메뉴 확인용. USE_MOCK_NOTIFICATION_HISTORY를 false로 바꾸면 사용 안 함 */
export const MOCK_NOTIFICATION_HISTORY: INotificationHistoryData = {
  hasNext: false,
  nextCursor: null,
  notifications: [
    {
      userNotificationId: 3,
      title: "주간 리포트",
      message: "이번 주 성과 리포트가 이메일로 발송되었습니다.",
      createdAt: "2026-08-25T08:00:00.000Z",
      type: "REPORT",
      isRead: false,
    },
    {
      userNotificationId: 2,
      title: "클릭수 급증 알림",
      message: "오늘 클릭수가 전일 대비 49% 증가했습니다.",
      createdAt: "2026-08-25T06:20:00.000Z",
      type: "CLICKS_INCREASE",
      isRead: false,
    },
    {
      userNotificationId: 1,
      title: "봇 클릭 탐지",
      message: "이상 클릭이 감지되었습니다.",
      createdAt: "2026-08-24T11:10:00.000Z",
      type: "BOT_CLICKS",
      isRead: false,
    },
  ],
};
