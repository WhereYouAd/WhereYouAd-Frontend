import type { ReactNode } from "react";

import Drawer from "@/components/common/drawer/Drawer";

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
      title="알림"
      className="max-w-90 h-auto min-h-[min(72vh,560px)] my-4 rounded-l-3xl"
    >
      {children}
    </Drawer>
  );
}
