import { useLayoutEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

/** `tokens.css` 타이포 블록과 동일 순서·이름 — 값은 런타임에 `getComputedStyle`으로 표시 */
const fontTokens = [
  {
    className: "font-hero",
    label: "Hero",
    cssVars: ["--type-hero-size", "--type-hero-weight", "--type-hero-leading"],
  },
  {
    className: "font-heading1",
    label: "Heading 1",
    cssVars: [
      "--type-heading1-size",
      "--type-heading1-weight",
      "--type-heading1-leading",
    ],
  },
  {
    className: "font-heading2",
    label: "Heading 2",
    cssVars: [
      "--type-heading2-size",
      "--type-heading2-weight",
      "--type-heading2-leading",
    ],
  },
  {
    className: "font-heading3",
    label: "Heading 3",
    cssVars: [
      "--type-heading3-size",
      "--type-heading3-weight",
      "--type-heading3-leading",
    ],
  },
  {
    className: "font-heading4",
    label: "Heading 4",
    cssVars: [
      "--type-heading4-size",
      "--type-heading4-weight",
      "--type-heading4-leading",
    ],
  },
  {
    className: "font-body1",
    label: "Body 1",
    cssVars: [
      "--type-body1-size",
      "--type-body1-weight",
      "--type-body1-leading",
    ],
  },
  {
    className: "font-body2",
    label: "Body 2",
    cssVars: [
      "--type-body2-size",
      "--type-body2-weight",
      "--type-body2-leading",
    ],
  },
  {
    className: "font-caption",
    label: "Caption",
    cssVars: [
      "--type-caption-size",
      "--type-caption-weight",
      "--type-caption-leading",
    ],
  },
  {
    className: "font-label",
    label: "Label",
    cssVars: [
      "--type-label-size",
      "--type-label-weight",
      "--type-label-leading",
    ],
  },
] as const;

type TFontMetrics = {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
};

const textColorTokens = [
  {
    varName: "--color-text-100",
    label: "100",
    note: "가장 밝음 · disabled",
  },
  {
    varName: "--color-text-200",
    label: "200",
    note: "muted · placeholder",
  },
  {
    varName: "--color-text-300",
    label: "300",
    note: "body",
  },
  {
    varName: "--color-text-400",
    label: "400",
    note: "가장 진함 · title",
  },
] as const;

const textRoleAliases = [
  { varName: "--color-text-title", mapsTo: "--color-text-400" },
  { varName: "--color-text-body", mapsTo: "--color-text-300" },
  { varName: "--color-text-muted", mapsTo: "--color-text-200" },
  { varName: "--color-text-placeholder", mapsTo: "--color-text-200" },
  { varName: "--color-text-disabled", mapsTo: "--color-text-100" },
] as const;

function TypographyDoc() {
  const sampleRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const colorRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [metrics, setMetrics] = useState<Record<string, TFontMetrics>>({});
  const [colors, setColors] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    const nextMetrics: Record<string, TFontMetrics> = {};
    for (const row of fontTokens) {
      const el = sampleRefs.current[row.className];
      if (!el) continue;
      const cs = getComputedStyle(el);
      nextMetrics[row.className] = {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
      };
    }
    setMetrics(nextMetrics);

    const nextColors: Record<string, string> = {};
    for (const row of textColorTokens) {
      const el = colorRefs.current[row.varName];
      if (!el) continue;
      nextColors[row.varName] = getComputedStyle(el).color;
    }
    for (const row of textRoleAliases) {
      const el = colorRefs.current[row.varName];
      if (!el) continue;
      nextColors[row.varName] = getComputedStyle(el).color;
    }
    setColors(nextColors);
  }, []);

  return (
    <div className="max-w-5xl space-y-12 p-8">
      <header className="space-y-1">
        <h1 className="font-heading2 text-text-main">Typography</h1>
        <p className="font-body2 text-text-muted">
          유틸 클래스는 <code className="font-mono text-sm">utilities.css</code>
          , 값은 <code className="font-mono text-sm">tokens.css</code>{" "}
          <code className="font-mono text-sm">@theme</code>의{" "}
          <code className="font-mono text-sm">--type-*</code>만 참조합니다.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-heading4 text-text-main">타이포 스케일</h2>
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,2fr)_repeat(3,minmax(0,0.65fr))] gap-x-3 gap-y-0 border-b border-surface-400 pb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
          <span>스타일</span>
          <span>CSS 변수</span>
          <span>샘플</span>
          <span>Size</span>
          <span>Weight</span>
          <span>Leading</span>
        </div>
        {fontTokens.map((row) => {
          const m = metrics[row.className];
          return (
            <div
              key={row.className}
              className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,2fr)_repeat(3,minmax(0,0.65fr))] items-baseline gap-x-3 border-b border-surface-400/30 py-3"
            >
              <div className="space-y-0.5">
                <span className="text-sm text-text-main">{row.label}</span>
                <span className="block font-mono text-xs text-text-muted">
                  .{row.className}
                </span>
              </div>
              <ul className="list-none space-y-0.5 font-mono text-[11px] leading-snug text-text-muted">
                {row.cssVars.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              <span
                ref={(el) => {
                  sampleRefs.current[row.className] = el;
                }}
                className={row.className}
              >
                {row.label} — 가나다라마바사
              </span>
              <span className="font-mono text-xs text-text-muted">
                {m?.fontSize ?? "—"}
              </span>
              <span className="font-mono text-xs text-text-muted">
                {m?.fontWeight ?? "—"}
              </span>
              <span className="font-mono text-xs text-text-muted">
                {m?.lineHeight ?? "—"}
              </span>
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="font-heading4 text-text-main">텍스트 색 (밝기 순)</h2>
        <p className="font-body2 text-text-muted">
          <code className="font-mono text-sm">--color-text-100</code> ···{" "}
          <code className="font-mono text-sm">--color-text-400</code>
        </p>
        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)_minmax(0,1.5fr)] gap-x-3 border-b border-surface-400 pb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
          <span>토큰</span>
          <span>샘플</span>
          <span>계산 색</span>
        </div>
        {textColorTokens.map((row) => (
          <div
            key={row.varName}
            className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)_minmax(0,1.5fr)] items-center gap-x-3 border-b border-surface-400/30 py-3"
          >
            <div>
              <span className="font-mono text-xs text-text-body">
                {row.varName}
              </span>
              <p className="mt-0.5 font-caption text-text-muted">{row.note}</p>
            </div>
            <span
              ref={(el) => {
                colorRefs.current[row.varName] = el;
              }}
              className="font-body1"
              style={{ color: `var(${row.varName})` }}
            >
              본문 샘플 · {row.label}
            </span>
            <span className="font-mono text-xs text-text-muted">
              {colors[row.varName] ?? "—"}
            </span>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-heading4 text-text-main">텍스트 역할 별칭</h2>
        <p className="font-body2 text-text-muted">
          아래 토큰은 위 밝기 스케일을 가리킵니다.
        </p>
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,2fr)_minmax(0,1.2fr)] gap-x-3 border-b border-surface-400 pb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
          <span>별칭</span>
          <span>→</span>
          <span>샘플</span>
          <span>계산 색</span>
        </div>
        {textRoleAliases.map((row) => (
          <div
            key={row.varName}
            className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,2fr)_minmax(0,1.2fr)] items-center gap-x-3 border-b border-surface-400/30 py-2"
          >
            <span className="font-mono text-xs text-text-body">
              {row.varName}
            </span>
            <span className="font-mono text-xs text-text-muted">
              {row.mapsTo}
            </span>
            <span
              ref={(el) => {
                colorRefs.current[row.varName] = el;
              }}
              className="font-body2"
              style={{ color: `var(${row.varName})` }}
            >
              역할 샘플 텍스트
            </span>
            <span className="font-mono text-xs text-text-muted">
              {colors[row.varName] ?? "—"}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Typography",
  component: TypographyDoc,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "타이포는 `tokens.css`의 `--type-*`와 `utilities.css`의 `.font-*`로 정리되어 있습니다. 표의 Size·Weight·Leading·색은 브라우저에서 계산된 값입니다.",
      },
    },
  },
};

export default meta;
type TStory = StoryObj;

export const All: TStory = {};
