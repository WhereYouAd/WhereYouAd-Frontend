import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env 로드 (PLAYWRIGHT_BASE_URL 등)
dotenv.config({ path: path.resolve(__dirname, ".env") });

const PORT = 5173; // vite.config.ts 와 동일
const LOCAL_BASE_URL = `http://localhost:${PORT}`;

// E2E 대상: PLAYWRIGHT_BASE_URL → VITE_APP_URL → 로컬
const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL ?? process.env.VITE_APP_URL ?? LOCAL_BASE_URL;

/** localhost 여부 (webServer 켤지 결정) */
function isLocalBaseUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

const isLocal = isLocalBaseUrl(BASE_URL);

export default defineConfig({
  testDir: "./tests", // *.spec.ts 위치

  fullyParallel: true, // 파일별 병렬
  forbidOnly: !!process.env.CI, // CI 에서 test.only 금지
  retries: process.env.CI ? 2 : 0, // CI 만 재시도
  workers: process.env.CI ? 1 : undefined, // CI 는 워커 1개

  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "html",

  timeout: 30_000, // 테스트 1개 제한
  expect: { timeout: 10_000 }, // assertion 대기

  use: {
    baseURL: BASE_URL, // page.goto('/') 기준
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: process.env.CI ? "on-first-retry" : "on", // 로컬: 리포트에서 UI(trace), CI: 재시도 시만
    ignoreHTTPSErrors: !isLocal, // 배포 HTTPS
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // 로컬만 Vite 기동, 배포 URL 은 webServer 없음
  ...(isLocal
    ? {
        webServer: {
          command: "pnpm run dev",
          url: LOCAL_BASE_URL,
          reuseExistingServer: !process.env.CI, // 로컬 dev 이미 켜져 있으면 재사용
          timeout: 120_000,
        },
      }
    : {}),
});
