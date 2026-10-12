import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

// 外部依存を増やさず、サイトの配色に合わせたノートのアイコンをPNGで生成する。
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, bytes) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(bytes.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, bytes])));
  return Buffer.concat([length, name, bytes, checksum]);
}

const directory = new URL('../web/icons/', import.meta.url);
await mkdir(directory, { recursive: true });
for (const size of [192, 512]) {
  const pixels = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      const cover = u >= .24 && u < .76 && v >= .20 && v < .80;
      const spine = u >= .29 && u < .32 && v >= .20 && v < .80;
      const line = u >= .39 && u < .66 && [.34, .45, .56, .67].some(top => v >= top && v < top + .025);
      const color = cover ? (spine || line ? [20, 27, 24] : [141, 204, 173]) : [20, 27, 24];
      const offset = y * (size * 3 + 1) + 1 + x * 3;
      pixels.set(color, offset);
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 2;
  await writeFile(new URL(`icon-${size}.png`, directory), Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0)),
  ]));
}
