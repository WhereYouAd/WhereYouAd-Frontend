import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";
import ChevronRight from "@/assets/icon/chevron/chevron-right.svg?react";
import ChevronUp from "@/assets/icon/chevron/chevron-up.svg?react";
import UserIcon from "@/assets/icon/common/user.svg?react";
import GoogleAdsLogo from "@/assets/logo/social-logo/circle/googleAds-circle.svg?react";
import KakaoLogo from "@/assets/logo/social-logo/circle/kakao-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

type TFeatureCardProps = {
  delay: number;
  title: string;
  description: string;
  Graphic: () => ReactNode;
};

function IntegrationGraphic() {
  return (
    <motion.div
      className="relative w-70"
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div className="flex items-center justify-between px-4 py-3 bg-surface-100/80 rounded-2xl border border-surface-400/70 shadow-landing-pill opacity-60 blur-[0.5px] transition-all duration-300 relative z-0">
        <div className="flex items-center gap-3">
          <NaverLogo className="w-8 h-8 rounded-full shadow-landing-pill" />
          <div className="flex flex-col text-left">
            <span className="font-body2 text-text-muted">Naver</span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-xl border border-surface-400/70 bg-surface-100/70 flex items-center justify-center shrink-0">
          <ChevronRight className="text-text-muted w-3.5 h-3.5" />
        </div>
      </motion.div>

      <motion.div className="-mt-3 flex items-center justify-between px-4 py-3.5 bg-surface-100 rounded-2xl shadow-landing-integration border border-surface-400/60 relative z-20 scale-[1.02]">
        <div className="flex items-center gap-3">
          <div className="bg-surface-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0 shadow-landing-pill overflow-hidden border border-surface-400/70">
            <GoogleAdsLogo className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-body2 tracking-wide text-text-title">
              Google Ads
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-surface-100 border border-surface-400/70 flex items-center justify-center shrink-0 ml-2">
          <ChevronRight className="text-text-muted w-3.5 h-3.5" />
        </div>
      </motion.div>

      <motion.div className="-mt-3 flex items-center justify-between px-4 py-3 bg-surface-100/80 rounded-2xl border border-surface-400/70 shadow-landing-pill opacity-60 blur-[0.5px] transition-all duration-300 relative z-10">
        <div className="flex items-center gap-3">
          <KakaoLogo className="w-8 h-8 rounded-full shadow-landing-pill" />
          <div className="flex flex-col text-left">
            <span className="font-body2 text-text-muted">Kakao</span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-xl border border-surface-400/70 bg-surface-100/70 flex items-center justify-center shrink-0">
          <ChevronRight className="text-text-muted w-3.5 h-3.5" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function WorkflowGraphic() {
  return (
    <div className="absolute left-0 bg-surface-100 backdrop-blur-sm rounded-r-full rounded-l-none p-3 pl-4 pr-5 flex items-center gap-3 shadow-landing-float border border-surface-400/60">
      <div
        aria-hidden
        className="h-10 rounded-full flex items-center px-4 gap-2 shrink-0 mx-0.5 shadow-md shadow-primary-400/20 relative overflow-hidden select-none"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-400), var(--color-primary-500))",
        }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -left-1/3 top-[-20%] h-[140%] w-[42%] rotate-12 blur-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-surface-100) 42%, transparent), transparent)",
          }}
          animate={{
            x: ["-140%", "220%"],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            repeatDelay: 1.1,
          }}
        />
        <span className="font-body1 text-surface-100">AI로 요약하기</span>
        <SparkleIcon className="w-4.5 h-auto ml-0.5 text-surface-100 fill-current" />
      </div>
      <div
        aria-hidden
        className="shrink-0 select-none rounded-full border border-surface-400/70 bg-surface-100/60 px-4 py-1.5 font-body2 text-text-muted"
      >
        다운로드
      </div>
    </div>
  );
}

function WorkspaceGraphic() {
  const fullText = "WhereYouAd@email.com";
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.45 });

  useEffect(() => {
    if (!isInView) return;

    setShowCursor(true);
    setTypedText("");

    const msPerChar = 40;
    const startAt = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const nextIndex = Math.min(
        fullText.length,
        Math.floor((now - startAt) / msPerChar),
      );

      setTypedText((prev) => {
        const next = fullText.slice(0, nextIndex);
        return prev === next ? prev : next;
      });

      if (nextIndex >= fullText.length) {
        setShowCursor(false);
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isInView, fullText]);

  return (
    <div
      ref={containerRef}
      className="bg-surface-100 rounded-3xl shadow-landing-card-deep w-70 p-4 flex flex-col gap-4 border border-surface-400/60"
    >
      <div className="flex gap-3">
        <div className="w-7 h-7 bg-color-primary-100 overflow-hidden shrink-0 mt-0.5 rounded-full flex items-center justify-center border border-surface-400/70">
          <UserIcon className="w-5 h-auto object-contain opacity-70" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="font-body2 text-text-title">You</span>
            <span className="font-caption text-text-muted">Team JSON</span>
          </div>
          <p className="font-body2 text-text-auth-sub">
            새로운 멤버를 초대하세요!
          </p>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-2 bg-color-primary-100 border border-surface-400/70 rounded-full p-1 pl-4">
        <div
          aria-hidden
          className="flex-1 truncate border-0 bg-transparent pt-0.5 font-body2 text-text-muted outline-none"
        >
          {typedText}
        </div>
        {showCursor && (
          <span className="-ml-1 animate-pulse font-body2 text-primary-400">
            |
          </span>
        )}
        <div
          aria-hidden
          className="w-7 h-7 rounded-full flex items-center justify-center bg-primary-500 shrink-0 shadow-landing-pill"
        >
          <ChevronUp className="text-surface-100 w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

export default function LandingFeatures() {
  const featureCards: Omit<TFeatureCardProps, "delay">[] = [
    {
      title: "광고 매체 연동",
      description:
        "클릭 한 번으로 모든 광고 매체와 마테크 서비스의 데이터를 간편하게 연동하세요.",
      Graphic: IntegrationGraphic,
    },
    {
      title: "AI 기반 워크플로우 제안",
      description:
        "데이터를 바탕으로 최적의 다음 액션과 워크플로우를 자동으로 제안받으세요.",
      Graphic: WorkflowGraphic,
    },
    {
      title: "조직을 이어주는 워크스페이스",
      description:
        "에이전시 및 팀원들과 캠페인 맥락을 잃지 않고 한 곳에서 효율적으로 소통하세요.",
      Graphic: WorkspaceGraphic,
    },
  ];

  return (
    <section
      id="features"
      tabIndex={-1}
      className="py-24 md:py-40 bg-surface-100 relative scroll-mt-[calc(var(--landing-header-height,64px)+16px)] focus-visible:outline-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <LandingSectionHeader title="어디서든 완벽한 광고 관리 경험" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {featureCards.map(({ title, description, Graphic }, idx) => (
            <motion.div
              key={title}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="w-full aspect-4/3 bg-surface-200 rounded-4xl flex items-center justify-center mb-8 relative overflow-hidden group">
                <Graphic />
              </div>
              <h3 className="mb-3 font-heading4 text-text-title">{title}</h3>
              <p className="max-w-70 font-body2 text-text-auth-sub">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
