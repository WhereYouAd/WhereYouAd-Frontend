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
        // #277 실측 기반 확정값 (dashboard AFTER 평균: LCP 1048ms / CLS 0.000304 / TBT 54ms)
        // CI 환경 변동성을 고려해 2배 마진 적용 후 error 수준으로 상향
        "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
