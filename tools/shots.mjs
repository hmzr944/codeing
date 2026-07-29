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

/* Un clic qui n'attend pas indéfiniment : sans cela, un bouton absent
   fige tout le script pendant le délai par défaut de Playwright. */
const click = async (sel, ms = 4000) => {
  try { await p.click(sel, { timeout: ms }); return true; }
  catch { console.log('  · ignoré :', sel); return false; }
};

/* Enchaîne une session jusqu'à l'écran de résultat */
const finishRun = async (max = 45, pick = 0) => {
  for (let i = 0; i < max; i++) {
    if (await p.locator('.score').count()) return true;
    const n = await p.locator('.ans').count();
    if (n) {
      const idx = pick < 0 ? n - 1 : Math.min(pick, n - 1);
      await p.click(`.ans >> nth=${idx}`, { timeout: 3000 }).catch(() => {});
      await p.waitForTimeout(50);
    }
    await p.click('#go', { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(110);
  }
  return !!(await p.locator('.score').count());
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
await finishRun(45, 0);
await shot('06-resultat');

// --- autres onglets ---
await click('[data-home]');
await shot('07-accueil');
await click('.tab[data-go="train"]');   await shot('08-parcours');
await click('.tab[data-go="exam"]');    await shot('09-examen');
await click('.tab[data-go="lessons"]'); await shot('10-cours');
await click('[data-lecon="signalisation"]'); await shot('10b-lecon');
await p.evaluate(() => window.scrollTo(0, 900)); await shot('10c-lecon-bas');
await click('[data-question]'); await shot('10d-assistant');
await p.fill('#msg', 'c’est quoi un accotement ?'); await p.press('#msg', 'Enter');
await p.waitForTimeout(300);
await p.fill('#msg', 'je peux boire combien'); await p.press('#msg', 'Enter');
await p.waitForTimeout(400); await shot('10e-assistant-reponse');
await click('[data-retour]');
await click('.tab[data-go="stats"]');   await shot('11-progres');

// --- thème clair ---
await click('.tab[data-go="home"]');
await click('[data-go="settings"]');
await shot('12-reglages');
await click('#theme [data-theme="jour"]');
await click('[data-back]');
await shot('13-accueil-jour');

// --- coffre du jour, si l'objectif est atteint ---
if (await p.locator('[data-chest]').count()) {
  await click('[data-chest]');
  await shot('21-coffre');
  await p.waitForTimeout(1600);
}

// --- mode survie : on répond volontairement mal pour perdre les vies ---
await click('.tab[data-go="home"]');
await click('[data-survie]');
await shot('15-survie-intro');
await click('[data-go]');
await p.waitForTimeout(200);
await shot('16-survie-vies');
await finishRun(60, -1);
await shot('17-survie-fin');

// --- défi de thème : il faut d'abord découvrir 10 questions du thème ---
await click('[data-home]');
await click('.tab[data-go="train"]');
await click('[data-t] >> nth=0');
await finishRun(40, 0);
await click('[data-home]');
await click('.tab[data-go="train"]');
await shot('20-parcours-debloque');
if (await p.locator('[data-boss]').count()) {
  await click('[data-boss] >> nth=0');
  await shot('18-defi-theme');
  await finishRun(25, 0);
  await shot('19-defi-resultat');
}

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
