import type { INotificationHistoryItem } from "@/types/notification/notification";

import NotificationItem from "@/components/notification/NotificationItem";
import NotificationListSkeleton from "@/components/notification/NotificationListSkeleton";

interface INotificationListProps {
  orgId: number | null;
  isLoading: boolean;
  notifications: INotificationHistoryItem[];
}

export default function NotificationList({
  orgId,
  isLoading,
  notifications,
}: INotificationListProps) {
  if (orgId === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="font-heading4 text-text-title">
          워크스페이스를 선택해주세요
        </p>
        <p className="font-body2 text-text-muted">
          현재 워크스페이스 기준으로 알림을 보여줍니다
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <NotificationListSkeleton />;
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="font-heading4 text-text-title">아직 알림이 없어요</p>
        <p className="font-body 2 text-text-muted">
          클릭수 변화나 주간 리포트가 오면
          <br /> 여기에 표시됩니다
        </p>
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-1 px-4 py-3">
      {notifications.map((item) => (
        <NotificationItem key={item.userNotificationId} item={item} />
      ))}
    </ul>
  );
}
