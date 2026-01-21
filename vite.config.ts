import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr({ include: "**/*.svg?react" })],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
