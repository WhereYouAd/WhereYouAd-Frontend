import { motion } from "framer-motion";

import { PROBLEMS } from "@/constants/landing";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// ─── 문제별 아이콘 ────────────────────────────────────────────────────────────
const PROBLEM_ICONS = [
  // 채널마다 따로 접속 — 분리된 창 아이콘
  ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <rect x="2" y="3" width="9" height="7" rx="1.5" />
      <rect x="13" y="3" width="9" height="7" rx="1.5" />
      <rect x="2" y="14" width="9" height="7" rx="1.5" />
      <rect x="13" y="14" width="9" height="7" rx="1.5" />
    </svg>
  ),
  // 이슈를 너무 늦게 발견 — 알람 + 느낌표 아이콘
  ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <line x1="12" y1="6" x2="12" y2="10" />
      <line
        x1="12"
        y1="13"
        x2="12"
        y2="13.5"
        strokeLinecap="round"
        strokeWidth={2}
      />
    </svg>
  ),
  // 데이터가 파편화 — 흩어진 점들 아이콘
  ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <circle cx="12" cy="12" r="2" />
      <line x1="7" y1="5" x2="10" y2="5" strokeDasharray="2 2" />
      <line x1="14" y1="5" x2="17" y2="5" strokeDasharray="2 2" />
      <line x1="5" y1="7" x2="5" y2="17" strokeDasharray="2 2" />
      <line x1="19" y1="7" x2="19" y2="17" strokeDasharray="2 2" />
      <line x1="7" y1="12" x2="10" y2="12" strokeDasharray="2 2" />
      <line x1="14" y1="12" x2="17" y2="12" strokeDasharray="2 2" />
    </svg>
  ),
] as const;

const CARD_ACCENT = [
  {
    border: "border-blue-500/20 hover:border-blue-500/60",
    icon: "text-blue-400 bg-blue-500/10",
    glow: "group-hover:shadow-blue-500/10",
    badge: "text-blue-400 bg-blue-500/10",
  },
  {
    border: "border-orange-500/20 hover:border-orange-500/60",
    icon: "text-orange-400 bg-orange-500/10",
    glow: "group-hover:shadow-orange-500/10",
    badge: "text-orange-400 bg-orange-500/10",
  },
  {
    border: "border-rose-500/20 hover:border-rose-500/60",
    icon: "text-rose-400 bg-rose-500/10",
    glow: "group-hover:shadow-rose-500/10",
    badge: "text-rose-400 bg-rose-500/10",
  },
] as const;

// ─── ProblemSection ───────────────────────────────────────────────────────────
export default function ProblemSection() {
  const { ref, controls, staggerContainer, staggerItem } = useScrollAnimation();

  return (
    <section className="relative overflow-hidden px-6 py-28">
      {/* 배경 그라디언트 */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-rose-950/5 to-transparent" />

      <div className="mx-auto max-w-5xl">
        {/* 섹션 헤더 */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="mb-16 flex flex-col items-center gap-3 text-center"
        >
          <motion.span
            variants={staggerItem}
            className="inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400"
          >
            Pain Points
          </motion.span>
          <motion.h2
            variants={staggerItem}
            className="text-3xl font-extrabold text-white md:text-4xl"
          >
            광고팀이 매일 겪는 문제들
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="max-w-md text-sm text-white/45"
          >
            채널이 늘어날수록 관리 비용은 기하급수적으로 증가합니다.
          </motion.p>
        </motion.div>

        {/* 문제 카드 그리드 */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="grid gap-5 md:grid-cols-3"
        >
          {PROBLEMS.map((problem, i) => {
            const Icon = PROBLEM_ICONS[i];
            const accent = CARD_ACCENT[i];

            return (
              <motion.div
                key={problem.id}
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative rounded-2xl border bg-white/4 p-7 backdrop-blur-sm transition-shadow duration-300 ${accent.border} ${accent.glow} hover:shadow-xl`}
              >
                {/* 호버 시 배경 글로우 */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 70%)",
                  }}
                />

                {/* 아이콘 */}
                <div
                  className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent.icon}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* 텍스트 */}
                <h3 className="mb-2 text-base font-bold text-white">
                  {problem.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {problem.description}
                </p>

                {/* 우하단 번호 */}
                <span
                  className={`absolute bottom-5 right-6 text-3xl font-black tabular-nums opacity-10 ${accent.icon.split(" ")[0]}`}
                >
                  0{i + 1}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
