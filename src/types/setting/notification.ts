import type { TMemberRole } from "@/types/workspace/workspace";

//공통 empty data
export type TNotificationEmptyData = Record<string, never>;

//GET .../members
export interface INotificationMemberItem {
  membershipId: number;
  name: string;
  email: string;
  role: TMemberRole;
  isReceive: boolean;
}
export interface INotificationMembersData {
  hasNext: boolean;
  nextCursor: string | null;
  members: INotificationMemberItem[];
}
export interface INotificationMembersParams {
  cursor?: string;
}

//GET .../settings/{orgId}
export interface IMyNotificationSettings {
  isMasterEnabled: boolean;
  isBrowserPushEnabled: boolean;
  isEmailEnabled: boolean;
  isSlackEnabled: boolean;
  isSlackConnected: boolean;
  isDiscordEnabled: boolean;
  isDiscordConnected: boolean;
  alertClicks: boolean;
  alertReport: boolean;
  orgAlertClicks: boolean;
  orgAlertReport: boolean;
}
//PATCH .../org
export interface IUpdateOrgNotificationSettingsRequest {
  isSlackEnabled: boolean;
  slackWebhookUrl: string;
  disconnectSlack: boolean;
  isDiscordEnabled: boolean;
  discordWebhookUrl: string;
  disconnectDiscord: boolean;
  alertClicks: boolean;
  alertReport: boolean;
}

//PATCH .../members
export interface IUpdateNotificationMemberItem {
  membershipId: number;
  isReceive: boolean;
}
export interface IUpdateNotificationMembersRequest {
  members: IUpdateNotificationMemberItem[];
}

//PATCH .../master
export interface IUpdateMasterNotificationSettingRequest {
  isMasterEnabled: boolean;
}

//PATCH .../channels
export interface IUpdateChannelNotificationSettingsRequest {
  isBrowserPushEnabled: boolean;
  isEmailEnabled: boolean;
}

//PATCH .../alerts
export interface IUpdateAlertsNotificationSettingsRequest {
  alertClicks: boolean;
  alertReport: boolean;
}
