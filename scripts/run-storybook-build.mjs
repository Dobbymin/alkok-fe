import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const cwd = process.cwd();
const storybookMain = path.join(cwd, ".storybook", "main.ts");

if (!fs.existsSync(storybookMain)) {
  console.log("[build-storybook] .storybook/main.ts not found yet (scheduled in Issue #15). Skipping.");
  process.exit(0);
}

execFileSync("pnpm", ["exec", "storybook", "build"], { stdio: "inherit" });
