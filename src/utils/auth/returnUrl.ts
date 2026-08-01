export const AUTH_RETURN_URL_KEY = "authReturnUrl";

const DEFAULT_FALLBACK = "/dashboard";

// 내부 경로로만 허용되도록. 오픈 리다이렉트 방지
export function getSafeReturnUrl(
  raw: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK,
): string {
  if (!raw) return fallback;

  const value = raw.trim();
  // if (/[\u0000-\u001F\u007F]/.test(value)) return fallback;
  // ESLint가 정규식 리터럴을 막기 때문에 같은 조건의 charCodeAt 사용
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) return fallback;
  }
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.includes("://")) return fallback;
  if (value.includes("\\")) return fallback;

  return value;
}

/*path에 안전한 returnUrl 쿼리를 붙인다. 없으면 path 그대로(즉, path에 쿼리붙이기)*/
export function buildPathWithReturnUrl(
  path: string,
  returnUrl: string | null | undefined,
): string {
  const safe = getSafeReturnUrl(returnUrl, "");
  if (!safe) return path;

  const params = new URLSearchParams({ returnUrl: safe });
  return `${path}?${params.toString()}`;
}
