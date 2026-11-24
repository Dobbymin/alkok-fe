import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readPngDimensions(filePath: string) {
  const buf = readFileSync(filePath);
  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(buf.subarray(0, 8).equals(pngSig)).toBe(true);
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function walkTextFiles(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkTextFiles(full, acc);
    } else if (/\.(ts|tsx|js|mjs|css|svg|json|md)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

describe("Brand & PWA assets", () => {
  it("provides SVG, ICO, and exact-dimension PNG icons", () => {
    const root = process.cwd();
    expect(existsSync(join(root, "public/brand/alkok-symbol.svg"))).toBe(true);
    expect(existsSync(join(root, "public/brand/alkok-wordmark.svg"))).toBe(true);
    expect(existsSync(join(root, "public/icon.svg"))).toBe(true);
    expect(existsSync(join(root, "public/favicon.ico"))).toBe(true);

    expect(readPngDimensions(join(root, "public/icons/icon-192.png"))).toEqual({
      width: 192,
      height: 192,
    });
    expect(readPngDimensions(join(root, "public/icons/icon-512.png"))).toEqual({
      width: 512,
      height: 512,
    });
    expect(
      readPngDimensions(join(root, "public/icons/icon-maskable-512.png")),
    ).toEqual({
      width: 512,
      height: 512,
    });
  });

  it("contains zero occurrences of Alcock across workspace", () => {
    const webRoot = process.cwd();
    const repoRoot = join(webRoot, "../..");
    const files = [
      ...walkTextFiles(join(webRoot, "app")),
      ...walkTextFiles(join(webRoot, "src")),
      ...walkTextFiles(join(webRoot, "public")),
      ...walkTextFiles(join(repoRoot, "apps/admin/app")),
      ...walkTextFiles(join(repoRoot, "apps/admin/src")),
      ...walkTextFiles(join(repoRoot, "packages/ui/src")),
      ...walkTextFiles(join(repoRoot, "packages/core/src")),
    ];

    for (const file of files) {
      if (file.endsWith("brand-assets.test.ts")) continue;
      const content = readFileSync(file, "utf8");
      expect(content.toLowerCase()).not.toContain("alcock");
    }
  });
});
