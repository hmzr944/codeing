/* Captures d'écran de contrôle. node tools/shots.mjs [url] */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:8099/';
const OUT = process.env.SHOT_DIR || '/tmp/claude-0/-home-user/8c14e4d7-2935-5807-b243-bca208739393/scratchpad/shots';
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2, locale: 'fr-FR', isMobile: true, hasTouch: true
});
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', e => errors.push('pageerror: ' + e.message));
p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

const shot = async (name) => {
  await p.waitForTimeout(320);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  console.log('  →', name);
};

await p.goto(BASE, { waitUntil: 'networkidle' });

// --- onboarding ---
await shot('01-onboarding');
await p.click('[data-next]');
await p.fill('#o-name', 'Lina');
await p.click('[data-next]');
await shot('02-rythme');
await p.click('[data-g="20"]');
await p.click('[data-done]');
await shot('03-accueil-vide');

// --- défi du jour : on répond à quelques questions ---
await p.click('[data-daily]');
await shot('04-question');
await p.click('.ans >> nth=0');
await p.click('#go');
await shot('05-correction');

// quelques réponses de plus pour nourrir les stats
for (let i = 0; i < 12; i++) {
  await p.click('#go');
  await p.waitForTimeout(90);
  const n = await p.locator('.ans').count();
  if (!n) break;
  await p.click(`.ans >> nth=${i % n}`);
  await p.waitForTimeout(60);
  await p.click('#go');
  await p.waitForTimeout(90);
}
// on termine la série
for (let i = 0; i < 40; i++) {
  if (await p.locator('.score').count()) break;
  if (await p.locator('.ans').count()) {
    await p.click('.ans >> nth=0').catch(() => {});
    await p.waitForTimeout(50);
  }
  await p.click('#go').catch(() => {});
  await p.waitForTimeout(120);
}
await shot('06-resultat');

// --- autres onglets ---
await p.click('[data-home]');
await shot('07-accueil');
await p.click('.tab[data-go="train"]');   await shot('08-reviser');
await p.click('.tab[data-go="exam"]');    await shot('09-examen');
await p.click('.tab[data-go="lessons"]'); await shot('10-fiches');
await p.click('.tab[data-go="stats"]');   await shot('11-progres');

// --- thème clair ---
await p.click('.tab[data-go="home"]');
await p.click('[data-go="settings"]');
await shot('12-reglages');
await p.click('#theme [data-theme="jour"]');
await p.click('[data-back]');
await shot('13-accueil-jour');

// --- panneaux : planche de contrôle ---
await p.evaluate(() => {
  document.body.innerHTML =
    '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;padding:16px;background:#fff">' +
    Signs.list().map(id =>
      `<div style="text-align:center"><div style="width:100%">${Signs.render(id)}</div>
       <div style="font:600 8px system-ui;color:#333;margin-top:4px">${id}</div></div>`).join('') + '</div>';
  document.querySelectorAll('svg').forEach(s => { s.style.width = '100%'; s.style.height = 'auto'; });
});
await p.setViewportSize({ width: 800, height: 1400 });
await p.screenshot({ path: `${OUT}/14-panneaux.png`, fullPage: true });
console.log('  → 14-panneaux');

await b.close();
if (errors.length) { console.error('\nERREURS:\n' + errors.join('\n')); process.exit(1); }
console.log('\nAucune erreur JS.');
