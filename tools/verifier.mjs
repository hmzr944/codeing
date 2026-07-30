/* ============================================================
   Vérification de bout en bout.

   À lancer de préférence sur un miroir du site publié, pour
   contrôler ce qui est réellement servi et non la copie locale :
     node tools/verifier.mjs http://localhost:8100/
   ============================================================ */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:8099/';
const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
  locale: 'fr-FR', isMobile: true, hasTouch: true
});

const erreurs = [];
let ok = 0, ko = 0;
const test = (nom, condition, detail) => {
  if (condition) { ok++; console.log(`  ok    ${nom}`); }
  else { ko++; console.log(`  ÉCHEC ${nom}${detail ? '  -> ' + detail : ''}`); }
};
const bloc = (n) => console.log(`\n${n}`);

const p = await ctx.newPage();
p.on('pageerror', (e) => erreurs.push('JS: ' + e.message));
/* Un relais IA injoignable n'est pas un défaut : l'assistant est
   conçu pour retomber sur le cours. Ce chemin est vérifié à part,
   dans tools/test-ia.mjs, contre un relais maîtrisé. Ici, l'origine
   locale de test n'étant pas dans la liste blanche du relais réel, le
   rejet CORS est attendu et n'indique aucune régression. */
p.on('console', (m) => {
  if (m.type() !== 'error') return;
  if (/workers\.dev|CORS policy|net::ERR_FAILED/.test(m.text())) return;
  erreurs.push('console: ' + m.text());
});
p.on('requestfailed', (r) => {
  if (!/workers\.dev|IA_URL/.test(r.url())) erreurs.push('requête: ' + r.url());
});

