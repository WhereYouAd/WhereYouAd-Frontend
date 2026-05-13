import { motion } from "framer-motion";

import ChevronDown from "@/assets/icon/chevron/chevron-down.svg?react";
import HeroBg1280Avif from "@/assets/mockup/optimized/landing/hero-bg-1280.avif";
import HeroBg1280Webp from "@/assets/mockup/optimized/landing/hero-bg-1280.webp";
import MockupTestImage from "@/assets/mockup/optimized/mockup_test.jpg";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLElement)) return;

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });

  if (prefersReducedMotion) {
    el.focus({ preventScroll: true });
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
    });
  });
}

export default function LandingHero() {
  return (
    <section className="relative w-full overflow-hidden bg-primary-100">
      <picture>
        <source type="image/avif" srcSet={HeroBg1280Avif} />
        <source type="image/webp" srcSet={HeroBg1280Webp} />
        <img
          src={MockupTestImage}
          alt=""
          aria-hidden
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />
      </picture>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-landing-hero-scrim"
        aria-hidden
      />
      <motion.div
        className="relative z-10 min-h-[calc(100dvh-var(--landing-header-height,64px))] flex flex-col items-center justify-start text-center max-w-3xl mx-auto px-6 space-y-4 pt-36 md:pt-24 pb-24"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-full border border-surface-100/35 bg-surface-500/25 px-3 py-1 font-caption text-surface-100">
            WhereYouAd
          </span>
          <span className="font-caption text-surface-100/80">
            광고 통합 대시보드
          </span>
        </div>
        <h1 className="break-keep whitespace-pre-line font-heading2 text-surface-100 sm:font-heading1 md:font-hero">
          광고 성과를 실시간으로{"\n"}한 화면에서 관리하세요
        </h1>
        <p className="max-w-2xl break-keep font-body1 text-surface-100/85">
          Google·Meta 파트너 서비스로 광고 데이터를 한 곳에서 관리하세요.
        </p>
      </motion.div>

      <motion.div
        className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-surface-100/75"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
      >
        <motion.button
          type="button"
          aria-label="다음 섹션(기능)으로 이동"
          onClick={() => scrollToSection("features")}
          className="rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-100/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-500/30"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-15 h-auto" focusable="false" />
        </motion.button>
      </motion.div>
    </section>
  );
}
