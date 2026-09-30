/**
 * Resolve hooks for the E2E runner (`node tests/runner.js`).
 *
 * Specs import real application modules, and those modules use the `@/`
 * tsconfig path alias (which plain Node cannot resolve). This hook maps
 * `@/<rest>` to `<repo>/src/<rest>`, trying `.ts` and `/index.ts` so both
 * `@/lib/persian` and `@/types` work. Registered at the top of `runner.js`,
 * before any spec is dynamically imported. `npm test` always runs from the
 * repo root, so `process.cwd()` is the project directory.
 */
import path from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const SRC = path.join(process.cwd(), 'src');

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith('@/')) {
    return nextResolve(specifier, context);
  }
  let target = path.join(SRC, specifier.slice(2));
  try {
    if (!path.extname(target)) {
      if (existsSync(target) && statSync(target).isDirectory()) {
        target = path.join(target, 'index.ts');
      } else {
        target += '.ts';
      }
    }
  } catch {
    // Fall through to default resolution so Node reports the real error.
    return nextResolve(specifier, context);
  }
  return { url: pathToFileURL(target).href, shortCircuit: true };
}
