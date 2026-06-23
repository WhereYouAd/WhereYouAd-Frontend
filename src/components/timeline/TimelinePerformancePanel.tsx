import type { FC, SVGProps } from "react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import type { TProviderType } from "@/types/dashboard/provider";
import type { ITimelineSummaryPanelData } from "@/types/timeline/summary";
import type { TTimelineViewUnit } from "@/types/timeline/ui";
import { TIMELINE_PERFORMANCE_STATUS_STYLE } from "@/constants/timeline/statusStyle";

import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import ChartLegend from "@/components/common/chart/ChartLegend";
import Drawer from "@/components/common/drawer/Drawer";
import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";
import { Skeleton } from "@/components/common/skeleton/Skeleton";
import TimelinePeriodSelector from "@/components/timeline/TimelinePeriodSelector";

import ChevronRightIcon from "@/assets/icon/chevron/chevron-right.svg?react";
import MoreIcon from "@/assets/icon/common/more.svg?react";
import TrashIcon from "@/assets/icon/common/trash.svg?react";
import GoogleWordmark from "@/assets/logo/social-logo/wordmark/google-wordmark.svg?react";
import MetaWordmark from "@/assets/logo/social-logo/wordmark/meta-wordmark.svg?react";
import NaverWordmark from "@/assets/logo/social-logo/wordmark/naver-wordmark.svg?react";

type TAiSummaryUiState = "idle" | "loading" | "done";

const AI_SUMMARY_LOADING_MS = 1500;

const CHART_PERIOD_LABELS = ["오늘", "1월 21일 → 25일", "1월 14일 → 20일"];

const SECTION_SHELL_CLASS =
  "rounded-3xl border border-surface-300/50 bg-surface-100 shadow-Soft-xs";

const SECTION_INNER_CLASS = "flex flex-col gap-5 px-6 py-6";

const SOFT_CARD_CLASS =
  "rounded-2xl border border-surface-300/40 bg-surface-100 shadow-Soft-xs";

const PLATFORM_WORDMARKS: Record<
  TProviderType,
  { Logo: FC<SVGProps<SVGSVGElement>>; className: string; label: string }
> = {
  GOOGLE: {
    Logo: GoogleWordmark,
    className: "h-5 w-auto",
    label: "Google",
  },
  NAVER: {
    Logo: NaverWordmark,
    className: "h-4 w-auto",
    label: "NAVER",
  },
  META: {
    Logo: MetaWordmark,
    className: "h-3.5 w-auto",
    label: "Meta",
  },
};

const SECTION_TITLE_CLASS = "font-heading4 text-text-title";

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

function PlatformContributionRow({
  provider,
  value,
}: {
  provider: TProviderType;
  value: number;
}) {
  const {
    Logo,
    className: logoClassName,
    label,
  } = PLATFORM_WORDMARKS[provider];
  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-5 w-24 shrink-0 items-center justify-start px-2">
        <Logo className={logoClassName} aria-label={label} />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-surface-300/80">
          <div
            className="h-full rounded-full bg-linear-to-r from-primary-300 via-primary-400 to-info-blue transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="min-w-14 shrink-0 px-2 text-right font-heading4 text-primary-400">
          {progress}%
        </span>
      </div>
    </div>
  );
}

