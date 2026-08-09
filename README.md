<div align="center">

2026 상명대학교 졸업 프로젝트

**분산된 광고 데이터를 하나의 대시보드로 광고 성과를 통합하고 AI가 분석해 드립니다**

<img width="3145" height="1769" alt="wyad" src="https://github.com/user-attachments/assets/9c284495-258e-4fd1-97f7-027a5034774f" />

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_S3_+_CloudFront-232F3E?logo=amazonaws&logoColor=white)

🏆 상명대학교 교내 창업아이디어 경진대회 **대상**

🏆 모두의 창업 공모전 **1기 선정 · 본선 진출**

</div>

<br>

## 📌 Overview

WhereYouAd는 Google, Naver, Meta 3개 광고 플랫폼의 성과 데이터를 단일 대시보드에 통합하는 B2B SaaS입니다. 팀 단위 워크스페이스로 멤버가 협업하며, AI 분석 리포트를 생성하고 PDF로 저장할 수 있습니다.

WhereYouAd Frontend는 Vite + React 기반의 2026 캡스톤 졸업 프로젝트입니다. 실시간 차트, 워크스페이스 권한 관리, AI 스트리밍, SSE 기반 클릭 스트림 등 복잡한 상태와 비동기 흐름을 중심으로 인프라 레이어를 직접 설계·구현합니다.

<br>

### 핵심 기능 영역

- Google·Naver·Meta 통합 KPI 대시보드
- SSE 실시간 클릭 스트림 및 이상 트래픽 감지
- AI 분석 리포트 (요약·예산 추천·이메일 전송)
- 트래킹 링크 생성 (shortURL + UTM)
- 가상 광고 + 트래픽 시뮬레이터
- 팀 워크스페이스 + RBAC
- 기간별 상세 분석 타임라인

