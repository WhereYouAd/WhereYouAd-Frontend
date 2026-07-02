import { LANDING_FAQ_ITEMS } from "@/constants/landing/faq";

import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

export default function LandingFAQ() {
  return (
    <section
      id="faq"
      tabIndex={-1}
      className="py-24 md:py-32 bg-surface-100 scroll-mt-[calc(var(--landing-header-height,64px)+16px)] focus-visible:outline-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <LandingSectionHeader title="자주 묻는 질문" />
        </div>

        <div className="mt-14 divide-y divide-surface-400/60">
          {LANDING_FAQ_ITEMS.map(({ q, a }) => (
            <div key={q} className="py-8 first:pt-0 last:pb-0">
              <h3 className="font-heading4 text-text-title">{q}</h3>
              <p className="mt-3 break-keep font-body1 text-text-muted leading-relaxed">
                {a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
