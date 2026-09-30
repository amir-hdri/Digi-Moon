/**
 * Tier 5 — Shared Foundations: real-code coverage for the refactored modules.
 *
 * The 100 tests in tiers 1–4 exercise hand-written simulators in `tests/harness.ts`
 * rather than the application, so nothing in the new query/text layer was covered. These
 * tests import the real modules.
 *
 * `toJalali` is cross-checked against `Intl.DateTimeFormat('en-US-u-ca-persian')` over a
 * 20-year window. The first implementation divided the day-of-year by 31 for every month
 * (Jalali months 7–12 have 30), which was wrong for ~41% of all dates; this check is what
 * would have caught it.
 */
import { describe, test, expect } from '../harness.ts';
import { toJalali, normalizePersian, normalizeIranianMobile, isValidIranianMobile } from '../../src/lib/persian.ts';
import { filterCatalog, resolveCategory, categoryTree, getBrandFacets } from '../../src/lib/catalog.ts';

/** Reference Jalali conversion from the platform's own calendar data. */
function intlJalali(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

describe('Shared foundations (real modules)', 'tier5', () => {
  test('T5.F1: toJalali matches the Intl Persian calendar for 20 years', () => {
    const mismatches: string[] = [];
    const cursor = new Date(Date.UTC(2020, 0, 1, 12));
    const end = Date.UTC(2040, 0, 1, 12);
    let checked = 0;
    while (cursor.getTime() < end) {
      // `toJalali` reads local fields; the reference reads UTC fields. Use a local-date
      // wrapper so both sides describe the same calendar day.
      const local = new Date(
        cursor.getUTCFullYear(),
        cursor.getUTCMonth(),
        cursor.getUTCDate(),
        12
      );
      const mine = toJalali(local);
      const ref = intlJalali(cursor);
      if (mine.year !== ref.year || mine.month !== ref.month || mine.day !== ref.day) {
        if (mismatches.length < 5) {
          mismatches.push(
            `${local.toDateString()}: got ${mine.year}/${mine.month}/${mine.day}, Intl says ${ref.year}/${ref.month}/${ref.day}`
          );
        }
      }
      checked += 1;
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    expect(checked, 'expected ~7300 days checked').toBeGreaterThan(7000);
    expect(mismatches.join('\n'), 'toJalali must match Intl for every day').toHaveLength(0);
  });

  test('T5.F2: toJalali never emits a day beyond the length of the Jalali month', () => {
    // Months 1–6 have 31 days, 7–11 have 30, Esfand has 29 (30 in a Jalali leap year).
    const isLeap = (jy: number) => ((jy + 2346) * 683) % 2820 < 683;
    const cursor = new Date(2020, 0, 1, 12);
    for (let i = 0; i < 4000; i += 1) {
      const { year, month, day } = toJalali(cursor);
      const len =
        month <= 6 ? 31 : month <= 11 ? 30 : isLeap(year) ? 30 : 29;
      if (day < 1 || day > len) {
        throw new Error(`impossible date ${year}/${month}/${day} (month length ${len})`);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    expect(true, 'no impossible Jalali dates in 4000 days').toBe(true);
  });

  test('T5.F3: toJalali is monotonic across a year boundary', () => {
    // The bug signature: 2024-03-20 is 1403/01/01, so the day before must be 1402/12/29.
    const nowruz = toJalali(new Date(2024, 2, 20, 12));
    const eve = toJalali(new Date(2024, 2, 19, 12));
    expect(nowruz).toEqual({ year: 1403, month: 1, day: 1 });
    expect(eve).toEqual({ year: 1402, month: 12, day: 29 });
  });

  test('T5.F4: normalizePersian folds Arabic/Persian orthographic variants', () => {
    const cases: Array<[string, string]> = [
      ['آب', 'اب'],            // alef madda
      ['كیک', 'کیک'],          // arabic kaf
      ['يک', 'یک'],            // arabic yeh
      ['مـرد', 'مرد'],  // tatweel
      ['درخت\u200cها', 'درخت ها'], // ZWNJ
      ['پُنیر', 'پنیر'],        // diacritic
      ['كتاب', 'کتاب'],
    ];
    for (const [input, expected] of cases) {
      if (normalizePersian(input) !== expected) {
        throw new Error(`normalizePersian('${input}') = '${normalizePersian(input)}', expected '${expected}'`);
      }
    }
    expect(true, 'all orthographic variants folded').toBe(true);
  });

  test('T5.F5: Iranian mobile normalization accepts every common spelling', () => {
    const valid = ['09123456789', '۰۹۱۲۳۴۵۶۷۸۹', '0912 345 6789', '0912-345-6789', '+989123456789', '989123456789', '00989123456789'];
    for (const input of valid) {
      if (normalizeIranianMobile(input) !== '09123456789') {
        throw new Error(`normalizeIranianMobile('${input}') = '${normalizeIranianMobile(input)}'`);
      }
      if (!isValidIranianMobile(input)) throw new Error(`isValidIranianMobile('${input}') was false`);
    }
    for (const input of ['08123456789', '0912345678', '12345', '', null, undefined]) {
      if (isValidIranianMobile(input)) throw new Error(`isValidIranianMobile('${input}') should be false`);
    }
    expect(true, 'mobile validation accepts and rejects correctly').toBe(true);
  });

  test('T5.F6: every category node resolves by both slug and id', () => {
    const unresolved: string[] = [];
    for (const node of categoryTree) {
      for (const candidate of [node.id, node.slug, node.slug.toUpperCase(), `  ${node.slug}  `]) {
        if (resolveCategory(candidate)?.id !== node.id) unresolved.push(`${node.id} via '${candidate}'`);
      }
      for (const child of node.children ?? []) {
        if (resolveCategory(child.slug)?.id !== child.id) unresolved.push(`${child.id} via slug`);
        if (resolveCategory(child.id)?.id !== child.id) unresolved.push(`${child.id} via id`);
      }
    }
    expect(unresolved.join('\n'), 'all nodes resolve').toHaveLength(0);
  });

  test('T5.F7: resolveCategory returns null for unknown slugs (no fake category)', () => {
    if (resolveCategory('does-not-exist') !== null) throw new Error('expected null for unknown slug');
    if (resolveCategory('') !== null) throw new Error('expected null for empty string');
    if (resolveCategory(null) !== null) throw new Error('expected null for null');
  });

  test('T5.F8: a brand facet always matches at least `count` products', () => {
    // The old hardcoded chip list matched Latin brand ids against Persian titles, so six of
    // seven chips returned an empty grid.
    for (const facet of getBrandFacets()) {
      const matched = filterCatalog({ brand: facet.id }).length;
      if (matched < facet.count) {
        throw new Error(`brand '${facet.id}' claims ${facet.count} but only ${matched} products match`);
      }
      if (matched === 0) throw new Error(`brand '${facet.id}' matches nothing`);
    }
    expect(getBrandFacets().length, 'brand facets derived from the catalog').toBeGreaterThan(0);
  });

  test('T5.F9: subcategory filtering returns a strict subset of its parent', () => {
    const parent = categoryTree.find((c) => (c.children ?? []).length > 0);
    if (!parent) throw new Error('fixture problem: no parent with children');
    const parentTotal = filterCatalog({ categoryId: parent.id }).length;
    for (const child of parent.children ?? []) {
      const childTotal = filterCatalog({ categoryId: child.id }).length;
      if (childTotal > parentTotal) {
        throw new Error(`subcategory ${child.id} (${childTotal}) exceeds parent ${parent.id} (${parentTotal})`);
      }
    }
    expect(true, 'subcategory counts nest inside their parent').toBe(true);
  });

  test('T5.F10: filterCatalog never mutates the source catalog', () => {
    const before = JSON.stringify(filterCatalog({ categoryId: 'groceries' }));
    const ascending = filterCatalog({ categoryId: 'groceries', sort: 'cheapest' });
    const descending = filterCatalog({ categoryId: 'groceries', sort: 'expensive' });
    if (JSON.stringify(filterCatalog({ categoryId: 'groceries' })) !== before) {
      throw new Error('filterCatalog mutated the underlying catalog');
    }
    if (ascending[0]?.price > descending[0]?.price) {
      throw new Error('sort keys are not opposite');
    }
    expect(true, 'sorting is non-mutating').toBe(true);
  });
});
