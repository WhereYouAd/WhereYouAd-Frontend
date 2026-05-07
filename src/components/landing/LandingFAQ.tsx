import { LANDING_FAQ_ITEMS } from "@/constants/landing/faq";

import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

import ChevronDown from "@/assets/icon/chevron/chevron-down.svg?react";
import ChevronUp from "@/assets/icon/chevron/chevron-up.svg?react";

export default function LandingFAQ() {
  return (
    <section className="py-24 md:py-32 bg-brand-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <LandingSectionHeader
            title="자주 묻는 질문"
            subtitle="시작하기 전에 자주 받는 질문을 모았습니다."
          />
        </div>

        <div className="mt-10 divide-y divide-chart-inactive rounded-component-md border border-chart-inactive overflow-hidden bg-white shadow-card">
          {LANDING_FAQ_ITEMS.map(({ q, a }) => (
            <details key={q} className="group px-5 md:px-6 py-5">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-logo-2/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
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
