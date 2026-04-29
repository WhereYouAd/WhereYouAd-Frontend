import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import ChevronDown from "@/assets/icon/chevron/chevron-down.svg?react";
import MockupTestImage from "@/assets/mockup/optimized/mockup_test.jpg";

export default function LandingHero() {
  return (
    <section className="relative w-full overflow-hidden bg-brand-300">
      <img
        src={MockupTestImage}
        alt=""
        aria-hidden
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden />
      <motion.div
        className="relative z-10 min-h-[calc(100dvh-72px)] flex flex-col items-center justify-start text-center max-w-3xl mx-auto px-6 space-y-5 pt-45 md:pt-32 pb-24"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center rounded-full border border-white/35 bg-black/25 px-3 py-1 text-[12px] font-semibold text-white">
            WhereYouAd
          </span>
          <span className="text-[12px] font-caption text-white/80">
            광고 통합 대시보드
          </span>
        </div>
        <h1 className="text-white tracking-[-0.03em] leading-[1.15] break-keep font-bold whitespace-pre-line text-[26px] sm:text-[36px] md:text-[64px]">
          광고 성과를 실시간으로{"\n"}한 화면에서 관리하세요
        </h1>
        <p className="text-[15px] text-white/85 font-normal break-keep max-w-2xl">
          Google·Meta 파트너 서비스로 광고 데이터를 한 곳에서 관리하세요.
        </p>

        <div className="pt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-brand-900 text-white active-scale transition-smooth hover:bg-logo-2 shadow-[0_10px_30px_rgba(0,0,0,0.18)] font-semibold py-[14px] px-[28px]"
          >
            무료로 시작하기
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-transparent text-white active-scale transition-smooth hover:bg-white/12 font-semibold py-[14px] px-[28px] border-[1.5px] border-white/70"
          >
            로그인
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/75"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-15 h-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}
