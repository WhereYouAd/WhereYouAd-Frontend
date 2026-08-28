import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Input from "@/components/common/input/Input";
import Toggle from "@/components/common/toggle/Toggle";

import DownloadIcon from "@/assets/icon/common/download.svg?react";
import MailIcon from "@/assets/icon/common/mail.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import BellIcon from "@/assets/icon/sidebar/notification.svg?react";
import DiscordIcon from "@/assets/logo/social-logo/plain/discord.svg?react";
import SlackIcon from "@/assets/logo/social-logo/plain/slack.svg?react";

type TNotificationSectionProps = {
  email: string;
  isAdmin: boolean;
  masterEnabled: boolean;
  onMasterEnabledChange: (value: boolean) => void;
  //channel
  browserPush: boolean;
  emailNotif: boolean;
  isPushPending?: boolean;
  onBrowserPushChange: (value: boolean) => void;
  onEmailNotifChange: (value: boolean) => void;
  slackEnabled: boolean;
  slackConnected: boolean;
  slackWebhookUrl: string;
  slackWebhookError?: string;
  onSlackWebhookUrlChange: (value: string) => void;
  onSlackEnabledChange: (value: boolean) => void;
  onConnectSlack: () => void;
  onDisconnectSlack: () => void;
  discordEnabled: boolean;
  discordConnected: boolean;
  discordWebhookUrl: string;
  discordWebhookError?: string;
  onDiscordWebhookUrlChange: (value: string) => void;
  onDiscordEnabledChange: (value: boolean) => void;
  onConnectDiscord: () => void;
  onDisconnectDiscord: () => void;
  //workspace
  workspaceName: string | null; // null이면 미선택/없음
  clickAlarm: boolean;
  weeklyReport: boolean;
  onClickAlarmChange: (value: boolean) => void;
  onWeeklyReportChange: (value: boolean) => void;
  workspaceNotifiDisabled: boolean; //selectedOrgId === null 등
  pendingOrgAction?: "slack" | "discord" | null;
};

