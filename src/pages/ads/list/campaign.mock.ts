import type { TPlatform } from "@/types/ads/campaign";

export interface ICampaign {
  id: number;
  name: string;
  platforms: TPlatform[];
  status: "syncing" | "success" | "inactive";
  statusText: string;
  progress: number;
  budget: string;
  startDate: string;
  description?: string;
}

export const MOCK_CAMPAIGNS: ICampaign[] = [
  {
    id: 1,
    name: "봄 프로모션 캠페인",
    platforms: ["kakao", "google", "naver"],
    status: "success",
    statusText: "완료",
    progress: 65,
    budget: "31,000,000",
    startDate: "2026.01.31",
    description:
      "봄 시즌 매출을 키우는 프로모션이에요.따뜻한 날씨에 맞춰 구매 전환을 높이는 캠페인으로, 이번 캠페인의 목표 매출은 1,200만 원이에요.",
  },
  {
    id: 2,
    platforms: ["kakao", "naver"],
    name: "폭염 대비 냉장 가전 얼리버드 특가 프로모션",
    status: "syncing",
    statusText: "동기화 중",
    progress: 32,
    budget: "31,000,000",
    startDate: "2026.01.31",
    description:
      "봄 시즌 매출을 키우는 프로모션이에요.따뜻한 날씨에 맞춰 구매 전환을 높이는 캠페인으로, 이번 캠페인의 목표 매출은 1,200만 원이에요.",
  },
  {
    id: 3,
    platforms: ["kakao"],
    name: "가을 감성 FW 시즌 신상 코트 선주문 캐시백 이벤트",
    status: "inactive",
    statusText: "미동기화",
    progress: 0,
    budget: "31,000,000",
    startDate: "2026.01.31",
    description:
      "봄 시즌 매출을 키우는 프로모션이에요.따뜻한 날씨에 맞춰 구매 전환을 높이는 캠페인으로, 이번 캠페인의 목표 매출은 1,200만 원이에요.",
  },
  {
    id: 4,
    platforms: ["google", "naver"],
    name: "크리스마스 홈파티 소품 대방출 및 연말 결산 세일",
    status: "success",
    statusText: "완료",
    progress: 98,
    budget: "31,000,000",
    startDate: "2026.01.31",
    description:
      "봄 시즌 매출을 키우는 프로모션이에요.따뜻한 날씨에 맞춰 구매 전환을 높이는 캠페인으로, 이번 캠페인의 목표 매출은 1,200만 원이에요.",
  },
];
