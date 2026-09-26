/**
 * Tier 2 — Category 7: Zustand selector stability
 *
 * Regression tests for the infinite-render loop that broke `/`, `/cart` and `/profile`
 * (every route that mounts `AddressModal`). The cause was
 *
 *     useAuthStore((state) => state.user?.addresses ?? [])
 *
 * `useSyncExternalStore` calls a selector repeatedly — including for
 * `getServerSnapshot` — and compares the result with `Object.is`. The `?? []` allocated a
 * fresh array on every call, so React saw a changed snapshot each time, warned
 * "The result of getServerSnapshot should be cached to avoid an infinite loop", and
 * re-rendered until it threw "Maximum update depth exceeded" and the route fell to
 * `app/error.tsx`.
 *
 * These assertions read the real source so the pattern cannot be reintroduced silently.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, test, expect } from '../harness.ts';

const ROOT = path.resolve(process.cwd());

function readSource(relative: string): string {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

/** Every `use<X>Store(...)` call site in the app, with its file. */
function storeCallSites(): Array<{ file: string; code: string }> {
  const out: Array<{ file: string; code: string }> = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry.name)) {
        out.push({ file: path.relative(ROOT, full), code: fs.readFileSync(full, 'utf8') });
      }
    }
  };
  walk(path.join(ROOT, 'src'));
  return out;
}

const STORE_SELECTOR = /use[A-Z][A-Za-z]*Store\(\s*\(?\s*(?:state|s)\s*\)?\s*=>/g;

describe('Zustand selector stability', 'tier2', () => {
  test('T2.C7.1: No store selector allocates a fresh array or object', () => {
    const offenders: string[] = [];
    for (const { file, code } of storeCallSites()) {
      STORE_SELECTOR.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = STORE_SELECTOR.exec(code))) {
        // Take the balanced call expression starting at this match.
        const start = match.index;
        let depth = 0;
        let i = code.indexOf('(', start);
        const open = i;
        for (; i < code.length; i += 1) {
          if (code[i] === '(') depth += 1;
          else if (code[i] === ')') {
            depth -= 1;
            if (depth === 0) break;
          }
        }
        const call = code.slice(start, i + 1);
        // `?? []`, `?? {}`, `.filter(`, `.map(`, `.slice(` all build a new reference.
        if (/\?\?\s*(\[\]|\{\})/.test(call) || /\.(filter|map)\(/.test(call)) {
          const line = code.slice(0, start).split('\n').length;
          offenders.push(`${file}:${line} -> ${call.replace(/\s+/g, ' ').slice(0, 90)}`);
        }
      }
    }
    expect(offenders, `selectors must return a stable reference:\n${offenders.join('\n')}`).toHaveLength(0);
  });

  test('T2.C7.2: AddressModal reads addresses from the store root, not user?.addresses', () => {
    const source = readSource('src/components/address/AddressModal.tsx');
    expect(source).not.toContain('state.user?.addresses');
    expect(source).toContain('state.addresses');
  });

  test('T2.C7.3: Every persisted store defers hydration to StoreHydration', () => {
    // A store that hydrates at creation reads localStorage during the first render, which
    // both diverges from the server HTML and can re-enter React's render loop.
    const storeDir = path.join(ROOT, 'src', 'stores');
    const offenders: string[] = [];
    for (const entry of fs.readdirSync(storeDir)) {
      if (!entry.endsWith('.ts')) continue;
      const source = fs.readFileSync(path.join(storeDir, entry), 'utf8');
      if (!source.includes('persist(')) continue;
      if (!source.includes('skipHydration')) offenders.push(entry);
    }
    expect(offenders, `persisted stores missing skipHydration: ${offenders.join(', ')}`).toHaveLength(0);
  });

  test('T2.C7.4: StoreHydration rehydrates every persisted store', () => {
    const hydration = readSource('src/components/ui/StoreHydration.tsx');
    const storeDir = path.join(ROOT, 'src', 'stores');
    const missing: string[] = [];
    for (const entry of fs.readdirSync(storeDir)) {
      if (!entry.endsWith('.ts')) continue;
      const source = fs.readFileSync(path.join(storeDir, entry), 'utf8');
      if (!source.includes('persist(')) continue;
      const hook = `use${entry.replace(/\.ts$/, '').replace(/^use/, '')}`.replace('StoreStore', 'Store');
      if (!hydration.includes(hook)) missing.push(`${entry} -> expected ${hook}`);
    }
    expect(missing, `not rehydrated by StoreHydration:\n${missing.join('\n')}`).toHaveLength(0);
  });
});
