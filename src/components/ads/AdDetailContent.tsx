import { toast } from "sonner";

import type { IAd } from "@/types/ads/campaign";

import Badge from "../common/badge/Badge";

import LinkIcon from "@/assets/icon/common/copy.svg?react";

interface IAdDetailContentProps {
  ad: IAd;
}

export default function AdDetailContent({ ad }: IAdDetailContentProps) {
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("링크가 복사되었습니다.");
    } catch (err) {
      toast.error("복사에 실패했습니다.");
    }
  };
  return (
    <div className="px-5 pt-4 pb-6 flex flex-col gap-6 transition-all animate-fade-in">
      <div className="flex w-full">
        <div className="w-[15%] shrink-0 mr-2" />

        <div className="w-[70%] flex flex-col gap-3 pl-2">
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
          <div className="relative w-full max-w-150 group mt-2">
            <div className="flex items-center justify-between w-full h-10 px-4 py-2 bg-white border border-text-placeholder rounded-component-sm group-hover:border-primary-light transition-all">
              {/* URL 텍스트: 길어지면 ... 처리 */}
              <span className="font-body2 text-text-auth-sub truncate pr-10 select-all">
                {ad.link}
              </span>

              {/* 복사 버튼 */}
              <button
                onClick={() => handleCopy(ad.link)}
                className="shrink-0 text-text-placeholder hover:text-primary-main transition-colors p-1"
                title="링크 복사"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* tracking controlBox */}
          <div />

          {/* campaign controlBox */}
          <div />
        </div>
      </div>
    </div>
  );
}
