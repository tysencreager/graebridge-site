// Requests every old Hibu URL in data/redirects.csv against a base URL and fails on anything
// other than a 301 to the expected target.
// Usage: npm run check:redirects -- http://localhost:4321 [--skip-anchors] [--allow-308] [--concurrency 4]
//   --skip-anchors  only check rules whose target is a page (no #anchor)
//   --allow-308     accept 308 for trailing-slash-only rules (Cloudflare Pages answers those with 308)
//   --concurrency   requests in flight at once (default 4). 5xx answers and network errors are retried twice.
import fs from 'node:fs';

const args = process.argv.slice(2);
const base = args.find((a) => /^https?:\/\//.test(a));
if (!base) {
  console.error('Usage: npm run check:redirects -- <base-url> [--skip-anchors] [--allow-308]');
  process.exit(2);
}
const skipAnchors = args.includes('--skip-anchors');
const allow308 = args.includes('--allow-308');
const cIdx = args.indexOf('--concurrency');
const concurrency = Math.max(1, Number(cIdx > -1 ? args[cIdx + 1] : 4) || 4);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const rows = fs
  .readFileSync('data/redirects.csv', 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => {
    const [from, to, status] = line.split(',');
    return { from, to, status: Number(status) };
  })
  .filter((r) => r.from && r.to);

const norm = (location, requestUrl) => {
  const u = new URL(location, requestUrl);
  return u.pathname + u.hash;
};

const failures = [];
let checked = 0;
let skipped = 0;

async function check(row) {
  if (row.from === row.to) return void skipped++; // "/" stays "/"
  if (skipAnchors && row.to.includes('#')) return void skipped++;
  const url = new URL(row.from, base).href;
  const slashOnly = row.from.replace(/\/$/, '') === row.to.replace(/\/$/, '');
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      if (res.status >= 500 && attempt < 2) { await sleep(1500 * (attempt + 1)); continue; }
      const location = res.headers.get('location');
      const got = location ? norm(location, url) : null;
      const statusOk = res.status === row.status || (allow308 && slashOnly && res.status === 308);
      checked++;
      if (!statusOk || got !== row.to) failures.push(`${row.from}  expected ${row.status} -> ${row.to}  got ${res.status} -> ${got ?? '(no Location)'}`);
      return;
    } catch (err) {
      if (attempt < 2) { await sleep(1500 * (attempt + 1)); continue; }
      checked++;
      failures.push(`${row.from}  request failed: ${err.message}`);
      return;
    }
  }
}

const queue = [...rows];
await Promise.all(Array.from({ length: concurrency }, async () => { while (queue.length) await check(queue.shift()); }));

if (failures.length) {
  console.error(`check:redirects FAILED: ${failures.length} of ${checked} rules wrong against ${base}\n` + failures.map((f) => `  ✗ ${f}`).join('\n'));
  process.exit(1);
}
console.log(`check:redirects passed: ${checked} rules redirect to the expected target against ${base} (${skipped} skipped)`);
