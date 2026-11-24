import { baseEslintConfig } from "@alkok/config/eslint/base.mjs";

export default [
  { ignores: ["storybook-static/**"] },
  ...baseEslintConfig,
];
