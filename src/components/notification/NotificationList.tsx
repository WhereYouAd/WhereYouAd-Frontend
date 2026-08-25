import { useEffect, useRef } from "react";

import type { INotificationHistoryItem } from "@/types/notification/notification";

import NotificationItem from "@/components/notification/NotificationItem";
import NotificationListSkeleton from "@/components/notification/NotificationListSkeleton";

interface INotificationListProps {
  orgId: number | null;
  isLoading: boolean;
  isError: boolean;
  notifications: INotificationHistoryItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onItemClick: (item: INotificationHistoryItem) => void;
}

export default function NotificationList({
  orgId,
  isLoading,
  isError,
  notifications,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onItemClick,
}: INotificationListProps) {
  const sentinelRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (!isFetchingNextPage) fetchNextPage();
      },
      { root: null, rootMargin: "80px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="font-heading4 text-text-title">
          알림을 불러오지 못했습니다
        </p>
        <p className="font-body2 text-text-muted">잠시 후 다시 시도해주세요</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="font-heading4 text-text-title">아직 알림이 없어요</p>
        <p className="font-body2 text-text-muted">
          클릭 급증, 봇 클릭, 주간 리포트가 오면
          <br /> 여기에 표시됩니다
        </p>
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-1 px-4 py-3">
      {notifications.map((item) => (
        <NotificationItem
          key={item.userNotificationId}
          item={item}
          onClick={onItemClick}
        />
      ))}
      {hasNextPage ? (
        <li ref={sentinelRef} className="h-4" aria-hidden />
      ) : null}
      {isFetchingNextPage ? <NotificationListSkeleton /> : null}
    </ul>
  );
}
