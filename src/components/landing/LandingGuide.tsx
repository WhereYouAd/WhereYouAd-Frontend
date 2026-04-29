import { motion } from "framer-motion";

import GuideOverviewChart from "@/components/landing/GuideOverviewChart";
import GuidePlatform from "@/components/landing/GuidePlatform";
import GuideTimeline from "@/components/landing/GuideTimeline";
import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

import TimelineDashboard from "@/assets/mockup/optimized/timeline_dashboard.jpg";

type TGuideStep = { step: number; title: string; text: string };

type TGuidePage = {
  number: string;
  label: string;
  title: string;
  description: string;
  steps: TGuideStep[];
  image?: string;
  alt?: string;
  reverse: boolean;
  useOverview?: boolean;
  useTimeline?: boolean;
  usePlatform?: boolean;
};

const pages: TGuidePage[] = [
  {
    number: "01",
    label: "통합 대시보드",
    title: "광고 현황을 한눈에 파악하세요",
    description:
      "주요 KPI부터 채널별 성과, 실시간 알림까지 모든 정보를 하나의 화면에서 확인할 수 있습니다.",
    steps: [
      {
        step: 1,
        title: "핵심 지표를 즉시 확인",
        text: "상단 요약 카드에서 노출수·클릭수·전환율 등 핵심 KPI를 빠르게 확인합니다.",
      },
      {
        step: 2,
        title: "채널별 효율 비교",
        text: "채널별 성과 차트로 매체 간 효율을 비교하고 예산 재배분을 결정합니다.",
      },
    ],
    useOverview: true,
    reverse: false,
  },
  {
    number: "02",
    label: "매체 통합 관리",
    title: "플랫폼별 캠페인을 한 곳에서 관리하세요",
    description:
      "다수의 광고 매체를 별도 로그인 없이 통합 관리하고, 캠페인 설정부터 소재 심사까지 원스톱으로 처리합니다.",
    steps: [
      {
        step: 1,
        title: "플랫폼 선택 후 현황 조회",
        text: "매체사 목록에서 플랫폼을 선택해 캠페인 전체 현황을 확인합니다.",
      },
      {
        step: 2,
        title: "인라인으로 빠르게 편집",
        text: "예산·기간·타겟 설정을 인라인 편집으로 빠르게 수정하고 저장합니다.",
      },
    ],
    usePlatform: true,
    reverse: true,
  },
  {
    number: "03",
    label: "일정 관리 타임라인",
    title: "타임라인으로 캠페인 일정을 계획하세요",
    description:
      "간트 차트 방식으로 전체 캠페인 기간을 시각화하고, 기간별 성과를 비교합니다.",
    steps: [
      {
        step: 1,
        title: "캠페인을 한눈에 파악",
        text: "타임라인 뷰에서 캠페인 일정을 주·월 단위로 한눈에 확인합니다.",
      },
      {
        step: 2,
        title: "기간별 성과 세부 확인",
        text: "타임라인 바를 클릭하면 해당 기간의 클릭수, 전환 등 세부 성과 지표를 확인할 수 있습니다.",
      },
    ],
    image: TimelineDashboard,
    alt: "Timeline 대시보드 화면",
    useTimeline: true,
    reverse: false,
  },
];

export default function LandingGuide() {
  return (
    <section
      id="guide"
      className="py-24 md:py-40 bg-brand-200 scroll-mt-20 relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(900px 320px at 20% 0%, rgba(46, 180, 255, 0.16), transparent 60%), radial-gradient(900px 320px at 80% 10%, rgba(96, 136, 254, 0.12), transparent 60%)",
        }}
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
          {pages.map((page) => (
            <motion.div
              key={page.number}
              className={`flex flex-col ${page.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-12`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className={`w-full md:w-3/5 rounded-component-lg overflow-hidden ${
                  page.useTimeline || page.usePlatform || page.useOverview
                    ? "bg-transparent shadow-none"
                    : "bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)] border border-chart-inactive/70"
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
                  <span className="text-4xl font-bold text-brand-600/35 leading-none select-none">
                    {page.number}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-brand-300 px-3 py-1 text-[11px] font-semibold text-text-sub tracking-wide">
                    {page.label}
                  </span>
                </div>

                <h3 className="font-heading2 text-text-main leading-snug break-keep text-balance">
                  {page.title}
                </h3>

                <p className="font-body1 text-text-auth-sub leading-relaxed break-keep">
                  {page.description}
                </p>

                <div className="mt-2 grid gap-3">
                  {page.steps.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-component-md border border-chart-inactive/60 bg-white/70 backdrop-blur-sm px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-body1 font-bold text-text-main leading-snug break-keep text-balance">
                          {item.title}
                        </span>
                      </div>
                      <p className="mt-2 font-body2 text-text-auth-sub leading-relaxed break-keep">
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
