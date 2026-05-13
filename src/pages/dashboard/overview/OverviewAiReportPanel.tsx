import { aiReportMockData } from "./aiReport.mock";

import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";
import SparkleCircleIcon from "@/assets/icon/ai/sparkle-circle.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

export default function OverviewAiReportPanel() {
  const data = aiReportMockData;

  return (
    <div className="flex flex-col bg-surface-100 relative">
      <div className="flex flex-col px-4 tablet:px-2 gap-8 pb-8 pt-2">
        <div className="flex flex-col gap-2.5 text-left px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary-500 font-label">
              <SparkleCircleIcon className="w-4.5 h-4.5 text-primary-500 fill-current" />
              <span>{data.label}</span>
            </div>
          </div>
          <h2 className="font-heading2 text-text-title break-keep">
            {data.title}
          </h2>
        </div>

        <div className="rounded-[24px] bg-primary-500/6 p-7 text-left mx-1">
          <h3 className="mb-3 flex items-center gap-2 font-heading4 text-primary-500">
            <SparkleIcon className="w-5 h-auto text-primary-500 fill-current" />
            {data.strategySuggestion.title}
          </h3>
          <p className="font-body2 whitespace-pre-line break-keep text-text-body">
            {data.strategySuggestion.content}
          </p>
        </div>

        <div className="flex flex-col px-2 gap-8">
          {data.sections.map((section) => (
            <div
              key={section.title}
              className="flex flex-col gap-3 text-left shrink-0"
            >
              <h3 className="font-heading4 text-text-title">{section.title}</h3>
              <div className="font-body2 whitespace-pre-line break-keep text-text-body">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] bg-info-red/6 p-7 text-left mx-1">
          <h3 className="mb-3 flex items-center gap-2 font-heading4 text-info-red">
            <WarnCircleIcon className="w-5 h-auto text-info-red" />
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