export default function TimelinePerformancePanel({
  isOpen,
  onClose,
  data,
  onEdit,
  onDelete,
  className,
}: ITimelinePerformancePanelProps) {
  const [aiState, setAiState] = useState<TAiSummaryUiState>("idle");
  const [viewUnit, setViewUnit] = useState<TTimelineViewUnit>("WEEK");
  const [chartPeriodIndex, setChartPeriodIndex] = useState(0);

  const statusStyle = TIMELINE_PERFORMANCE_STATUS_STYLE[data.performanceStatus];
  const chartPeriodLabel =
    CHART_PERIOD_LABELS[chartPeriodIndex] ?? CHART_PERIOD_LABELS[0];

  useEffect(() => {
    if (!isOpen) return;
    setAiState(data.aiSummary.trim() ? "done" : "idle");
  }, [isOpen, data.aiSummary]);

  const handleGenerateSummary = () => {
    setAiState("loading");
    window.setTimeout(() => {
      setAiState("done");
    }, AI_SUMMARY_LOADING_MS);
  };

  const handlePrevChartPeriod = () => {
    setChartPeriodIndex((prev) =>
      prev === 0 ? CHART_PERIOD_LABELS.length - 1 : prev - 1,
    );
  };

  const handleNextChartPeriod = () => {
    setChartPeriodIndex((prev) =>
      prev === CHART_PERIOD_LABELS.length - 1 ? 0 : prev + 1,
    );
  };

  const menuItems = [
    {
      label: "삭제하기",
      icon: <TrashIcon className="h-4 w-4 text-info-red" />,
      danger: true,
      labelClassName: "text-info-red",
      onClick: () => onDelete?.(),
    },
    {
      label: "수정하기",
      onClick: () => onEdit?.(),
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} hideHeader className={className}>
      <div className="flex flex-col gap-7 px-7 pb-10 pt-6">
        {/* 헤더 */}
        <header className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              aria-label="요약 패널 닫기"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-surface-200"
            >
              <span className="flex items-center -space-x-2 text-text-disabled">
                <ChevronRightIcon className="h-3.5 w-3.5" />
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </span>
            </button>
            <DropdownMenu
              trigger={<MoreIcon className="h-4 w-4 text-text-disabled" />}
              aria-label="더보기"
              items={menuItems}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-surface-200"
            />
          </div>

          <h2 className="font-heading2 text-text-title">{data.timelineName}</h2>

          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex min-w-26 flex-col gap-1.5">
              <span className="font-body2 text-text-muted">기간</span>
              <span className="font-body2 text-text-title">
                {data.periodLabel}
              </span>
            </div>

            <div className="flex min-w-26 flex-col gap-1.5">
              <span className="font-body2 text-text-muted">성과 상태</span>
              <span
                className={twMerge(
                  "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-caption text-text-body",
                  statusStyle.barBg,
                )}
              >
                <span
                  className={twMerge(
                    "h-1.5 w-1.5 rounded-full",
                    statusStyle.dot,
                  )}
                />
                {statusStyle.label}
              </span>
            </div>

            <div className="flex min-w-32 flex-1 flex-col gap-1.5">
              <span className="font-body2 text-text-muted">성과 지표</span>
              <div className="flex flex-wrap gap-2">
                {data.metrics.map((metric) => (
                  <Badge key={metric.metric} variant="surface">
                    {metric.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* AI 요약 */}
        <section className="flex flex-col gap-4 py-3">
          {aiState === "idle" && (
            <Button
              type="button"
              variant="gradient"
              size="big"
              fullWidth
              onClick={handleGenerateSummary}
              className="rounded-2xl px-6 py-4 shadow-Soft"
            >
              요약하기 생성
            </Button>
          )}

          {aiState === "loading" && (
            <div aria-busy="true" className="flex flex-col gap-2 px-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          )}

          {aiState === "done" && data.aiSummary && (
            <p
              className={twMerge(
                SOFT_CARD_CLASS,
                "px-5 py-4 font-body1 text-text-body break-keep leading-relaxed",
              )}
            >
              {data.aiSummary}
            </p>
          )}
        </section>

        {/* KPI — 선택한 지표 수만큼 가로 균등 분할 */}
        <section className="flex w-full gap-2">
          {data.metrics.map((metric) => (
            <div
              key={metric.metric}
              className={twMerge(
                SOFT_CARD_CLASS,
                "flex min-w-0 flex-1 flex-col gap-1 px-4 py-3.5",
              )}
            >
              <span className="truncate font-body2 text-text-muted">
                {metric.label}
              </span>
              <span className="truncate text-text-title tracking-tight font-heading4">
                {formatMetricValue(metric.value, metric.unit)}
              </span>
              {metric.changeRate !== undefined && (
                <span
                  className={twMerge(
                    "font-body2",
                    metric.changeRate >= 0 ? "text-info-red" : "text-info-blue",
                  )}
                >
                  {metric.changeRate >= 0 ? "▲" : "▼"}{" "}
                  {formatChangeRate(metric.changeRate)}
                </span>
              )}
            </div>
          ))}
        </section>

        {/* 차트 placeholder */}
        <section className={SECTION_SHELL_CLASS}>
          <div className={SECTION_INNER_CLASS}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                <h3 className={SECTION_TITLE_CLASS}>일별 변화 추이</h3>
                <ChartLegend
                  className="[&_span]:text-text-body"
                  items={[
                    { label: "클릭수", colorClass: "bg-primary-400" },
                    { label: "예산 수정 시점", colorClass: "bg-info-red" },
                  ]}
                />
              </div>
              <TimelinePeriodSelector
                viewUnit={viewUnit}
                periodLabel={chartPeriodLabel}
                onViewUnitChange={setViewUnit}
                onPrevPeriod={handlePrevChartPeriod}
                onNextPeriod={handleNextChartPeriod}
              />
            </div>
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-surface-300/70 bg-surface-200/30 px-4 py-6">
              <span className="font-caption text-text-muted">
                차트 영역 (ApexChart 연동예정)
              </span>
            </div>
          </div>
        </section>

        {/* 플랫폼 기여 */}
        <section className={SECTION_SHELL_CLASS}>
          <div className={SECTION_INNER_CLASS}>
            <h3 className={SECTION_TITLE_CLASS}>플랫폼 기여 정보</h3>
            <div className="flex flex-col gap-5">
              {data.platformShare.map(({ provider, contributionRate }) => (
                <PlatformContributionRow
                  key={provider}
                  provider={provider}
                  value={Math.round(contributionRate * 100)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
