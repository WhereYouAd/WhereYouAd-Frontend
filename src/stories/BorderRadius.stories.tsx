import type { Meta, StoryObj } from "@storybook/react";

const radiusTokens = [
  {
    className: "rounded-component-sm",
    label: "Component SM",
    value: "0.5rem (8px)",
  },
  {
    className: "rounded-component-md",
    label: "Component MD",
    value: "1rem (16px)",
  },
  {
    className: "rounded-component-lg",
    label: "Component LG",
    value: "1.5rem (24px)",
  },
  { className: "rounding-15", label: "Rounding 15", value: "15px" },
  { className: "rounding-20", label: "Rounding 20", value: "20px" },
  { className: "rounding-30", label: "Rounding 30", value: "30px" },
];

function BorderRadiusDoc() {
  return (
    <div className="p-8 space-y-2 max-w-2xl">
      <div className="grid grid-cols-[180px_1fr_140px] gap-x-4 pb-2 border-b border-gray-200 text-xs text-gray-400 font-medium uppercase tracking-wide">
        <span>Token</span>
        <span>Preview</span>
        <span>Value</span>
      </div>
      {radiusTokens.map(({ className, value }) => (
        <div
          key={className}
          className="grid grid-cols-[180px_1fr_140px] gap-x-4 items-center py-4 border-b border-gray-100"
        >
          <span className="text-xs text-gray-400 font-mono">.{className}</span>
          <div
            className={`w-20 h-12 bg-brand-400 border border-brand-500 ${className}`}
          />
          <span className="text-xs text-gray-400">{value}</span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Border Radius",
  component: BorderRadiusDoc,
  parameters: { layout: "fullscreen" },
};

export default meta;
type TStory = StoryObj;

export const All: TStory = {};
