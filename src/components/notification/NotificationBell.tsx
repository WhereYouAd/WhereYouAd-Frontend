import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { useNotificationHistory } from "@/hooks/notification/useNotificationHistory";

import NotificationList from "@/components/notification/NotificationList";
import NotificationPanel from "@/components/notification/NotificationPanel";

import BellIcon from "@/assets/icon/sidebar/notification.svg?react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { orgId, notifications, unreadCount, isLoading } =
    useNotificationHistory();

  //   const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);
  const togglePanel = () => setIsOpen((prev) => !prev);

  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);
  const badgeSizeClass =
    unreadCount > 99 ? "h-4.5 w-6.5" : unreadCount < 10 ? "h-4 w-4" : "h-4 w-5";

  return (
    <>
      <button
        type="button"
        aria-label="알림 열기"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={togglePanel}
        // onMouseEnter={openPanel}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-text-title transition-colors hover:bg-surface-200 hover:text-text-body"
      >
        <BellIcon className="h-6.5 w-6.5" />
        {unreadCount > 0 ? (
          <span
            className={twMerge(
              "absolute top-0 right-0.5 flex items-center justify-center rounded-full bg-info-red font-caption text-surface-100",
              badgeSizeClass,
            )}
          >
            {badgeLabel}
          </span>
        ) : null}
      </button>
      <NotificationPanel isOpen={isOpen} onClose={closePanel}>
        <NotificationList
          orgId={orgId}
          isLoading={isLoading}
          notifications={notifications}
        />
      </NotificationPanel>
    </>
  );
}
