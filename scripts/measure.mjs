// Measures every design's home page with Lighthouse (desktop preset) and writes scores.json.
// Usage: python3 -m http.server 5173 &   then   node scripts/measure.mjs   (needs Chrome; fetches lighthouse via npx)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const keys = readFileSync(new URL('../templates.js', import.meta.url), 'utf8').match(/^  (\w+): T\(/gm).map(l => l.trim().split(':')[0]);
const dir = mkdtempSync(join(tmpdir(), 'lh-')), scores = {};
for (const k of keys) {
  const out = join(dir, `${k}.json`);
  execFileSync('npx', ['-y', 'lighthouse@13', `http://localhost:5173/template.html?t=${k}&theme=1`, '--preset=desktop',
    '--only-categories=performance,accessibility,best-practices,seo', '--output=json', `--output-path=${out}`,
    '--chrome-flags=--headless=new', '--quiet'], { stdio: 'ignore' });
  const c = JSON.parse(readFileSync(out, 'utf8')).categories, n = x => Math.round(c[x].score * 100);
  scores[k] = { performance: n('performance'), accessibility: n('accessibility'), bestPractices: n('best-practices'), seo: n('seo'), measured: new Date().toISOString().slice(0, 10), mode: 'Lighthouse 13, desktop, local static server' };
  console.log(k, scores[k].performance, scores[k].accessibility, scores[k].bestPractices, scores[k].seo);
}
writeFileSync(new URL('../scores.json', import.meta.url), JSON.stringify(scores, null, 2) + '\n');
