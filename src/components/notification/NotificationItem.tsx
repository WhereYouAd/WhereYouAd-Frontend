import { twMerge } from "tailwind-merge";

import type {
  INotificationHistoryItem,
  TNotificationType,
} from "@/types/notification/notification";

import TrendDownIcon from "@/assets/icon/chevron/trend-down.svg?react";
import TrendUpIcon from "@/assets/icon/chevron/trend-up.svg?react";

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

function getClickTrend(item: INotificationHistoryItem): "up" | "down" | null {
  const text = `${item.title} ${item.message}`;

  if (text.includes("급증") || text.includes("증가")) return "up";
  if (text.includes("급감") || text.includes("감소")) return "down";

  return null;
}

function getNotificationRowClass(
  type: TNotificationType,
  trend: "up" | "down" | null,
): string {
  if (type === "REPORT") return "bg-surface-200";
  if (trend === "up") return "bg-info-red/[0.08]";
  if (trend === "down") return "bg-info-blue/[0.08]";
  return "";
}

export default function NotificationItem({ item }: INotificationItemProps) {
  const trend = getClickTrend(item);
  const rowClass = getNotificationRowClass(item.type, trend);
  return (
    <li
      className={twMerge(
        "flex gap-3 rounded-2xl px-3 py-3",
        !item.isRead && rowClass,
      )}
    >
      <span
        className={twMerge(
          "mt-2 h-2 w-2 shrink-0 rounded-full",
          item.isRead ? "bg-transparent" : "bg-text-placeholder",
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="min-w-0 truncate font-body1 text-text-title">
            {item.title}
          </p>
          {trend === "up" ? (
            <TrendUpIcon
              className="h-4 w-4 shrink-0 text-info-red"
              aria-label="증가"
            />
          ) : null}
          {trend === "down" ? (
            <TrendDownIcon
              className="h-4 w-4 shrink-0 text-info-blue"
              aria-label="감소"
            />
          ) : null}
        </div>

        <p className="mt-1 font-body2 text-text-muted">{item.message}</p>
        <p className="mt-2 font-caption text-text-placeholder">
          {formatNotificationTime(item.createdAt)}
        </p>
      </div>
    </li>
  );
}