export default function NotificationSection({
  email,
  isAdmin,
  masterEnabled,
  onMasterEnabledChange,
  browserPush,
  emailNotif,
  isPushPending,
  onBrowserPushChange,
  onEmailNotifChange,
  slackEnabled,
  slackConnected,
  slackWebhookUrl,
  slackWebhookError,
  onSlackWebhookUrlChange,
  onSlackEnabledChange,
  onConnectSlack,
  onDisconnectSlack,
  discordEnabled,
  discordConnected,
  discordWebhookUrl,
  discordWebhookError,
  onDiscordWebhookUrlChange,
  onDiscordEnabledChange,
  onConnectDiscord,
  onDisconnectDiscord,
  workspaceName,
  clickAlarm,
  weeklyReport,
  onClickAlarmChange,
  onWeeklyReportChange,
  workspaceNotifiDisabled,
  pendingOrgAction = null,
}: TNotificationSectionProps) {
  const rowIconClass =
    "h-5 w-5 shrink-0 text-text-muted [&_path]:[stroke-width:2]";
  const channelDisabled = workspaceNotifiDisabled || !masterEnabled;
  const isSlackPending = pendingOrgAction === "slack";
  const isDiscordPending = pendingOrgAction === "discord";
  const isAnyOrgPending = pendingOrgAction != null;
  return (
    <Card className="p-8 tablet:p-6">
      <header className="mb-7 flex items-center gap-4">
        <BellIcon />
        <h2 className="font-heading4 text-text-title">알림 설정</h2>
      </header>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-body1 text-text-title break-keep">마스터 알림</p>
          <p className="font-body2 text-text-muted break-keep">
            끄면 모든 알림이 비활성화 됩니다
          </p>
        </div>
        <div className="shrink-0">
          <Toggle
            checked={masterEnabled}
            disabled={workspaceNotifiDisabled}
            onToggle={() => onMasterEnabledChange(!masterEnabled)}
            ariaLabel="마스터 알림 켜기/끄기"
          />
        </div>
      </div>

      <section aria-labelledby="notification-channel-heading">
        <h3
          id="notification-channel-heading"
          className="mb-4 font-label text-text-muted"
        >
          알림 채널
        </h3>

        <div className="flex flex-col divide-y divide-surface-300">
          <div className="flex items-center justify-between gap-4 py-5 first:pt-0">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <BellIcon className={rowIconClass} />
              <p className="font-body1 text-text-title break-keep">
                브라우저 푸시 알림
              </p>
            </div>
            <div className="shrink-0">
              <Toggle
                checked={browserPush}
                disabled={channelDisabled || isPushPending}
                onToggle={() => onBrowserPushChange(!browserPush)}
                ariaLabel="브라우저 푸시 알림 켜기/끄기"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-5 gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <MailIcon className={rowIconClass} />
              <div className="min-w-0">
                <p className="font-body1 text-text-title break-keep">
                  이메일 알림 설정
                </p>
                <p className="font-body2 text-text-muted truncate">{email}</p>
              </div>
            </div>
            <div className="shrink-0">
              <Toggle
                checked={emailNotif}
                disabled={channelDisabled}
                onToggle={() => onEmailNotifChange(!emailNotif)}
                ariaLabel="이메일 알림 켜기/끄기"
              />
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-4 py-5 tablet:flex-col tablet:items-stretch">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <SlackIcon className={rowIconClass} />
                <div className="min-w-0">
                  <p className="font-body1 text-text-title break-keep">
                    슬랙 연동하기
                  </p>
                  <p className="font-body2 text-text-muted break-keep">
                    {slackConnected
                      ? "연동됨 • 알림 on/off는 저장 시 반영"
                      : "Webhook URL로 연동"}
                  </p>
                </div>
              </div>
              {slackConnected ? (
                <div className="flex shrink-0 items-center gap-3 tablet:w-full tablet:justify-end">
                  <Toggle
                    checked={slackEnabled}
                    disabled={channelDisabled || isAnyOrgPending}
                    onToggle={() => onSlackEnabledChange(!slackEnabled)}
                    ariaLabel="슬랙 알림 켜기/끄기"
                  />
                  <Button
                    variant="outline"
                    size="small"
                    type="button"
                    disabled={channelDisabled || isAnyOrgPending}
                    isLoading={isSlackPending}
                    onClick={onDisconnectSlack}
                  >
                    연동 해제
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    aria-label="슬랙 Webhook URL"
                    placeholder="https://hooks.slack.com/..."
                    value={slackWebhookUrl}
                    onChange={(e) => onSlackWebhookUrlChange(e.target.value)}
                    error={!!slackWebhookError}
                    helperText={slackWebhookError}
                    disabled={channelDisabled || isAnyOrgPending}
                    wrapperClassName="w-1/4 shrink-0 tablet:w-full"
                    containerClassName="h-10 rounded-lg"
                    inputClassName="px-3 font-body2"
                  />
                  <Button
                    variant="outline"
                    size="small"
                    type="button"
                    className="shrink-0 tablet:w-full"
                    disabled={
                      channelDisabled ||
                      isAnyOrgPending ||
                      !slackWebhookUrl.trim()
                    }
                    isLoading={isSlackPending}
                    onClick={onConnectSlack}
                  >
                    연동
                  </Button>
                </>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-4 py-5 last:pb-0 tablet:flex-col tablet:items-stretch">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <DiscordIcon className={rowIconClass} />
                <div className="min-w-0">
                  <p className="font-body1 text-text-title break-keep">
                    디스코드 연동하기
                  </p>
                  <p className="font-body2 text-text-muted break-keep">
                    {discordConnected
                      ? "연동됨 • 알림 on/off는 저장 시 반영"
                      : "Webhook URL로 연동"}
                  </p>
                </div>
              </div>
              {discordConnected ? (
                <div className="flex shrink-0 items-center gap-3 tablet:w-full tablet:justify-end">
                  <Toggle
                    checked={discordEnabled}
                    disabled={channelDisabled || isAnyOrgPending}
                    onToggle={() => onDiscordEnabledChange(!discordEnabled)}
                    ariaLabel="디스코드 알림 켜기/끄기"
                  />
                  <Button
                    variant="outline"
                    size="small"
                    type="button"
                    disabled={channelDisabled || isAnyOrgPending}
                    isLoading={isDiscordPending}
                    onClick={onDisconnectDiscord}
                  >
                    연동 해제
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    aria-label="디스코드 Webhook URL"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={discordWebhookUrl}
                    onChange={(e) => onDiscordWebhookUrlChange(e.target.value)}
                    error={!!discordWebhookError}
                    helperText={discordWebhookError}
                    disabled={channelDisabled || isAnyOrgPending}
                    wrapperClassName="w-1/4 shrink-0 tablet:w-full"
                    containerClassName="h-10 rounded-lg"
                    inputClassName="px-3 font-body2"
                  />
                  <Button
                    variant="outline"
                    size="small"
                    type="button"
                    className="shrink-0 tablet:w-full"
                    disabled={
                      channelDisabled ||
                      isAnyOrgPending ||
                      !discordWebhookUrl.trim()
                    }
                    isLoading={isDiscordPending}
                    onClick={onConnectDiscord}
                  >
                    연동
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="my-8 border-t border-surface-300" aria-hidden />

      <section aria-labelledby="notification-workspace-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3
            id="notification-workspace-heading"
            className="font-label text-text-muted"
          >
            워크스페이스 알림
          </h3>
          <p className="min-w-0 truncate font-caption text-text-muted">
            {workspaceNotifiDisabled
              ? "워크스페이스를 선택해주세요"
              : workspaceName}
          </p>
        </div>

        <div className="flex flex-col divide-y divide-surface-300">
          <div className="flex items-center justify-between gap-4 py-5 first:pt-0">
            <div className="flex min-w-0 items-center gap-4">
              <WarnCircleIcon className={rowIconClass} />
              <div className="min-w-0">
                <p className="font-body1 text-text-title break-keep">
                  클릭수 알림
                </p>
                <p className="font-body2 text-text-muted break-keep">
                  이상 징후가 있을 때 알림
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <Toggle
                ariaLabel="클릭수 알람 켜기/끄기"
                checked={clickAlarm}
                disabled={channelDisabled}
                onToggle={() => onClickAlarmChange(!clickAlarm)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-5 last:pb-0">
            <div className="flex min-w-0 items-center gap-4">
              <DownloadIcon className={rowIconClass} />
              <div className="min-w-0">
                <p className="font-body1 text-text-title break-keep">
                  주간 리포트
                </p>
                <p className="font-body2 text-text-muted break-keep">
                  매주 월요일 오전 8시 리포트 이메일 발송
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <Toggle
                ariaLabel="주간리포트 받기/안받기"
                checked={weeklyReport}
                disabled={channelDisabled}
                onToggle={() => onWeeklyReportChange(!weeklyReport)}
              />
            </div>
          </div>
        </div>
      </section>
    </Card>
  );
}
