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
    <div className="w-full bg-surface-100">
      {/* Table Header */}
      <div className="flex items-center border-b border-surface-400 px-7 py-3">
        <div className="w-[25%] font-body1 text-text-title tablet:w-[28%]">
          플랫폼
        </div>
        <div className="w-[40%] font-body1 text-text-title tablet:w-[34%]">
          캠페인 명
        </div>
        <div className="w-[35%] font-body1 text-text-title tablet:w-[38%]">
          <span className="tablet:hidden">예산 소진 현황</span>
          <span className="hidden tablet:inline">예산</span>
        </div>
      </div>

      {/* Row */}
      <ul>
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
