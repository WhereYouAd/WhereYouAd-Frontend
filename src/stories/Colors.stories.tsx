import type { Meta, StoryObj } from "@storybook/react";

const colorGroups = [
  {
    label: "Brand",
    colors: [
      { name: "brand-900", value: "#000000" },
      { name: "brand-800", value: "#001f5b" },
      { name: "brand-700", value: "#213e68" },
      { name: "brand-600", value: "#466a9c" },
      { name: "brand-500", value: "#88c1ff" },
      { name: "brand-400", value: "#dce7f2" },
      { name: "brand-300", value: "#f9fafb" },
      { name: "brand-200", value: "#ffffff" },
    ],
  },
  {
    label: "Logo",
    colors: [
      { name: "logo-1", value: "#2eb4ff" },
      { name: "logo-2", value: "#6088fe" },
    ],
  },
  {
    label: "Status",
    colors: [
      { name: "status-red", value: "#ff2a4b" },
      { name: "status-blue", value: "#0084fe" },
      { name: "status-green", value: "#22c55e" },
      { name: "status-yellow", value: "#facc15" },
    ],
  },
  {
    label: "Text",
    colors: [
      { name: "text-main", value: "#212121" },
      { name: "text-auth-sub", value: "#546171" },
      { name: "text-sub", value: "#8b8b8f" },
      { name: "text-placeholder", value: "#c3c3c3" },
      { name: "text-disabled", value: "#b0b8c1" },
      { name: "bg-disabled", value: "#e5e8eb" },
      { name: "bg-surface", value: "#f6f6f6" },
    ],
  },
  {
    label: "Social",
    colors: [
      { name: "social-kakao", value: "#fee500" },
      { name: "social-naver", value: "#03c75a" },
      { name: "social-google", value: "#ffffff" },
    ],
  },
  {
    label: "Chart",
    colors: [
      { name: "chart-1", value: "#0a3d91" },
      { name: "chart-2", value: "#0056b3" },
      { name: "chart-3", value: "#1485ff" },
      { name: "chart-4", value: "#00aeef" },
      { name: "chart-5", value: "#4fc3f7" },
      { name: "chart-inactive", value: "#f2f4f6" },
    ],
  },
];

function ColorDoc() {
  return (
    <div className="p-8 space-y-8 max-w-3xl">
      {colorGroups.map(({ label, colors }) => (
        <div key={label}>
          <h2 className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
            {label}
          </h2>
          <div className="flex flex-wrap gap-4">
            {colors.map(({ name, value }) => (
              <div key={name} className="flex flex-col gap-1.5 w-24">
                <div
                  className="w-24 h-12 rounded-lg border border-gray-300 overflow-hidden"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #d1d5db 25%, transparent 25%), linear-gradient(-45deg, #d1d5db 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d1d5db 75%), linear-gradient(-45deg, transparent 75%, #d1d5db 75%)",
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: value }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-mono">{name}</span>
                <span className="text-xs text-gray-400">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Colors",
  component: ColorDoc,
  parameters: { layout: "fullscreen" },
};

export default meta;
type TStory = StoryObj;

export const All: TStory = {};
