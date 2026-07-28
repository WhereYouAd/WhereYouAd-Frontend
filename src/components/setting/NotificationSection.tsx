import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Toggle from "@/components/common/toggle/Toggle";

import DownloadIcon from "@/assets/icon/common/download.svg?react";
import MailIcon from "@/assets/icon/common/mail.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import BellIcon from "@/assets/icon/sidebar/notification.svg?react";
import SlackIcon from "@/assets/logo/social-logo/plain/slack.svg?react";

type TNotificationSectionProps = {
  email: string;
  //channel
  browserPush: boolean;
  emailNotif: boolean;
  onBrowserPushChange: (value: boolean) => void;
  onEmailNotifChange: (value: boolean) => void;
  //workspace
  workspaceName: string | null; // null이면 미선택/없음
  clickAlarm: boolean;
  weeklyReport: boolean;
  onClickAlarmChange: (value: boolean) => void;
  onWeeklyReportChange: (value: boolean) => void;
  workspaceNotifiDisabled: boolean; //selectedOrgId === null 등
};

export default function NotificationSection({
  email,
  browserPush,
  emailNotif,
  onBrowserPushChange,
  onEmailNotifChange,
  workspaceName,
  clickAlarm,
  weeklyReport,
  onClickAlarmChange,
  onWeeklyReportChange,
  workspaceNotifiDisabled,
}: TNotificationSectionProps) {
  const rowIconClass =
    "h-5 w-5 shrink-0 text-text-muted [&_path]:[stroke-width:2]";

  return (
    <Card className="p-8 tablet:p-10">
      <header className="mb-7 flex items-center gap-4">
        <BellIcon />
        <h2 className="font-heading4 text-text-title">알림 설정</h2>
      </header>

      <section aria-labelledby="notification-channel-heading">
        <h3
          id="notification-channel-heading"
          className="mb-4 font-label text-text-muted"
        >
          알림 채널
        </h3>

        <div className="flex flex-col divide-y divide-surface-300">
          <div className="flex items-center justify-between py-5 first:pt-0">
            <div className="flex items-center gap-4">
              <BellIcon className={rowIconClass} />
              <p className="font-body1 text-text-title">브라우저 푸시 알림</p>
            </div>
            <div className="flex items-center gap-4">
              {browserPush && <Badge variant="infoBlue">켜짐</Badge>}
              <Toggle
                checked={browserPush}
                onToggle={() => onBrowserPushChange(!browserPush)}
                ariaLabel="브라우저 푸시 알림 켜기/끄기"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <MailIcon className={rowIconClass} />
              <div>
                <p className="font-body1 text-text-title">이메일 알림 설정</p>
                <p className="font-body2 text-text-muted">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {emailNotif && <Badge variant="infoBlue">켜짐</Badge>}
              <Toggle
                checked={emailNotif}
                onToggle={() => onEmailNotifChange(!emailNotif)}
                ariaLabel="이메일 알림 켜기/끄기"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <SlackIcon className={rowIconClass} />
              <div>
                <p className="font-body1 text-text-title">슬랙 연동하기</p>
                <p className="font-body2 text-text-muted">#채널명</p>
              </div>
            </div>
            <Button variant="outline" size="small" type="button">
              연동
            </Button>
          </div>
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
                <p className="font-body1 text-text-title">클릭수 알림</p>
                <p className="font-body2 text-text-muted">
                  이상 징후가 있을 때 알림
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              {clickAlarm && !workspaceNotifiDisabled && (
                <Badge variant="infoBlue">켜짐</Badge>
              )}
              <Toggle
                ariaLabel="클릭수 알람 켜기/끄기"
                checked={clickAlarm}
                disabled={workspaceNotifiDisabled}
                onToggle={() => onClickAlarmChange(!clickAlarm)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-5 last:pb-0">
            <div className="flex min-w-0 items-center gap-4">
              <DownloadIcon className={rowIconClass} />
              <div className="min-w-0">
                <p className="font-body1 text-text-title">주간 리포트</p>
                <p className="font-body2 text-text-muted">
                  매주 월요일 오전 8시 리포트 이메일 발송
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              {weeklyReport && !workspaceNotifiDisabled && (
                <Badge variant="infoBlue">켜짐</Badge>
              )}
              <Toggle
                ariaLabel="주간리포트 받기/안받기"
                checked={weeklyReport}
                disabled={workspaceNotifiDisabled}
                onToggle={() => onWeeklyReportChange(!weeklyReport)}
              />
            </div>
          </div>
        </div>
      </section>
    </Card>
  );
}
