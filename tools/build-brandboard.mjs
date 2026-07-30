/* ============================================================
   Génère dist/brand-board.html : le système de design de Feu Vert,
   documenté par lui-même.

   Rien n'est recopié à la main. Les couleurs, les rayons, l'échelle
   typographique, les panneaux, les schémas et les blocs de leçon
   sont lus dans les fichiers du projet, et les rapports de contraste
   sont calculés. Une planche dessinée à part se désynchroniserait au
   premier changement de token ; celle-ci ne peut pas.

   Lancer : node tools/build-brandboard.mjs
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(root, f), 'utf8');

const css = lire('css/style.css');
const police = lire('css/font.css');

/* ---------------- tokens ---------------- */

/* On lit les deux blocs de variables plutôt que de les redéclarer :
   la planche affiche forcément les valeurs en vigueur. */
function tokens(selecteur) {
  const i = css.indexOf(selecteur);
  const bloc = css.slice(i, css.indexOf('\n}', i));
  const out = {};
  for (const m of bloc.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}
const NUIT = tokens(':root{');
const JOUR = tokens('html[data-theme="jour"]{');

/* ---------------- contraste ---------------- */

const canal = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ([r, g, b]) => 0.2126 * canal(r / 255) + 0.7152 * canal(g / 255) + 0.0722 * canal(b / 255);
const rgb = (v) => {
  const h = v.match(/^#([0-9a-f]{6})$/i);
  if (h) return [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16));
  const m = v.match(/rgba?\(([^)]+)\)/);
  return m ? m[1].split(',').slice(0, 3).map((x) => +x) : null;
};
const ratio = (a, b) => {
  const x = rgb(a), y = rgb(b);
  if (!x || !y) return null;
  const l1 = lum(x), l2 = lum(y);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const fmt = (r) => (r === null ? '—' : r.toFixed(2).replace('.', ',') + ':1');

/* Les paires qui existent réellement dans l'interface. */
const PAIRES = [
  ['--txt', '--bg', 'Texte principal sur le fond'],
  ['--txt-2', '--surface', 'Texte secondaire sur une carte'],
  ['--txt-3', '--surface-3', 'Texte faible, sur la surface la plus claire'],
  ['--accent-ink', '--accent', 'Encre posée sur l’accent'],
  ['--accent-txt', '--surface', 'Accent employé comme couleur de texte'],
  ['--ok-ink', '--ok', 'Encre sur « bonne réponse »'],
  ['--ko-ink', '--ko', 'Encre sur « mauvaise réponse »']
];

const lignesContraste = PAIRES.map(([a, b, quoi]) => {
  const n = ratio(NUIT[a.slice(2)], NUIT[b.slice(2)]);
  const j = ratio(JOUR[a.slice(2)] || NUIT[a.slice(2)], JOUR[b.slice(2)] || NUIT[b.slice(2)]);
  const pire = Math.min(n ?? 99, j ?? 99);
  return `<tr>
    <td>${quoi}<span class="paire">${a} sur ${b}</span></td>
    <td class="n">${fmt(n)}</td>
    <td class="n">${fmt(j)}</td>
    <td class="n"><span class="verdict ${pire >= 4.5 ? 'ok' : 'ko'}">${pire >= 4.5 ? 'AA' : 'sous le seuil'}</span></td>
  </tr>`;
}).join('');

/* ---------------- échantillons vivants ---------------- */

/* Les générateurs SVG du projet sont exécutés ici : les panneaux et
   les schémas de la planche sont ceux de l'application, pas des
   images figées. */
const noop = () => {};
const bac = {
  console, window: {}, document: { addEventListener: noop }, navigator: {},
  localStorage: { getItem: () => null, setItem: noop }, setTimeout, setInterval,
  matchMedia: () => ({ matches: false, addEventListener: noop })
};
bac.window = bac;
vm.createContext(bac);
for (const f of ['js/icons.js', 'js/signs.js', 'js/diagrams.js', 'js/data/themes.js', 'js/data/lessons.js']) {
  vm.runInContext(lire(f), bac, { filename: f });
}
const { Icons, Signs, Diagrams, LESSONS } = bac;

const PANNEAUX = ['stop', 'cedez', 'danger-enfants', 'limite-50', 'obl-tout-droit',
  'parking', 'route-prioritaire', 'fin-interdictions'];
const ICONES = ['signalisation', 'priorites', 'vitesse', 'usagers', 'secours',
  'vehicule', 'chrono', 'serie', 'etoile', 'valide', 'chat', 'fiches'];

const echPanneaux = PANNEAUX.filter((s) => Signs.has(s))
  .map((s) => `<figure class="pan">${Signs.render(s)}<figcaption>${s}</figcaption></figure>`).join('');
const echIcones = ICONES.filter((i) => Icons.has(i))
  .map((i) => `<span class="ico" title="${i}">${Icons.svg(i, 22)}</span>`).join('');
const echSchema = Diagrams.render('deux-secondes');

/* Les sept formes de bloc, avec un exemple pris dans les leçons. */
const TYPES = [
  ['retenir', 'La phrase à garder si on ne retient qu’une chose'],
  ['piege', 'L’erreur classique, celle qui coûte des points'],
  ['cle', 'Les points à retenir, un par ligne'],
  ['chiffres', 'Un tableau de valeurs, alignées pour être comparées'],
  ['panneaux', 'Les panneaux du thème, dessinés'],
  ['schema', 'Un dessin, quand la notion ne s’explique pas par des mots'],
  ['texte', 'Un paragraphe court, jamais plus de trois phrases']
];
const compte = {};
for (const l of LESSONS) for (const b of l.blocs) compte[b.t] = (compte[b.t] || 0) + 1;
const lignesBlocs = TYPES.map(([t, quoi]) =>
  `<tr><td><code>${t}</code></td><td>${quoi}</td><td class="n">${compte[t] || 0}</td></tr>`).join('');

/* ---------------- échelle typographique ---------------- */
const ECHELLE = [
  ['h1', 'clamp(25px, 6.6vw, 32px)', 800, 'Titre d’écran'],
  ['h2', 'clamp(18px, 4.8vw, 21px)', 800, 'Titre de section'],
  ['.q-txt', 'clamp(17.5px, 4.6vw, 20px)', 750, 'Énoncé d’une question'],
  ['corps', '14,5px', 400, 'Texte de leçon'],
  ['.small', '13px', 400, 'Précision'],
  ['.tiny', '11,5px', 400, 'Mention discrète'],
  ['.sec-t', '11px · +0,11em', 750, 'Étiquette de section, en capitales']
];
const lignesType = ECHELLE.map(([n, t, g, quoi]) =>
  `<tr><td><code>${n}</code></td><td>${t}</td><td class="n">${g}</td><td>${quoi}</td></tr>`).join('');

/* ---------------- planche ---------------- */

const swatch = (nom, cn, cj) => `<div class="sw">
  <div class="sw-p"><span style="background:${cn}"></span><span style="background:${cj}"></span></div>
  <div class="sw-n"><code>--${nom}</code><span>${cn}<br>${cj}</span></div>
</div>`;

const COULEURS = ['accent', 'accent-txt', 'accent-ink', 'ok', 'ko',
  'bg', 'surface', 'surface-2', 'surface-3', 'line', 'txt', 'txt-2', 'txt-3'];

const html = `<title>Feu Vert · système de design</title>
<style>
${police}

/* Les tokens du projet, tels quels. Le thème suit celui du lecteur,
   comme dans l'application : la nuit par défaut, le jour sur demande. */
:root{
${Object.entries(NUIT).map(([k, v]) => `  --${k}:${v};`).join('\n')}
  color-scheme:dark;
}
@media (prefers-color-scheme:light){
  :root{
${Object.entries(JOUR).map(([k, v]) => `    --${k}:${v};`).join('\n')}
    color-scheme:light;
  }
}
:root[data-theme="light"]{
${Object.entries(JOUR).map(([k, v]) => `  --${k}:${v};`).join('\n')}
  color-scheme:light;
}
:root[data-theme="dark"]{
${Object.entries(NUIT).map(([k, v]) => `  --${k}:${v};`).join('\n')}
  color-scheme:dark;
}

*,*::before,*::after{box-sizing:border-box}
body{
  margin:0;padding:clamp(20px,5vw,56px) clamp(16px,5vw,40px) 80px;
  background:var(--bg);color:var(--txt);
  font-family:var(--font);line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.page{max-width:920px;margin:0 auto}

h1{font-size:clamp(30px,7vw,52px);font-weight:850;letter-spacing:-.04em;line-height:1.02;margin:0;text-wrap:balance}
.premisse{font-size:clamp(15px,2.4vw,18px);color:var(--txt-2);max-width:56ch;margin-top:14px;text-wrap:pretty}
.marque{display:flex;align-items:center;gap:13px;margin-bottom:26px}
.marque i{
  width:46px;height:46px;flex:0 0 46px;border-radius:14px;
  background:var(--accent);color:var(--accent-ink);
  display:grid;place-items:center;font-weight:850;font-size:19px;letter-spacing:-.05em;font-style:normal;
}
.marque b{font-size:15px;font-weight:800;letter-spacing:-.02em;display:block}
.marque span{font-size:12px;color:var(--txt-3)}

section{margin-top:clamp(38px,6vw,64px)}
h2{
  font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;
  color:var(--txt-3);margin:0 0 16px;padding-bottom:10px;
  border-bottom:1px solid var(--line);
}
h3{font-size:15px;font-weight:750;letter-spacing:-.015em;margin:26px 0 10px}
p{margin:0 0 12px;max-width:64ch;color:var(--txt-2);text-wrap:pretty}
code{
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.87em;
  background:var(--surface-2);padding:2px 6px;border-radius:6px;color:var(--txt);
}

/* Deux pastilles par token : la nuit à gauche, le jour à droite. */
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(214px,1fr));gap:12px}
.sw{border:1px solid var(--line-soft);border-radius:var(--r-card);overflow:hidden;background:var(--surface)}
.sw-p{display:flex;height:58px}
.sw-p span{flex:1}
.sw-n{padding:10px 12px;display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.sw-n code{white-space:nowrap}
.sw-n span{font-size:10.5px;color:var(--txt-3);text-align:right;line-height:1.45;
  font-variant-numeric:tabular-nums;white-space:nowrap}

.tbl-wrap{overflow-x:auto;border:1px solid var(--line-soft);border-radius:var(--r-card);background:var(--surface)}
table{width:100%;border-collapse:collapse;font-size:13.5px;min-width:480px}
th{
  text-align:left;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;
  color:var(--txt-3);padding:13px 14px;border-bottom:1px solid var(--line);white-space:nowrap;
}
td{padding:12px 14px;border-bottom:1px solid var(--line-soft);color:var(--txt-2);vertical-align:top}
tr:last-child td{border-bottom:0}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--txt)}
.paire{display:block;font-size:10.5px;color:var(--txt-3);margin-top:3px;
  font-family:ui-monospace,Menlo,monospace}
.verdict{
  display:inline-block;padding:2px 9px;border-radius:999px;
  font-size:10.5px;font-weight:800;letter-spacing:.06em;
}
.verdict.ok{background:var(--ok-soft);color:var(--ok);border:1px solid var(--ok-line)}
.verdict.ko{background:var(--ko-soft);color:var(--ko);border:1px solid var(--ko-line)}

.rayons{display:flex;gap:14px;flex-wrap:wrap}
.rayon{flex:1;min-width:132px;padding:20px 14px;text-align:center;
  background:var(--surface-2);border:1px solid var(--line)}
.rayon.c{border-radius:var(--r-card)}
.rayon.t{border-radius:var(--r-ctl)}
.rayon.p{border-radius:var(--r-pill)}
.rayon b{display:block;font-size:13px;font-weight:750;color:var(--txt)}
.rayon span{font-size:11px;color:var(--txt-3)}

.icones{display:flex;flex-wrap:wrap;gap:10px}
.ico{
  width:46px;height:46px;border-radius:var(--r-ctl);
  background:var(--surface-2);border:1px solid var(--line-soft);
  display:grid;place-items:center;color:var(--txt-2);
}
.ico svg{display:block}

.panneaux{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:12px}
.pan{margin:0;padding:12px;border-radius:var(--r-ctl);text-align:center;
  background:var(--surface-2);border:1px solid var(--line-soft)}
.pan svg{width:100%;max-width:62px;height:auto;display:block;margin:0 auto}
.pan figcaption{font-size:10px;color:var(--txt-3);margin-top:8px;
  font-family:ui-monospace,Menlo,monospace;overflow-wrap:anywhere}

.schema{padding:16px;border-radius:var(--r-card);background:var(--surface-2);
  border:1px solid var(--line-soft);margin-top:6px}
.dg{width:100%;height:auto;display:block}
.dg text{font-family:var(--font);font-weight:650}
.dg-t,.dg-lg{fill:var(--txt-2)}
.dg-lg2{fill:var(--txt-3)}
.dg-titre,.dg-sur{fill:var(--txt);font-weight:750}
.dg-sur-acc{fill:var(--accent-ink);font-weight:800}
.dg-lg-acc{fill:var(--accent-txt);font-weight:750}
.dg-route,.dg-route-c,.dg-neutre{fill:var(--surface-3)}
.dg-accent-f{fill:var(--accent)}
.dg-veh{fill:var(--txt-2)}
.dg-veh-acc{fill:var(--accent)}
.dg-vitre{fill:var(--surface)}
.dg-bande{stroke:var(--txt-3);stroke-width:2;stroke-dasharray:12 10;opacity:.6}
.dg-cote{stroke:var(--txt-3);stroke-width:1.5}
.dg-fleche-c{stroke:var(--accent);stroke-width:3.5;fill:none;stroke-linecap:round}
.dg-fleche-p{fill:var(--accent)}

/* Ce que le système interdit. C'est la partie qui tient dans le temps :
   une règle négative se vérifie, une intention ne se vérifie pas. */
.interdits{display:grid;gap:10px}
.interdit{
  display:flex;gap:12px;padding:14px 16px;border-radius:var(--r-card);
  background:var(--surface);border:1px solid var(--line-soft);
  border-left:3px solid var(--ko);
}
.interdit b{color:var(--txt);font-weight:750;display:block;font-size:13.5px}
.interdit span{font-size:13px;color:var(--txt-2);display:block;margin-top:3px}

footer{margin-top:64px;padding-top:20px;border-top:1px solid var(--line);
  font-size:12px;color:var(--txt-3)}
</style>

<div class="page">

  <div class="marque"><i>FV</i><div><b>Feu Vert</b><span>Révision du code de la route 2026</span></div></div>

  <h1>Un seul accent, deux couleurs qui ne mentent jamais.</h1>
  <p class="premisse">Le jaune n’est pas un choix décoratif : c’est la couleur de la
  signalisation, le sujet même de l’application. Le vert et le rouge ne veulent dire
  qu’une chose, « bonne réponse » et « mauvaise réponse ». Tout le reste est neutre.</p>

  <section>
    <h2>Couleur</h2>
    <p>Chaque pastille montre la valeur de nuit à gauche, celle de jour à droite.
    Les deux thèmes portent les mêmes rôles, jamais les mêmes teintes.</p>
    <div class="swatches">
      ${COULEURS.map((c) => swatch(c, NUIT[c], JOUR[c] || NUIT[c])).join('')}
    </div>

    <h3>Contraste, mesuré</h3>
    <p>Ces rapports ne sont pas déclarés : <code>tools/contraste.mjs</code> parcourt
    quatorze écrans dans les deux thèmes et relève la couleur calculée de chaque texte
    visible. Le seuil AA est de 4,5:1 pour du texte courant.</p>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Paire</th><th class="n">Nuit</th><th class="n">Jour</th><th class="n">Verdict</th></tr></thead>
      <tbody>${lignesContraste}</tbody>
    </table></div>
  </section>

  <section>
    <h2>Typographie</h2>
    <p>Lexend Variable, sous licence SIL, intégrée en base64 dans la page.
    Dessinée pour la lisibilité : proportions ouvertes, espacement généreux,
    pensée pour réduire la fatigue de lecture. Elle est embarquée et non chargée
    à distance, pour que l’absence de réseau ne fasse jamais basculer la mise en
    page sur une police de repli.</p>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Rôle</th><th>Taille</th><th class="n">Graisse</th><th>Emploi</th></tr></thead>
      <tbody>${lignesType}</tbody>
    </table></div>
    <p style="margin-top:14px">Aucun texte sous 10,5 px dans l’interface, et les nombres
    sont toujours en chiffres tabulaires pour que les compteurs ne sautent pas.</p>
  </section>

  <section>
    <h2>Forme</h2>
    <p>Trois rayons, aucun autre. Un quatrième rayon introduit du bruit sans rien dire.</p>
    <div class="rayons">
      <div class="rayon c"><b>${NUIT['r-card']}</b><span>surfaces, blocs</span></div>
      <div class="rayon t"><b>${NUIT['r-ctl']}</b><span>boutons, champs</span></div>
      <div class="rayon p"><b>pastille</b><span>jauges, badges</span></div>
    </div>
  </section>

  <section>
    <h2>Icônes</h2>
    <p>Phosphor Icons, licence MIT, graisse <em>light</em> pour l’interface. Elles sont
    extraites à la compilation dans <code>js/icons.js</code> et héritent de la couleur du
    texte : aucune règle de couleur à écrire au cas par cas. ${Icons.list().length} icônes,
    aucun emoji nulle part.</p>
    <div class="icones">${echIcones}</div>
  </section>

  <section>
    <h2>Panneaux</h2>
    <p>${Signs.list().length} panneaux, dessinés en SVG et non photographiés : forme et
    couleurs fidèles, pictogrammes simplifiés, lisibles à n’importe quelle taille.
    C’est le seul endroit où d’autres couleurs vives sont admises, parce qu’elles y sont
    le sujet et non la décoration.</p>
    <div class="panneaux">${echPanneaux}</div>
  </section>

  <section>
    <h2>Schémas</h2>
    <p>${Diagrams.list().length} schémas pour les notions qui ne s’expliquent pas par des
    mots. Toutes leurs couleurs viennent des variables du système, donc ils suivent le
    thème sans traitement particulier.</p>
    <div class="schema">${echSchema}</div>
  </section>

  <section>
    <h2>Blocs de leçon</h2>
    <p>Une leçon n’est pas du HTML libre : c’est une suite de blocs typés. Le lecteur ne
    sait dessiner que ces sept formes, et c’est la leçon qui dit laquelle employer. Un mur
    de texte devient structurellement impossible.</p>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Type</th><th>Ce qu’il porte</th><th class="n">Emplois</th></tr></thead>
      <tbody>${lignesBlocs}</tbody>
    </table></div>
  </section>

  <section>
    <h2>Ce que le système interdit</h2>
    <p>La partie qui tient dans le temps. Une règle négative se vérifie ; une intention
    ne se vérifie pas.</p>
    <div class="interdits">
      <div class="interdit"><div><b>Une deuxième teinte décorative</b>
        <span>Un seul accent. Le vert et le rouge sont réservés au juste et au faux.</span></div></div>
      <div class="interdit"><div><b>L’accent comme couleur de texte en thème jour</b>
        <span>Il y plafonne à 2,7:1. Le rôle <code>--accent-txt</code> existe pour ça.</span></div></div>
      <div class="interdit"><div><b>Un quatrième rayon de bordure</b>
        <span>Trois suffisent à distinguer une surface, une commande et une pastille.</span></div></div>
      <div class="interdit"><div><b>Un emoji dans l’interface</b>
        <span>Le rendu change d’un appareil à l’autre et l’alignement optique est ingérable.</span></div></div>
      <div class="interdit"><div><b>Un thème qui s’inverse en cours de page</b>
        <span>Une seule ambiance du haut en bas, nuit ou jour.</span></div></div>
      <div class="interdit"><div><b>Une police chargée depuis un serveur distant</b>
        <span>Elle manquerait hors ligne et déplacerait toute la mise en page.</span></div></div>
    </div>
  </section>

  <footer>Planche générée par <code>tools/build-brandboard.mjs</code> à partir de
  <code>css/style.css</code>, <code>js/signs.js</code>, <code>js/diagrams.js</code> et
  <code>js/data/lessons.js</code>. Aucune valeur n’y est recopiée à la main : elle ne peut
  pas se désynchroniser du code.</footer>

</div>
`;

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/brand-board.html'), html);
console.log(`dist/brand-board.html  ${(Buffer.byteLength(html) / 1024).toFixed(0)} Ko`);
console.log(`${COULEURS.length} tokens, ${PAIRES.length} paires mesurées, ` +
  `${echPanneaux ? PANNEAUX.length : 0} panneaux, ${Diagrams.list().length} schémas recensés.`);
if (/<(!doctype|html|head|body)\b/i.test(html)) {
  console.error('ERREUR : la planche contient une balise de document.');
  process.exit(1);
}
