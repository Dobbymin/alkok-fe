import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { deflateSync } from "node:zlib";

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // filter none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    makeChunk("IHDR", ihdr),
    makeChunk("IDAT", idat),
    makeChunk("IEND", Buffer.alloc(0)),
  ]);
}

function renderBrandRgba(size, { maskable = false } = {}) {
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = maskable ? size * 0.24 : size * 0.28;
  const innerR = maskable ? size * 0.1 : size * 0.12;
  const cornerR = maskable ? 0 : size * 0.24;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const idx = (y * size + x) * 4;
      let insideRounded = true;

      if (cornerR > 0) {
        const dx = Math.max(0, Math.abs(x + 0.5 - cx) - (size / 2 - cornerR));
        const dy = Math.max(0, Math.abs(y + 0.5 - cy) - (size / 2 - cornerR));
        if (dx * dx + dy * dy > cornerR * cornerR) {
          insideRounded = false;
        }
      }

      if (!insideRounded) {
        rgba[idx] = 0;
        rgba[idx + 1] = 0;
        rgba[idx + 2] = 0;
        rgba[idx + 3] = 0;
        continue;
      }

      const dist = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (dist <= innerR) {
        // Emerald 500 (#10B981)
        rgba[idx] = 16;
        rgba[idx + 1] = 185;
        rgba[idx + 2] = 129;
        rgba[idx + 3] = 255;
      } else if (dist <= outerR) {
        // Pure white (#FFFFFF)
        rgba[idx] = 255;
        rgba[idx + 1] = 255;
        rgba[idx + 2] = 255;
        rgba[idx + 3] = 255;
      } else {
        // Indigo 600 (#4F46E5)
        rgba[idx] = 79;
        rgba[idx + 1] = 70;
        rgba[idx + 2] = 229;
        rgba[idx + 3] = 255;
      }
    }
  }

  return rgba;
}

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

function writeOut(relPath, buf) {
  const full = resolve(process.cwd(), relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, buf);
}

const icon192 = encodePng(192, 192, renderBrandRgba(192));
const icon512 = encodePng(512, 512, renderBrandRgba(512));
const iconMaskable512 = encodePng(
  512,
  512,
  renderBrandRgba(512, { maskable: true }),
);
const faviconPng32 = encodePng(32, 32, renderBrandRgba(32));
const faviconIco = encodeIcoFromPng(faviconPng32, 32);

writeOut("public/icons/icon-192.png", icon192);
writeOut("public/icons/icon-512.png", icon512);
writeOut("public/icons/icon-maskable-512.png", iconMaskable512);
writeOut("public/favicon.ico", faviconIco);

console.log("Generated brand PNG/ICO icons successfully.");
