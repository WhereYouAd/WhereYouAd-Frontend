import type { CSSProperties } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

type TSwatchItem = {
  varName: string;
  note?: string;
};

const colorSections: {
  title: string;
  description?: string;
  items: TSwatchItem[];
}[] = [
  {
    title: "Primary",
    description:
      "원시 팔레트 (--primary-*). 100이 가장 밝고 500이 가장 진합니다.",
    items: [
      { varName: "--primary-100", note: "Blue tint" },
      { varName: "--primary-200", note: "Light blue" },
      { varName: "--primary-300", note: "Mid blue" },
      { varName: "--primary-400", note: "CTA blue" },
      { varName: "--primary-500", note: "Brand blue" },
    ],
  },
  {
    title: "Surface",
    description:
      "밝기 순 (--color-surface-*). 100이 가장 밝고 500이 가장 진합니다.",
    items: [
      { varName: "--color-surface-100" },
      { varName: "--color-surface-200" },
      { varName: "--color-surface-300" },
      { varName: "--color-surface-400" },
      { varName: "--color-surface-500" },
    ],
  },
  {
    title: "Text (밝기)",
    description: "쿨 그레이 스케일. 100이 가장 밝고 400이 가장 진합니다.",
    items: [
      { varName: "--color-text-100", note: "가장 밝음" },
      { varName: "--color-text-200" },
      { varName: "--color-text-300" },
      { varName: "--color-text-400", note: "가장 진함" },
    ],
  },
  {
    title: "Text (역할 별칭)",
    description:
      "위 밝기 토큰을 가리킵니다. 계산 색은 동일 스케일로 이어집니다.",
    items: [
      { varName: "--color-text-title", note: "→ 400" },
      { varName: "--color-text-body", note: "→ 300" },
      { varName: "--color-text-muted", note: "→ 200" },
      { varName: "--color-text-placeholder", note: "→ 200" },
      { varName: "--color-text-disabled", note: "→ 100" },
    ],
  },
];

const checkerboardStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, #d1d5db 25%, transparent 25%), linear-gradient(-45deg, #d1d5db 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d1d5db 75%), linear-gradient(-45deg, transparent 75%, #d1d5db 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
};

function ColorDoc() {
  const swatchRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [resolved, setResolved] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    const next: Record<string, string> = {};
    for (const section of colorSections) {
      for (const item of section.items) {
        const el = swatchRefs.current[item.varName];
        if (!el) continue;
        next[item.varName] = getComputedStyle(el).backgroundColor;
      }
    }
    setResolved(next);
  }, []);

  return (
    <div className="max-w-5xl space-y-12 p-8">
      <header className="space-y-1">
        <h1 className="font-heading2 text-text-main">Colors</h1>
        <p className="font-body2 text-text-muted">
          스와치는 <code className="font-mono text-sm">tokens.css</code>{" "}
          <code className="font-mono text-sm">@theme</code> 변수로만 칠한 뒤,
          아래 hex/rgb는 브라우저에서 계산된 값입니다.
        </p>
      </header>

      {colorSections.map((section) => (
        <section key={section.title} className="space-y-3">
          <div>
            <h2 className="font-heading4 text-text-main">{section.title}</h2>
            {section.description ? (
              <p className="mt-1 font-body2 text-text-muted">
                {section.description}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,1.2fr)] gap-x-4 gap-y-3 border-b border-gray-200 pb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            <span>토큰</span>
            <span>스와치</span>
            <span>계산 색</span>
          </div>
          <ul className="list-none space-y-0 p-0">
            {section.items.map((item) => (
              <li
                key={item.varName}
                className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,1.2fr)] items-center gap-x-4 border-b border-gray-100 py-3"
              >
                <div>
                  <span className="font-mono text-xs text-gray-700">
                    {item.varName}
                  </span>
                  {item.note ? (
                    <p className="mt-0.5 font-caption text-gray-400">
                      {item.note}
                    </p>
                  ) : null}
                </div>
                <div
                  className="h-12 w-full max-w-[7rem] overflow-hidden rounded-lg border border-gray-300"
                  style={checkerboardStyle}
                >
                  <div
                    ref={(el) => {
                      swatchRefs.current[item.varName] = el;
                    }}
                    className="h-full w-full"
                    style={{ backgroundColor: `var(${item.varName})` }}
                  />
                </div>
                <span className="font-mono text-xs text-gray-600">
                  {resolved[item.varName] ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Colors",
  component: ColorDoc,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "`tokens.css`에 정의된 색 토큰만 표시합니다. Primary·Surface·Text는 여기가 단일 출처이며, 스토리북 값은 런타임 계산 결과입니다.",
      },
    },
  },
};

export default meta;
type TStory = StoryObj;

export const All: TStory = {};
