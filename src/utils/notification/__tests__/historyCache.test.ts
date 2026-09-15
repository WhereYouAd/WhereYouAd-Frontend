import { describe, expect, it } from "vitest";

import type { INotificationHistoryItem } from "@/types/notification/notification";

import {
  markAllNotificationRead,
  markNotificationRead,
  prependNotification,
  type TNotificationHistoryCache,
} from "@/utils/notification/historyCache";

const item = (id: number, isRead: boolean): INotificationHistoryItem => ({
  userNotificationId: id,
  title: `알림 ${id}`,
  message: "메시지",
  createdAt: "2026-09-15T00:00:00.000Z",
  type: "REPORT",
  isRead,
});

const cacheWith = (
  notifications: INotificationHistoryItem[],
): TNotificationHistoryCache => ({
  pages: [{ hasNext: false, nextCursor: null, notifications }],
  pageParams: [null],
});

describe("historyCache", () => {
  describe("markNotificationRead", () => {
    it("해당 알림만 읽음 처리한다", () => {
      const next = markNotificationRead(
        cacheWith([item(1, false), item(2, false)]),
        1,
      );
      expect(next.pages[0]?.notifications.map((n) => n.isRead)).toEqual([
        true,
        false,
      ]);
    });

    it("캐시가 없으면 빈 캐시를 반환한다", () => {
      expect(markNotificationRead(undefined, 1)).toEqual({
        pages: [],
        pageParams: [],
      });
    });
  });

  describe("markAllNotificationRead", () => {
    it("모든 알림을 읽음 처리한다", () => {
      const next = markAllNotificationRead(
        cacheWith([item(1, false), item(2, false)]),
      );
      expect(next.pages[0]?.notifications.every((n) => n.isRead)).toBe(true);
    });
  });

  describe("prependNotification", () => {
    it("빈 캐시에도 안읽음 알림을 넣어 뱃지가 바로 +1 될 수 있게 한다", () => {
      const next = prependNotification(undefined, item(9, false));
      expect(next.pages[0]?.notifications).toEqual([item(9, false)]);
      expect(next.pageParams).toEqual([null]);
    });

    it("첫 페이지 맨 앞에 새 알림을 붙인다", () => {
      const next = prependNotification(
        cacheWith([item(1, true)]),
        item(2, false),
      );
      expect(
        next.pages[0]?.notifications.map((n) => n.userNotificationId),
      ).toEqual([2, 1]);
    });

    it("같은 id면 중복으로 붙이지 않는다", () => {
      const existing = cacheWith([item(1, false)]);
      const next = prependNotification(existing, item(1, false));
      expect(next.pages[0]?.notifications).toHaveLength(1);
    });
  });
});