const passerAccueil = async () => {
  await p.click('[data-next]'); await p.click('[data-next]'); await p.click('[data-done]');
  await p.waitForTimeout(200);
};
const jouer = async (max, choix = 0) => {
  for (let i = 0; i < max; i++) {
    if (await p.locator('.score').count()) return true;
    const n = await p.locator('.ans').count();
    if (n) {
      await p.click(`.ans >> nth=${choix < 0 ? n - 1 : Math.min(choix, n - 1)}`, { timeout: 3000 }).catch(() => {});
      await p.waitForTimeout(40);
    }
    await p.click('#go', { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(90);
  }
  return !!(await p.locator('.score').count());
};

/* L'assistant peut interroger un relais avant de répondre : on attend
   que la bulle d'attente disparaisse plutôt qu'un délai fixe, sinon on
   mesure le clignotement et pas la réponse. */
const attendreReponse = async () => {
  await p.waitForFunction(() => !document.querySelector('.pense'), null,
    { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(120);
};

/* ---------------- 1. chargement et données ---------------- */
bloc('1. Chargement et données');
await p.goto(BASE, { waitUntil: 'networkidle' });
const d = await p.evaluate(() => ({
  questions: Store.all.length,
  themes: THEMES.length,
  lecons: LESSONS.length,
  blocs: LESSONS.reduce((a, l) => a + l.blocs.length, 0),
  schemas: Diagrams.list().length,
  succes: BADGES.length,
  panneaux: Signs.list().length,
  icones: Icons.list().length,
  quota: Object.values(EXAM_QUOTA).reduce((a, x) => a + x, 0),
  stockage: Store.persistant,
  doublons: Store.all.length - new Set(Store.all.map(q => q.id)).size
}));
test('460 questions chargées', d.questions === 460, d.questions);
test('16 thèmes', d.themes === 16, d.themes);
test('19 leçons', d.lecons === 19, d.lecons);
test('blocs de cours', d.blocs > 100, d.blocs);
test('22 schémas', d.schemas === 22, d.schemas);
test('32 succès', d.succes === 32, d.succes);
test('66 panneaux', d.panneaux === 66, d.panneaux);
test('84 icônes', d.icones === 84, d.icones);
test('quotas d’examen = 40', d.quota === 40, d.quota);
test('aucun identifiant en double', d.doublons === 0, d.doublons);
test('stockage local disponible', d.stockage === true);

/* ---------------- 2. icônes rendues ---------------- */
bloc('2. Icônes et absence d’emoji dans l’interface');
await passerAccueil();
const ic = await p.evaluate(() => document.querySelectorAll('svg.ico').length);
test('icônes SVG présentes sur l’accueil', ic > 8, ic + ' trouvée(s)');

/* emoji résiduels : on ignore les panneaux, dont les pictogrammes
   sont volontairement des emoji */
const emo = await p.evaluate(() => {
  const re = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;
  const trouves = [];
  document.querySelectorAll('#app *, .tabbar *').forEach((el) => {
    if (el.closest('.q-sign') || el.children.length) return;
    const t = (el.textContent || '').trim();
    if (t && re.test(t)) trouves.push(el.className + ' :: ' + t.slice(0, 30));
  });
  return trouves;
});
test('aucun emoji dans l’interface', emo.length === 0, emo.slice(0, 3).join(' | '));

/* ---------------- 3. parcours et onglets ---------------- */
bloc('3. Navigation');
/* Chaque onglet est reconnu à un élément qui lui est propre et qui
   existe dès le premier lancement : le bloc de statistiques de
   l'examen, lui, n'apparaît qu'une fois un examen passé. */
for (const [tab, marqueur] of [['train', '.medal-box'], ['exam', '[data-start]'],
  ['lessons', '[data-lecon]'], ['stats', '.kpi'], ['home', '.hero']]) {
  await p.click(`.tab[data-go="${tab}"]`);
  await p.waitForTimeout(250);
  test(`onglet ${tab}`, (await p.locator(marqueur).count()) > 0);
}

/* ---------------- 4. défi du jour et mémorisation ---------------- */
bloc('4. Défi du jour et répétition espacée');
const avant = await p.evaluate(() => ({ xp: Store.s.xp, cartes: Object.keys(Store.s.cards).length }));
await p.click('[data-daily]');
await p.click('.ans >> nth=0');
await p.click('#go');
const correction = await p.locator('.fb').count();
test('correction affichée après validation', correction === 1);
test('explication présente', (await p.locator('.fb-b').textContent()).length > 30);
test('lien d’aide vers Claude',
  (await p.locator('a.fb-aide').getAttribute('href')).startsWith('https://claude.ai/new?q='));
test('assistant proposé dans la correction', (await p.locator('[data-fb-assist]').count()) === 1);
/* La feuille se pose sur la session sans la perdre */
await p.click('[data-fb-assist]');
await p.waitForTimeout(250);
test('feuille de l’assistant ouverte', (await p.locator('.feuille-panneau').count()) === 1);
await p.fill('#msg', 'angle mort');
await p.press('#msg', 'Enter');
await attendreReponse();
test('l’assistant répond dans la feuille',
  /angle mort|rétroviseur|contrôle/i.test(await p.locator('.feuille .msg.bot >> nth=-1').textContent()));
await p.click('.feuille button[data-fermer]');
await p.waitForTimeout(200);
test('la session reprend après fermeture', (await p.locator('.fb').count()) === 1);
await jouer(40);
const apres = await p.evaluate(() => ({ xp: Store.s.xp, cartes: Object.keys(Store.s.cards).length, hist: Store.s.history.length }));
test('XP en hausse', apres.xp > avant.xp, `${avant.xp} -> ${apres.xp}`);
test('fiches de révision créées', apres.cartes > avant.cartes, `${avant.cartes} -> ${apres.cartes}`);
test('session enregistrée', apres.hist >= 1);
test('écran de résultat', (await p.locator('.score').count()) === 1);

/* ---------------- 5. persistance ---------------- */
bloc('5. Persistance');
const nomAvant = await p.evaluate(() => Store.s.profile.name);
const xpAvant = await p.evaluate(() => Store.s.xp);
await p.goto(BASE, { waitUntil: 'networkidle' });
const apresRechargement = await p.evaluate(() => ({ nom: Store.s.profile.name, xp: Store.s.xp }));
test('prénom conservé après rechargement', apresRechargement.nom === nomAvant, apresRechargement.nom);
test('XP conservée après rechargement', apresRechargement.xp === xpAvant, `${xpAvant} -> ${apresRechargement.xp}`);

/* ---------------- 6. cours ---------------- */
bloc('6. Cours');

/* Le lecteur montre une idée par écran plutôt qu'une longue page :
   il faut donc avancer pas à pas (comme une vraie utilisatrice le
   ferait) pour cumuler ce qui a été vu sur toute la leçon, au lieu
   de tout lire d'un coup sur une seule capture du DOM. */
async function parcourirLecon(max) {
  const cumul = { panneaux: 0, retenir: 0, pieges: 0, schemas: 0 };
  await p.click('[data-suivant]');           // « Commencer », depuis la couverture
  await p.waitForTimeout(200);
  for (let i = 0; i < (max || 25); i++) {
    cumul.panneaux += await p.locator('.pan-d svg').count();
    cumul.retenir += await p.locator('.bl-retenir').count();
    cumul.pieges += await p.locator('.bl-piege').count();
    cumul.schemas += await p.locator('.bl-schema svg.dg').count();
    if ((await p.locator('[data-question]').count()) > 0) break;   // écran de fin atteint
    await p.click('[data-suivant]');
    await p.waitForTimeout(120);
  }
  return cumul;
}

await p.click('.tab[data-go="lessons"]');
test('les 19 leçons sont listées', (await p.locator('[data-lecon]').count()) === 19);
await p.click('[data-lecon="signalisation"]');
await p.waitForTimeout(250);
test('leçon ouverte', (await p.locator('.lecon-tete h1').textContent()) === 'Signalisation');
const lu = await parcourirLecon();
test('panneaux dessinés dans la leçon', lu.panneaux >= 8, lu.panneaux);
test('bloc « à retenir » présent', lu.retenir >= 1);
test('bloc « piège » présent', lu.pieges >= 1);
test('leçon marquée comme lue', await p.evaluate(() => !!Store.s.lessons.signalisation));
await p.click('[data-lecon]:not([data-lecon="signalisation"]) >> nth=0');
await p.waitForTimeout(200);
test('leçon suivante accessible',
  (await p.locator('.lecon-tete h1').textContent()) !== 'Signalisation');

/* Un schéma au moins doit se dessiner : sinon la leçon retombe en
   texte seul, ce qu'on cherchait précisément à éviter. */
await p.click('[data-retour] >> nth=0');
await p.waitForTimeout(200);
await p.click('[data-lecon="priorites"]');
await p.waitForTimeout(250);
const luPriorites = await parcourirLecon();
test('schémas dessinés', luPriorites.schemas >= 2, luPriorites.schemas);

/* ---------------- 6 bis. assistant ---------------- */
bloc('6 bis. Assistant');
/* parcourirLecon() s'arrête déjà sur l'écran de fin, où le bouton
   de l'assistant est proposé. */
await p.click('[data-question]');
await p.waitForTimeout(250);
for (const [question, attendu] of [
  ['c’est quoi un accotement ?', /bord de la route/i],
  ['je peux boire combien', /0,5|0,2|alcool/i],
  ['distance de sécurité', /seconde|distance/i],
  ['rond point qui passe', /giratoire|rond/i],
  ['zzzz qwerty', /je ne trouve rien/i]]) {
  await p.fill('#msg', question);
  await p.press('#msg', 'Enter');
  await attendreReponse();
  const txt = await p.locator('.msg.bot >> nth=-1').textContent();
  test(`assistant « ${question} »`, attendu.test(txt), txt.slice(0, 50));
}
test('renvoi vers Claude proposé',
  (await p.locator('.msg.bot >> nth=-1').locator('a.chat-lien').getAttribute('href'))
    .startsWith('https://claude.ai/new?q='));
await p.click('.msg.bot button[data-lecon] >> nth=0').catch(() => {});
await p.waitForTimeout(250);
test('l’assistant ouvre la leçon citée', (await p.locator('.lecon-tete h1').count()) === 1);

/* ---------------- 7. examen blanc ---------------- */
bloc('7. Examen blanc');
/* Le lecteur masque la barre d'onglets : on en sort d'abord, ce qui
   vérifie au passage que le bouton retour la fait revenir. */
await p.click('[data-retour] >> nth=0');
await p.waitForTimeout(200);
test('la barre d’onglets revient après la lecture',
  await p.locator('.tab[data-go="exam"]').isVisible());
await p.click('.tab[data-go="exam"]');
await p.click('[data-start]');
await p.waitForTimeout(300);
const ex = await p.evaluate(() => ({ n: Quiz && document.querySelectorAll('.pips i').length }));
test('40 questions tirées', ex.n === 40, ex.n);
const t1 = await p.locator('#timer').textContent();
await p.waitForTimeout(2100);
const t2 = await p.locator('#timer').textContent();
test('chronomètre décompte', t1 !== t2, `${t1.trim()} puis ${t2.trim()}`);
await p.click('.ans >> nth=0'); await p.click('#go'); await p.waitForTimeout(200);
test('aucune correction pendant l’épreuve', (await p.locator('.fb').count()) === 0);

/* ---------------- 8. survie ---------------- */
bloc('8. Mode survie');
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.click('[data-survie]'); await p.click('[data-go]');
await p.waitForTimeout(300);
test('trois vies au départ', (await p.locator('.lives .heart:not(.out)').count()) === 3);
await jouer(60, -1);
const surv = await p.evaluate(() => Store.s.survivalBest);
test('partie terminée et record enregistré', typeof surv === 'number');

/* ---------------- 9. réglages ---------------- */
bloc('9. Réglages');
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.click('[data-go="settings"]');
await p.click('#theme [data-theme="jour"]');
await p.waitForTimeout(200);
test('thème jour appliqué', (await p.evaluate(() => document.documentElement.dataset.theme)) === 'jour');
await p.click('#theme [data-theme="nuit"]');
await p.waitForTimeout(200);
test('thème nuit appliqué', (await p.evaluate(() => document.documentElement.dataset.theme)) === 'nuit');
await p.click('[data-goal="30"]');
test('objectif quotidien modifié', (await p.evaluate(() => Store.s.profile.goal)) === 30);

const tel = p.waitForEvent('download', { timeout: 8000 }).catch(() => null);
await p.click('[data-ics]');
const fichier = await tel;
test('rappel calendrier téléchargeable', !!fichier && /\.ics$/.test(fichier.suggestedFilename()),
  fichier ? fichier.suggestedFilename() : 'aucun téléchargement');

/* ---------------- 10. hors ligne ---------------- */
bloc('10. Fonctionnement hors ligne');
await p.goto(BASE, { waitUntil: 'networkidle' });
const sw = await p.evaluate(() => navigator.serviceWorker.ready.then(() => true).catch(() => false));
test('service worker actif', sw === true);
await p.waitForTimeout(1500);
await ctx.setOffline(true);
await p.goto(BASE, { waitUntil: 'domcontentloaded' }).catch(() => {});
await p.waitForTimeout(600);
const horsLigne = await p.evaluate(() => (window.Store && Store.all.length) || 0).catch(() => 0);
test('application chargée sans réseau', horsLigne === 460, horsLigne + ' question(s)');
await ctx.setOffline(false);

/* ---------------- bilan ---------------- */
await b.close();
console.log(`\n${ok} contrôle(s) réussi(s), ${ko} échec(s).`);
if (erreurs.length) {
  console.log('\nErreurs relevées pendant le parcours :');
  [...new Set(erreurs)].slice(0, 10).forEach((e) => console.log('  ' + e));
}
process.exit(ko || erreurs.length ? 1 : 0);
