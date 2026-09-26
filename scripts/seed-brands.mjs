// One-off codemod: add `brand` (latin filter key) + `brandLabel` (display) to each mock
// product. Run from the repo root:  node scripts/seed-brands.mjs
import fs from 'node:fs';

const FILE = 'src/data/mock-data.ts';

const BRANDS = {
  'prod-1': ['oila', 'اویلا'],
  'prod-2': ['hahsemi', 'هاشمی'],
  'prod-3': ['rojin', 'روژین'],
  'prod-4': ['chilane', 'شیلانه'],
  'prod-5': ['pishgaman', 'پیشگمان'],
  'prod-6': ['toosirkan', 'تویسرکان'],
  'prod-7': ['farmand', 'فرمند'],
  'prod-8': ['nescafe', 'نسکافه'],
  'prod-9': ['ladora', 'لدورا'],
  'prod-10': ['nivea', 'نیوآ'],
  'prod-11': ['meswick', 'میسویک'],
  'prod-12': ['laferr', 'لافارر'],
  'prod-13': ['prey', 'پریل'],
  'prod-14': ['persil', 'پرسیل'],
  'prod-15': ['active', 'اکتیو'],
  'prod-16': ['rafone', 'رافونه'],
  'prod-17': ['kalleh', 'کاله'],
  'prod-18': ['kalleh', 'کاله'],
  'prod-19': ['pegah', 'پگاه'],
  'prod-20': ['pegah', 'پگاه'],
  'prod-21': ['bahman', 'بهمن'],
  'prod-22': ['domino', 'دومینو'],
  'prod-23': ['sepehr', 'سپهر'],
  'prod-24': ['zar', 'زارع'],
};

let source = fs.readFileSync(FILE, 'utf8');
let inserted = 0;
let skipped = 0;

// Anchor on the product id, then insert after the `categoryTitle:` line of that object.
for (const [id, [key, label]] of Object.entries(BRANDS)) {
  const idRe = new RegExp(`(id: '${id}',)`);
  const idMatch = idRe.exec(source);
  if (!idMatch) {
    skipped += 1;
    continue;
  }
  // Find the next `categoryTitle:` after this product's id.
  const tail = source.slice(idMatch.index);
  const catMatch = /(categoryTitle: '[^']*',\n)/.exec(tail);
  if (!catMatch) {
    skipped += 1;
    continue;
  }
  if (/brand:/.test(tail.slice(0, catMatch.index + catMatch[0].length + 40))) {
    skipped += 1;
    continue;
  }
  const at = idMatch.index + catMatch.index + catMatch[0].length;
  source = `${source.slice(0, at)}    brand: '${key}',\n    brandLabel: '${label}',\n${source.slice(at)}`;
  inserted += 1;
}

fs.writeFileSync(FILE, source);
console.log(`inserted=${inserted} skipped=${skipped}`);
