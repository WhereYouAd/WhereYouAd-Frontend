import { useNavigate } from "react-router-dom";

import CampaignTable from "@/components/ads/CampaignTable";
import ControlBox from "@/components/common/controlbox/ControlBox";

export default function AdsListPage() {
  const navigate = useNavigate();
  const handleCampaignClick = (id: number) => {
    navigate(`/ads/${id}`);
  };

  return (
    <section className="flex flex-col overflow-hidden bg-white rounded-component-lg min-h-[90vh]">
      <div className="flex-1 overflow-x-auto py-15 px-10 md:px-18 lg:px-25">
        <div className="flex flex-col gap-16 min-w-180">
          <header className="w-full flex flex-col">
            <h1 className="font-heading2 text-text-main">광고 운영 관리</h1>
            <p className="font-body2 text-text-placeholder mt-3">
              연결된 캠페인 및 광고 소재의 상세 운영 설정을 확인하고 제어할 수
              있습니다.
            </p>
          </header>
          {/* 테이블 */}
          <div className="w-full flex flex-col">
            <CampaignTable onRowClick={(id) => handleCampaignClick(id)} />
          </div>
          {/* 하단 배너 */}
          <div className="w-full flex flex-col">
            <ControlBox
              title="캠페인 통합 운영 제어"
              description={`여러 광고 플랫폼의 캠페인을 하나로 묶어 성과와 운영 상태를 통합 관리합니다.\n광고 플랫폼 로그인 후 캠페인을 불러와 연결합니다.`}
              buttonText="캠페인 통합 연동하기"
              onButtonClick={() => console.log("페이지 이동")}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div />
    </section>
  );
}
