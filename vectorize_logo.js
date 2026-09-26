const Jimp = require('jimp');
const potrace = require('potrace');
const fs = require('fs');
const util = require('util');

const trace = util.promisify(potrace.trace);

async function processImage() {
  const original = await Jimp.read('public/logo-moonmarket.jpg');
  const width = original.bitmap.width;
  const height = original.bitmap.height;

  // Create 3 empty images with white background
  const greenLayer = new Jimp(width, height, 0xFFFFFFFF);
  const redLayer = new Jimp(width, height, 0xFFFFFFFF);
  const greyLayer = new Jimp(width, height, 0xFFFFFFFF);

  const dist = (r, g, b, tr, tg, tb) => Math.sqrt((r-tr)**2 + (g-tg)**2 + (b-tb)**2);

  const targetGreen = [0, 166, 81];
  const targetRed = [235, 28, 36];
  const targetGrey = [140, 145, 153];

  original.scan(0, 0, width, height, function(x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx+1];
    const b = this.bitmap.data[idx+2];

    if (r > 230 && g > 230 && b > 230) return;

    const dGreen = dist(r, g, b, ...targetGreen);
    const dRed = dist(r, g, b, ...targetRed);
    const dGrey = dist(r, g, b, ...targetGrey);

    const min = Math.min(dGreen, dRed, dGrey);

    if (min === dGreen) {
      greenLayer.setPixelColor(0x000000FF, x, y);
    } else if (min === dRed) {
      redLayer.setPixelColor(0x000000FF, x, y);
    } else {
      greyLayer.setPixelColor(0x000000FF, x, y);
    }
  });

  const greenBuf = await greenLayer.getBufferAsync(Jimp.MIME_PNG);
  const redBuf = await redLayer.getBufferAsync(Jimp.MIME_PNG);
  const greyBuf = await greyLayer.getBufferAsync(Jimp.MIME_PNG);

  console.log('Tracing layers...');
  
  const opts = {
    turdSize: 100,
    optTolerance: 0.2,
    blackOnWhite: true,
  };

  const greenSvg = await trace(greenBuf, opts);
  const redSvg = await trace(redBuf, opts);
  const greySvg = await trace(greyBuf, opts);

  const extractPath = (svgStr) => {
    const match = svgStr.match(/<path[^>]*d="([^"]*)"/);
    return match ? match[1] : '';
  };

  const greenPath = extractPath(greenSvg);
  const redPath = extractPath(redSvg);
  const greyPath = extractPath(greySvg);

  const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <path fill="#0fa958" d="${greenPath}" />
    <path fill="#e11d27" d="${redPath}" />
    <path fill="#8c9199" d="${greyPath}" />
  </svg>`;

  fs.writeFileSync('public/logo-moonmarket.svg', finalSvg);
  console.log('Successfully created true vector SVG!');
}

processImage().catch(console.error);
