import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), svgr({ include: "**/*.svg?react" }), tailwindcss()],

    // 개발 서버 및 프록시 설정
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_TARGET_URL,
          changeOrigin: true,
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq) => {
              // 백엔드가 Origin 기반으로 CORS 차단하는 경우(예: "Invalid CORS request")
              // 개발 프록시에서는 브라우저의 Origin을 전달하지 않도록 제거합니다.
              proxyReq.removeHeader("origin");
            });
          },
        },
      },
    },

    // 경로 별칭
    resolve: {
      alias: {
        "@": "/src",
      },
      dedupe: ["react", "react-dom"],
    },

    // 사전 번들링 최적화
    optimizeDeps: {
      include: ["react-apexcharts", "apexcharts"],
    },

    // 배포 시 콘솔 로그 제거
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },

    // 빌드 최적화
    build: {
      chunkSizeWarningLimit: 1000, // 청크 크기 경고 한도 상향
      rollupOptions: {
        output: {
          // 라이브러리 및 코드 분할
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (
                id.includes("react") ||
                id.includes("react-dom") ||
                id.includes("react-router-dom")
              ) {
                return "react-vendor"; // 리액트 관련 코어
              }
              return "vendor"; // 기타 라이브러리
            }
          },
        },
      },
    },
  };
});
