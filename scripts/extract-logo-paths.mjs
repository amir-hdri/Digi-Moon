#!/usr/bin/env node
/**
 * Extracts the main color layers from public/logo-moonmarket.svg into
 * src/lib/digimoon-logo-paths.ts so DigiMoonAnimatedLogo can stroke-draw
 * the mark before handing off to the full-color image.
 *
 * Usage: node scripts/extract-logo-paths.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'public/logo-moonmarket.svg'), 'utf8');

// Anti-aliased edge layers (fill #F0B2AA) are only needed for the rasterized
// look; the six real color layers drive the draw animation.
const ORDER = { '#529F5A': 0, '#B7D3B3': 1, '#FFFFFF': 2, '#D13635': 3, '#A7A7A7': 4 };

const layers = [...svg.matchAll(/<g fill="([^"]+)"[^>]*>\s*(<path[^>]*?\/>)\s*<\/g>/gs)]
  .map(([, fill, path]) => ({
    fill,
    d: path.match(/d="([^"]*)"/)[1],
  }))
  .filter((layer) => layer.fill !== '#F0B2AA')
  .sort((a, b) => (ORDER[a.fill] ?? 9) - (ORDER[b.fill] ?? 9) || b.d.length - a.d.length);

const out = `/* GENERATED from public/logo-moonmarket.svg — Digi-Moon logo vector layers.
   Used by DigiMoonAnimatedLogo to stroke-draw the mark, then hand off to the
   full-color image. Regenerate with scripts/extract-logo-paths.mjs if the
   source logo changes. */

export interface LogoLayer {
  /** SVG path data in the 666x701 logo coordinate space */
  d: string;
  /** Brand fill/stroke color for this layer */
  fill: string;
}

export const DIGIMOON_LOGO_VIEWBOX = '0 0 666 701';

export const DIGIMOON_LOGO_LAYERS: LogoLayer[] = [
${layers
  .map((l) => `  {\n    fill: "${l.fill}",\n    d:\n      "${l.d}",\n  },`)
  .join('\n')}
];
`;

writeFileSync(join(root, 'src/lib/digimoon-logo-paths.ts'), out);
console.log(`Wrote ${layers.length} layers (${out.length} bytes)`);
