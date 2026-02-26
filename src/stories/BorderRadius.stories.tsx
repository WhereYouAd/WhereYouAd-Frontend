import type { Meta, StoryObj } from "@storybook/react";

const radiusTokens = [
  {
    className: "rounded-component-sm",
    label: "Component SM",
    value: "0.5rem (8px)",
    usage: "이미지, 소형 버튼, 뱃지",
  },
  {
    className: "rounded-component-md",
    label: "Component MD",
    value: "1rem (16px)",
    usage: "버튼, 인풋, 모달, 드롭다운, 네비 아이템",
  },
  {
    className: "rounded-component-lg",
    label: "Component LG",
    value: "1.5rem (24px)",
    usage: "카드, 패널, 알럿",
  },
  {
    className: "rounded-full",
    label: "Full",
    value: "9999px",
    usage: "아바타, 소셜 버튼, 뱃지 pill",
  },
];

function BorderRadiusDoc() {
  return (
    <div className="p-8 space-y-2 max-w-3xl">
      <div className="grid grid-cols-[180px_1fr_120px_1fr] gap-x-4 pb-2 border-b border-gray-200 text-xs text-gray-400 font-medium uppercase tracking-wide">
        <span>Token</span>
        <span>Preview</span>
        <span>Value</span>
        <span>Usage</span>
      </div>
      {radiusTokens.map(({ className, value, usage }) => (
        <div
          key={className}
          className="grid grid-cols-[180px_1fr_120px_1fr] gap-x-4 items-center py-4 border-b border-gray-100"
        >
          <span className="text-xs text-gray-400 font-mono">.{className}</span>
          <div
            className={`w-20 h-12 bg-brand-400 border border-brand-500 ${className}`}
          />
          <span className="text-xs text-gray-400">{value}</span>
          <span className="text-xs text-gray-400">{usage}</span>
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
