import CampaignRow from "./CampaignRow";

import { MOCK_CAMPAIGNS } from "@/pages/ads/list/campaign.mock";

interface ICampaignTableProps {
  onRowClick?: (id: number) => void;
}

export default function CampaignTable({ onRowClick }: ICampaignTableProps) {
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
          {MOCK_CAMPAIGNS.map((campaign) => (
            <CampaignRow
              key={campaign.id}
              {...campaign}
              onClick={() => onRowClick?.(campaign.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
