import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

const cwd = process.cwd();
const candidates = [
  path.join(os.homedir(), "Desktop/Dev/agent-skill/dev-principles/bin/dev-principles.mjs"),
  path.join(os.homedir(), ".claude/plugins/cache/dev-principles/dev-principles/0.1.0/bin/dev-principles.mjs"),
];

const cliPath = candidates.find((p) => fs.existsSync(p));
if (cliPath) {
  execFileSync("node", [cliPath, "check", "--preset", "fsd", "--strict"], {
    cwd,
    stdio: "inherit",
  });
  process.exit(0);
}

// CI fallback: lightweight zero-dep static check for security invariants & FSD layers
const LAYER_RANK = { app: 0, views: 1, pages: 1, widgets: 2, features: 3, entities: 4, shared: 5 };
const srcRoot = path.join(cwd, "src");
const findings = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === "generated") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(e.name)) files.push(full);
  }
  return files;
}

for (const file of walk(srcRoot)) {
  const rel = path.relative(cwd, file).replace(/\\/g, "/");
  const isTest = /\.(test|spec|stories)\.[jt]sx?$/.test(rel);
  const content = fs.readFileSync(file, "utf8");
  if (!isTest && /\bdangerouslySetInnerHTML\b|\beval\s*\(|\bnew\s+Function\s*\(/.test(content)) {
    findings.push(`[SEC-02] ${rel}: unsafe execution or HTML injection sink`);
  }
  if (!isTest && /(:\s*any\b|<any>|\bas\s+any\b)/.test(content)) {
    findings.push(`[TS-02] ${rel}: prohibited any usage`);
  }
  const fromParts = path.relative(srcRoot, file).replace(/\\/g, "/").split("/");
  const fromLayer = fromParts[0];
  if (fromLayer && fromLayer in LAYER_RANK) {
    const importRegex = /from\s+["']@\/([^"']+)["']/g;
    let m;
    while ((m = importRegex.exec(content)) !== null) {
      const targetParts = m[1].split("/");
      const toLayer = targetParts[0];
      if (toLayer && toLayer in LAYER_RANK && LAYER_RANK[fromLayer] > LAYER_RANK[toLayer]) {
        findings.push(`[FSD-01] ${rel}: reverse layer import @/${m[1]}`);
      }
    }
  }
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}
console.log("[check:principles] 0 findings (CI fallback)");
