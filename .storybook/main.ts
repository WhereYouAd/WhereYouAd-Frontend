import type { StorybookConfig } from "@storybook/react-vite";
import type { InlineConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: "@storybook/react-vite",
  async viteFinal(viteConfig: InlineConfig) {
    viteConfig.define = {
      ...(viteConfig.define ?? {}),
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        "http://localhost:8080",
      ),
    };
    return viteConfig;
  },
};

export default config;
