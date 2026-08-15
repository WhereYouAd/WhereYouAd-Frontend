import type { ReactNode } from "react";

import Drawer from "@/components/common/drawer/Drawer";

import BellIcon from "@/assets/icon/sidebar/notification.svg?react";

interface INotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function NotificationPanel({
  isOpen,
  onClose,
  children,
}: INotificationPanelProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h2 className="flex items-center gap-2 pl-2 pt-2 font-heading4 text-text-title">
          <BellIcon className="h-6 w-6 text-text-title" /> 알림
        </h2>
      }
      className="max-w-90 h-auto min-h-[min(72vh,560px)] my-4 rounded-l-3xl"
    >
      {children}
    </Drawer>
  );
}
