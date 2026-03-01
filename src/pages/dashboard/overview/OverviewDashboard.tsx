import { Fragment } from "react";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";

import { overviewMockData } from "./overview.mock";

export default function OverviewDashboard() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading3 text-text-main">통합 대시보드</h1>
          <p className="font-caption text-text-sub mt-1">
            데이터 기준 | 2026.01.06 09:13
          </p>
        </div>
        {/* TODO: AI 요약 버튼 */}
      </div>

      <div className="grid grid-cols-2 bg-white rounded-component-md border border-chart-inactive lg:flex">
        {overviewMockData.kpis.map((kpi, index) => (
          <Fragment key={kpi.title}>
            {index > 0 && (
              <div className="hidden w-px bg-bg-surface lg:my-5 lg:block" />
            )}
            <div className="relative flex-1">
              <StatCard className="border-0 rounded-none" {...kpi} />
              {index % 2 === 0 && (
                <div className="absolute right-0 top-4 bottom-4 w-px bg-bg-surface lg:hidden" />
              )}
              {index < 2 && (
                <div className="absolute bottom-0 left-4 right-4 h-px bg-bg-surface lg:hidden" />
              )}
            </div>
          </Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-4">
        <Card title="실시간 트래픽 변화" className="min-h-100" />
        <Card title="예산 소진 현황" className="min-h-100" />
      </div>

      <Card
        title="플랫폼별 비교"
        className="min-h-80"
        RightElement={<Button size="small">플랫폼 대시보드 보기</Button>}
      />
    </div>
  );
}
