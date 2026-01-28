# WhereYouAd Frontend
**2026 Capstone · Graduation Project**

WhereYouAd는 **광고 성과 및 워크스페이스 관리를 효율적으로 지원하는 웹 서비스**입니다.
</br>본 레포지토리는 2026 캡스톤(졸업 프로젝트)을 위해 개발 중인 프론트엔드 애플리케이션으로,
</br>사용자 친화적인 대시보드 UI와 안정적인 상태 관리, 확장 가능한 아키텍처를 목표로 합니다.

&nbsp;

## 프로젝트 개요

- **프로젝트명**: WhereYouAd
- **목적**: 광고 및 워크스페이스 관리 서비스의 프론트엔드 구현
- **성격**: 2026 캡스톤 디자인 · 졸업 프로젝트

### 주요 기능

- **광고 성과 지표 대시보드** 제공
- 워크스페이스 **단위 광고 및 캠페인 관리**
- **성과 데이터 시각화** 및 요약 리포트 제공
- 사용자 인증 및 **권한 기반 접근 제어**


### 기술 방향성
- 빠른 화면 렌더링과 효율적인 데이터 패칭
- 명확한 상태 관리 분리 (UI State / Server State)
- 팀 협업을 고려한 컨벤션 및 코드 품질 관리

&nbsp;

## 팀 구성 (Frontend)

| <div align="center">[서제경](https://github.com/Seojegyeong)</div> | <div align="center">[박재선](https://github.com/jjjsun)</div> | <div align="center">[임예림](https://github.com/YermIm)</div> |
| --- | --- | --- |
| <div align="center"><img src="https://avatars.githubusercontent.com/Seojegyeong" width="160" /></div> | <div align="center"><img src="https://avatars.githubusercontent.com/jjjsun" width="160" /></div> | <div align="center"><img src="https://avatars.githubusercontent.com/YermIm" width="160" /></div> |
| <div align="center">프론트엔드<br/><strong>TEAM LEADER</strong></div> | <div align="center">프론트엔드</div> | <div align="center">프론트엔드</div> |


&nbsp;

## 기술 스택

### Core
- **Framework**: React 19, TypeScript, Vite
- **Routing**: react-router-dom (v7)

### State Management
- **Client State**: zustand
- **Server State**: @tanstack/react-query

### Styling
- **CSS Framework**: Tailwind CSS v4
- **Utilities**: clsx
- **SVG Handling**: vite-plugin-svgr

### Form & Validation
- **Form**: react-hook-form
- **Schema Validation**: zod, @hookform/resolvers
- **UI Feedback**: sonner (Toast)

### Code Quality & Collaboration
- **Linting / Formatting**: ESLint (v9), Prettier
- **Git Hooks**: husky, lint-staged
- **Commit Convention**: commitlint (Conventional Commits)

&nbsp;

## 개발 환경

- **Node.js**: v20.x.x (LTS 권장)
- **패키지 매니저**: pnpm

팀 내 개발 환경 차이를 최소화하기 위해 **Node 20 LTS 기준**으로 개발합니다.

&nbsp;

## 주요 스크립트

| Script | 설명 |
| --- | --- |
| `pnpm run dev` | Vite 개발 서버 실행 |
| `pnpm run build` | TypeScript + Vite 프로덕션 빌드 |
| `pnpm run preview` | 빌드 결과 미리보기 |
| `pnpm run lint` | ESLint 전체 검사 |
| `pnpm run prepare` | Husky Git Hook 설정 |

&nbsp;


## 프로젝트 구조

현재 프로젝트는 **기능별(Pages)** 및 **재사용성(Components/Layout)** 을 중심으로 구성되어 있습니다.

```bash
src
├── api/          # API 통신 및 요청 로직
├── assets/       # 이미지, 아이콘, 폰트 등 정적 리소스
├── components/   # UI 컴포넌트 모음
├── constants/    # 상수 데이터 관리
├── layout/       # 페이지 레이아웃 구조
├── pages/        # 라우트 단위 페이지
├── routes/       # 라우터 설정
├── store/        # Zustand 전역 상태 관리
├── types/        # 공통 타입 정의
└── utils/        # 유틸리티 함수 및 헬퍼
```

&nbsp;

## 협업 컨벤션

### 1. Branch Strategy
- **main**: 배포 가능한 상태의 브랜치 (Production)
- **develop**: 다음 버전을 위한 개발 브랜치
- **feature/#[이슈번호]**: 새로운 기능 개발 브랜치 (예: `feature/#1`)

&nbsp;

### 2. Commit Convention
Angular Commit Convention을 따르며, `commitlint`로 관리됩니다.

`type: subject`

| Type | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 (README 등) |
| `style` | 코드 포맷팅, 세미콜론 누락, 공백 등 (코드 변경 없음) |
| `refactor` | 코드 리팩토링 (기능 변화 없음) |
| `test` | 테스트 코드 추가/수정 |
| `chore` | 빌드, 설정, 패키지 매니저 등 기타 변경사항 |
| `ci` | CI 관련 설정 변경 |
| `setting` | 프로젝트 환경 설정 변경 |

&nbsp;

### 3. Code Style & Import Rule

팀 전체의 코드 스타일 일관성을 위해 **ESLint 기반 자동화 규칙**을 적용합니다.

- **Import 정렬 플러그인**: eslint-plugin-simple-import-sort
- **설정 파일**: eslint/import.mjs
- `.vscode/settings.json`에 `codeActionsOnSave`가 설정되어 있으며
- 파일 저장 시 `source.fixAll.eslint`가 자동 실행됩니다.
- 별도의 명령 없이도 저장 시 Import 정렬 및 ESLint 수정 사항이 자동 반영됩니다.

이를 통해 팀 전체가 동일한 코드 스타일을 유지하며,
코드 리뷰 시 스타일 관련 피드백을 최소화합니다.

&nbsp;

### 4. PR Process
PR 템플릿에 따라 작성하며, **리뷰어 가이드**를 준수합니다.

- **Title**: `[Type/#이슈번호] 작업 요약` (예: `[Feature/#1] 로그인 페이지 UI 구현`)
- **Review Labels**:
  - `P1`: **필수 반영 (Critical)** - 버그/컨벤션 위반 (머지 불가)
  - `P2`: **적극 권장 (Recommended)** - 더 나은 대안 (반영 권장)
  - `P3`: **제안 (Suggestion)** - 아이디어 공유 (자율)
  - `P4`: **단순 확인 (Nit)** - 오타/칭찬 등

&nbsp;
