import { useCallback, useState } from "react";
import type { EventData, Step } from "react-joyride";
import { EVENTS, STATUS } from "react-joyride";

const ONBOARDING_KEY = "hasSeenOnboarding";

const TOUR_STEPS: Step[] = [
  {
    target: "body",
    content:
      "WhereYouAd의 주요 기능을 간단히 소개할게요. Google, Naver, Meta 광고 성과를 한눈에 관리할 수 있어요.",
    placement: "center",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-workspace-switcher']",
    content:
      "팀 단위로 광고 데이터를 관리하는 공간이에요. 멤버를 초대하고 역할을 나눌 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-dashboard']",
    content:
      "연동 완료 후 여기서 Google·Naver·Meta 통합 성과를 한눈에 볼 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-ads']",
    content: "캠페인 목록을 조회하고 광고 상태를 관리할 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-workspace']",
    content: "워크스페이스 설정, 멤버 관리, 플랜 및 결제를 여기서 관리해요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-integrations']",
    content:
      "지금 여기예요. 광고 계정을 연동해야 대시보드에 데이터가 표시돼요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-platform-google']",
    content:
      "Google Ads 계정을 연동하면 검색·디스플레이 광고 성과를 볼 수 있어요.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-platform-naver']",
    content: "Naver 광고 계정을 연동하면 검색 광고 성과를 확인할 수 있어요.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-platform-meta']",
    content:
      "Meta 광고 계정을 연동하면 Facebook·Instagram 광고 성과를 볼 수 있어요.",
    placement: "bottom",
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
