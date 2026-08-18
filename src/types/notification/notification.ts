export interface IMyNotificationSettings {
  isMasterEnabled: boolean;
  isBrowserPushEnabled: boolean;
  isEmailEnabled: boolean;
  isSlackEnabled: boolean;
  isSlackConnted: boolean;
  isDiscordEnabled: boolean;
  isDiscordConnected: boolean;
  alertClicks: boolean;
  alertReport: boolean;
  orgAlertclicks: boolean;
  orgAlertReport: boolean;
}

export interface INotificationMemberSetting {
  membershipId: number;
  name: string;
  email: string;
  role: string;
  isReceive: boolean;
}

export type TNotificationType = "CLICKS" | "REPORT";

export interface INotificationHistoryItem {
  userNotificationId: number;
  title: string;
  message: string;
  createdAt: string;
  type: TNotificationType;
  isRead: boolean;
}

export interface INotificationHistoryData {
  hasNext: boolean;
  nextCursor: string | null;
  notifications: INotificationHistoryItem[];
}
