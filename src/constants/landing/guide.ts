import TimelineDashboard from "@/assets/mockup/optimized/timeline_dashboard.jpg";

export type TLandingGuideStep = { step: number; title: string; text: string };

export type TLandingGuidePage = {
  number: string;
  label: string;
  title: string;
  description: string;
  steps: TLandingGuideStep[];
  image?: string;
  alt?: string;
  reverse: boolean;
  useOverview?: boolean;
  useTimeline?: boolean;
  usePlatform?: boolean;
};

export const LANDING_GUIDE_PAGES: TLandingGuidePage[] = [
  {
    number: "01",
    label: "통합 대시보드",
    title: "광고 현황을 한눈에 파악하세요",
    description: `주요 KPI부터 채널별 성과, 실시간 알림까지
모든 정보를 하나의 화면에서 확인할 수 있습니다.`,
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
    description: `다수의 광고 매체를 별도 로그인 없이 통합 관리하고
캠페인 설정부터 소재 심사까지 원스톱으로 처리합니다.`,
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
    description: `간트 차트 방식으로 전체 캠페인 기간을 시각화하고
기간별 성과를 비교합니다.`,
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
