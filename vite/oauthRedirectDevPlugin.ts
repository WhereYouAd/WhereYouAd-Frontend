import type { Plugin } from "vite";

const OAUTH_START_PATHS = new Set(["/api/google/login", "/api/meta/auth-url"]);

/**
 * 로컬 dev 전용: OAuth 시작 API의 302 Location을 서버에서 읽어 JSON으로 반환.
 * 브라우저 XHR이 OAuth 제공자로 따라가 CORS/403 나는 문제를 막습니다.
 */
export function oauthRedirectDevPlugin(
  apiTargetUrl: string | undefined,
): Plugin {
  return {
    name: "oauth-redirect-dev-bff",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void (async () => {
          if (!apiTargetUrl) {
            next();
            return;
          }

          const url = new URL(req.url ?? "/", "http://localhost");
          if (!OAUTH_START_PATHS.has(url.pathname) || req.method !== "GET") {
            next();
            return;
          }

          const accept = req.headers.accept ?? "";
          if (!accept.includes("application/json")) {
            next();
            return;
          }

          const orgId = url.searchParams.get("orgId");
          if (!orgId) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                status: "Bad Request",
                message: "orgId가 필요합니다.",
              }),
            );
            return;
          }

          try {
            const target = apiTargetUrl.replace(/\/$/, "");
            const backendUrl = `${target}${url.pathname}?orgId=${encodeURIComponent(orgId)}`;

            const backendRes = await fetch(backendUrl, {
              method: "GET",
              headers: {
                ...(req.headers.authorization
                  ? { Authorization: req.headers.authorization }
                  : {}),
              },
              redirect: "manual",
            });

            if (backendRes.status === 302) {
              const redirectUrl = backendRes.headers.get("location");
              if (redirectUrl) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    status: "OK",
                    data:
                      url.pathname === "/api/meta/auth-url"
                        ? { authUrl: redirectUrl }
                        : { redirectUrl },
                  }),
                );
                return;
              }
            }

            const body = await backendRes.text();
            res.statusCode = backendRes.status;
            res.setHeader(
              "Content-Type",
              backendRes.headers.get("content-type") ?? "application/json",
            );
            res.end(body);
          } catch {
            next();
          }
        })().catch(() => next());
      });
    },
  };
}
