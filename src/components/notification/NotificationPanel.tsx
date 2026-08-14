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
    <Drawer isOpen={isOpen} onClose={onClose} title="알림">
      {children}
    </Drawer>
  );
}
