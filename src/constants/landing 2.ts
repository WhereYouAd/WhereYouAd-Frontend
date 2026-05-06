export const LANDING_META = {
  serviceName: "Where you ad",
  tagline: "흩어진 광고 채널, 하나의 화면으로",
  subCopy:
    "인스타그램, 구글, 네이버, 카카오 — 모든 광고 성과를\n실시간으로 한 대시보드에서 모니터링하세요",
} as const;

export const PROBLEMS = [
  {
    id: 1,
    title: "채널마다 따로 접속",
    description: "각 플랫폼 대시보드를 오가며 시간 낭비",
  },
  {
    id: 2,
    title: "이슈를 너무 늦게 발견",
    description: "클릭 급증, 예산 초과를 뒤늦게 파악",
  },
  {
    id: 3,
    title: "데이터가 파편화",
    description: "집계 단위가 달라 채널 간 비교가 불가",
  },
] as const;

export const FEATURES = [
  {
    id: 1,
    title: "실시간 통합 대시보드",
    description: "1분/5분/1시간 단위 차트로 전 채널 성과를 한눈에",
  },
  {
    id: 2,
    title: "트래킹 링크 생성",
    description: "클릭 이벤트 자동 수집으로 정확한 전환 추적",
  },
  {
    id: 3,
    title: "가상 시뮬레이터",
    description: "실제 과금 없이 광고 전략을 미리 테스트",
  },
  {
    id: 4,
    title: "AI 인사이트",
    description: "LLM 기반 예산 추천 & 자연어 요약으로 빠른 의사결정",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "광고 채널 연결",
    description: "Google / Meta / Naver / Kakao 계정을 한 번에 연동",
  },
  {
    step: 2,
    title: "트래킹 URL 발급 & 광고에 등록",
    description: "자동 생성된 트래킹 링크를 광고 소재에 삽입",
  },
  {
    step: 3,
    title: "실시간 클릭 이벤트 자동 수집",
    description: "방문자 행동 데이터가 즉시 수집·처리",
  },
  {
    step: 4,
    title: "대시보드에서 통합 성과 모니터링",
    description: "모든 채널 지표를 단일 화면에서 비교·분석",
  },
] as const;

export const SOCIAL_PROOF_STATS = [
  {
    id: 1,
    label: "연동 광고 채널",
    value: "4+",
  },
  {
    id: 2,
    label: "실시간 처리",
    value: "1,000건/초",
  },
  {
    id: 3,
    label: "대시보드 로딩",
    value: "< 1초",
  },
] as const;
