import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const webSrc = path.resolve(currentDir, "../../web/src");
const adminSrc = path.resolve(currentDir, "../../admin/src");

const config: StorybookConfig = {
  stories: [
    "../../../packages/ui/src/**/*.stories.@(ts|tsx|mdx)",
    "../../../apps/web/src/**/*.stories.@(ts|tsx|mdx)",
    "../../../apps/admin/src/**/*.stories.@(ts|tsx|mdx)",
  ],
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../../web/public"],
  async viteFinal(viteConfig) {
    viteConfig.plugins = viteConfig.plugins ?? [];
    viteConfig.plugins.unshift({
      name: "alkok-monorepo-alias-resolver",
      enforce: "pre",
      async resolveId(source, importer, options) {
        if (!source.startsWith("@/")) return null;
        const subPath = source.slice(2);
        const normalizedImporter = importer?.replace(/\\/g, "/") ?? "";
        const baseSrc = normalizedImporter.includes("/apps/admin/")
          ? adminSrc
          : webSrc;
        return this.resolve(path.join(baseSrc, subPath), importer, {
          ...options,
          skipSelf: true,
        });
      },
    });
    return viteConfig;
  },
};

export default config;
