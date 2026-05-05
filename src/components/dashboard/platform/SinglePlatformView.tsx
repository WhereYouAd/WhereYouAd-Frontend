import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import Badge from "@/components/common/badge/Badge";
import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";
import ChartLegend from "@/components/common/chart/ChartLegend";
import { Skeleton } from "@/components/common/skeleton/Skeleton";
import BudgetGaugeChart, {
  getBudgetStatus,
  statusBadgeVariant,
} from "@/components/dashboard/charts/BudgetGaugeChart";
import PlatformDetailTable from "@/components/dashboard/platform/PlatformDetailTable";

import AiButtonSvg from "@/assets/logo/service-logo/ai-요약버튼.svg?react";
import GoogleLogo from "@/assets/logo/social-logo/wordmark/google-wordmark.svg?react";
import MetaLogo from "@/assets/logo/social-logo/wordmark/meta-wordmark.svg?react";
import NaverLogo from "@/assets/logo/social-logo/wordmark/naver-wordmark.svg?react";
import {
  budgetStatusMock,
  performanceEfficiencyMock,
  platformDailyPerformanceMock,
} from "@/pages/dashboard/platform/platformDashboard.mock";

const PLATFORM_LOGOS: Record<
  string,
  { component: React.FC<React.SVGProps<SVGSVGElement>>; className: string }
> = {
  GOOGLE: { component: GoogleLogo, className: "h-10" },
  NAVER: { component: NaverLogo, className: "h-6 ml-2" },
  META: { component: MetaLogo, className: "h-6 ml-2" },
};

interface ISinglePlatformViewProps {
  platform: string;
  isLoading: boolean;
}

export default function SinglePlatformView({
  platform,
  isLoading,
}: ISinglePlatformViewProps) {
  const [viewRange, setViewRange] = React.useState<7 | 30>(7);

  const platformData = useMemo(() => {
    return performanceEfficiencyMock.find(
      (p) => p.provider.toUpperCase() === platform.toUpperCase(),
    );
  }, [platform]);

  const kpis = useMemo(() => {
    if (!platformData) return [];

    return [
      {
        title: "클릭수(CTR)",
        value: platformData.clicks.toLocaleString(),
        trend: {
          direction: platformData.clickChangeRate >= 0 ? "up" : "down",
          value: `${Math.abs(platformData.clickChangeRate * 100).toFixed(2)}%`,
        },
      },
      {
        title: "노출수",
        value: platformData.impressions.toLocaleString(),
        trend: {
          direction: platformData.impressionChangeRate >= 0 ? "up" : "down",
          value: `${Math.abs(platformData.impressionChangeRate * 100).toFixed(2)}%`,
        },
      },
      {
        title: "전환율(CVR)",
        value: `${platformData.conversion}%`,
        trend: {
          direction: platformData.cvrChangeRate >= 0 ? "up" : "down",
          value: `${Math.abs(platformData.cvrChangeRate * 100).toFixed(2)}%`,
        },
      },
      {
        title: "광고비 대비 매출(ROAS)",
        value: `${platformData.ROAS}%`,
        trend: {
          direction: platformData.ROASChangeRate >= 0 ? "up" : "down",
          value: `${Math.abs(platformData.ROASChangeRate * 100).toFixed(2)}%`,
        },
      },
    ];
  }, [platformData]);

  const logoInfo = PLATFORM_LOGOS[platform.toUpperCase()];

  const budget = useMemo(() => {
    const data = budgetStatusMock.find(
      (b) => b.providerType.toUpperCase() === platform.toUpperCase(),
    );
    if (!data) return null;

    return {
      totalBudget: data.totalBudget,
      spent: data.totalSpend,
      warningThreshold: 50,
      dangerThreshold: 75,
    };
  }, [platform]);

  const budgetPct = budget
    ? Math.round((budget.spent / budget.totalBudget) * 100)
    : 0;

  const budgetStatus = budget
    ? getBudgetStatus(
        budgetPct,
        budget.warningThreshold,
        budget.dangerThreshold,
      )
    : null;

  const dailyData = useMemo(() => {
    const key = platform?.toUpperCase();
    const allData = key ? platformDailyPerformanceMock[key] || [] : [];
    return allData.slice(0, viewRange);
  }, [platform, viewRange]);

  return (
    <div className="flex flex-col gap-8">
      {/* platform header */}
      <div className="flex items-center justify-between">
        <div className="h-10 flex items-center">
          {logoInfo ? (
            <logoInfo.component
              className={twMerge("w-auto", logoInfo.className)}
            />
          ) : (
            <h2 className="text-3xl font-bold text-text-main">{platform}</h2>
          )}
        </div>

        <button
          type="button"
          aria-label="AI 요약 보기"
          className="p-2 -mr-2 outline-none cursor-pointer"
        >
          <AiButtonSvg className="h-6 w-auto" />
        </button>
      </div>

      {/* top */}
      <div className="grid grid-cols-4 tablet:grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-7 flex flex-col gap-4 border border-white/40"
              >
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            ))
          : kpis.map((kpi) => (
              <StatCard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                trend={kpi.trend as any}
              />
            ))}
      </div>

      {/* mid */}
      <div className="grid grid-cols-3 tablet:grid-cols-1 gap-6">
        <Card
          title="실시간 트래픽 변화"
          className="col-span-2 tablet:col-span-1 min-h-125 flex flex-col"
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <Badge variant="running">Coming Soon</Badge>
            <p className="text-text-sub font-caption text-center">
              실시간 클릭 트래픽 모니터링 기능을 준비하고 있습니다.
            </p>
          </div>
        </Card>

        <Card
          title="예산 소진 현황"
          className="col-span-1 tablet:col-span-1 h-full min-h-125 flex flex-col"
          description={
            <ChartLegend
              items={[
                { label: "안정", colorClass: "bg-status-green" },
                { label: "주의", colorClass: "bg-status-yellow" },
                { label: "위험", colorClass: "bg-status-red" },
              ]}
            />
          }
          RightElement={
            budgetStatus && (
              <Badge
                variant={statusBadgeVariant[budgetStatus]}
                size="sm"
                className="px-2"
              >
                {budgetStatus}
              </Badge>
            )
          }
        >
          {budget ? (
            <div className="-mt-6 flex-1 flex flex-col">
              <BudgetGaugeChart {...budget} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-sub">
              데이터가 없습니다.
            </div>
          )}
        </Card>
      </div>

      {/* bottom */}
      <Card
        title="광고 현황 상세"
        className="min-h-150"
        RightElement={
          <div className="flex border border-bg-disabled rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setViewRange(7)}
              className={twMerge(
                "px-4 py-2 font-body2 transition-all duration-200",
                viewRange === 7
                  ? "bg-status-blue text-white shadow-sm"
                  : "bg-white text-text-sub hover:bg-bg-surface",
              )}
            >
              최근 7일
            </button>
            <button
              type="button"
              onClick={() => setViewRange(30)}
              className={twMerge(
                "px-4 py-2 font-body2 border-l border-bg-disabled transition-all duration-200",
                viewRange === 30
                  ? "bg-status-blue text-white shadow-sm"
                  : "bg-white text-text-sub hover:bg-bg-surface",
              )}
            >
              최근 30일
            </button>
          </div>
        }
      >
        <PlatformDetailTable data={dailyData} />
      </Card>
    </div>
  );
}