<br>

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Scripts](#-scripts)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [CI/CD](#-cicd)
- [Conventions](#-conventions)
- [Contributors](#-contributors)

<br>

## 🛠 Tech Stack

| Category          | Stack                                                                        |
| ----------------- | ---------------------------------------------------------------------------- |
| Core              | React 19, TypeScript 5.9, Vite 6.4 + @vitejs/plugin-react-swc                |
| Routing           | React Router DOM v7                                                          |
| Server State      | TanStack React Query v5                                                      |
| Client State      | Zustand v5                                                                   |
| HTTP              | Axios                                                                        |
| Form / Validation | React Hook Form, Zod v4                                                      |
| Styling           | Tailwind CSS v4 + @tailwindcss/vite                                          |
| Animation         | Framer Motion                                                                |
| Chart             | ApexCharts                                                                   |
| Toast             | Sonner                                                                       |
| AI Streaming      | @microsoft/fetch-event-source (SSE + JWT 헤더 지원)                          |
| Markdown          | react-markdown (AI 리포트 렌더링)                                            |
| Test              | Vitest (단위), Playwright (E2E)                                              |
| Docs              | Storybook 8 + Chromatic (시각 회귀)                                          |
| Monitoring        | Sentry (프로덕션 에러 수집)                                                  |
| Deploy            | AWS S3 + CloudFront                                                          |
| Quality           | ESLint v9 (flat config 4파일 분리), Prettier, Husky, lint-staged, Commitlint |

<br>

## 🚀 Getting Started

### Prerequisites

```bash
node -v
# v20.x.x

pnpm -v
# v10.x.x
```

### Installation

```bash
pnpm install
```

### Run Dev Server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

<br>

## 📜 Scripts

| Command              | Description                                         |
| -------------------- | --------------------------------------------------- |
| `pnpm dev`           | Vite 개발 서버를 실행합니다.                        |
| `pnpm build`         | TypeScript 빌드 후 Vite 프로덕션 빌드를 생성합니다. |
| `pnpm lint`          | ESLint로 전체 코드를 검사합니다.                    |
| `pnpm preview`       | 빌드 결과를 로컬에서 미리 확인합니다.               |
| `pnpm prepare`       | Husky Git hook을 설치합니다.                        |
| `pnpm test`          | Vitest로 단위 테스트를 실행합니다.                  |
| `pnpm test:watch`    | Vitest watch 모드로 실행합니다.                     |
| `pnpm test:e2e`      | Playwright로 E2E 테스트를 실행합니다.               |

<br>

## 🔑 Environment Variables

`.env` 파일을 프로젝트 루트에 생성하고 아래 변수를 설정합니다.

| 변수                   | 설명                                              |
| ---------------------- | ------------------------------------------------- |
| `VITE_API_BASE_URL`    | 백엔드 API 베이스 URL                             |
| `VITE_NAVER_AES_SECRET`| Naver 광고 OAuth AES 암호화 키                    |
| `VITE_NAVER_AES_IV`    | Naver 광고 OAuth AES 초기화 벡터                  |
| `VITE_SENTRY_DSN`      | Sentry 프로젝트 DSN (미설정 시 Sentry 비활성화)   |

> CI/CD 환경에서는 GitHub Secrets로 관리됩니다.

<br>

## 📁 Project Structure

```
src
├── api                  # 도메인별 axios 호출 함수 (순수 fetch 레이어)
│   ├── auth/            # 로그인·회원가입·토큰 재발급
│   ├── dashboard/       # overview, platform, aiAnalysis
│   ├── ads/             # 캠페인 목록·상세
│   ├── integration/     # Google/Naver/Meta OAuth 연동
│   └── workspace/       # 워크스페이스·멤버 관리
│
├── hooks                # 도메인별 커스텀 훅
│   ├── customQuery.ts   # useCoreQuery / useCoreMutation 추상화
│   ├── auth/
│   ├── dashboard/
│   ├── ads/
│   ├── common/
│   ├── integration/
│   └── sidebar/
│
├── lib                  # 앱 수준 인프라
│   ├── axiosInstance.ts # axios 인스턴스 + 401 refreshSubscribers 큐 패턴
│   ├── queryClient.ts   # QueryClient (4xx 즉시 실패 / 5xx 1회 재시도)
│   ├── queryKeys.ts     # QUERY_KEYS 중앙 상수 팩토리
│   └── loadable.tsx     # React.lazy + Suspense 헬퍼 (code splitting)
│
├── store                # Zustand 전역 상태
│   ├── useAuthStore.ts        # accessToken 메모리 저장, isTokenInitialized
│   ├── useWorkspaceStore.ts   # selectedOrgId, myRole
│   ├── useSidebarStore.ts     # isCollapsed
│   └── useModalStore.ts       # type-safe 전역 모달 레지스트리
│
├── utils
│   ├── dashboard/
│   │   ├── metricRegistry.ts  # 지표 포맷·레이블 SSOT (16파일 → 1곳)
│   │   ├── metricsToKpis.ts   # API 응답 → KPI 카드 Props 변환
│   │   └── downloadChart.ts
│   └── auth/
│
├── components
│   ├── common/          # Button, Card, Modal, Input 등 (+ .stories)
│   ├── dashboard/       # ai-report, charts, overview, platform
│   ├── sidebar/         # Sidebar, WorkspaceSwitcher
│   └── modal/           # ModalProvider, 전역 모달 컴포넌트
│
├── layout
│   ├── GlobalLayout.tsx      # Toaster + ModalProvider + useTokenRefresh
│   ├── auth/AuthLayout.tsx
│   ├── main/MainLayout.tsx   # Sidebar + 헤더 + Outlet
│   └── workspace/
│
├── pages                # 라우트 단위 페이지
├── routes               # createBrowserRouter + AuthGuard + RoleGuard
├── styles
│   ├── tokens.css       # @theme {} 블록 디자인 토큰 (별도 config 파일 없음)
│   └── print.css
└── types                # 도메인별 TypeScript 인터페이스
```

### Import Alias

`@/`는 `src/`를 가리킵니다.

```ts
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useCoreQuery } from "@/hooks/customQuery";
```

<br>

## ⚙️ CI/CD

| 워크플로        | 트리거              | 내용                                                                                  |
| --------------- | ------------------- | ------------------------------------------------------------------------------------- |
| `ci.yaml`       | PR → develop / main | ESLint → Vitest → TypeScript build → Lighthouse CI (LCP / CLS / TBT 자동 검증)       |
| `main.yaml`     | push → main         | S3 업로드 → CloudFront Functions (CSP 헤더) 자동 배포 → CloudFront 캐시 무효화 → Discord 알림 |
| `chromatic.yml` | push → develop      | Storybook 시각 회귀 테스트 (Chromatic)                                                |

<br>

## 🤝 Conventions

### Branch

- `feature/#이슈번호`
- `fix/#이슈번호`
- `style/#이슈번호`
- `docs/#이슈번호`
- `setting/#이슈번호`
- `refactor/#이슈번호`

### Commit

Conventional Commits 규칙을 따릅니다. commitlint로 자동 검증됩니다.

- `feat: AI 분석 리포트 스트리밍 추가`
- `fix: 병렬 401 상황에서 토큰 재발급 중복 호출 방지`
- `refactor: 지표 포맷 로직을 METRIC_REGISTRY로 통합`
- `docs: README 업데이트`

### Pull Request

- PR 제목은 `[Feature/#1] 작업 내용` 형식을 권장합니다.
- GitHub Issue를 먼저 등록하고 PR 본문에 `closes #이슈번호`를 포함합니다.
- 리뷰 기준은 `.cursor/rules/always.mdc`를 따릅니다.

### Code Quality

- 저장 전 ESLint와 Prettier 규칙을 맞춥니다.
- `simple-import-sort` 규칙에 따라 import 순서를 유지합니다.
- `api/`, `lib/`는 `components/`, `pages/`에 의존하지 않도록 import 방향을 지킵니다.
- 서버 상태는 TanStack Query, UI 상태는 Zustand, 폼 상태는 React Hook Form으로 분리합니다.
- SVG는 `vite-plugin-svgr`를 통해 React 컴포넌트로 사용합니다.

<br>

## 👥 Contributors

| <div align="center">[서제경](https://github.com/Seojegyeong)</div>                                    | <div align="center">[박재선](https://github.com/jjjsun)</div>                                    | <div align="center">[임예림](https://github.com/YermIm)</div>                                    |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| <div align="center"><img src="https://avatars.githubusercontent.com/Seojegyeong" width="160" /></div> | <div align="center"><img src="https://avatars.githubusercontent.com/jjjsun" width="160" /></div> | <div align="center"><img src="https://avatars.githubusercontent.com/YermIm" width="160" /></div> |
| <div align="center">프론트엔드<br/><strong>TEAM LEADER</strong></div>                                 | <div align="center">프론트엔드</div>                                                             | <div align="center">프론트엔드</div>                                                             |
