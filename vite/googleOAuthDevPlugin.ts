import type { Plugin } from "vite";

/**
 * 로컬 dev 전용: /api/google/login 302 Location을 서버에서 읽어 JSON으로 반환.
 * 브라우저 XHR이 Google로 따라가 403 나는 문제를 막습니다.
 */
export function googleOAuthDevPlugin(apiTargetUrl: string | undefined): Plugin {
  return {
    name: "google-oauth-dev-bff",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void (async () => {
          if (!apiTargetUrl) {
            next();
            return;
          }

          const url = new URL(req.url ?? "/", "http://localhost");
          if (url.pathname !== "/api/google/login" || req.method !== "GET") {
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
            const backendUrl = `${target}/api/google/login?orgId=${encodeURIComponent(orgId)}`;

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
                    data: { redirectUrl },
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
