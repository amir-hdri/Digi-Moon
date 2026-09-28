import sharp from 'sharp';
import { rmSync, mkdirSync, copyFileSync } from 'node:fs';

const SRC = process.argv[2] ?? '/tmp/irlogos';
const OUT = '/Users/amirheidari/GitHub/Digi-Moon/public/brands';

const raster = [
  ['kalleh.png', 'kalleh.png'],
  ['farmand.jpg', 'farmand.jpg'],
  ['pegah.png', 'pegah.png'],
  ['kooshyar.png', 'kooshyar.png'],
  ['zamzam-alt.png', 'zamzam.png'],
  ['solico.jpg', 'solico.jpg'],
  ['golstan.png', 'golstan.png'],
  ['sunich.png', 'sunich.png'],
  ['mazmaz.png', 'mazmaz.png'],
];
const svgs = ['sahar.svg', 'shirin-asal.svg', 'minoo.svg'];

mkdirSync(OUT, { recursive: true });
// wipe previous (international) logos
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const report = [];
for (const [src, dest] of raster) {
  const isJpg = dest.endsWith('.jpg');
  const white = { r: 255, g: 255, b: 255, alpha: 1 };
  let pipeline = sharp(`${SRC}/${src}`);
  const meta = await pipeline.metadata();
  try {
    pipeline = pipeline.trim(meta.hasAlpha ? { background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 } : { background: white, threshold: 12 });
  } catch {}
  const buf = await pipeline
    .resize({ width: 320, height: 320, fit: 'inside', withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  if (isJpg) {
    await sharp(buf.data).jpeg({ quality: 88, mozjpeg: true }).toFile(`${OUT}/${dest}`);
  } else {
    await sharp(buf.data).png({ compressionLevel: 9 }).toFile(`${OUT}/${dest}`);
  }
  report.push(`${dest}  ${meta.width}x${meta.height} -> ${buf.info.width}x${buf.info.height}  ${(buf.info.size / 1024).toFixed(1)}KB`);
}
for (const s of svgs) {
  copyFileSync(`${SRC}/${s}`, `${OUT}/${s}`);
  report.push(`${s}  copied`);
}
console.log(report.join('\n'));
