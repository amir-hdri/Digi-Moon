const fs = require('fs');

// The transparent PNG we generated earlier
const imgPath = 'public/logo-moonmarket.png';
const imgBuffer = fs.readFileSync(imgPath);
const base64 = imgBuffer.toString('base64');

// We know the image is 447x447 from the `file` command output
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 447 447">
  <image href="data:image/png;base64,${base64}" width="447" height="447" />
</svg>`;

fs.writeFileSync('public/logo-moonmarket.svg', svg);
console.log('Created Base64 embedded SVG!');
