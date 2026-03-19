import type { ICampaignDetail } from "@/types/ads/campaign";

export const MOCK_CAMPAIGNS: ICampaignDetail[] = [
  {
    projectId: 1,
    name: "봄 프로모션 캠페인",
    providers: ["kakao", "google", "naver"],
    status: "ON_GOING",
    budgetUsageRate: 65,
    budget: 31000000,
    createdAt: "2026.01.31",
    description:
      "봄 시즌 매출을 키우는 프로모션이에요.\n따뜻한 날씨에 맞춰 구매 전환을 높이는 캠페인으로, 이번 캠페인의 목표 매출은 1,200만 원이에요.",

    ads: [
      {
        id: 101,
        name: "봄 맞이 20% 할인 배너 A",
        runStatus: "running",
        runStatusText: "운영 중",
        platform: ["google"],
        description:
          "봄을 맞이하여 20%를 할인하는 배너입니다.\n봄을 맞이하여 20%를 할인하는 배너입니다.\n봄을 맞이하여 20%를 할인하는 배너입니다.",
        tags: ["남성", "여성", "10대", "20대", "광주", "전라", "충청"],
        link: "https://github.com/WhereYouAd",
      },
      {
        id: 102,
        name: "신규회원 쿠폰 5,000원 지급",
        runStatus: "stopped",
        runStatusText: "중단",
        platform: ["google"],
        description:
          "신규 가입자 유치를 위한 5,000원 할인 쿠폰 지급 이벤트 광고 소재입니다.",
        tags: ["전체"],
        link: "https://github.com/WhereYouAd",
      },
      {
        id: 103,
        name: "20-30 여성 타겟 봄 프로모션",
        runStatus: "stopped",
        runStatusText: "중단",
        platform: ["kakao"],
        description: "20대, 30대 여성을 대상으로 하는 봄 프로모션입니다.",
        tags: ["20대", "30대", "여성"],
        link: "https://github.com/WhereYouAd",
      },
      {
        id: 104,
        name: "30대 남성 타겟 봄 프로모션",
        runStatus: "stopped",
        runStatusText: "중단",
        platform: ["naver"],
        description: "30대 남성을 대상으로 하는 봄 프로모션입니다.",
        tags: ["30대", "남성"],
        link: "https://github.com/WhereYouAd",
      },
      {
        id: 105,
        name: "10-20 호남권 타겟 봄 프로모션",
        runStatus: "running",
        runStatusText: "운영 중",
        platform: ["naver"],
        description:
          "해당 광고는 10-20대 전체 대상으로 호남지방에 집중적으로 진행하였습니다.\n그리고 광고는 어쩌고저쩌고 프로모션으로써 학생/대학생이 주로 클릭할것으로 예상됩니다.",
        tags: ["10대", "20대", "전체", "광주", "전라"],
        link: "https://github.com/WhereYouAd",
      },
    ],
  },
  {
    projectId: 2,
    providers: ["kakao", "naver"],
    name: "폭염 대비 냉장 가전 얼리버드 특가 프로모션",
    status: "PAUSED",
    budgetUsageRate: 32,
    budget: 31000000,
    createdAt: "2026.01.31",
    description:
      "봄 시즌 매출을 키우는 프로모션이에요.\n따뜻한 날씨에 맞춰 구매 전환을 높이는 캠페인으로, 이번 캠페인의 목표 매출은 1,200만 원이에요.",

    ads: [],
  },
  {
    projectId: 3,
    providers: ["kakao"],
    name: "가을 감성 FW 시즌 신상 코트 선주문 캐시백 이벤트",
    status: "PAUSED",
    budgetUsageRate: 0,
    budget: 31000000,
    createdAt: "2026.01.31",
    description:
      "봄 시즌 매출을 키우는 프로모션이에요.\n따뜻한 날씨에 맞춰 구매 전환을 높이는 캠페인으로, 이번 캠페인의 목표 매출은 1,200만 원이에요.",

    ads: [],
  },
];
