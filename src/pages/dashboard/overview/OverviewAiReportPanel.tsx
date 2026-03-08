import { aiReportMockData } from "./aiReport.mock";

import SparkleIcon from "@/assets/icon/ai-report/sparkle.svg?react";
import SparkleCircleIcon from "@/assets/icon/ai-report/sparkle-circle.svg?react";
import WarningIcon from "@/assets/icon/ai-report/warning.svg?react";

export default function OverviewAiReportPanel() {
  const data = aiReportMockData;

  return (
    <div className="flex flex-col bg-white relative">
      <div className="flex flex-col px-2 sm:px-4 gap-8 pb-8 pt-2">
        {/* 타이틀 */}
        <div className="flex flex-col gap-2.5 text-left px-2">
          <div className="flex items-center gap-1.5 text-logo-1 font-label font-bold">
            <SparkleCircleIcon className="w-4.5 h-4.5 text-logo-1 fill-current" />
            <span>{data.label}</span>
          </div>
          <h2 className="font-heading3 text-[26px] font-extrabold text-text-main tracking-[-0.02em] leading-tight break-keep">
            {data.title}
          </h2>
        </div>

        {/* 전략 제안 */}
        <div className="rounded-[24px] bg-logo-1/6 p-7 text-left mx-1">
          <h3 className="flex items-center gap-2 text-logo-1 font-body1 font-bold text-[16px] mb-3">
            <SparkleIcon className="w-4.5 h-4.5 text-logo-1 fill-current" />
            {data.strategySuggestion.title}
          </h3>
          <p className="text-text-main font-body2 font-medium text-[15px] leading-[1.65] whitespace-pre-line break-keep">
            {data.strategySuggestion.content}
          </p>
        </div>

        {/* 성과 요약 */}
        <div className="flex flex-col px-2 gap-6">
          {data.sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-3 text-left shrink-0">
              <h3 className="text-text-main font-body1 font-extrabold text-[17px] tracking-[-0.01em]">
                {section.title}
              </h3>
              <div className="text-text-auth-sub font-body2 font-medium text-[15px] leading-[1.7] whitespace-pre-line break-keep tracking-[-0.01em]">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* 주의 */}
        <div className="rounded-[24px] bg-status-red/6 p-7 text-left mx-1">
          <h3 className="flex items-center gap-2 text-status-red font-body1 font-bold text-[16px] mb-3 tracking-tight">
            <WarningIcon className="w-4.5 h-4.5 fill-current text-status-red" />
            {data.warning.title}
          </h3>
          <p className="text-text-auth-sub font-body2 font-medium text-[15px] leading-[1.65] whitespace-pre-line break-keep">
            {data.warning.content}
          </p>
        </div>
      </div>
    </div>
  );
}
