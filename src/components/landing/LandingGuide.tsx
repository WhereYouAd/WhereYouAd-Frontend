import { motion } from "framer-motion";

import { LANDING_GUIDE_PAGES } from "@/constants/landing/guide";

import GuideOverviewChart from "@/components/landing/GuideOverviewChart";
import GuidePlatform from "@/components/landing/GuidePlatform";
import GuideTimeline from "@/components/landing/GuideTimeline";
import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

export default function LandingGuide() {
  return (
    <section
      id="guide"
      tabIndex={-1}
      className="py-24 md:py-40 bg-surface-100 scroll-mt-[calc(var(--landing-header-height,64px)+16px)] relative overflow-hidden focus-visible:outline-none"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35 bg-landing-guide-wash"
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16 relative"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <LandingSectionHeader
            title="이용 가이드"
            subtitle="WhereYouAd의 주요 기능을 단계별로 확인해보세요."
          />
        </motion.div>

        <div className="space-y-20 md:space-y-32 relative">
          {LANDING_GUIDE_PAGES.map((page) => (
            <motion.div
              key={page.number}
              className={`flex flex-col ${page.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-12`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className={`w-full md:w-3/5 rounded-3xl overflow-hidden ${
                  page.useTimeline || page.usePlatform || page.useOverview
                    ? "bg-transparent shadow-none"
                    : "bg-surface-100 shadow-Soft border border-surface-400/70"
                }`}
                initial={{ opacity: 0, x: page.reverse ? 42 : -42 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {page.useOverview ? (
                  <div className="p-0 bg-transparent">
                    <GuideOverviewChart />
                  </div>
                ) : page.useTimeline ? (
                  <div className="p-0 bg-transparent">
                    <GuideTimeline />
                  </div>
                ) : page.usePlatform ? (
                  <div className="p-0 bg-transparent">
                    <GuidePlatform />
                  </div>
                ) : (
                  <img
                    src={page.image}
                    alt={page.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-cover object-top"
                  />
                )}
              </motion.div>

              <motion.div
                className="w-full md:w-2/5 md:max-w-120 flex flex-col gap-5"
                initial={{ opacity: 0, x: page.reverse ? -42 : 42 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="select-none font-heading1 leading-none text-primary-400">
                    {page.number}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary-300 px-3 py-1 font-caption text-surface-100 shadow-Soft tracking-wide">
                    {page.label}
                  </span>
                </div>

                <h3 className="break-keep text-balance font-heading2 text-text-title">
                  {page.title}
                </h3>

                <p className="break-keep whitespace-pre-line font-body1 text-text-auth-sub">
                  {page.description}
                </p>

                <div className="mt-2 grid gap-3">
                  {page.steps.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-2xl border border-surface-400/60 bg-surface-100/70 backdrop-blur-sm px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="break-keep text-balance font-label text-text-title">
                          {item.title}
                        </span>
                      </div>
                      <p className="mt-2 break-keep font-body2 text-text-auth-sub">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
