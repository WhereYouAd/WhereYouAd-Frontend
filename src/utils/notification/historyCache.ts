import type { InfiniteData } from "@tanstack/react-query";

import type {
  INotificationHistoryData,
  INotificationHistoryItem,
} from "@/types/notification/notification";

export type TNotificationHistoryCache = InfiniteData<
  INotificationHistoryData,
  string | null
>;

export function emptyHistoryCache(): TNotificationHistoryCache {
  return { pages: [], pageParams: [] };
}

//알림 단건 읽음 처리
export function markNotificationRead(
  cache: TNotificationHistoryCache | undefined,
  userNotificationId: number,
): TNotificationHistoryCache {
  if (!cache) return emptyHistoryCache();

  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      notifications: page.notifications.map((item) =>
        item.userNotificationId === userNotificationId
          ? { ...item, isRead: true }
          : item,
      ),
    })),
  };
}

//모두 읽음 처리
export function markAllNotificationRead(
  cache: TNotificationHistoryCache | undefined,
): TNotificationHistoryCache {
  if (!cache) return emptyHistoryCache();

  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      notifications: page.notifications.map((item) => ({
        ...item,
        isRead: true,
      })),
    })),
  };
}

//새알림 맨 위로 붙이기
export function prependNotification(
  cache: TNotificationHistoryCache | undefined,
  item: INotificationHistoryItem,
): TNotificationHistoryCache {
  // 캐시가 없거나 페이지 0장이면 새로운 페이지 만들어서 알림 추가
  if (!cache || cache.pages.length === 0) {
    return {
      pages: [{ hasNext: false, nextCursor: null, notifications: [item] }],
      pageParams: [null],
    };
  }

  // 이미 페이지가 있으면 페이지 맨위에 알림 추가
  const alreadyExists = cache.pages.some((page) =>
    page.notifications.some(
      (n) => n.userNotificationId === item.userNotificationId,
    ),
  );
  // 이미 있는 알림이면 캐시 그대로 반환
  if (alreadyExists) return cache;

  //firstPage = 1페이지 (최신알람들 있는곳)
  //restPages = 2페이지부터 나머지 다
  const [firstPage, ...restPages] = cache.pages;
  const [firstParam, ...restParams] = cache.pageParams;

  return {
    pages: [
      {
        ...firstPage,
        notifications: [item, ...firstPage.notifications], //[새알림, ...예전1페이지알림들]
      },
      ...restPages,
    ],
    pageParams: [firstParam, ...restParams],
  };
}
