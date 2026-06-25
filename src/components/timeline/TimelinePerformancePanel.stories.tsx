import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import {
  TIMELINE_SUMMARY_PANEL_MOCK,
  TIMELINE_SUMMARY_PANEL_NO_AI_MOCK,
} from "@/types/timeline/timeline.mock";

import TimelinePerformancePanel from "./TimelinePerformancePanel";

const meta: Meta<typeof TimelinePerformancePanel> = {
  title: "Timeline/PerformancePanel",
  component: TimelinePerformancePanel,
  parameters: { layout: "fullscreen" },
  args: {
    onClose: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};

export default meta;
type TStory = StoryObj<typeof TimelinePerformancePanel>;

function ClosedPreivew() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary-400 px-4 py-2 font-body2 text-surface-100"
        >
          패널 열기
        </button>
      </div>
      <TimelinePerformancePanel
        isOpen={open}
        onClose={() => setOpen(false)}
        data={TIMELINE_SUMMARY_PANEL_NO_AI_MOCK}
        onEdit={fn()}
        onDelete={fn()}
      />
    </>
  );
}

export const Closed: TStory = {
  render: () => <ClosedPreivew />,
};

export const Open: TStory = {
  args: {
    isOpen: true,
    data: TIMELINE_SUMMARY_PANEL_NO_AI_MOCK,
  },
};

export const OpenWithSummary: TStory = {
  args: {
    isOpen: true,
    data: TIMELINE_SUMMARY_PANEL_MOCK,
  },
};

function InteractivePreview() {
  const [open, setOpen] = useState(true);
  return (
    <TimelinePerformancePanel
      isOpen={open}
      onClose={() => setOpen(false)}
      data={TIMELINE_SUMMARY_PANEL_MOCK}
      onEdit={fn()}
      onDelete={fn()}
    />
  );
}

export const Interactive: TStory = {
  render: () => <InteractivePreview />,
};
