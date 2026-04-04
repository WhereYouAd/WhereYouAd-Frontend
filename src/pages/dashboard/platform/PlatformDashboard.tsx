import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import ChartLegend from "@/components/common/chart/ChartLegend";
import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";
import PageHeader from "@/components/common/PageHeader";
import AdStatusChart from "@/components/dashboard/charts/AdStatusChart";
import PerformanceEfficiencyChart from "@/components/dashboard/charts/PerformanceEfficiencyChart";
import PlatformDetailCard from "@/components/dashboard/platform/PlatformDetailCard";
import {
  AdStatusChartSkeleton,
  BadgeSkeleton,
  PerformanceEfficiencyChartSkeleton,
  PlatformDetailCardSkeleton,
  TopPerformanceListSkeleton,
  TrafficChartSkeleton,
} from "@/components/dashboard/platform/skeleton/PlatformSkeleton";
import TopPerformanceList from "@/components/dashboard/platform/TopPerformanceList";

import {
  adStatusMock,
  performanceEfficiencyMock,
  roasRankingMock,
} from "./platformDashboard.mock";

import ChevronDownIcon from "@/assets/icon/chevron/chevron-up.svg?react";

export default function PlatformDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [isLoading, setIsLoading] = useState(true);

  const isAllView = selectedPlatform === "전체";

  const platformItems = [
    { label: "Google", onClick: () => setSelectedPlatform("Google") },
    { label: "NAVER", onClick: () => setSelectedPlatform("NAVER") },
    { label: "Meta", onClick: () => setSelectedPlatform("Meta") },
  ];

  // 로딩 시뮬레이션 (태스크 요구사항)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

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
              isLoading ? (
                <BadgeSkeleton className="w-28" />
              ) : (
                <Badge
                  variant="stopped"
                  size="sm"
                  className="text-text-auth-sub"
                >
                  ROAS 기준 상위 3
                </Badge>
              )
            }
            className="flex-1 min-h-67 flex flex-col"
          >
            {isLoading ? (
              <TopPerformanceListSkeleton />
            ) : (
              <TopPerformanceList rankings={roasRankingMock} />
            )}
          </Card>

          {/* 광고 소재 현황 */}
          <Card
            title="광고 소재 현황"
            description={
              <ChartLegend
                className="[&_div]:rounded-none"
                items={[
                  { label: "Google", colorClass: "bg-status-blue" },
                  { label: "NAVER", colorClass: "bg-status-green" },
                  { label: "Meta", colorClass: "bg-text-auth-sub" },
                ]}
              />
            }
            RightElement={
              isLoading ? (
                <BadgeSkeleton className="w-14" />
              ) : (
                <Badge
                  variant="stopped"
                  size="sm"
                  className="text-text-auth-sub"
                >
                  총 {adStatusMock.totalCount}개
                </Badge>
              )
            }
            className="flex-1 min-h-67 flex flex-col"
          >
            {isLoading ? (
              <AdStatusChartSkeleton />
            ) : (
              <AdStatusChart data={adStatusMock.providerCount} />
            )}
          </Card>

          {/* 플랫폼별 성과 효율 비교 */}
          <Card
            title="플랫폼별 성과 효율 비교"
            className="flex-1 min-h-67 flex flex-col pb-1"
            description={
              <ChartLegend
                items={[
                  { label: "클릭률", colorClass: "bg-status-blue" },
                  { label: "전환율", colorClass: "bg-text-auth-sub" },
                  { label: "노출수", colorClass: "bg-status-green" },
                ]}
              />
            }
          >
            {isLoading ? (
              <PerformanceEfficiencyChartSkeleton />
            ) : (
              <PerformanceEfficiencyChart data={performanceEfficiencyMock} />
            )}
          </Card>
        </div>

        {/* 실시간 트래픽 변화 */}
        <Card title="실시간 트래픽 변화" className="min-h-125">
          {isLoading ? <TrafficChartSkeleton /> : null}
        </Card>

        {/* 개별 플랫폼 상세 */}
        <div className="grid grid-cols-3 tablet:grid-cols-1 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <PlatformDetailCardSkeleton key={i} />
              ))
            : performanceEfficiencyMock.map((platform) => (
                <PlatformDetailCard key={platform.provider} data={platform} />
              ))}
        </div>
      </div>
    </section>
  );
}
