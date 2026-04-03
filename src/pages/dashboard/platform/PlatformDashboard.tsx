import { useState } from "react";
import { twMerge } from "tailwind-merge";

import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";
import PageHeader from "@/components/common/PageHeader";
import TopPerformanceList from "@/components/dashboard/platform/TopPerformanceList";

import { roasRankingMock } from "./platformDashboard.mock";

import ChevronDownIcon from "@/assets/icon/chevron/chevron-up.svg?react";

export default function PlatformDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState("전체");

  const isAllView = selectedPlatform === "전체";

  const platformItems = [
    { label: "Google", onClick: () => setSelectedPlatform("Google") },
    { label: "Naver", onClick: () => setSelectedPlatform("Naver") },
    { label: "Meta", onClick: () => setSelectedPlatform("Meta") },
  ];

  return (
    <section className="flex flex-col gap-8 w-full min-w-0">
      <PageHeader
        title="플랫폼 대시보드"
        description="데이터 기준 · 2026. 04. 03. 오전 09:13"
        actions={
          <div className="flex items-center gap-5">
            <Button
              type="button"
              size="small"
              variant={isAllView ? "primary" : "custom"}
              onClick={() => setSelectedPlatform("전체")}
              className={twMerge(
                "w-34 py-6 font-body1 rounded-component-md",
                !isAllView &&
                  "border border-bg-disabled bg-white text-text-sub hover:bg-bg-surface",
              )}
            >
              전체보기
            </Button>
            <DropdownMenu
              menuClassName="w-34"
              trigger={
                <Button
                  type="button"
                  size="small"
                  variant={!isAllView ? "primary" : "custom"}
                  className={twMerge(
                    "flex items-center w-34 py-6 rounded-component-md",
                    isAllView &&
                      "border border-bg-disabled bg-white text-text-sub hover:bg-bg-surface",
                  )}
                >
                  <span
                    className={twMerge(
                      "font-body1",
                      isAllView ? "text-text-sub" : "text-white",
                    )}
                  >
                    {isAllView ? "플랫폼 선택" : selectedPlatform}
                  </span>
                  <ChevronDownIcon
                    className={twMerge(
                      "w-3 h-3 rotate-180 ml-2 transition-transform",
                      isAllView ? "text-text-sub" : "text-white",
                    )}
                  />
                </Button>
              }
              items={platformItems}
            />
          </div>
        }
      />

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-3 tablet:grid-cols-1 gap-6">
          {/* 성과 우수 플랫폼 */}
          <Card
            title="성과 우수 플랫폼"
            RightElement={
              <Badge variant="stopped" size="sm" className="text-text-auth-sub">
                ROAS 기준 상위 3
              </Badge>
            }
            className="flex-1 min-h-40"
          >
            <TopPerformanceList rankings={roasRankingMock} />
          </Card>

          {/* 광고 소재 현황 */}
          <Card title="광고 소재 현황" className="flex-1 min-h-40" />

          {/* 플랫폼별 성과 기여도 */}
          <Card title="플랫폼별 성과 기여도" className="flex-1 min-h-40" />
        </div>

        {/* 실시간 트래픽 변화 */}
        <Card title="실시간 트래픽 변화" className="min-h-125" />

        {/* 개별 플랫폼 상세 */}
        <div className="grid grid-cols-3 tablet:grid-cols-1 gap-6">
          <Card title="Google" className="min-h-80" />
          <Card title="Naver" className="min-h-80" />
          <Card title="Meta" className="min-h-80" />
        </div>
      </div>
    </section>
  );
}
