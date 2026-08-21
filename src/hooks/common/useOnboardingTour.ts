import { useCallback, useState } from "react";
import type { EventData, Step } from "react-joyride";
import { ACTIONS, EVENTS, STATUS } from "react-joyride";

import useWorkspaceStore from "@/store/useWorkspaceStore";

export const ONBOARDING_KEY = "hasSeenOnboarding";

const ADMIN_STEPS: Step[] = [
  {
    target: "body",
    title: "WhereYouAd에 오신 걸 환영해요",
    content:
      "Google, Naver, Meta 광고 성과를\n한 곳에서 관리하는 방법을 안내해 드릴게요.",
    placement: "center",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-workspace-switcher']",
    title: "워크스페이스",
    content: "여러 워크스페이스를 만들고 자유롭게 전환할 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-dashboard']",
    title: "통합·플랫폼 대시보드",
    content:
      "Google, Naver, Meta 성과를 한 화면에서 확인하고 AI 분석 리포트도 받아볼 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-ads']",
    title: "캠페인 관리",
    content:
      "운영 중인 캠페인 목록을 조회하고\n상태를 한눈에 파악할 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-workspace']",
    title: "워크스페이스 관리",
    content: "멤버 초대·역할 관리를 모두 여기서\n처리할 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-integrations']",
    title: "플랫폼 연동",
    content:
      "광고 계정을 연동하면 대시보드에서\n성과 데이터를 바로 확인할 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-create-workspace']",
    title: "워크스페이스를 만들고\n시작해볼까요?",
    content:
      "워크스페이스를 생성하면 멤버를 초대하고\n광고 계정을 연동할 수 있어요.",
    placement: "bottom",
    skipBeacon: true,
    skipScroll: true,
  },
];

const MEMBER_STEPS: Step[] = [
  {
    target: "body",
    title: "WhereYouAd에 오신 걸 환영해요",
    content:
      "Google, Naver, Meta 광고 성과를\n한 곳에서 관리하는 방법을 안내해 드릴게요.",
    placement: "center",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-workspace-switcher']",
    title: "워크스페이스",
    content: "팀원들과 광고 데이터를 함께 확인하는 공간이에요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-dashboard']",
    title: "통합·플랫폼 대시보드",
    content:
      "Google, Naver, Meta 성과를 한 화면에서 확인하고 AI 분석 리포트도 받아볼 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-ads']",
    title: "캠페인 관리",
    content:
      "운영 중인 캠페인 목록을 조회하고\n상태를 한눈에 파악할 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "[data-tour='tour-workspace']",
    title: "워크스페이스 설정",
    content: "팀원 목록과 기본 정보를 여기서 확인할 수 있어요.",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "body",
    title: "이제 시작할 준비가 됐어요!",
    content: "대시보드에서 광고 성과를 바로 확인해보세요.",
    placement: "center",
    skipBeacon: true,
  },
];

export function useOnboardingTour() {
  const myRole = useWorkspaceStore((s) => s.myRole);
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setRun(true);
  }, []);

  const steps = myRole === "MEMBER" ? MEMBER_STEPS : ADMIN_STEPS;

  const handleEvent = useCallback((data: EventData) => {
    const { action, index, status, type } = data;

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setStepIndex(0);
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
  }, []);

  return { run, startTour, handleEvent, steps, stepIndex, myRole };
}
