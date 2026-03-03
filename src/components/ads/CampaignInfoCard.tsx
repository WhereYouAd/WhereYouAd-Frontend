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
      <div className="flex flex-col gap-4 w-full px-5">
        {/* 예산 현황 */}
        <div className="flex justify-between items-center">
          <Badge variant="running" size="sm" className={badgeStyle}>
            예산 현황
          </Badge>
          <span className="text-xl font-heading3 text-text-main truncate ml-4">
            {budget}
          </span>
        </div>

        {/* 등록 날짜 */}
        <div className="flex justify-between items-center">
          <Badge variant="running" size="sm" className={badgeStyle}>
            등록 날짜
          </Badge>
          <span className="text-xl font-heading3 text-text-main">{date}</span>
        </div>
      </div>
    </InfoCard>
  );
}
