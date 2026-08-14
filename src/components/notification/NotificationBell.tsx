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

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);
  const togglePanel = () => setIsOpen((prev) => !prev);

  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <>
      <button
        type="button"
        aria-label="알림 열기"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={togglePanel}
        onMouseEnter={openPanel}
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span
            className={twMerge(
              "absolute -top-0.5 -right-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-info-red px-1 font-caption text-surface-100",
              unreadCount > 9 ? "h-4.5" : "h-4 w-4",
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
