import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export function createNextEslintConfig(extraIgnores = []) {
  return defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "next-env.d.ts",
      ...extraIgnores,
    ]),
  ]);
}
