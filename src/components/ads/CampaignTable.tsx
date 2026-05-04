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
  const visibleCampaigns = campaigns.filter(
    (project) => project.status !== "OVER",
  );

  return (
    <div className="w-full bg-white">
      {/* Table Header */}
      <div className="flex items-center px-7 py-3 border-b border-bg-disabled">
        <div className="w-[25%] tablet:w-[28%] font-body1 text-text-main">
          플랫폼
        </div>
        <div className="w-[40%] tablet:w-[34%] font-body1 text-text-main">
          캠페인 명
        </div>
        <div className="w-[35%] tablet:w-[38%] font-body1 text-text-main">
          <span className="tablet:hidden">예산 소진 현황</span>
          <span className="hidden tablet:inline">예산</span>
        </div>
      </div>

      {/* Row */}
      <ul className="divide-y divide-bg-disabled">
        {visibleCampaigns.length > 0 ? (
          visibleCampaigns.map((project) => (
            <CampaignRow
              key={project.projectId}
              {...project}
              onClick={() => onRowClick?.(project.projectId)}
            />
          ))
        ) : (
          <li className="py-20 text-center font-body2 text-text-placeholder">
            현재 표시할 캠페인이 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
}
