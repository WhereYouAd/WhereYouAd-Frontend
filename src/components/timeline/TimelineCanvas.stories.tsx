import { useEffect, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { TIMELINE_GRID_MOCK } from "@/types/timeline/timeline.mock";
import { TIMELINE_COL_WIDTH } from "@/constants/timeline/layout";

import TimelineAxis from "./TimelineAxis";
import TimelineBar from "./TimelineBar";
import TimelineGrid from "./TimelineGrid";

const { columns, bars } = TIMELINE_GRID_MOCK;
const maxRow = Math.max(...bars.map((bar) => bar.row));
const totalWidth = columns.length * TIMELINE_COL_WIDTH;

function TimelineCanvasPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, []);

  return (
    // wrapper width는 API + 레이아웃때 다시 맞추기
    <div className="h-105 max-w-126 overflow-hidden rounded-2xl border border-surface-400/70 bg-surface-100">
      <div ref={scrollRef} className="h-full overflow-x-auto overflow-y-hidden">
        <div style={{ width: totalWidth }} className="flex h-full flex-col">
          <TimelineAxis columns={columns} />
          <TimelineGrid columns={columns} rowCount={maxRow}>
            {bars.map((bar) => (
              <TimelineBar key={bar.id} bar={bar} />
            ))}
          </TimelineGrid>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof TimelineCanvasPreview> = {
  title: "Timeline/Canvas",
  component: TimelineCanvasPreview,
  parameters: { layout: "padded" },
};
export default meta;
type TStory = StoryObj<typeof TimelineCanvasPreview>;

export const Default: TStory = {};
