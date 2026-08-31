import { twMerge } from "tailwind-merge";

import type {
  INotificationHistoryItem,
  TNotificationType,
} from "@/types/notification/notification";

import TrendUpIcon from "@/assets/icon/chevron/trend-up.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

interface INotificationItemProps {
  item: INotificationHistoryItem;
  onClick: (item: INotificationHistoryItem) => void;
}

function formatNotificationTime(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function getNotificationRowClass(type: TNotificationType): string {
  if (type === "REPORT") return "bg-surface-200";
  if (type === "CLICKS_INCREASE") return "bg-info-red/[0.08]";
  if (type === "BOT_CLICKS") return "bg-info-yellow/[0.08]";
  return "";
}

export default function NotificationItem({
  item,
  onClick,
}: INotificationItemProps) {
  const rowClass = getNotificationRowClass(item.type);
  return (
    <li>
      <button
        type="button"
        onClick={() => onClick(item)}
        className={twMerge(
          "flex w-full cursor-pointer gap-3 rounded-2xl px-4 py-3 text-left",
          !item.isRead && rowClass,
        )}
      >
        <span
          className={twMerge(
            "mt-2 h-2 w-2 shrink-0 rounded-full",
            item.isRead ? "bg-transparent" : "bg-text-body",
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="min-w-0 truncate font-body1 text-text-title">
              {item.title}
            </p>
            {item.type === "CLICKS_INCREASE" ? (
              <TrendUpIcon
                className="h-4 w-4 shrink-0 text-info-red"
                aria-label="증가"
              />
            ) : null}
            {item.type === "BOT_CLICKS" ? (
              <WarnCircleIcon
                className="h-4 w-4 shrink-0 text-info-yellow"
                aria-label="봇 클릭"
              />
            ) : null}
          </div>

          <p className="mt-1 font-body2 text-text-muted">{item.message}</p>
          <p className="mt-2 font-caption text-text-placeholder">
            {formatNotificationTime(item.createdAt)}
          </p>
        </div>
      </button>
    </li>
  );
}
