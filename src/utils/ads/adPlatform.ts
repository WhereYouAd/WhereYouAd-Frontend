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

export function providerToPlatform(ad: IAd): TPlatform {
  const fromPlatform = ad.platform ? normalizeProvider(ad.platform) : null;
  if (fromPlatform) return fromPlatform;
  const fromSource = normalizeProvider(firstProviderRaw(ad));
  if (fromSource) return fromSource;
  return "naver";
}

/** 연결 플랫폼 순서대로, 광고가 있는 플랫폼만 반환 */
export function groupAdsByPlatform(
  ads: IAd[],
  connectedPlatforms: TPlatform[],
): { platform: TPlatform; ads: IAd[] }[] {
  const buckets = new Map<TPlatform, IAd[]>();
  for (const ad of ads) {
    const platform = providerToPlatform(ad);
    const list = buckets.get(platform) ?? [];
    list.push(ad);
    buckets.set(platform, list);
  }

  const order = connectedPlatforms.length
    ? connectedPlatforms
    : [...AD_PLATFORM_ORDER];

  return order
    .map((platform) => ({ platform, ads: buckets.get(platform) ?? [] }))
    .filter((section) => section.ads.length > 0);
}
