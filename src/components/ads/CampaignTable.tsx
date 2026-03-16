import CampaignRow from "./CampaignRow";

import { MOCK_CAMPAIGNS } from "@/pages/ads/list/campaign.mock";

interface ICampaignTableProps {
  onRowClick?: (id: number) => void;
}

export default function CampaignTable({ onRowClick }: ICampaignTableProps) {
  return (
    <div className="w-full bg-white">
      {/* Table Header */}
      <div className="flex items-center px-7 py-3 border-b border-bg-disabled">
        <div className="w-[20%] tablet:w-[22%] font-body1 text-text-main">
          플랫폼
        </div>
        <div className="w-[35%] tablet:w-[28%] font-body1 text-text-main">
          캠페인 명
        </div>
        <div className="w-[15%] tablet:w-[18%] font-body1 text-text-main">
          <span className="tablet:hidden">동기화 상태</span>
          <span className="hidden tablet:inline">상태</span>
        </div>
        <div className="w-[30%] tablet:w-[32%] font-body1 text-text-main">
          <span className="tablet:hidden">예산 소진 현황</span>
          <span className="hidden tablet:inline">예산</span>
        </div>
      </div>

      {/* Row */}
      <ul className="divide-y divide-bg-disabled">
        {MOCK_CAMPAIGNS.map((campaign) => (
          <CampaignRow
            key={campaign.id}
            {...campaign}
            onClick={() => onRowClick?.(campaign.id)}
          />
        ))}
      </ul>
    </div>
  );
}
