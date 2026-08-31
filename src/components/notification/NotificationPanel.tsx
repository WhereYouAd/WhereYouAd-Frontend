import type { ReactNode } from "react";

import Drawer from "@/components/common/drawer/Drawer";

import BellIcon from "@/assets/icon/sidebar/notification.svg?react";

interface INotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  onReadAll?: () => void;
}

export default function NotificationPanel({
  isOpen,
  onClose,
  children,
  onReadAll,
}: INotificationPanelProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 pl-2 pt-2">
          <h2 className="flex items-center gap-2 font-heading4 text-text-title">
            <BellIcon className="h-6 w-6 text-text-title" /> 알림
          </h2>
          {onReadAll ? (
            <button
              type="button"
              onClick={onReadAll}
              className="shrink-0 cursor-pointer rounded-lg px-2 py-1 font-body2 text-text-muted transition-ui-fast hover:bg-surface-200 hover:text-text-body"
            >
              모두 읽음
            </button>
          ) : null}
        </div>
      }
      className="max-w-90 h-auto min-h-[min(72vh,560px)] my-4 rounded-l-3xl tablet:my-0"
    >
      {children}
    </Drawer>
  );
}
