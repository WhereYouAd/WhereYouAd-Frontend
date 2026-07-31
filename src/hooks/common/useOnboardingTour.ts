import { useCallback, useState } from "react";
import type { EventData, Step } from "react-joyride";
import { EVENTS, STATUS } from "react-joyride";

const ONBOARDING_KEY = "hasSeenOnboarding";

const TOUR_STEPS: Step[] = [
  {
    target: "body",
    title: "WhereYouAd에 오신 걸 환영해요",
    content:
      "주요 기능을 간단히 소개할게요. Google, Naver, Meta 광고 성과를 한눈에 관리할 수 있어요.",
    placement: "center",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-workspace-switcher']",
    title: "워크스페이스",
    content:
      "팀 단위로 광고 데이터를 관리하는 공간이에요. 멤버를 초대하고 역할을 나눌 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-dashboard']",
    title: "통합 대시보드",
    content:
      "Google·Naver·Meta 성과를 한 화면에서 확인하고 AI 분석 리포트를 받아볼 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-ads']",
    title: "캠페인 관리",
    content: "운영 중인 캠페인 목록을 조회하고 상태를 한눈에 파악할 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-workspace']",
    title: "워크스페이스 설정",
    content:
      "멤버 초대, 역할 관리, 플랜 및 결제를 여기서 모두 처리할 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-integrations']",
    title: "플랫폼 연동",
    content:
      "지금 바로 시작해요. 광고 계정을 연동해야 대시보드에 데이터가 표시돼요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-platform-google']",
    title: "Google Ads 연동",
    content: "검색·디스플레이·쇼핑 광고 성과를 실시간으로 확인할 수 있어요.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-platform-naver']",
    title: "Naver 광고 연동",
    content: "네이버 검색 광고 성과를 대시보드에서 바로 볼 수 있어요.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-platform-meta']",
    title: "Meta 광고 연동",
    content: "Facebook·Instagram 광고 성과를 통합해서 분석할 수 있어요.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "body",
    title: "이제 시작할 준비가 됐어요!",
    content:
      "광고 계정을 연동하면 모든 성과 데이터를 한눈에 확인할 수 있어요. 지금 바로 연동해보세요.",
    placement: "center",
    skipBeacon: true,
  },
];

export function useOnboardingTour() {
  const [run, setRun] = useState(false);

  const startTour = useCallback(() => {
    setRun(true);
  }, []);

  const handleEvent = useCallback((data: EventData) => {
    const { status, type } = data;

    const isFinished = status === STATUS.FINISHED || status === STATUS.SKIPPED;
    const isError = type === EVENTS.TARGET_NOT_FOUND;

    if (isFinished || isError) {
      setRun(false);
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
  }, []);

  return { run, startTour, handleEvent, steps: TOUR_STEPS };
}
