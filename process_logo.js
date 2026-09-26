const { Jimp } = require('jimp');

async function processImage() {
  try {
    const image = await Jimp.read('public/logo-moonmarket.jpg');
    
    // Distance function to calculate color similarity to white
    const colorDistance = (r, g, b, targetR, targetG, targetB) => {
      return Math.sqrt(
        Math.pow(r - targetR, 2) +
        Math.pow(g - targetG, 2) +
        Math.pow(b - targetB, 2)
      );
    };

    image.scan((x, y, idx) => {
      const r = image.bitmap.data[idx];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];

      // If the color is close to white (255, 255, 255)
      if (colorDistance(r, g, b, 255, 255, 255) < 30) {
        // Set alpha to 0
        image.bitmap.data[idx + 3] = 0;
      }
    });

    await image.write('public/logo-moonmarket.png');
    console.log('Successfully created transparent PNG');
  } catch (error) {
    console.error('Error:', error);
  }
}

processImage();
