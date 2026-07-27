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
        // warn 수준 임계값 — #277에서 before/after 실측 후 error 수준으로 확정
        // preset 없이 3개만 지정: preset이 error 레벨 assertion을 추가해 CI를 막았음
        "largest-contentful-paint": ["warn", { maxNumericValue: 4000 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 600 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
