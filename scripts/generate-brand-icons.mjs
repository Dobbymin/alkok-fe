import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const webPublicDir = resolve(repoRoot, "apps/web/public");
const symbolSvgPath = resolve(webPublicDir, "brand/alkok-symbol.svg");

function encodeIcoFromPng(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(1, 4); // 1 image

  const entry = Buffer.alloc(16);
  entry[0] = size >= 256 ? 0 : size;
  entry[1] = size >= 256 ? 0 : size;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(22, 12); // offset = 6 + 16

  return Buffer.concat([header, entry, pngBuf]);
}

function buildMaskableSvg(symbolSvg) {
  const inner = symbolSvg
    .replace(/^<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "")
    .replace(/<rect width="64" height="64" rx="16" fill="#2563EB"\s*\/>/, "");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#2563EB" />
  <g transform="translate(7.04, 7.04) scale(0.78)">
    ${inner}
  </g>
</svg>`;
}

function writeOut(relPath, buf) {
  const full = resolve(webPublicDir, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, buf);
}

async function renderSvgToPng(page, svgMarkup, size, { omitBackground = true } = {}) {
  await page.setViewportSize({ width: size, height: size });
  const scaledSvg = svgMarkup
    .replace(/width="64"/, `width="${size}"`)
    .replace(/height="64"/, `height="${size}"`);

  await page.setContent(
    `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:transparent;overflow:hidden;width:${size}px;height:${size}px;">
    ${scaledSvg}
  </body>
</html>`,
    { waitUntil: "load" },
  );

  return page.screenshot({
    type: "png",
    omitBackground,
    clip: { x: 0, y: 0, width: size, height: size },
  });
}

async function main() {
  const symbolSvg = readFileSync(symbolSvgPath, "utf8");
  const maskableSvg = buildMaskableSvg(symbolSvg);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    const icon192 = await renderSvgToPng(page, symbolSvg, 192, { omitBackground: true });
    const icon512 = await renderSvgToPng(page, symbolSvg, 512, { omitBackground: true });
    const iconMaskable512 = await renderSvgToPng(page, maskableSvg, 512, {
      omitBackground: false,
    });
    const faviconPng32 = await renderSvgToPng(page, symbolSvg, 32, { omitBackground: true });

    writeOut("icons/icon-192.png", icon192);
    writeOut("icons/icon-512.png", icon512);
    writeOut("icons/icon-maskable-512.png", iconMaskable512);
    writeOut("favicon.ico", encodeIcoFromPng(faviconPng32, 32));
  } finally {
    await browser.close();
  }

  console.log("Generated brand PNG/ICO icons successfully.");
}

await main();
