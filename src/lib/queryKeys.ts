// TanStack Query의 queryKey를 중앙 관리하는 상수 객체

export const QUERY_KEYS = {
  auth: {
    /** 내 계정 정보 */
    myInfo: () => ["myInfo"] as const,
  },

  workspace: {
    /** 내 워크스페이스 목록 */
    list: () => ["my-workspaces"] as const,
    /** 마지막으로 선택한 워크스페이스 */
    saved: () => ["savedWorkspace"] as const,
    /** 워크스페이스 상세(기본정보) */
    detail: (orgId: number) => ["workspaceDetail", orgId] as const,
    /** 워크스페이스 멤버 목록 (invalidate 전용) */
    members: (orgId: number) => ["workspaceMembers", orgId] as const,
    /** 워크스페이스 멤버 목록 (페이지 사이즈 포함) */
    membersWithPageSize: (orgId: number, pageSize: number) =>
      ["workspaceMembers", orgId, pageSize] as const,
    /** 워크스페이스 전체 멤버 수 */
    memberCount: (orgId: number) => ["workspaceMemberCount", orgId] as const,
    /** 초대 수락 대기 중인 멤버 목록 */
    pendingMembers: (orgId: number) =>
      ["workspacePendingMembers", orgId] as const,
  },

  campaign: {
    /** 캠페인 목록 (AdsListPage · useOverviewCampaignList 캐시 공유) */
    list: (orgId: number | null) => ["campaigns", orgId] as const,
    /** 캠페인 그룹 상세 */
    detail: (orgId: number, projectId: number) =>
      ["campaignDetail", orgId, projectId] as const,
    /** 플랫폼별 연결 가능한 캠페인 목록 */
    platformList: (orgId: number | null, platform: string) =>
      ["platformCampaigns", orgId, platform] as const,
  },

  overview: {
    /** 전체 플랫폼 통합 지표 */
    metrics: (orgId: number | null) => ["overview", "metrics", orgId] as const,
    /** 전체 플랫폼 ROAS 랭킹 */
    roasRankings: (orgId: number | null) =>
      ["overview", "roasRankings", orgId] as const,
    /** 전체 플랫폼 예산 */
    budget: (orgId: number | null) => ["overview", "budget", orgId] as const,
  },

  platform: {
    /** 플랫폼별 지표 */
    metrics: (orgId: number | null, provider: string) =>
      ["platform", "metrics", orgId, provider] as const,
    /** 플랫폼별 광고 상태 수 */
    adCount: (orgId: number | null) => ["platform", "adCount", orgId] as const,
    /** 플랫폼별 성과 목록 */
    performance: (orgId: number | null) =>
      ["platform", "performance", orgId] as const,
    /** 플랫폼별 ROAS 랭킹 */
    roasRankings: (orgId: number | null) =>
      ["platform", "roasRankings", orgId] as const,
    /** 플랫폼별 예산 */
    budget: (orgId: number | null, provider: string) =>
      ["platform", "budget", orgId, provider] as const,
    /** 플랫폼별 일별 지표 상세 */
    metricFacts: (orgId: number | null, provider: string, days: number) =>
      ["platform", "metricFacts", orgId, provider, days] as const,
    /** 플랫폼 연동 연결 상태 목록 */
    connections: (orgId: number | null) =>
      ["platform-connections", orgId] as const,
  },

  ai: {
    /** AI 분석 리포트 폴링 쿼리 */
    report: (provider: string, orgId: number | null) =>
      ["ai", "report", provider, orgId] as const,
  },

  timeline: {
    list: (orgId: number | null) => ["timeline", "list", orgId] as const,
    detail: (orgId: number | null, timelineId: number | null) =>
      ["timeline", "detail", orgId, timelineId] as const,
  },
} as const;
