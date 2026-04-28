import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

import ChevronDown from "@/assets/icon/chevron/chevron-down.svg?react";
import ChevronUp from "@/assets/icon/chevron/chevron-up.svg?react";

export default function LandingFAQ() {
  return (
    <section className="py-24 md:py-32 bg-brand-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <LandingSectionHeader
            title="자주 묻는 질문"
            subtitle="시작하기 전에 자주 받는 질문을 모았습니다."
          />
        </div>

        <div className="mt-10 divide-y divide-chart-inactive rounded-2xl border border-chart-inactive overflow-hidden bg-white">
          {[
            {
              q: "무료로 시작할 수 있나요?",
              a: "네. 스타터 플랜으로 주요 기능을 바로 체험할 수 있습니다.",
            },
            {
              q: "어떤 광고 채널을 연동할 수 있나요?",
              a: "Google, Meta, 카카오, 네이버 등 주요 채널을 지원합니다. (추가 채널은 순차 확대 예정입니다.)",
            },
            {
              q: "요금은 언제부터 결제되나요?",
              a: "프로 플랜은 무료 체험 이후에 결제가 시작됩니다. 자세한 내용은 요금제에서 확인하세요.",
            },
            {
              q: "엔터프라이즈는 어떤 기능이 포함되나요?",
              a: "조직/권한 관리, 보안 옵션, 전용 지원 등 규모에 맞춘 기능을 제공합니다.",
            },
            {
              q: "데모를 받을 수 있나요?",
              a: "네. 엔터프라이즈 문의를 통해 데모 일정을 조율할 수 있습니다.",
            },
          ].map(({ q, a }) => (
            <details key={q} className="group px-5 md:px-6 py-5">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="font-body1 text-text-main">{q}</span>
                <span className="text-text-sub shrink-0">
                  <ChevronDown className="w-5 h-5 group-open:hidden" />
                  <ChevronUp className="w-5 h-5 hidden group-open:block" />
                </span>
              </summary>
              <div className="mt-3 font-body2 text-text-auth-sub leading-relaxed">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
