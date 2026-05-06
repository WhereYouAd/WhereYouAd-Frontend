import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

import { LANDING_META } from "@/constants/landing";

import { staggerContainer, staggerItem } from "@/hooks/useScrollAnimation";

// ─── 숫자 카운터 훅 ──────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1600, delay = 0) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
        setCount(Math.floor(eased * target));
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return count;
}

// ─── 채널 카드 ───────────────────────────────────────────────────────────────
interface IChannelCardProps {
  channel: string;
  metric: string;
  target: number;
  color: string;
  dot: string;
  delay: number;
}

function ChannelCard({
  channel,
  metric,
  target,
  color,
  dot,
  delay,
}: IChannelCardProps) {
  // 목업 진입(0.3s delay + 0.8s duration) 이후 시작
  const count = useCounter(target, 1600, 1100 + delay);

  return (
    <div
      className={`min-w-0 flex-1 rounded-xl border p-4 ${color} backdrop-blur-sm`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <span className="text-xs font-semibold tracking-wide text-white/80">
          {channel}
        </span>
      </div>
      <p className="mb-1 text-[11px] text-white/50">{metric}</p>
      <p className="text-2xl font-bold tabular-nums text-white">
        {count.toLocaleString()}
      </p>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-white/40"
          initial={{ width: 0 }}
          animate={{ width: `${(count / target) * 100}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
    </div>
  );
}

// ─── 대시보드 목업 ────────────────────────────────────────────────────────────
const CHANNEL_CARDS: IChannelCardProps[] = [
  {
    channel: "Google Ads",
    metric: "오늘 클릭수",
    target: 12847,
    color: "bg-blue-600/30 border-blue-500/30",
    dot: "bg-blue-400",
    delay: 0,
  },
  {
    channel: "Meta",
    metric: "노출 횟수",
    target: 98532,
    color: "bg-purple-600/30 border-purple-500/30",
    dot: "bg-purple-400",
    delay: 150,
  },
  {
    channel: "Naver",
    metric: "전환 수",
    target: 3241,
    color: "bg-emerald-600/30 border-emerald-500/30",
    dot: "bg-emerald-400",
    delay: 300,
  },
];

function DashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-900/80 shadow-2xl shadow-black/50 backdrop-blur-md">
      {/* 브라우저 크롬 바 */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <div className="ml-3 flex-1 rounded-md bg-white/10 px-3 py-1 text-[11px] text-white/30">
          app.whereyouad.com/dashboard
        </div>
      </div>

      <div className="p-5">
        {/* 상단 레이블 */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-white/70">통합 성과 개요</p>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            LIVE
          </span>
        </div>

        {/* 채널 카드 */}
        <div className="flex gap-3">
          {CHANNEL_CARDS.map((card) => (
            <ChannelCard key={card.channel} {...card} />
          ))}
        </div>

        {/* 미니 SVG 차트 */}
        <div className="mt-4 h-20 overflow-hidden rounded-xl border border-white/5 bg-white/5 px-4 py-3">
          <p className="mb-2 text-[10px] text-white/30">클릭 추이 (최근 24h)</p>
          <svg
            viewBox="0 0 300 36"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="heroLineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,32 C20,28 40,18 60,20 S100,8 120,13 S160,4 180,7 S220,10 240,4 S280,1 300,3"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 1.2 }}
            />
            <motion.path
              d="M0,32 C20,28 40,18 60,20 S100,8 120,13 S160,4 180,7 S220,10 240,4 S280,1 300,3 L300,36 L0,36 Z"
              fill="url(#heroLineGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 1.4 }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const textControls = useAnimation();
  const mockupControls = useAnimation();

  useEffect(() => {
    const run = async () => {
      await textControls.start("visible");
      mockupControls.start("visible");
    };
    run();
  }, [textControls, mockupControls]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
      {/* 배경 도트 패턴 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(99,102,241,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* 배경 글로우 블롭 */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-125 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

      {/* ── 텍스트 블록 ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-5 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate={textControls}
      >
        {/* 뱃지 */}
        <motion.div variants={staggerItem}>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            실시간 광고 모니터링 플랫폼
          </span>
        </motion.div>

        {/* 헤드라인 */}
        <motion.h1
          variants={staggerItem}
          className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl"
        >
          {LANDING_META.tagline}
        </motion.h1>

        {/* 서브 카피 */}
        <motion.p
          variants={staggerItem}
          className="max-w-xl text-base leading-relaxed text-white/55 md:text-lg"
        >
          {LANDING_META.subCopy.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < LANDING_META.subCopy.split("\n").length - 1 && <br />}
            </span>
          ))}
        </motion.p>

        {/* CTA 버튼 */}
        <motion.div
          variants={staggerItem}
          className="mt-2 flex flex-wrap items-center gap-3"
        >
          <motion.button
            className="relative rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                "0 0 0px 0px rgba(99,102,241,0)",
                "0 0 22px 7px rgba(99,102,241,0.45)",
                "0 0 0px 0px rgba(99,102,241,0)",
              ],
            }}
            transition={{
              boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            무료로 시작하기
          </motion.button>

          <motion.button
            className="rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm"
            whileHover={{
              scale: 1.04,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            데모 보기
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── 대시보드 목업 ── */}
      <motion.div
        className="relative z-10 mt-16 w-full max-w-3xl"
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
          },
        }}
        initial="hidden"
        animate={mockupControls}
      >
        {/* float 루프 */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        >
          <DashboardMockup />
        </motion.div>

        {/* 하단 페이드 아웃 */}
        <div className="pointer-events-none absolute -bottom-8 left-0 right-0 h-20 bg-linear-to-t from-gray-950 to-transparent" />
      </motion.div>

      {/* ── 스크롤 인디케이터 ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/30">
          Scroll
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M8 3v10M4 9l4 4 4-4"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
