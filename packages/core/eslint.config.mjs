import { baseEslintConfig } from "@alkok/config/eslint/base.mjs";

export default [
  { ignores: ["src/api/generated/**"] },
  ...baseEslintConfig,
];
