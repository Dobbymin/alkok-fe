export interface OgFontEntry {
  name: string;
  data: ArrayBuffer;
  weight: 500 | 700;
  style: "normal";
}

const MAX_CACHE_ENTRIES = 16;
const fontCache = new Map<string, ArrayBuffer>();

function getUniqueGlyphs(text: string): string {
  const unique = new Set(Array.from(text));
  return Array.from(unique).join("");
}

async function fetchSubsetTtf(
  weight: 500 | 700,
  glyphs: string,
): Promise<ArrayBuffer | null> {
  const cacheKey = `${weight}:${glyphs}`;
  const cached = fontCache.get(cacheKey);
  if (cached) {
    fontCache.delete(cacheKey);
    fontCache.set(cacheKey, cached);
    return cached;
  }

  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(glyphs)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const cssRes = await fetch(url, {
      headers: {
        // Legacy Safari UA prompts Google Fonts to serve .ttf instead of .woff2 (required by Satori)
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
      signal: controller.signal,
    });
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const fontUrlMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]truetype['"]\)/i);
    const fontUrl = fontUrlMatch?.[1]?.replace(/['"]/g, "");
    if (!fontUrl) return null;

    const fontRes = await fetch(fontUrl, { signal: controller.signal });
    if (!fontRes.ok) return null;
    const buffer = await fontRes.arrayBuffer();

    if (fontCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = fontCache.keys().next().value;
      if (oldestKey) fontCache.delete(oldestKey);
    }
    fontCache.set(cacheKey, buffer);
    return buffer;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function loadKoreanOgFonts(text: string): Promise<OgFontEntry[]> {
  const glyphs = getUniqueGlyphs(text);
  if (!glyphs) return [];

  const [regular, bold] = await Promise.all([
    fetchSubsetTtf(500, glyphs),
    fetchSubsetTtf(700, glyphs),
  ]);

  const fonts: OgFontEntry[] = [];
  if (regular) {
    fonts.push({ name: "Noto Sans KR", data: regular, weight: 500, style: "normal" });
  }
  if (bold) {
    fonts.push({ name: "Noto Sans KR", data: bold, weight: 700, style: "normal" });
  }
  return fonts;
}
