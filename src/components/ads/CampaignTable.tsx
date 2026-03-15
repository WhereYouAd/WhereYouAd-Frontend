import type { ICampaign } from "@/types/ads/campaign";

import CampaignRow from "./CampaignRow";

//import { MOCK_CAMPAIGNS } from "@/pages/ads/list/campaign.mock";

interface ICampaignTableProps {
  campaigns: ICampaign[];
  onRowClick?: (id: number) => void;
}

export default function CampaignTable({
  campaigns,
  onRowClick,
}: ICampaignTableProps) {
  return (
    <div className="w-full bg-white overflow-x-auto">
      <div className="min-w-180">
        {/* Table Header */}
        <div className="flex items-center px-7 py-3 border-b border-bg-disabled">
          <div className="w-[20%] font-body1 text-text-main">플랫폼</div>
          <div className="w-[50%] font-body1 text-text-main">캠페인 명</div>
          {/* <div className="w-[15%] font-body1 text-text-main">동기화 상태</div> */}
          <div className="w-[30%] font-body1 text-text-main">
            예산 소진 현황
          </div>
        </div>

        {/* Row */}
        <ul className="divide-y divide-bg-disabled">
          {campaigns && campaigns.length > 0 ? (
            campaigns
              .filter((project) => project.status !== "OVER")
              .map((project) => (
                <CampaignRow
                  key={project.projectId}
                  {...project}
                  onClick={() => onRowClick?.(project.projectId)}
                />
              ))
          ) : (
            <div className="py-20 text-center font-body2 text-text-placeholder">
              현재 캠페인이 없습니다.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
