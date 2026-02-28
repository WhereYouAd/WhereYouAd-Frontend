import type { ICampaign } from "@/types/ads/campaign";

import CampaignRow from "./CampaignRow";

export default function CampaignTable() {
  const campaigns: ICampaign[] = [
    {
      id: 1,
      platforms: ["kakao", "google", "naver"],
      name: "봄 프로모션 캠페인",
      status: "syncing",
      statusText: "동기화 중",
      progress: 65,
    },
    {
      id: 2,
      platforms: ["kakao", "naver"],
      name: "폭염 대비 냉장 가전 얼리버드 특가 프로모션",
      status: "syncing",
      statusText: "동기화 중",
      progress: 32,
    },
    {
      id: 3,
      platforms: ["kakao"],
      name: "가을 감성 FW 시즌 신상 코트 선주문 캐시백 이벤트",
      status: "inactive",
      statusText: "미동기화",
      progress: 0,
    },
    {
      id: 4,
      platforms: ["google", "naver"],
      name: "크리스마스 홈파티 소품 대방출 및 연말 결산 세일",
      status: "success",
      statusText: "완료",
      progress: 98,
    },
  ];

  return (
    <div className="w-full bg-white overflow-x-auto">
      <div className="min-w-180">
        {/* Table Header */}
        <div className="flex items-center px-7 py-3 border-b border-bg-disabled">
          <div className="w-[20%] font-body1 text-text-main">플랫폼</div>
          <div className="w-[35%] font-body1 text-text-main">캠페인 명</div>
          <div className="w-[15%] font-body1 text-text-main">동기화 상태</div>
          <div className="w-[30%] font-body1 text-text-main">
            예산 소진 현황
          </div>
        </div>

        {/* Row */}
        <ul className="divide-y divide-bg-disabled">
          {campaigns.map((campaign) => (
            <CampaignRow
              key={campaign.id}
              platforms={campaign.platforms}
              name={campaign.name}
              status={campaign.status}
              statusText={campaign.statusText}
              progress={campaign.progress}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
