import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";

import { HOW_IT_WORKS_STEPS } from "@/constants/landing";

import { staggerContainer } from "@/hooks/useScrollAnimation";

// ─── 스텝별 아이콘 ────────────────────────────────────────────────────────────
const STEP_ICONS = [
  // 광고 채널 연결 — 플러그/링크
  ({ active }: { active: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={`h-6 w-6 transition-colors duration-300 ${active ? "text-indigo-300" : "text-white/40"}`}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  // 트래킹 URL 발급 — 코드/슬래시
  ({ active }: { active: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={`h-6 w-6 transition-colors duration-300 ${active ? "text-indigo-300" : "text-white/40"}`}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  // 클릭 이벤트 수집 — 번개
  ({ active }: { active: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={`h-6 w-6 transition-colors duration-300 ${active ? "text-indigo-300" : "text-white/40"}`}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  // 통합 모니터링 — 바 차트
  ({ active }: { active: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={`h-6 w-6 transition-colors duration-300 ${active ? "text-indigo-300" : "text-white/40"}`}
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
] as const;

// ─── 점선 연결선 ──────────────────────────────────────────────────────────────
function ConnectorLine({ animate: shouldAnimate }: { animate: boolean }) {
  return (
    <div className="hidden flex-1 items-center md:flex">
      <svg viewBox="0 0 80 8" className="w-full" preserveAspectRatio="none">
        <motion.line
          x1="0"
          y1="4"
          x2="80"
          y2="4"
          stroke="rgba(99,102,241,0.4)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            shouldAnimate
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {/* 화살표 머리 */}
        <motion.path
          d="M74 1.5 L79 4 L74 6.5"
          fill="none"
          stroke="rgba(99,102,241,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
        />
      </svg>
    </div>
  );
}

// ─── 스텝 카드 ────────────────────────────────────────────────────────────────
interface IStepCardProps {
  step: (typeof HOW_IT_WORKS_STEPS)[number];
  index: number;
  active: boolean;
}

const stepVariant: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay: i * 0.2 },
  }),
};

function StepCard({ step, index, active }: IStepCardProps) {
  const Icon = STEP_ICONS[index];

  return (
    <motion.div
      custom={index}
      variants={stepVariant}
      className="flex flex-col items-center gap-4 text-center md:items-start md:text-left"
    >
      {/* 아이콘 + 번호 원 */}
      <div className="relative">
        <motion.div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 ${
            active
              ? "border-indigo-500/50 bg-indigo-500/15 shadow-lg shadow-indigo-500/20"
              : "border-white/10 bg-white/5"
          }`}
          animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{
            duration: 1.4,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <Icon active={active} />
        </motion.div>
        {/* 번호 뱃지 */}
        <span
          className={`absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300 ${
            active ? "bg-indigo-500 text-white" : "bg-white/10 text-white/40"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* 텍스트 */}
      <div>
        <h3
          className={`mb-1.5 text-sm font-bold transition-colors duration-300 ${
            active ? "text-white" : "text-white/60"
          }`}
        >
          {step.title}
        </h3>
        <p
          className={`text-xs leading-relaxed transition-colors duration-300 ${
            active ? "text-white/60" : "text-white/30"
          }`}
        >
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── HowItWorksSection ────────────────────────────────────────────────────────
export default function HowItWorksSection() {
  const controls = useAnimation();
  const [sectionRef, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
      // 뷰포트 진입 후 스텝 순차 하이라이트
      intervalRef.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % HOW_IT_WORKS_STEPS.length);
      }, 2200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [inView, controls]);

  return (
    <section className="relative overflow-hidden px-6 py-28">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-indigo-950/8 to-transparent" />

      <div className="mx-auto max-w-5xl">
        {/* 섹션 헤더 */}
        <div
          ref={sectionRef}
          className="mb-16 flex flex-col items-center gap-3 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400"
          >
            How it works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl font-extrabold text-white md:text-4xl"
          >
            3분이면 시작할 수 있어요
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="max-w-md text-sm text-white/45"
          >
            복잡한 설정 없이, 채널 연결만 하면 데이터가 바로 흐릅니다.
          </motion.p>
        </div>

        {/* 스텝 + 연결선 */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="flex flex-col gap-8 md:flex-row md:items-start md:gap-0"
        >
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.step} className="contents">
              <div
                className="flex-1"
                onClick={() => setActiveStep(i)}
                style={{ cursor: "pointer" }}
              >
                <StepCard step={step} index={i} active={activeStep === i} />
              </div>
              {i < HOW_IT_WORKS_STEPS.length - 1 && (
                <ConnectorLine animate={inView && activeStep > i} />
              )}
            </div>
          ))}
        </motion.div>

        {/* 진행 바 */}
        <div className="mt-12 flex justify-center gap-2">
          {HOW_IT_WORKS_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className="h-1 overflow-hidden rounded-full bg-white/10 transition-all duration-300"
              style={{ width: activeStep === i ? 32 : 8 }}
            >
              {activeStep === i && (
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "linear" }}
                  key={activeStep}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
