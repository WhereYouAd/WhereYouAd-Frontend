import type { Meta, StoryObj } from "@storybook/react";

const fontTokens = [
  {
    className: "font-hero",
    label: "Hero",
    size: "54px",
    weight: "700",
    lineHeight: "140%",
  },
  {
    className: "font-heading1",
    label: "Heading 1",
    size: "30px",
    weight: "600",
    lineHeight: "130%",
  },
  {
    className: "font-heading2",
    label: "Heading 2",
    size: "28px",
    weight: "600",
    lineHeight: "130%",
  },
  {
    className: "font-heading3",
    label: "Heading 3",
    size: "24px",
    weight: "500",
    lineHeight: "130%",
  },
  {
    className: "font-heading4",
    label: "Heading 4",
    size: "18px",
    weight: "400",
    lineHeight: "130%",
  },
  {
    className: "font-body1",
    label: "Body 1",
    size: "16px",
    weight: "500",
    lineHeight: "140%",
  },
  {
    className: "font-body2",
    label: "Body 2",
    size: "14px",
    weight: "500",
    lineHeight: "140%",
  },
  {
    className: "font-label",
    label: "Label",
    size: "14px",
    weight: "600",
    lineHeight: "140%",
  },
  {
    className: "font-caption",
    label: "Caption",
    size: "12px",
    weight: "500",
    lineHeight: "130%",
  },
];

function TypographyDoc() {
  return (
    <div className="p-8 space-y-2 max-w-2xl">
      <div className="grid grid-cols-[120px_1fr_80px_60px_60px] gap-x-4 pb-2 border-b border-gray-200 text-xs text-gray-400 font-medium uppercase tracking-wide">
        <span>Token</span>
        <span>Sample</span>
        <span>Size</span>
        <span>Weight</span>
        <span>Leading</span>
      </div>
      {fontTokens.map(({ className, label, size, weight, lineHeight }) => (
        <div
          key={className}
          className="grid grid-cols-[120px_1fr_80px_60px_60px] gap-x-4 items-baseline py-3 border-b border-gray-100"
        >
          <span className="text-xs text-gray-400 font-mono">.{className}</span>
          <span className={className}>{label} — 가나다라마바사</span>
          <span className="text-xs text-gray-400">{size}</span>
          <span className="text-xs text-gray-400">{weight}</span>
          <span className="text-xs text-gray-400">{lineHeight}</span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Typography",
  component: TypographyDoc,
  parameters: { layout: "fullscreen" },
};

export default meta;
type TStory = StoryObj;

export const All: TStory = {};
