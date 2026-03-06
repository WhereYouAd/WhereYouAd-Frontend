import AdListTable from "@/components/ads/AdListTable";
import CampaignInfoCard from "@/components/ads/CampaignInfoCard";
import PlatformCard from "@/components/ads/PlatformCard";
import Badge from "@/components/common/badge/Badge";
import ControlBox from "@/components/common/controlbox/ControlBox";

import { MOCK_CAMPAIGNS } from "./campaign.mock";

export default function CampaignDetail() {
  const data = MOCK_CAMPAIGNS[0];
  return (
    <section className="flex flex-col justify-start bg-white rounded-component-lg min-h-[90vh] overflow-x-auto">
      <div className="flex-1 py-15 px-10 md:px-15 lg:px-25">
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

            <div className="mt-10">
              <ControlBox
                title="캠페인 운영 제어"
                description={`전체 플랫폼의 광고 운영을 한번에 제어할 수 있습니다.\n클릭 시 해당 캠페인 내 속한 모든 광고 소재의 운영이 즉시 중단됩니다.`}
                buttonText="중단하기"
                onButtonClick={() => {}}
                buttonDisabled={false}
                containerClassName="bg-status-red/7 border-status-red px-6 py-4 min-w-140 shrink-0"
                titleClassName="text-status-red font-heading3"
                descriptionClassName="font-body2 text-text-sub leading-relaxed"
                buttonSize="big"
                buttonClassName="font-body1 bg-status-red"
              />
            </div>
          </div>

          {/* control box */}
        </div>
      </div>
    </section>
  );
}
