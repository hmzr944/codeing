/* ============================================================
   Audit responsive : détecte les débordements horizontaux et les
   éléments trop étirés, à plusieurs largeurs de téléphone.

   Lancer : node tools/responsive.mjs
   ============================================================ */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:8099/';
const LARGEURS = [320, 360, 390, 430];   // iPhone SE -> iPhone Pro Max

const ECRANS = [
  { n: 'onboarding', aller: async () => {} },
  { n: 'onboarding-profil', aller: async (p) => { await p.click('[data-next]'); } },
  { n: 'onboarding-rythme', aller: async (p) => { await p.click('[data-next]'); await p.click('[data-next]'); } },
  { n: 'accueil', aller: async (p) => { await passer(p); } },
  { n: 'quiz', aller: async (p) => { await passer(p); await p.click('[data-daily]'); } },
  { n: 'correction', aller: async (p) => {
      await passer(p); await p.click('[data-daily]');
      await p.click('.ans >> nth=0'); await p.click('#go'); } },
  { n: 'parcours', aller: async (p) => { await passer(p); await p.click('.tab[data-go="train"]'); } },
  { n: 'examen', aller: async (p) => { await passer(p); await p.click('.tab[data-go="exam"]'); } },
  { n: 'cours', aller: async (p) => { await passer(p); await p.click('.tab[data-go="lessons"]'); } },
  { n: 'lecon-couverture', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]');
      await p.click('[data-lecon="signalisation"]'); } },
  { n: 'lecon-panneaux', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]');
      await p.click('[data-lecon="signalisation"]');
      await avancerJusqua(p, '.pan-d svg'); } },
  { n: 'lecon-chiffres', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]');
      await p.click('[data-lecon="memo"]');
      await avancerJusqua(p, '.tbl'); } },
  { n: 'lecon-fin', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]');
      await p.click('[data-lecon="memo"]');
      await avancerJusqua(p, '[data-question]'); } },
  { n: 'assistant', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]');
      await p.click('[data-chat]');
      await p.fill('#msg', 'distance de sécurité');
      await p.press('#msg', 'Enter'); await p.waitForTimeout(300); } },
  { n: 'progres', aller: async (p) => { await passer(p); await p.click('.tab[data-go="stats"]'); } },
  { n: 'reglages', aller: async (p) => { await passer(p); await p.click('[data-go="settings"]'); } },
  { n: 'survie', aller: async (p) => { await passer(p); await p.click('[data-survie]'); } },
  { n: 'sprint', aller: async (p) => { await passer(p); await p.click('[data-sprint]'); } },
  /* La porte d'entrée n'apparaît qu'à une vraie deuxième ouverture :
     l'onboarding qui vient de finir ne pose jamais le drapeau de
     session, donc un simple rechargement suffit à la déclencher. */
  { n: 'entree', aller: async (p) => {
      await passer(p);
      await p.reload({ waitUntil: 'networkidle' }); } },
  { n: 'resultat-a-revoir', aller: async (p) => {
      await passer(p); await p.click('[data-daily]');
      await repondreFaux(p); } },
  { n: 'defi-theme', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="train"]');
      await p.click('[data-boss] >> nth=0'); } },
  { n: 'defi-resultat', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="train"]');
      await p.click('[data-boss] >> nth=0');
      await repondreFaux(p); } }
];

/* Répond systématiquement la dernière proposition (souvent fausse)
   jusqu'à l'écran de résultat : sert à peupler « À revoir » et les
   jauges de fin d'épreuve avec de vraies erreurs. */
