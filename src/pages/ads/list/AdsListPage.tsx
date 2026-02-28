import CampaignTable from "@/components/ads/CampaignTable";

export default function AdsListPage() {
  return (
    <section className="flex flex-col gap-16 bg-white rounded-component-lg py-15 px-25 min-h-[90vh]">
      <header className="w-full flex flex-col">
        <h1 className="font-heading2 text-text-main">광고 운영 관리</h1>
        <p className="font-body2 text-text-placeholder mt-3">
          연결된 캠페인 및 광고 소재의 상세 운영 설정을 확인하고 제어할 수
          있습니다.
        </p>
      </header>
      {/* 테이블 */}
      <div className="w-full flex flex-col">
        <CampaignTable />
      </div>
      {/* 하단 배너 */}
      <div />
    </section>
  );
}
