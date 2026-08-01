export const AUTH_RETURN_URL_KEY = "authReturnUrl";

const DEFAULT_FALLBACK = "/dashboard";

// 내부 경로로만 허용되도록. 오픈 리다이렉트 방지
export function getSafeReturnUrl(
  raw: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK,
): string {
  if (!raw) return fallback;

  const value = raw.trim();
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.includes("://")) return fallback;
  if (value.includes("\\")) return fallback;

  return value;
}

/*path에 안전한 returnUrl 쿼리를 붙인다. 없으면 path 그대로(소셜로그인은 나가면 url잃어버리니까 미리 저장해놓기)*/
export function buildPathWithReturnUrl(
  path: string,
  returnUrl: string | null | undefined,
): string {
  const safe = getSafeReturnUrl(returnUrl);
  if (!safe) return path;

  const params = new URLSearchParams({ returnUrl: safe });
  return `${path}?${params.toString()}`;
}
