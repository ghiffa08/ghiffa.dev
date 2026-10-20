const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// PNG encoder helper
function createPNG(width, height, getPixel) {
  const bytesPerPixel = 4;
  const rowSize = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });

  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    let c = 0 ^ (-1);
    for (let i = 0; i < typeBuf.length; i++) c = (c >>> 8) ^ crcTable[(c ^ typeBuf[i]) & 0xff];
    for (let i = 0; i < data.length; i++) c = (c >>> 8) ^ crcTable[(c ^ data[i]) & 0xff];
    c = (c ^ (-1)) >>> 0;
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(c, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([header, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

// Seamless 2D Value Noise generator
function createNoiseGrid(size) {
  const grid = new Float32Array(size * size);
  let s = 2026;
  function rand() {
    s = (s * 16807 + 7) % 2147483647;
    return (s - 1) / 2147483646;
  }
  for (let i = 0; i < grid.length; i++) {
    grid[i] = rand();
  }
  return {
    sample(x, y) {
      const x0 = ((Math.floor(x) % size) + size) % size;
      const y0 = ((Math.floor(y) % size) + size) % size;
      const x1 = (x0 + 1) % size;
      const y1 = (y0 + 1) % size;
      const fx = x - Math.floor(x);
      const fy = y - Math.floor(y);

      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);

      const top = grid[y0 * size + x0] * (1 - sx) + grid[y0 * size + x1] * sx;
      const bottom = grid[y1 * size + x0] * (1 - sx) + grid[y1 * size + x1] * sx;
      return top * (1 - sy) + bottom * sy;
    }
  };
}

const N = 512;
const noise16 = createNoiseGrid(16);
const noise32 = createNoiseGrid(32);
const noise64 = createNoiseGrid(64);
const noise128 = createNoiseGrid(128);

function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const buffer = createPNG(N, N, (x, y) => {
  // Multi-frequency fractal noise with vertical grain elongation
  const n1 = noise16.sample((x / N) * 16, (y / N) * 6);
  const n2 = noise32.sample((x / N) * 32, (y / N) * 12);
  const n3 = noise64.sample((x / N) * 64, (y / N) * 24);
  const n4 = noise128.sample((x / N) * 128, (y / N) * 48);

  const grit = hash(x, y);
  const fineGrit = hash(x * 3 + 17, y * 7 + 31);
  const microGrit = hash(x * 11 + 43, y * 13 + 59);

  const fbm = n1 * 0.45 + n2 * 0.3 + n3 * 0.15 + n4 * 0.1;

  let alpha = 0;

  // 1. Broad distribution of micro-stipple ink starvation (paper color showing through)
  if (grit > 0.72) {
    alpha = Math.max(alpha, (grit - 0.72) * 2.8 * (0.3 + 0.7 * fbm));
  }

  // 2. High-density noise grain
  if (fineGrit > 0.84) {
    alpha = Math.max(alpha, (fineGrit - 0.84) * 4.5 * 0.7);
  }

  // 3. Medium distress splotches / paper fiber flecks
  if (fbm > 0.52 && microGrit > 0.35) {
    const splotch = ((fbm - 0.52) / 0.48) * microGrit;
    alpha = Math.max(alpha, splotch * 0.85);
  }

  // 4. Subtle vertical woodgrain fibers
  const vertPattern = Math.sin((x / N) * Math.PI * 32 + fbm * 8);
  if (vertPattern > 0.65 && grit > 0.45) {
    alpha = Math.max(alpha, (vertPattern - 0.65) * 1.8 * grit * 0.65);
  }

  alpha = Math.min(Math.max(alpha, 0), 0.95);

  // Background paper color: #EAE6DF = rgb(234, 230, 223)
  const r = 234;
  const g = 230;
  const b = 223;
  const a = Math.round(alpha * 255);

  return [r, g, b, a];
});

const outPath = path.join(__dirname, '../public/distress-speckles.png');
fs.writeFileSync(outPath, buffer);
console.log('Regenerated rich distress texture:', outPath, 'Bytes:', buffer.length);
