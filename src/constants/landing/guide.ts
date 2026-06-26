export type TLandingGuideStep = { step: number; title: string; text: string };

export type TLandingGuidePage = {
  number: string;
  label: string;
  title: string;
  description: string;
  steps: TLandingGuideStep[];
  reverse: boolean;
  useOverview?: boolean;
  useTimeline?: boolean;
  usePlatform?: boolean;
  useWorkspace?: boolean;
};

export const LANDING_GUIDE_PAGES: TLandingGuidePage[] = [
  {
    number: "01",
    label: "플랫폼 연동",
    title: "광고 매체를 간편하게 연동하세요",
    description:
      "클릭 한 번으로 주요 광고 매체를 연동하고 데이터를 바로 확인하세요.",
    steps: [
      { step: 1, title: "플랫폼 선택 후 바로 연동", text: "" },
      { step: 2, title: "실시간 데이터 동기화", text: "" },
    ],
    usePlatform: true,
    reverse: false,
  },
  {
    number: "02",
    label: "통합 및 플랫폼 대시보드",
    title: "광고 현황을 한눈에 파악하세요",
    description:
      "주요 KPI·채널별 성과·실시간 알림을 하나의 화면에서 확인하세요.",
    steps: [
      { step: 1, title: "핵심 지표를 즉시 확인", text: "" },
      { step: 2, title: "채널별 효율 비교", text: "" },
    ],
    useOverview: true,
    reverse: true,
  },
  {
    number: "03",
    label: "캠페인 관리",
    title: "캠페인을 계획하고 관리하세요",
    description:
      "간트 차트로 일정을 시각화하고 예산·상태를 한 곳에서 관리하세요.",
    steps: [
      { step: 1, title: "타임라인으로 일정 계획", text: "" },
      { step: 2, title: "인라인으로 빠르게 편집", text: "" },
    ],
    useTimeline: true,
    reverse: false,
  },
  {
    number: "04",
    label: "팀 협업",
    title: "팀과 함께 광고를 관리하세요",
    description:
      "멤버를 초대하고 권한을 설정해 에이전시·팀원과 효율적으로 협업하세요.",
    steps: [
      { step: 1, title: "멤버 초대 및 권한 설정", text: "" },
      { step: 2, title: "워크스페이스 단위 관리", text: "" },
    ],
    useWorkspace: true,
    reverse: true,
  },
];
