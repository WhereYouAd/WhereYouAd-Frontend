import type { Meta, StoryObj } from "@storybook/react";

const shadowTokens = [
  {
    className: "shadow-Soft",
    label: "Soft",
    value: "0px 0px 16px 0px rgba(0, 0, 0, 0.1)",
  },
  {
    className: "shadow-Medium",
    label: "Medium",
    value: "0px 0px 16px 0px rgba(0, 0, 0, 0.2)",
  },
];

function ShadowDoc() {
  return (
    <div className="p-8 space-y-2 max-w-2xl">
      <div className="grid grid-cols-[140px_1fr_280px] gap-x-4 pb-2 border-b border-surface-400 text-xs text-text-muted font-medium uppercase tracking-wide">
        <span>Token</span>
        <span>Preview</span>
        <span>Value</span>
      </div>
      {shadowTokens.map(({ className, value }) => (
        <div
          key={className}
          className="grid grid-cols-[140px_1fr_280px] gap-x-4 items-center py-6 border-b border-surface-400/30"
        >
          <span className="text-xs text-text-muted font-mono">
            .{className}
          </span>
          <div className={`w-24 h-14 bg-surface-100 rounded-lg ${className}`} />
          <span className="text-xs text-text-muted">{value}</span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Shadows",
  component: ShadowDoc,
  parameters: { layout: "fullscreen" },
};

export default meta;
type TStory = StoryObj;

export const All: TStory = {};
