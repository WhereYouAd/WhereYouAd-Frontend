import type { RefObject } from "react";

import type {
  ITimelineCampaignBar,
  ITimelineGridColumn,
  TTimelineViewUnit,
} from "@/types/timeline/ui";

import TimelineAxis from "./TimelineAxis";
import TimelineBar from "./TimelineBar";
import TimelineGrid from "./TimelineGrid";

interface ITimelineCanvasProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  totalWidth: number;
  columns: ITimelineGridColumn[];
  colWidth: number;
  bars: ITimelineCampaignBar[];
  maxRow: number;
  viewUnit: TTimelineViewUnit;
  hasNoVisibleBars: boolean;
  selectedBarId: number | null;
  isPanelOpen: boolean;
  onBarClick: (bar: ITimelineCampaignBar) => void;
  onEdit: (id: number) => void;
  onDelete: (target: { id: number; name: string }) => void;
}

export default function TimelineCanvas({
  scrollRef,
  totalWidth,
  columns,
  colWidth,
  bars,
  maxRow,
  viewUnit,
  hasNoVisibleBars,
  selectedBarId,
  isPanelOpen,
  onBarClick,
  onEdit,
  onDelete,
}: ITimelineCanvasProps) {
  return (
    <div
      ref={scrollRef}
      className="flex min-h-0 w-full flex-1 flex-col overflow-auto"
    >
      <div
        style={{ width: totalWidth, minHeight: "100%" }}
        className="flex min-h-full flex-1 flex-col"
      >
        <TimelineAxis
          columns={columns}
          colWidth={colWidth}
          className="sticky top-0"
        />
        {hasNoVisibleBars ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="font-heading4 text-text-title">
              이 기간에 표시할 타임라인이 없어요
            </p>
            <p className="max-w-sm font-body2 text-text-muted">
              다른 기간으로 이동하거나 보기 단위를 변경해 보세요
            </p>
          </div>
        ) : (
          <TimelineGrid columns={columns} rowCount={maxRow} colWidth={colWidth}>
            {bars.map((bar) => (
              <TimelineBar
                key={`${viewUnit}-${bar.id}`}
                bar={bar}
                colWidth={colWidth}
                menuPlacement={bar.row === maxRow ? "top" : "auto"}
                isSelected={selectedBarId === bar.id && isPanelOpen}
                onBarClick={onBarClick}
                onEdit={() => onEdit(bar.id)}
                onDelete={() => onDelete({ id: bar.id, name: bar.title })}
              />
            ))}
          </TimelineGrid>
        )}
      </div>
    </div>
  );
}
