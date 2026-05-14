export type TLandingPlanFeature = { text: string; enabled: boolean };

export type TLandingPlan = {
  name: string;
  target: string;
  price: string;
  priceUnit?: string;
  priceSubText?: string;
  buttonText: string;
  featured: boolean;
  assurance: string;
  features: TLandingPlanFeature[];
};

export const LANDING_PLANS: TLandingPlan[] = [
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
