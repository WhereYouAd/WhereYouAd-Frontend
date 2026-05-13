import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { LANDING_PLANS } from "@/constants/landing/pricing";

import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

function CheckIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 ${enabled ? "text-primary-400" : "text-text-disabled"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function LandingPricing() {
  const navigate = useNavigate();

  function handleCta() {
    navigate("/signup", { replace: false });
  }

  const proMailtoHref = `mailto:whereyouadofficial@gmail.com?subject=${encodeURIComponent(
    "WhereYouAd 요금제 문의",
  )}&body=${encodeURIComponent("문의하실 내용을 입력해 주세요.")}`;

  return (
    <section
      id="pricing"
      tabIndex={-1}
      className="py-24 md:py-40 bg-surface-100 relative scroll-mt-[calc(var(--landing-header-height,64px)+16px)] overflow-hidden focus-visible:outline-none"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35 bg-landing-guide-wash"
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <LandingSectionHeader
            title="요금제"
            subtitle="비즈니스 규모에 맞는 최적의 플랜을 선택하세요."
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7 max-w-7xl mx-auto items-stretch">
          {LANDING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`bg-surface-100 rounded-[28px] p-7 lg:p-8 relative transition-[box-shadow,transform,border-color] duration-300 flex flex-col ${
                plan.featured
                  ? "order-first md:order-0 border border-primary-400/55 shadow-landing-featured-plan -translate-y-1"
                  : "border border-surface-400/70 shadow-card hover:shadow-card-hover"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-400 text-surface-100 px-4 py-1.5 rounded-[99px] text-[12px] font-semibold shadow-landing-pill">
                  인기 플랜
                </div>
              )}

              <h3 className="text-xl font-bold text-text-title mb-2">
                {plan.name}
              </h3>
              <p className="font-body2 text-text-auth-sub mb-6 leading-relaxed break-keep">
                {plan.target}
              </p>

              <div className="mb-7">
                <div className="flex items-end gap-2">
                  <span className="text-[30px] leading-none font-extrabold tracking-[-0.02em] text-text-title">
                    {plan.price}
                  </span>
                  {plan.priceUnit && (
                    <span className="pb-1 text-[14px] font-semibold text-text-muted">
                      {plan.priceUnit}
                    </span>
                  )}
                </div>
                {plan.priceUnit && plan.priceSubText && (
                  <div className="mt-2 font-caption text-text-muted">
                    {plan.priceSubText}
                  </div>
                )}
              </div>

              {plan.name === "프로" ? (
                <a
                  href={proMailtoHref}
                  className={`w-full h-12 rounded-2xl font-semibold transition-colors mb-4 inline-flex items-center justify-center ${
                    plan.featured
                      ? "bg-primary-400 text-surface-100 hover:bg-primary-500 shadow-landing-cta"
                      : "bg-text-disabled text-text-title hover:brightness-95 active:brightness-90 border border-surface-400/70"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-100`}
                >
                  {plan.buttonText}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleCta}
                  className={`w-full h-12 rounded-2xl font-semibold transition-colors mb-4 ${
                    plan.featured
                      ? "bg-primary-400 text-surface-100 hover:bg-primary-500 shadow-landing-cta"
                      : "bg-text-disabled/50 text-text-title hover:brightness-95 active:brightness-90 border border-surface-400/70"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-100`}
                >
                  {plan.buttonText}
                </button>
              )}

              <p className="text-[13px] text-text-muted mb-8">
                {plan.assurance}
              </p>

              <div className="h-px w-full bg-surface-400/70 mb-7" />

              <ul
                className={`space-y-4 text-sm font-body2 flex-1 ${plan.featured ? "text-text-title" : "text-text-auth-sub"}`}
              >
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    <CheckIcon enabled={feature.enabled} />
                    <span
                      className={
                        feature.enabled
                          ? "text-current"
                          : "text-text-disabled line-through decoration-text-disabled/70"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
