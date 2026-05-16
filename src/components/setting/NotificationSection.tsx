import { useState } from "react";

import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Toggle from "@/components/common/toggle/Toggle";

import MailIcon from "@/assets/icon/common/mail.svg?react";
import BellIcon from "@/assets/icon/sidebar/notification.svg?react";
import SlackIcon from "@/assets/logo/social-logo/plain/slack.svg?react";

type TNotificationSectionProps = {
  email: string;
};

export default function NotificationSection({
  email,
}: TNotificationSectionProps) {
  const [browserPush, setBrowserPush] = useState(false);
  const [emailNotif, setEmailNotif] = useState(false);

  return (
    <Card className="p-8 tablet:p-10">
      <header className="mb-7 flex items-center gap-4">
        <BellIcon />
        <h2 className="font-heading4 text-text-title">알림 채널 설정</h2>
      </header>

      <div className="flex flex-col divide-y divide-surface-300">
        <div className="flex items-center justify-between py-5 first:pt-0">
          <div className="flex items-center gap-4">
            <BellIcon className="h-5 w-5 shrink-0 text-text-muted" />
            <p className="font-body1 text-text-title">브라우저 푸시 알림</p>
          </div>
          <div className="flex items-center gap-4">
            {browserPush && <Badge variant="infoBlue">권한 허용됨</Badge>}
            <Toggle
              checked={browserPush}
              onToggle={() => setBrowserPush((p) => !p)}
              ariaLabel="브라우저 푸시 알림 켜기/끄기"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <MailIcon className="h-5 w-5 shrink-0 text-text-muted" />
            <div>
              <p className="font-body1 text-text-title">이메일 알림 설정</p>
              <p className="font-body2 text-text-muted">{email}</p>
            </div>
          </div>
          <Toggle
            checked={emailNotif}
            onToggle={() => setEmailNotif((p) => !p)}
            ariaLabel="이메일 알림 켜기/끄기"
          />
        </div>

        <div className="flex items-center justify-between py-5 last:pb-0">
          <div className="flex items-center gap-4">
            <SlackIcon className="h-5 w-5 shrink-0" />
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
    </Card>
  );
}
