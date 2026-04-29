import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

type TFeature = { text: string; enabled: boolean };

type TPlan = {
  name: string;
  target: string;
  price: string;
  priceUnit?: string;
  priceSubText?: string;
  buttonText: string;
  featured: boolean;
  assurance: string;
  features: TFeature[];
};

const plans: TPlan[] = [
  {
    name: "프리",
    target: "서비스를 처음 체험하는 누구나",
    price: "무료",
    buttonText: "무료로 시작하기",
    featured: false,
    assurance: "카드 불필요",
    features: [
      { text: "광고 매체 연동 최대 3개", enabled: true },
      { text: "멤버 1명", enabled: true },
      { text: "단일 워크스페이스", enabled: true },
      { text: "AI 성과 리포트", enabled: false },
      { text: "분석보고서 이메일 전송", enabled: false },
    ],
  },
  {
    name: "스타터",
    target: "1인 창업자",
    price: "₩30,000",
    priceUnit: "/월",
    priceSubText: "(부가세 별도)",
    buttonText: "시작하기",
    featured: false,
    assurance: "카드 필요",
    features: [
      { text: "광고 매체 연동 최대 10개", enabled: true },
      { text: "멤버 1명", enabled: true },
      { text: "워크스페이스 최대 5개", enabled: true },
      { text: "AI 요약 기능", enabled: true },
      { text: "분석보고서 이메일 전송", enabled: false },
    ],
  },
  {
    name: "팀",
    target: "소규모 팀 (2~10인)",
    price: "₩150,000",
    priceUnit: "/월",
    priceSubText: "(부가세 별도)",
    buttonText: "14일 무료 체험하기",
    featured: true,
    assurance: "무료 체험 가능 · 카드 필요",
    features: [
      { text: "광고 매체 연동 최대 30개", enabled: true },
      { text: "멤버 최대 10명", enabled: true },
      { text: "워크스페이스 최대 10개", enabled: true },
      { text: "AI 요약 기능", enabled: true },
      { text: "분석보고서 이메일 전송", enabled: true },
    ],
  },
  {
    name: "프로",
    target: "성장 기업 및 에이전시",
    price: "₩500,000",
    priceUnit: "/월",
    priceSubText: "(부가세 별도)",
    buttonText: "영업팀에 문의",
    featured: false,
    assurance: "맞춤 견적 · 데모 제공",
    features: [
      { text: "광고 매체 연동 무제한", enabled: true },
      { text: "멤버 무제한", enabled: true },
      { text: "워크스페이스 무제한", enabled: true },
      { text: "광고 성과 변화 알림 및 실시간 대응", enabled: true },
      { text: "전담 어카운트 매니저(AM)", enabled: true },
    ],
  },
];

function CheckIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 ${enabled ? "text-logo-2" : "text-text-disabled"}`}
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

  function handleCta(planName: string) {
    if (planName === "프로") {
      const subject = encodeURIComponent("WhereYouAd 요금제 문의");
      const body = encodeURIComponent("문의하실 내용을 입력해 주세요.");
      window.location.href = `mailto:contact@whereyouad.com?subject=${subject}&body=${body}`;
      return;
    }

    navigate("/signup", { replace: false });
  }

  return (
    <section
      id="pricing"
      className="py-24 md:py-40 bg-landing-section relative scroll-mt-20 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            "radial-gradient(900px 420px at 20% 0%, rgba(96,136,254,0.18), transparent 62%), radial-gradient(900px 420px at 85% 15%, rgba(46,180,255,0.14), transparent 60%)",
        }}
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
          {plans.map((plan, i) => (
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
              className={`bg-white rounded-[28px] p-7 lg:p-8 relative transition-[box-shadow,transform,border-color] duration-300 flex flex-col ${
                plan.featured
                  ? "order-first md:order-0 border border-logo-2/55 shadow-[0_18px_55px_rgba(96,136,254,0.14)] -translate-y-1"
                  : "border border-chart-inactive/70 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.06)]"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-logo-2 text-white px-4 py-1.5 rounded-[99px] text-[12px] font-semibold shadow-sm">
                  가장 인기
                </div>
              )}

              <h3 className="text-xl font-bold text-text-main mb-2">
                {plan.name}
              </h3>
              <p className="text-text-sub text-sm mb-6 leading-relaxed break-keep">
                {plan.target}
              </p>

              <div className="mb-7">
                <div className="flex items-end gap-2">
                  <span className="text-[30px] leading-none font-extrabold tracking-[-0.02em] text-text-main">
                    {plan.price}
                  </span>
                  {plan.priceUnit && (
                    <span className="pb-1 text-[14px] font-semibold text-text-sub">
                      {plan.priceUnit}
                    </span>
                  )}
                </div>
                {plan.priceUnit && plan.priceSubText && (
                  <div className="mt-2 text-[13px] text-text-sub">
                    {plan.priceSubText}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleCta(plan.name)}
                className={`w-full h-12 rounded-component-md font-semibold transition-colors mb-4 ${
                  plan.featured
                    ? "bg-logo-2 text-white hover:bg-logo-1 shadow-[0_10px_24px_rgba(96,136,254,0.18)]"
                    : "bg-white border border-chart-inactive/70 text-text-main hover:bg-brand-300"
                }`}
              >
                {plan.buttonText}
              </button>

              <p className="text-[13px] text-text-sub mb-8">{plan.assurance}</p>

              <div className="h-px w-full bg-chart-inactive/70 mb-7" />

              <ul
                className={`space-y-4 text-sm font-body2 flex-1 ${plan.featured ? "text-text-main" : "text-text-auth-sub"}`}
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
