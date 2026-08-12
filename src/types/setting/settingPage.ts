export interface IChannelNotificationSettings {
  browserPush: boolean;
  emailNotif: boolean;
}

export interface IWorkspaceNotificationSettings {
  clickAlarm: boolean;
  weeklyReport: boolean;
}

export interface IOrgNotificationSettings {
  masterEnabled: boolean;
  slackEnabled: boolean;
  slackConnected: boolean;
  discordEnabled: boolean;
  discordConnected: boolean;
}

export const DEFAULT_CHANNEL: IChannelNotificationSettings = {
  browserPush: false,
  emailNotif: false,
};

export const DEFAULT_WORKSPACE_NOTIF: IWorkspaceNotificationSettings = {
  clickAlarm: false,
  weeklyReport: false,
};

export const DEFAULT_ORG_NOTIF: IOrgNotificationSettings = {
  masterEnabled: true,
  slackEnabled: false,
  slackConnected: false,
  discordEnabled: false,
  discordConnected: false,
};

export interface IDraftProfile {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface ISavedProfile {
  name: string;
  profileImageUrl: string | null;
}
