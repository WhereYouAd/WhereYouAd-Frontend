import type { IAd, TPlatform } from "@/types/ads/campaign";

export const AD_PLATFORM_ORDER: readonly TPlatform[] = [
  "google",
  "meta",
  "naver",
] as const;

function normalizeProvider(raw: string | undefined): TPlatform | null {
  if (!raw) return null;
  const p = String(raw).trim().toLowerCase();
  if (p === "meta" || p === "google" || p === "naver") return p;
  return null;
}

function firstProviderRaw(ad: IAd): string | undefined {
  if (ad.providerType) return String(ad.providerType);
  const p = ad.provider;
  if (p == null) return undefined;
  if (Array.isArray(p)) return p[0] != null ? String(p[0]) : undefined;
  return String(p);
}

export function providerToPlatform(
  ad: IAd,
  fallbackPlatforms: readonly TPlatform[] = [],
): TPlatform {
  const fromPlatform = ad.platform ? normalizeProvider(ad.platform) : null;
  if (fromPlatform) return fromPlatform;
  const fromSource = normalizeProvider(firstProviderRaw(ad));
  if (fromSource) return fromSource;
  if (fallbackPlatforms.length === 1) return fallbackPlatforms[0];
  return "naver";
}

function normalizeConnectedPlatforms(
  connectedPlatforms: readonly TPlatform[],
): TPlatform[] {
  const normalized = connectedPlatforms
    .map((platform) => normalizeProvider(String(platform)))
    .filter((platform): platform is TPlatform => platform != null);

  return [...new Set(normalized)];
}

/** 연결 플랫폼 순 우선, 광고가 있는 플랫폼 반환 (버킷에만 있는 플랫폼도 포함) */
export function groupAdsByPlatform(
  ads: IAd[],
  connectedPlatforms: TPlatform[],
): { platform: TPlatform; ads: IAd[] }[] {
  const normalizedConnected = normalizeConnectedPlatforms(connectedPlatforms);
  const preferredOrder =
    normalizedConnected.length > 0
      ? normalizedConnected
      : [...AD_PLATFORM_ORDER];

  const buckets = new Map<TPlatform, IAd[]>();
  for (const ad of ads) {
    const platform = providerToPlatform(ad, preferredOrder);
    const list = buckets.get(platform) ?? [];
    list.push(ad);
    buckets.set(platform, list);
  }

  const order: TPlatform[] = [];
  const seen = new Set<TPlatform>();

  for (const platform of preferredOrder) {
    if ((buckets.get(platform)?.length ?? 0) > 0 && !seen.has(platform)) {
      order.push(platform);
      seen.add(platform);
    }
  }

  for (const platform of AD_PLATFORM_ORDER) {
    if ((buckets.get(platform)?.length ?? 0) > 0 && !seen.has(platform)) {
      order.push(platform);
      seen.add(platform);
    }
  }

  return order.map((platform) => ({
    platform,
    ads: buckets.get(platform) ?? [],
  }));
}
