import { twMerge } from "tailwind-merge";

import type { INotificationHistoryItem } from "@/types/notification/notification";

interface INotificationItemProps {
  item: INotificationHistoryItem;
}

function formatNotificationTime(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function NotificationItem({ item }: INotificationItemProps) {
  return (
    <li
      className={twMerge(
        "flex gap-3 rounded-2xl px-3 py-3",
        !item.isRead && "bg-primary-100",
      )}
    >
      <span
        className={twMerge(
          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
          item.isRead ? "bg-transparent" : "bg-primary-400",
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="font-body1 text-text-title">{item.title}</p>
        <p className="mt-1 font-body2 text-text-muted">{item.message}</p>
        <p className="mt-2 font-caption text-text-placeholder">
          {formatNotificationTime(item.createdAt)}
        </p>
      </div>
    </li>
  );
}
