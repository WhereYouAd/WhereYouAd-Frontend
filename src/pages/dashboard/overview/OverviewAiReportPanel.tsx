import { aiReportMockData } from "./aiReport.mock";

import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";
import SparkleCircleIcon from "@/assets/icon/ai/sparkle-circle.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

export default function OverviewAiReportPanel() {
  const data = aiReportMockData;

  return (
    <div className="relative flex flex-col bg-surface-100">
      <div className="flex flex-col gap-8 px-5 pb-8 pt-2 tablet:px-4">
        <div className="flex flex-col gap-2.5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-label text-primary-500">
              <SparkleCircleIcon className="h-4 w-4 shrink-0 fill-current text-primary-500" />
              <span>{data.label}</span>
            </div>
          </div>
          <h2 className="font-heading2 text-text-title break-keep">
            {data.title}
          </h2>
        </div>

        <div className="rounded-[24px] bg-primary-500/6 p-6 text-left tablet:p-5">
          <h3 className="mb-3 flex items-center gap-2 font-heading4 text-primary-500">
            <SparkleIcon className="h-4 w-4 shrink-0 fill-current text-primary-500" />
            {data.strategySuggestion.title}
          </h3>
          <p className="font-body2 whitespace-pre-line break-keep text-text-body">
            {data.strategySuggestion.content}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {data.sections.map((section) => (
            <div
              key={section.title}
              className="flex shrink-0 flex-col gap-3 text-left"
            >
              <h3 className="font-heading4 text-text-title">{section.title}</h3>
              <div className="font-body2 whitespace-pre-line break-keep text-text-body">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] bg-info-red/6 p-6 text-left tablet:p-5">
          <h3 className="mb-3 flex items-center gap-2 font-heading4 text-info-red">
            <WarnCircleIcon className="h-4 w-4 shrink-0 text-info-red" />
            {data.warning.title}
          </h3>
          <p className="font-body2 whitespace-pre-line break-keep text-text-body">
            {data.warning.content}
          </p>
        </div>
      </div>
    </div>
  );
}
