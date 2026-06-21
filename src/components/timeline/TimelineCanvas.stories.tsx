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
  return (
    <div className="h-90 w-full max-w-5xl overflow-hidden bg-surface-100 md:h-105">
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <div style={{ width: totalWidth }} className="flex h-full flex-col">
          <TimelineAxis columns={columns} />
          <TimelineGrid columnCount={columns.length} rowCount={maxRow}>
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
