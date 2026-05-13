import { aiReportMockData } from "./aiReport.mock";

import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";
import SparkleCircleIcon from "@/assets/icon/ai/sparkle-circle.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

export default function OverviewAiReportPanel() {
  const data = aiReportMockData;

  return (
    <div className="flex flex-col bg-white relative">
      <div className="flex flex-col px-4 tablet:px-2 gap-8 pb-8 pt-2">
        <div className="flex flex-col gap-2.5 text-left px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-logo-1 font-label font-bold">
              <SparkleCircleIcon className="w-4.5 h-4.5 text-logo-1 fill-current" />
              <span>{data.label}</span>
            </div>
          </div>
          <h2 className="font-heading2 font-extrabold text-text-title tracking-[-0.02em] leading-tight break-keep">
            {data.title}
          </h2>
        </div>

        <div className="rounded-[24px] bg-logo-1/6 p-7 text-left mx-1">
          <h3 className="flex items-center gap-2 text-logo-1 font-heading4 font-semibold! mb-3">
            <SparkleIcon className="w-5 h-auto text-logo-1 fill-current" />
            {data.strategySuggestion.title}
          </h3>
          <p className="text-text-body font-body2 font-medium leading-[1.65] whitespace-pre-line break-keep">
            {data.strategySuggestion.content}
          </p>
        </div>

        <div className="flex flex-col px-2 gap-8">
          {data.sections.map((section) => (
            <div
              key={section.title}
              className="flex flex-col gap-3 text-left shrink-0"
            >
              <h3 className="text-text-title font-heading4 font-semibold! tracking-[-0.01em]">
                {section.title}
              </h3>
              <div className="text-text-body font-body2 font-medium leading-[1.7] whitespace-pre-line break-keep tracking-[-0.01em]">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] bg-status-red/6 p-7 text-left mx-1">
          <h3 className="flex items-center gap-2 text-status-red font-heading4 font-semibold! mb-3 tracking-tight">
            <WarnCircleIcon className="w-5 h-auto text-status-red" />
            {data.warning.title}
          </h3>
          <p className="text-text-body font-body2 font-medium leading-[1.65] whitespace-pre-line break-keep">
            {data.warning.content}
          </p>
        </div>
      </div>
    </div>
  );
}
