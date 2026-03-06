import { toast } from "sonner";

import type { IAd } from "@/types/ads/campaign";

import Badge from "../common/badge/Badge";
import ControlBox from "../common/controlbox/ControlBox";

import LinkIcon from "@/assets/icon/common/copy.svg?react";

interface IAdDetailContentProps {
  ad: IAd;
}

export default function AdDetailContent({ ad }: IAdDetailContentProps) {
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("링크가 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };
  return (
    <div className="px-5 pt-2 pb-6 flex flex-col gap-6 transition-all animate-fade-in overflow-hidden">
      <div className="flex w-full">
        <div className="w-[15%] shrink-0 mr-2" />

        <div className="w-[70%] flex flex-col gap-4 pl-2">
          {/* description */}
          <p className="font-body2 text-text-sub whitespace-pre-line leading-relaxed">
            {ad.description}
          </p>

          {/* tags */}
          <div className="flex flex-wrap gap-2">
            {ad.tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="running"
                size="sm"
                className="border border-bg-text-sub bg-bg-surface text-text-sub font-normal px-3"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* link */}
          <div className="relative w-full max-w-150 group">
            <div className="flex items-center justify-between w-full h-10 px-4 py-2 bg-white border border-text-placeholder rounded-component-sm group-hover:border-primary-light transition-all">
              <span className="font-body2 text-text-auth-sub truncate pr-10 select-all">
                {ad.link}
              </span>
              <button
                onClick={() => handleCopy(ad.link)}
                className="shrink-0 text-text-placeholder hover:text-primary-main transition-colors p-1"
                title="링크 복사"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full overflow-x-auto">
        <div className="w-[15%] shrink-0 mr-2" />
        <div className="flex-1 max-w-[85%] flex flex-col gap-6 pl-2 overflow-x-auto overflow-y-hidden">
          <ControlBox
            title="트래킹 활성화 시 실시간 성과 수집이 시작돼요"
            description="광고 클릭/전환 데이터를 실시간으로 수집하여 성과 분석과 보고서에 바로 반영됩니다."
            buttonText="트래킹 활성화"
            onButtonClick={() => {}}
            buttonDisabled={false}
            containerClassName="bg-chart-3/7 border-chart-3 px-6 py-4 min-w-[650px] shrink-0"
            titleClassName="text-chart-3 font-heading3"
            descriptionClassName="font-caption text-text-sub"
            buttonSize="big"
            buttonClassName="font-body1"
          />
          <ControlBox
            title="해당 광고를 중단할 수 있어요"
            description="선택한 광고의 노출과 클릭이 즉시 중단되며, 다른 광고에는 영향을 주지 않습니다."
            buttonText="중단하기"
            onButtonClick={() => {}}
            buttonDisabled={false}
            containerClassName="bg-status-red/7 border-status-red px-6 py-4 min-w-[650px] shrink-0"
            titleClassName="text-status-red font-heading3"
            descriptionClassName="font-caption text-text-sub"
            buttonSize="big"
            buttonClassName="font-body1 bg-status-red"
          />
        </div>
      </div>
    </div>
  );
}
