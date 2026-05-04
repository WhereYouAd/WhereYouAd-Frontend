import InfoCard from "@/components/common/card/InfoCard";

import Badge from "../common/badge/Badge";

interface ICampaignInfoCardProps {
  budget: string;
  date: string;
  className?: string;
}

export default function CampaignInfoCard({
  budget,
  date,
  className,
}: ICampaignInfoCardProps) {
  const badgeStyle = "border-none bg-bg-disabled text-text-sub";
  return (
    <InfoCard title="캠페인 정보" className={className}>
      <div className="flex flex-col h-full justify-between">
        {/* 예산 현황 */}
        <div className="flex items-center justify-between w-full">
          <Badge variant="running" size="sm" className={badgeStyle}>
            예산 현황
          </Badge>
          <span className="text-xl font-heading3 text-text-main truncate ml-16">
            {budget}
          </span>
        </div>

        {/* 등록 날짜 */}
        <div className="flex items-center justify-between w-full">
          <Badge variant="running" size="sm" className={badgeStyle}>
            등록 날짜
          </Badge>
          <span className="text-xl font-heading3 text-text-main ml-16">
            {date}
          </span>
        </div>
      </div>
    </InfoCard>
  );
}
