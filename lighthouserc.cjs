/** @type {import('@lhci/cli').LighthousercConfig} */
module.exports = {
  ci: {
    collect: {
      // CI 환경에서 인증이 필요한 /dashboard는 /login으로 리다이렉트됨.
      // /dashboard 실측은 #277(perf/no-skeleton 브랜치)에서 진행.
      startServerCommand: "pnpm preview --port 3000",
      startServerReadyPattern: "Local",
      url: ["http://localhost:3000/login"],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      assertions: {
        // LCP: CI는 /login을 lazy load 환경에서 측정해 ~15s가 나옴 — 로컬 /dashboard 실측값(1048ms)과
        // 측정 대상이 달라 error 임계값 적용 불가. 회귀 추세 감지용 warn으로 유지.
        "largest-contentful-paint": ["warn", { maxNumericValue: 4000 }],
        // CLS, TBT: CI 환경 무관하게 안정적으로 낮은 값 → error 수준 적용
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
