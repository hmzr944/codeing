/* ============================================================
   Audit de contraste, mesuré et non supposé.

   Les rapports de contraste avaient été calculés à la main jusqu'ici.
   Une valeur calculée à la main vieillit mal : elle suppose quelle
   couleur se trouve derrière quel texte, et cette supposition devient
   fausse au premier changement de fond.

   Cet outil ne suppose rien. Il parcourt les écrans réels, relève la
   couleur calculée de chaque texte visible, remonte l'arbre jusqu'au
   premier fond opaque, et compare.

   Seuils WCAG 2.1 niveau AA :
     4,5:1  texte courant
     3,0:1  texte large (24 px, ou 18,66 px en gras) et éléments
            d'interface porteurs de sens

   Lancer : node tools/contraste.mjs [url]
   ============================================================ */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:8099/';

/* ---------- relevé dans la page ---------- */
const RELEVE = () => {
  const lum = (r, g, b) => {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const rgb = (s) => {
    const m = String(s).match(/[\d.]+/g);
    return m ? { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] } : null;
  };
  /* Une couleur semi-transparente ne s'applique pas seule : elle se
     compose avec ce qu'il y a derrière. Sans cette composition, un
     fond à 13 % d'opacité serait pris pour un aplat. */
  const poser = (dessus, dessous) => ({
    r: dessus.r * dessus.a + dessous.r * (1 - dessus.a),
    g: dessus.g * dessus.a + dessous.g * (1 - dessus.a),
    b: dessus.b * dessus.a + dessous.b * (1 - dessus.a),
    a: 1
  });

  /* Le fond effectif : on empile les fonds semi-transparents en
     remontant, jusqu'au premier aplat. */
  const fondDe = (el) => {
    const couches = [];
    let n = el;
    while (n && n.nodeType === 1) {
      const c = rgb(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) {
        couches.push(c);
        if (c.a === 1) break;
      }
      n = n.parentElement;
    }
    if (!couches.length) return { r: 255, g: 255, b: 255, a: 1 };
    let base = couches[couches.length - 1];
    if (base.a < 1) base = poser(base, { r: 255, g: 255, b: 255, a: 1 });
    for (let i = couches.length - 2; i >= 0; i--) base = poser(couches[i], base);
    return base;
  };

  /* L'opacité de l'élément et de ses ancêtres délave le texte vers le
     fond. L'ignorer sous-estime le problème : un libellé en opacity .75
     est mesuré plus contrasté qu'il ne l'est réellement. */
  const opaciteCumulee = (el) => {
    let o = 1, n = el;
    while (n && n.nodeType === 1) {
      o *= parseFloat(getComputedStyle(n).opacity);
      n = n.parentElement;
    }
    return o;
  };

  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none') return false;
    if (opaciteCumulee(el) < 0.15) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };

  const desc = (el) => el.tagName.toLowerCase() +
    (el.id ? '#' + el.id : '') +
    (el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');

  const out = [];
  document.querySelectorAll('body *').forEach((el) => {
    /* Seuls les éléments qui portent eux-mêmes du texte : sinon on
       mesurerait le même mot une fois par ancêtre. */
    const propre = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim()).join(' ');
    if (!propre || !visible(el)) return;

    const s = getComputedStyle(el);
    const texte = rgb(s.color);
    if (!texte) return;
    const fond = fondDe(el);
    /* Alpha de la couleur ET opacité héritée : les deux délavent. */
    const alpha = texte.a * opaciteCumulee(el);
    const avant = alpha < 1 ? poser({ ...texte, a: alpha }, fond) : texte;

    const l1 = lum(avant.r, avant.g, avant.b);
    const l2 = lum(fond.r, fond.g, fond.b);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    const taille = parseFloat(s.fontSize);
    const graisse = parseInt(s.fontWeight, 10) || 400;
    /* « Texte large » au sens WCAG : 24 px, ou 18,66 px si gras. */
    const large = taille >= 24 || (taille >= 18.66 && graisse >= 700);
    const exige = large ? 3 : 4.5;

    out.push({
      desc: desc(el), texte: propre.slice(0, 42),
      ratio: Math.round(ratio * 100) / 100,
      taille: Math.round(taille * 10) / 10, graisse, exige,
      passe: ratio >= exige
    });
  });
  return out;
};

/* ---------- écrans parcourus ---------- */
const passer = async (p) => {
  await p.click('[data-next]'); await p.click('[data-next]'); await p.click('[data-done]');
  await p.waitForTimeout(200);
};

/* Le lecteur de leçon montre une idée par écran : pour mesurer un
   type de bloc précis (panneaux, chiffres...), on avance pas à pas
   depuis la couverture jusqu'à ce que ce bloc apparaisse, plutôt que
   de supposer combien de clics il faut (le contenu des leçons bouge). */
const avancerJusqua = async (p, selecteur, max) => {
  for (let i = 0; i < (max || 20); i++) {
    if ((await p.locator(selecteur).count()) > 0) return;
    if ((await p.locator('[data-suivant]').count()) === 0) return;
    await p.click('[data-suivant]');
    await p.waitForTimeout(120);
  }
};

