import AdListTable from "@/components/ads/AdListTable";
import CampaignInfoCard from "@/components/ads/CampaignInfoCard";
import PlatformCard from "@/components/ads/PlatformCard";
import Badge from "@/components/common/badge/Badge";

import { MOCK_CAMPAIGNS } from "./campaign.mock";

export default function CampaignDetail() {
  const data = MOCK_CAMPAIGNS[0];
  return (
    <section className="flex flex-col bg-white rounded-component-lg min-h-[90vh] overflow-x-auto">
      <div className="flex-1 py-15 px-10 md:px-15 lg:px-25 ">
        <div className="flex flex-col gap-10 w-full">
          {/* header */}
          <header className="flex flex-col gap-5">
            <div className="flex items-center gap-4 flex-nowrap whitespace-nowrap overflow-hidden">
              <h1 className="font-heading2 text-text-main mr-3">{data.name}</h1>
              <Badge variant={data.runStatus} size="sm">
                {data.runStatusText}
              </Badge>
            </div>
            <div className="border-l-3 border-text-auth-sub pl-4 py-1">
              <p className="text-text-auth-sub font-body1 whitespace-pre-line leading-relaxed">
                {data.description}
              </p>
            </div>
          </header>

          {/* card section */}
          <div className="flex flex-wrap gap-7 w-full">
            <CampaignInfoCard
              budget={data.budget}
              date={data.startDate}
              className="flex-1 min-w-[320px] max-w-110 w-full"
            />
            <PlatformCard
              platforms={["kakao", "google", "naver"]}
              className="flex-1 min-w-[320px] max-w-110 w-full"
            />
          </div>

          {/* ads list */}
          <div className="w-full overflow-x-auto">
            <AdListTable ads={data.ads} />
          </div>

          {/* control box */}
        </div>
      </div>
    </section>
  );
}
