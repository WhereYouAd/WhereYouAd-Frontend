import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";
import { Skeleton } from "@/components/common/skeleton/Skeleton";

import AiButtonSvg from "@/assets/logo/service-logo/ai-요약버튼.svg?react";
import GoogleLogo from "@/assets/logo/social-logo/wordmark/google-wordmark.svg?react";
import MetaLogo from "@/assets/logo/social-logo/wordmark/meta-wordmark.svg?react";
import NaverLogo from "@/assets/logo/social-logo/wordmark/naver-wordmark.svg?react";
import { performanceEfficiencyMock } from "@/pages/dashboard/platform/platformDashboard.mock";

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
          className="group relative p-2 -mr-2 rounded-2xl outline-none cursor-pointer overflow-hidden"
        >
          <AiButtonSvg className="[&>path:nth-of-type(4)]:transition-transform [&>path:nth-of-type(4)]:duration-300 group-hover:[&>path:nth-of-type(4)]:translate-x-0.5 [&>path:nth-of-type(5)]:transition-transform [&>path:nth-of-type(5)]:duration-300 group-hover:[&>path:nth-of-type(5)]:translate-x-1" />
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
        <Card title="실시간 트래픽 변화" className="col-span-2 min-h-110">
          <div className="text-text-sub">라인 차트</div>
        </Card>

        <Card title="예산 소진 현황" className="col-span-1 min-h-110">
          <div className="text-text-sub">게이지 차트</div>
        </Card>
      </div>

      {/* bottom */}
      <Card
        title="실시간 트래픽 변화"
        className="min-h-100"
        RightElement={
          <div className="flex border border-bg-disabled rounded-lg overflow-hidden">
            <button className="px-4 py-2 bg-brand-main text-text-sub font-body2">
              최근 7일
            </button>
            <button className="px-4 py-2 bg-white text-text-sub font-body2 border-l border-bg-disabled">
              최근 30일
            </button>
          </div>
        }
      >
        <div className="text-text-sub mt-6">테이블</div>
      </Card>
    </div>
  );
}
