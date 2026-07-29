/* Vérification hors navigateur : syntaxe, intégrité de la banque
   de questions, panneaux référencés. Lancer : node tools/check.mjs */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Ordre des scripts, lu directement dans index.html pour rester en phase */
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);

const noop = () => {};
const fakeEl = new Proxy({}, {
  get: (t, k) => (k === 'classList' ? { add: noop, remove: noop, toggle: noop }
    : k === 'style' ? {}
    : k === 'querySelectorAll' || k === 'querySelector' ? () => (k.endsWith('All') ? [] : null)
    : typeof k === 'string' ? noop : undefined)
});
const sandbox = {
  console,
  window: {},
  localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  sessionStorage: { getItem: () => null, setItem: noop },
  navigator: {},
  location: { protocol: 'http:', hash: '' },
  history: { replaceState: noop },
  setTimeout, clearTimeout, setInterval, clearInterval,
  document: {
    addEventListener: noop, getElementById: () => fakeEl,
    querySelector: () => fakeEl, querySelectorAll: () => [],
    createElement: () => fakeEl, body: fakeEl, documentElement: fakeEl
  },
  matchMedia: () => ({ matches: false, addEventListener: noop })
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

let fail = 0;
const bad = (m) => { console.error('  ✗ ' + m); fail++; };

for (const f of files) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  try { vm.runInContext(src, sandbox, { filename: f }); }
  catch (e) { bad(`${f} : ${e.message}`); }
}
console.log(`Scripts chargés : ${files.length}`);

const W = sandbox.window;

/* ---------- banque de questions ---------- */
const banks = ['Q_SIGNALISATION', 'Q_CIRCULATION', 'Q_CONDUCTEUR', 'Q_VEHICULE', 'Q_USAGERS', 'Q_SECOURS'];
const all = banks.flatMap(b => W[b] || []);
const ids = new Set();
const themeKeys = new Set((W.THEMES || []).map(t => t.k));
const perTheme = {};

for (const q of all) {
  if (!q.id) bad('question sans id');
  if (ids.has(q.id)) bad(`id dupliqué : ${q.id}`);
  ids.add(q.id);
  if (!themeKeys.has(q.t)) bad(`${q.id} : thème inconnu "${q.t}"`);
  if (!q.q || !q.e) bad(`${q.id} : question ou explication manquante`);
  if (!Array.isArray(q.o) || q.o.length < 2) bad(`${q.id} : moins de 2 propositions`);
  if (!Array.isArray(q.a) || q.a.length === 0) bad(`${q.id} : aucune bonne réponse`);
  for (const i of q.a || []) if (i < 0 || i >= (q.o || []).length) bad(`${q.id} : index de réponse ${i} hors bornes`);
  if (new Set(q.a).size !== (q.a || []).length) bad(`${q.id} : index de réponse dupliqué`);
  if (q.a && q.a.length === (q.o || []).length) bad(`${q.id} : toutes les propositions sont correctes`);
  if (q.sign && !W.Signs.has(q.sign)) bad(`${q.id} : panneau inconnu "${q.sign}"`);
  if (![1, 2, 3].includes(q.d)) bad(`${q.id} : difficulté invalide`);
  perTheme[q.t] = (perTheme[q.t] || 0) + 1;
}

/* ---------- quotas de l'examen blanc ---------- */
const quota = { signalisation: 7, priorites: 5, vitesse: 4, manoeuvres: 4, autoroute: 3,
  stationnement: 3, conducteur: 4, usagers: 3, vehicule: 3, conditions: 2, secours: 1, environnement: 1 };
for (const [k, n] of Object.entries(quota)) {
  if ((perTheme[k] || 0) < n) bad(`thème "${k}" : ${perTheme[k] || 0} questions pour un quota d'examen de ${n}`);
}

/* ---------- fiches & panneaux ---------- */
for (const l of W.LESSONS || []) {
  if (!l.k || !l.n || !l.html) bad(`fiche incomplète : ${l.k}`);
  if (/—|–/.test(l.html)) bad(`fiche ${l.k} : tiret cadratin interdit`);
}
for (const id of W.Signs.list()) {
  const svg = W.Signs.render(id);
  if (!svg.startsWith('<svg') || !svg.endsWith('</svg>')) bad(`panneau ${id} : SVG malformé`);
}

/* ---------- copie visible ---------- */
const visible = JSON.stringify(all) + JSON.stringify(W.LESSONS) + JSON.stringify(W.BADGES) + JSON.stringify(W.THEMES);
if (/—|–/.test(visible)) bad('tiret cadratin détecté dans le contenu visible');

/* ---------- rapport ---------- */
console.log(`Questions : ${all.length}`);
console.log('Répartition :');
for (const t of W.THEMES) {
  console.log(`  ${String(perTheme[t.k] || 0).padStart(3)}  ${t.n}`);
}
console.log(`Panneaux dessinés : ${W.Signs.list().length}`);
console.log(`Fiches : ${(W.LESSONS || []).length}   Succès : ${(W.BADGES || []).length}`);

if (fail) { console.error(`\n${fail} problème(s).`); process.exit(1); }
console.log('\nTout est cohérent.');
