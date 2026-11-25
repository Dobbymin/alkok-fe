import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

type Oklch = [number, number, number];

function oklchToLinearRgb([L, C, H]: Oklch): [number, number, number] {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return 0.2126 * clamp(rgb[0]) + 0.7152 * clamp(rgb[1]) + 0.0722 * clamp(rgb[2]);
}

function contrastRatio(fg: Oklch, bg: Oklch): number {
  const l1 = relativeLuminance(oklchToLinearRgb(fg));
  const l2 = relativeLuminance(oklchToLinearRgb(bg));
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function parseBlockTokens(blockBody: string): Record<string, string> {
  const map: Record<string, string> = {};
  const declRegex = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match: RegExpExecArray | null;
  while ((match = declRegex.exec(blockBody)) !== null) {
    const key = match[1];
    const value = match[2];
    if (key && value) {
      map[`--${key}`] = value.replace(/\s+/g, " ").trim();
    }
  }
  return map;
}

function resolveOklch(nameOrValue: string | undefined, vars: Record<string, string>): Oklch {
  if (!nameOrValue) {
    throw new Error("Missing CSS token value");
  }
  let current = nameOrValue.trim();
  for (let i = 0; i < 6; i++) {
    const varMatch = /^var\((--[a-z0-9-]+)\)$/i.exec(current);
    const refName = varMatch?.[1];
    if (!refName) break;
    const next = vars[refName];
    if (!next) throw new Error(`Unresolved CSS variable: ${refName}`);
    current = next;
  }
  const oklchMatch = /^oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)$/i.exec(current);
  if (!oklchMatch) {
    throw new Error(`Expected solid oklch(...) value, got "${current}"`);
  }
  return [Number(oklchMatch[1]), Number(oklchMatch[2]), Number(oklchMatch[3])];
}

describe("Design System OKLCH tokens", () => {
  const css = fs.readFileSync(path.resolve(__dirname, "tokens.css"), "utf8");
  const rootMatch = /:root\s*\{([\s\S]*?)\n\}/.exec(css);
  const darkMatch = /\.dark\s*\{([\s\S]*?)\n\}/.exec(css);

  it("defines both :root and .dark theme blocks", () => {
    expect(rootMatch).not.toBeNull();
    expect(darkMatch).not.toBeNull();
  });

  const lightVars = parseBlockTokens(rootMatch?.[1] ?? "");
  const darkVars = { ...lightVars, ...parseBlockTokens(darkMatch?.[1] ?? "") };

  it("keeps all Layer 1 primitives inside the sRGB gamut", () => {
    for (const [key, val] of Object.entries(lightVars)) {
      if (!key.startsWith("--alkok-")) continue;
      const rgb = oklchToLinearRgb(resolveOklch(val, lightVars));
      for (const ch of rgb) {
        expect(ch, `${key} out of sRGB gamut`).toBeGreaterThanOrEqual(-0.002);
        expect(ch, `${key} out of sRGB gamut`).toBeLessThanOrEqual(1.002);
      }
    }
  });

  it("passes WCAG 2.2 AA contrast for light and dark semantic pairs", () => {
    const textPairs: Array<[string, string, number]> = [
      ["--foreground", "--background", 4.5],
      ["--muted-foreground", "--background", 4.5],
      ["--muted-foreground", "--card", 4.5],
      ["--muted-foreground", "--sidebar", 4.5],
      ["--primary-foreground", "--primary", 4.5],
      ["--destructive-foreground", "--destructive", 4.5],
      ["--accent-foreground", "--accent", 4.5],
      ["--sidebar-accent-foreground", "--sidebar-accent", 4.5],
      ["--status-valid-fg", "--status-valid-bg", 4.5],
      ["--status-review-fg", "--status-review-bg", 4.5],
      ["--status-expired-fg", "--status-expired-bg", 4.5],
      ["--input", "--card", 3.0],
      ["--ring", "--card", 3.0],
    ];

    for (const [fgKey, bgKey, min] of textPairs) {
      const lightRatio = contrastRatio(
        resolveOklch(lightVars[fgKey], lightVars),
        resolveOklch(lightVars[bgKey], lightVars),
      );
      expect(lightRatio, `Light ${fgKey} on ${bgKey}`).toBeGreaterThanOrEqual(min);

      const darkRatio = contrastRatio(
        resolveOklch(darkVars[fgKey], darkVars),
        resolveOklch(darkVars[bgKey], darkVars),
      );
      expect(darkRatio, `Dark ${fgKey} on ${bgKey}`).toBeGreaterThanOrEqual(min);
    }
  });
});