const ECRANS = [
  { n: 'onboarding', aller: async () => {} },
  { n: 'accueil', aller: passer },
  { n: 'question', aller: async (p) => { await passer(p); await p.click('[data-daily]'); } },
  { n: 'correction juste', aller: async (p) => {
      await passer(p); await p.click('[data-daily]');
      for (let i = 0; i < 12; i++) {
        const n = await p.locator('.ans').count();
        /* On cherche une bonne réponse : c'est le vert qu'on veut mesurer. */
        await p.click('.ans >> nth=0'); await p.click('#go'); await p.waitForTimeout(120);
        if (await p.locator('.fb.ok').count()) return;
        await p.click('#go'); await p.waitForTimeout(120);
      } } },
  { n: 'correction fausse', aller: async (p) => {
      await passer(p); await p.click('[data-daily]');
      for (let i = 0; i < 12; i++) {
        const n = await p.locator('.ans').count();
        await p.click(`.ans >> nth=${n - 1}`); await p.click('#go'); await p.waitForTimeout(120);
        if (await p.locator('.fb.ko').count()) return;
        await p.click('#go'); await p.waitForTimeout(120);
      } } },
  { n: 'parcours', aller: async (p) => { await passer(p); await p.click('.tab[data-go="train"]'); } },
  { n: 'examen', aller: async (p) => { await passer(p); await p.click('.tab[data-go="exam"]'); } },
  { n: 'cours', aller: async (p) => { await passer(p); await p.click('.tab[data-go="lessons"]'); } },
  { n: 'leçon couverture', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]');
      await p.click('[data-lecon="signalisation"]'); } },
  { n: 'leçon panneaux', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]');
      await p.click('[data-lecon="signalisation"]');
      await avancerJusqua(p, '.pan-d svg'); } },
  { n: 'leçon chiffres', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]');
      await p.click('[data-lecon="memo"]');
      await avancerJusqua(p, '.tbl'); } },
  { n: 'leçon fin', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]');
      await p.click('[data-lecon="memo"]');
      await avancerJusqua(p, '[data-question]'); } },
  { n: 'assistant', aller: async (p) => {
      await passer(p); await p.click('.tab[data-go="lessons"]'); await p.click('[data-chat]');
      await p.fill('#msg', 'distance de sécurité'); await p.press('#msg', 'Enter');
      await p.waitForTimeout(600); } },
  { n: 'progrès', aller: async (p) => { await passer(p); await p.click('.tab[data-go="stats"]'); } },
  { n: 'réglages', aller: async (p) => { await passer(p); await p.click('[data-go="settings"]'); } },
  { n: 'survie', aller: async (p) => {
      await passer(p); await p.click('[data-survie]'); await p.click('[data-go]');
      await p.waitForTimeout(250); } },
  /* Le bandeau passager, mesuré à pleine opacité : c'est le seul état
     dans lequel on le lit. Sans cette entrée dédiée il n'était mesuré
     que par hasard, au gré du temps mis pour atteindre l'écran —
     parfois en plein fondu de sortie, à 15 % d'opacité, ce qui faisait
     échouer l'audit sur un contraste que personne ne voit jamais. */
  { n: 'bandeau', gardeBandeau: true, aller: async (p) => {
      await passer(p);
      await p.evaluate(() => UI.toast('Lisibilité du bandeau de notification', 'valide'));
      await p.waitForTimeout(400); } }
];

/* ---------- parcours ---------- */
const b = await chromium.launch();
const echecs = new Map();
let mesures = 0;

for (const theme of ['nuit', 'jour']) {
  const ctx = await b.newContext({
    viewport: { width: 390, height: 900 }, locale: 'fr-FR', isMobile: true, hasTouch: true,
    colorScheme: theme === 'jour' ? 'light' : 'dark'
  });

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
    await p.evaluate((t) => {
      /* Le thème est imposé avant tout rendu, pour ne pas mesurer un
         écran à moitié rebasculé. */
      const s = JSON.parse(localStorage.getItem('feuvert.v1') || '{}');
      s.profile = Object.assign({}, s.profile, { theme: t });
      localStorage.setItem('feuvert.v1', JSON.stringify(s));
    }, theme);
    await p.reload({ waitUntil: 'networkidle' });
    try { await ecran.aller(p); } catch { /* écran inatteignable à cette étape */ }
    /* 600ms et non 250 : les grilles à entrée décalée (médailles, succès,
       panneaux) mettent jusqu'à 480ms (200ms de délai + 280ms de durée)
       avant que leur dernier élément soit stabilisé. Un audit de contraste
       juge l'état stabilisé, pas une image prise en plein fondu. */
    await p.waitForTimeout(600);
    /* Un bandeau de notification s'affiche puis s'efface tout seul.
       Le surprendre pendant son fondu de sortie mesure un contraste
       qui n'existe qu'une fraction de seconde, et fait échouer l'audit
       au hasard du temps mis pour atteindre l'écran. On attend donc
       qu'il soit parti — sauf sur l'écran qui l'examine exprès. */
    if (!ecran.gardeBandeau) {
      await p.waitForFunction(() => {
        const t = document.getElementById('toaster');
        return !t || t.children.length === 0;
      }, null, { timeout: 8000 }).catch(() => {});
    }

    const releve = await p.evaluate(RELEVE);
    mesures += releve.length;
    for (const r of releve.filter((x) => !x.passe)) {
      const cle = theme + '|' + r.desc + '|' + r.ratio;
      if (!echecs.has(cle)) echecs.set(cle, { ...r, theme, ecran: ecran.n });
    }
    await p.close();
  }
  await ctx.close();
}
await b.close();

/* ---------- rapport ---------- */
console.log(`${mesures} textes mesurés sur ${ECRANS.length} écrans, en thème nuit et jour.\n`);

const liste = [...echecs.values()].sort((a, b) => a.ratio - b.ratio);
if (!liste.length) {
  console.log('Aucun texte sous le seuil AA.');
  process.exit(0);
}

console.log(`${liste.length} texte(s) sous le seuil :\n`);
for (const e of liste) {
  console.log(`  ${e.ratio.toFixed(2)}:1  (exigé ${e.exige})  ${e.theme} · ${e.ecran}`);
  console.log(`     ${e.desc}   ${e.taille}px/${e.graisse}`);
  console.log(`     « ${e.texte} »`);
}
process.exit(1);
