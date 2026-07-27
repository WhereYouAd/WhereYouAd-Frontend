import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { LANDING_GUIDE_PAGES } from "@/constants/landing/guide";

import GuideOverviewChart from "@/components/landing/GuideOverviewChart";
import GuidePlatform from "@/components/landing/GuidePlatform";
import GuideTimeline from "@/components/landing/GuideTimeline";
import GuideWorkspace from "@/components/landing/GuideWorkspace";
import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

import CheckIcon from "@/assets/icon/common/check.svg?react";

export default function LandingGuide() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        setIsInView(visible.length > 0);
        if (visible.length === 0) return;

        const closest = visible.reduce((best, entry) =>
          entry.intersectionRatio > best.intersectionRatio ? entry : best,
        );
        const idx = stepRefs.current.indexOf(closest.target as HTMLDivElement);
        if (idx !== -1) setActiveIndex(idx);
      },
      { threshold: [0.1, 0.25, 0.5, 0.75, 1], rootMargin: "-45% 0px -45% 0px" },
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
          className="mb-10 md:mb-16 relative"
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

        <div className="space-y-12 md:space-y-32 relative">
          {LANDING_GUIDE_PAGES.map((page, idx) => (
            <motion.div
              key={page.number}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
              className={`flex flex-col ${page.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-6 md:gap-12`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className={`w-full md:w-1/2 rounded-3xl overflow-hidden ${
                  page.useTimeline ||
                  page.usePlatform ||
                  page.useOverview ||
                  page.useWorkspace
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
                ) : page.useWorkspace ? (
                  <div className="p-0 bg-transparent">
                    <GuideWorkspace />
                  </div>
                ) : null}
              </motion.div>

              <motion.div
                className="w-full md:w-1/2 md:max-w-120 flex flex-col gap-5"
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
                  <span className="select-none font-heading2 leading-none text-primary-400 md:font-heading1">
                    {page.number}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 font-caption text-primary-500 tracking-wide">
                    {page.label}
                  </span>
                </div>

                <h3 className="break-keep text-balance font-heading3 text-text-title md:font-heading2">
                  {page.title}
                </h3>

                <p className="break-keep whitespace-pre-line font-body1 text-text-auth-sub">
                  {page.description}
                </p>

                <ul className="mt-2 flex flex-col gap-2.5">
                  {page.steps.map((item) => (
                    <li key={item.step} className="flex items-center gap-2.5">
                      <CheckIcon className="w-4 h-4 shrink-0 text-primary-400" />
                      <span className="break-keep font-label text-text-title">
                        {item.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 진행 인디케이터: 화면 우측에 고정, 현재 보고 있는 스텝을 표시 */}
      <div
        aria-hidden={!isInView}
        className={`hidden lg:flex fixed right-6 xl:right-10 top-1/2 z-30 -translate-y-1/2 flex-col items-center gap-5 transition-opacity duration-300 ${
          isInView ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LANDING_GUIDE_PAGES.map((page, idx) => (
          <button
            key={page.number}
            type="button"
            onClick={() =>
              stepRefs.current[idx]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
            aria-label={`${page.number} ${page.label}로 이동`}
            aria-current={idx === activeIndex ? "step" : undefined}
            className="group flex flex-col items-center gap-1.5"
          >
            <span
              className={`font-caption tabular-nums transition-colors duration-300 ${
                idx === activeIndex ? "text-primary-400" : "text-text-muted/60"
              }`}
            >
              {page.number}
            </span>
            <span
              className={`w-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "h-6 bg-primary-400"
                  : "h-1.5 bg-surface-400/60 group-hover:bg-text-muted/60"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
