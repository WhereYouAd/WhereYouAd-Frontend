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
