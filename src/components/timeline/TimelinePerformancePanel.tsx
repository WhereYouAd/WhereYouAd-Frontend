import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { PLATFORM_MAP } from "@/types/dashboard/provider";
import type { ITimelineSummaryPanelData } from "@/types/timeline/summary";
import type { TTimelineViewUnit } from "@/types/timeline/ui";
import { TIMELINE_PERFORMANCE_STATUS_STYLE } from "@/constants/timeline/statusStyle";

import TimelinePeriodSelector from "./TimelinePeriodSelector";
import Badge from "../common/badge/Badge";
import Button from "../common/button/Button";
import Card from "../common/card/Card";
import StatCard from "../common/card/StatCard";
import ChartLegend from "../common/chart/ChartLegend";
import Drawer from "../common/drawer/Drawer";
import { DropdownMenu } from "../common/dropdownmenu/DropdownMenu";
import ProgressBar from "../common/progressbar/ProgressBar";
import { Skeleton } from "../common/skeleton/Skeleton";

import ChevronRightIcon from "@/assets/icon/chevron/chevron-right.svg?react";
import MoreIcon from "@/assets/icon/common/more.svg?react";
import TrashIcon from "@/assets/icon/common/trash.svg?react";

type TAiSummaryUiState = "idle" | "loading" | "done";

const AI_SUMMARY_LOADING_MS = 1500;

interface ITimelinePerformancePanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: ITimelineSummaryPanelData;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

function formatMetricValue(value: number, unit?: string) {
  const formatted = Number.isInteger(value)
    ? value.toLocaleString()
    : value.toFixed(2);
  return unit ? `${formatted}${unit}` : formatted;
}

function formatChangeRate(changeRate: number) {
  return `${Math.abs(changeRate * 100).toFixed(1)}%`;
}

export default function TimelinePerformancePanel({
  isOpen,
  onClose,
  data,
  onEdit,
  onDelete,
  className,
}: ITimelinePerformancePanelProps) {
  const [aiState, setaiState] = useState<TAiSummaryUiState>("idle");
  const [viewUnit, setViewUnit] = useState<TTimelineViewUnit>("WEEK");

  const statusStyle = TIMELINE_PERFORMANCE_STATUS_STYLE[data.performanceStatus];

  //패널 열릴때, 서버에 요약있으면 done, 없으면 idle
  useEffect(() => {
    if (!isOpen) return;
    setaiState(data.aiSummary.trim() ? "done" : "idle");
  }, [isOpen, data.aiSummary]);

  const handleGenerateSummary = () => {
    setaiState("loading");
    window.setTimeout(() => {
      setaiState("done");
    }, AI_SUMMARY_LOADING_MS);
  };

  const menuItems = [
    {
      label: "삭제하기",
      icon: <TrashIcon className="text-info-red h-4 w-4" />,
      onClick: () => onDelete?.(),
    },
    {
      label: "수정하기",
      onClick: () => onEdit?.(),
    },
  ];
  return (
    <div>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        hideHeader
        className={className}
      >
        <div>
          <header>
            <div>
              <button
                type="button"
                onClick={onClose}
                aria-label="요약 패널 닫기"
              >
                <span>
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </span>
              </button>
              <DropdownMenu
                trigger={<MoreIcon className="h-4 w-4 text-text-disabled" />}
                aria-label="더보기"
                items={menuItems}
              />
            </div>
            <h2>{data.timelineName}</h2>
            <dl>
              <dt>기간</dt>
              <dd>{data.periodLabel}</dd>
              <dt>성과 상태</dt>
              <dd>
                <span>
                  <span
                    className={twMerge(
                      "h-1.5 w-1.5 rounded-full",
                      statusStyle.dot,
                    )}
                  />
                </span>
              </dd>
              <dt>성과 지표</dt>
              <dd>
                {data.metrics.map((metric) => (
                  <Badge key={metric.label} variant="surface">
                    {metric.label}
                  </Badge>
                ))}
              </dd>
            </dl>
          </header>

          {/* AI 요약 파트 */}
          <section>
            {aiState === "idle" && (
              <Button
                type="button"
                variant="secondary"
                size="small"
                fullWidth
                onClick={handleGenerateSummary}
              >
                요약하기 생성
              </Button>
            )}

            {aiState === "loading" && (
              <div aria-busy="true">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            )}

            {aiState === "done" && data.aiSummary && <p>{data.aiSummary}</p>}
          </section>

          {/* KPI 카드 */}
          <section>
            {data.metrics.map((metric) => (
              <StatCard
                key={metric.metric}
                title={metric.label}
                value={formatMetricValue(metric.value, metric.unit)}
                compact
                trend={
                  metric.changeRate !== undefined
                    ? {
                        direction: metric.changeRate >= 0 ? "up" : "down",
                        value: formatChangeRate(metric.changeRate),
                      }
                    : undefined
                }
                className="p-5"
              />
            ))}
          </section>

          {/* 차트 */}
          <Card
            title="일별 변화 추이"
            description={
              <ChartLegend
                items={[
                  { label: "클릭수", colorClass: "bg-primary-400" },
                  { label: "예산 수정 시점", colorClass: "bg-info-red" },
                ]}
              />
            }
            RightElement={
              <TimelinePeriodSelector
                viewUnit={viewUnit}
                periodLabel="오늘"
                onViewUnitChange={setViewUnit}
                onPrevPeriod={() => {}}
                onNextPeriod={() => {}}
              />
            }
          >
            <div className="font-caption text-text-muted">
              <span>차트 영역 (ApexChart 연동예정)</span>
            </div>
          </Card>

          {/* 플랫폼 기여 파트 */}
          <section>
            <h3 className="font-heading4 text-text-title">플랫폼 기여 정보</h3>
            {data.platformShare.map(({ provider, contributionRate }) => (
              <div key={provider} className="flex items-center gap-3">
                <span>{PLATFORM_MAP[provider]}</span>
                <ProgressBar value={Math.round(contributionRate * 100)} />
              </div>
            ))}
          </section>
        </div>
      </Drawer>
    </div>
  );
}
