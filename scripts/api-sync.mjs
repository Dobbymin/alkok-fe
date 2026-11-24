import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const cwd = process.cwd();
const source = process.env.OPENAPI_SPEC_URL || path.join(cwd, "openapi", "alkok-openapi.json");
const outFile = path.join(
  cwd,
  "packages",
  "core",
  "src",
  "api",
  "generated",
  "schema.d.ts",
);

fs.mkdirSync(path.dirname(outFile), { recursive: true });
execFileSync("pnpm", ["exec", "openapi-typescript", source, "-o", outFile], {
  cwd,
  stdio: "inherit",
});
console.log(`[api:sync] Generated ${path.relative(cwd, outFile)} from ${source}`);