async function repondreFaux(p, max) {
  for (let i = 0; i < (max || 90); i++) {
    if ((await p.locator('.score').count())) return;
    const n = await p.locator('.ans').count();
    if (n) {
      await p.click(`.ans >> nth=${n - 1}`, { timeout: 3000 }).catch(() => {});
      await p.waitForTimeout(30);
    }
    await p.click('#go', { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(70);
  }
}

async function passer(p) {
  await p.click('[data-next]');
  await p.click('[data-next]');
  await p.click('[data-done]');
  await p.waitForTimeout(150);
}

/* Le lecteur de leçon montre une idée par écran : on avance pas à pas
   depuis la couverture jusqu'à ce que le bloc recherché apparaisse,
   plutôt que de supposer combien de clics il faut. */
async function avancerJusqua(p, selecteur, max) {
  for (let i = 0; i < (max || 20); i++) {
    if ((await p.locator(selecteur).count()) > 0) return;
    if ((await p.locator('[data-suivant]').count()) === 0) return;
    await p.click('[data-suivant]');
    await p.waitForTimeout(120);
  }
}

/* Relevé dans la page : ce qui dépasse, ce qui est démesuré */
const RELEVE = () => {
  const vw = document.documentElement.clientWidth;
  const out = { debordePage: document.documentElement.scrollWidth > vw + 1, elements: [] };

  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed') return;

    const desc = el.tagName.toLowerCase() +
      (el.id ? '#' + el.id : '') +
      (el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');

    // dépasse la largeur de l'écran
    if (r.right > vw + 1 || r.left < -1) {
      out.elements.push({ q: 'déborde', desc, l: Math.round(r.left), r: Math.round(r.right) });
    }
    /* Contenu plus large que son conteneur.
       Le texte SVG est exclu : il déborde de sa boîte de mise en page
       sans jamais être coupé, la seule limite étant le viewBox du
       dessin. Contrôlé à la capture : les libellés des schémas
       s'affichent en entier. */
    if (el.namespaceURI !== 'http://www.w3.org/2000/svg' &&
        el.scrollWidth > el.clientWidth + 2 && cs.overflowX === 'visible') {
      out.elements.push({ q: 'contenu coupé', desc, dans: el.clientWidth, contenu: el.scrollWidth });
    }
    // champ de saisie démesurément large par rapport à son contenu utile
    if (/^(input|select)$/.test(el.tagName.toLowerCase())) {
      const t = el.type || '';
      if (['date', 'time', 'number'].includes(t) && r.width > 260) {
        out.elements.push({ q: 'champ trop étiré', desc: desc + '[' + t + ']', largeur: Math.round(r.width) });
      }
    }
    // cible tactile trop petite
    if (/^(button|a)$/.test(el.tagName.toLowerCase()) && el.offsetParent !== null) {
      if (r.height > 0 && r.height < 32 && el.textContent.trim().length > 0) {
        out.elements.push({ q: 'cible tactile <32px', desc, h: Math.round(r.height) });
      }
    }
  });
  return out;
};

const b = await chromium.launch();
let total = 0;

for (const largeur of LARGEURS) {
  const ctx = await b.newContext({ viewport: { width: largeur, height: 800 }, locale: 'fr-FR', isMobile: true, hasTouch: true });

  /* Même tirage en local et sur la CI. Sans cela l'audit ne mesure pas
     les mêmes écrans d'un passage à l'autre — 1014 textes ici, 1044
     sur la CI — et un contraste insuffisant peut passer inaperçu en
     local avant de bloquer la publication. C'est très exactement ce
     qui est arrivé au vert de l'assistant à 4,28:1. */
  await ctx.addInitScript(() => {
    let graine = 20260731;
    Math.random = function () {
      graine = (graine * 1103515245 + 12345) % 2147483648;
      return graine / 2147483648;
    };
  });
  for (const ecran of ECRANS) {
    const p = await ctx.newPage();
    await p.goto(BASE, { waitUntil: 'domcontentloaded' });
    await p.evaluate(() => localStorage.clear());
    await p.reload({ waitUntil: 'networkidle' });
    try { await ecran.aller(p); } catch { /* écran non atteignable à cette étape */ }
    await p.waitForTimeout(250);

    const r = await p.evaluate(RELEVE);
    const vus = new Set();
    const uniques = r.elements.filter((e) => {
      const k = e.q + '|' + e.desc;
      if (vus.has(k)) return false;
      vus.add(k); return true;
    });
    if (r.debordePage || uniques.length) {
      console.log(`\n${largeur}px · ${ecran.n}${r.debordePage ? '   [LA PAGE DÉFILE LATÉRALEMENT]' : ''}`);
      uniques.forEach((e) => {
        const d = Object.entries(e).filter(([k]) => k !== 'q' && k !== 'desc')
          .map(([k, v]) => `${k}=${v}`).join(' ');
        console.log(`   ${e.q.padEnd(20)} ${e.desc}  ${d}`);
        total++;
      });
    }
    await p.close();
  }
  await ctx.close();
}

await b.close();
console.log(`\n${total} problème(s) relevé(s).`);
process.exit(total ? 1 : 0);
