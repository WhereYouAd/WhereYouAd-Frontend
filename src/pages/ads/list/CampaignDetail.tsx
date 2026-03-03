import CampaignInfoCard from "@/components/ads/CampaignInfoCard";
import PlatformCard from "@/components/ads/PlatformCard";
import Badge from "@/components/common/badge/Badge";

export default function CampaignDetail() {
  return (
    <section className="flex flex-col bg-white rounded-component-lg min-h-[90vh] overflow-x-auto">
      <div className="flex-1 py-15 px-10 md:px-15 lg:px-25 ">
        <div className="flex flex-col gap-10 w-full">
          {/* header */}
          <header className="flex flex-col gap-5">
            <div className="flex items-center gap-4 flex-nowrap whitespace-nowrap overflow-hidden">
              <h1 className="font-heading2 text-text-main mr-3">
                봄 프로모션 캠페인
              </h1>
              <Badge variant="running" size="sm">
                운영 중
              </Badge>
            </div>
            <div className="border-l-3 border-text-auth-sub pl-4 py-1">
              <p className="text-text-auth-sub font-body1">
                봄 시즌 매출을 키우는 프로모션이에요.
                <br />
                따뜻한 날씨에 맞춰 구매 전환을 높이는 캠페인으로, 이번 캠페인의
                목표 매출은 1,200만 원이에요.
              </p>
            </div>
          </header>

          {/* card section */}
          <div className="flex flex-wrap gap-7 w-full">
            <CampaignInfoCard
              budget="31,000,000"
              date="2026.01.31"
              className="flex-1 min-w-[320px] max-w-110 w-full"
            />
            <PlatformCard
              platforms={["kakao", "google", "naver"]}
              className="flex-1 min-w-[320px] max-w-110 w-full"
            />
          </div>

          {/* ads list */}
          <div className="min-w-180" />
          {/* control box */}
        </div>
      </div>
    </section>
  );
}
