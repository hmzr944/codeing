/* ============================================================
   L'assistant branché sur le relais.

   Le relais est remplacé par un faux serveur local : on contrôle
   ce qui compte, c'est-à-dire que le modèle ne reçoit que des
   extraits du cours, que sa réponse reste vérifiable, et surtout
   que rien ne casse quand il ne répond pas.

   Lancer : node tools/test-ia.mjs
   ============================================================ */
import { chromium } from 'playwright';
import http from 'node:http';

const BASE = process.argv[2] || 'http://localhost:8099/';
const PORT = 8097;

let mode = 'ok';                 // ok | erreur | lent
let recu = null;

const relais = http.createServer((req, res) => {
  const entetes = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  if (req.method === 'OPTIONS') { res.writeHead(204, entetes); return res.end(); }

  let corps = '';
  req.on('data', (c) => { corps += c; });
  req.on('end', () => {
    recu = JSON.parse(corps);
    if (mode === 'erreur') { res.writeHead(502, entetes); return res.end('{"erreur":"panne"}'); }
    const repondre = () => {
      res.writeHead(200, entetes);
      res.end(JSON.stringify({
        reponse: 'Tu laisses deux secondes entre toi et la voiture de devant.\n' +
          'Sur route mouillée tu doubles, donc quatre secondes.'
      }));
    };
    /* Deux cents millisecondes : de quoi observer la bulle d'attente,
       comme le ferait un vrai aller-retour réseau. */
    setTimeout(repondre, mode === 'lent' ? 20000 : 200);
  });
});
await new Promise((r) => relais.listen(PORT, r));

let ok = 0, ko = 0;
const test = (nom, condition, detail) => {
  if (condition) { ok++; console.log(`  ok    ${nom}`); }
  else { ko++; console.log(`  ÉCHEC ${nom}${detail ? '  -> ' + detail : ''}`); }
};
const bloc = (n) => console.log(`\n${n}`);

const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 }, locale: 'fr-FR', isMobile: true, hasTouch: true
});
const erreurs = [];

const p = await ctx.newPage();
p.on('pageerror', (e) => erreurs.push('JS: ' + e.message));
/* Certains blocs provoquent volontairement une panne du relais : le
   navigateur la journalise, ce n'est pas un défaut de l'application.
   C'est même le comportement testé. */
let pannePrevue = false;
p.on('console', (m) => {
  if (m.type() === 'error' && mode !== 'erreur' && !pannePrevue) {
    erreurs.push('console: ' + m.text());
  }
});

/* L'adresse du relais est posée après chargement : c'est ce que
   fait js/config.js une fois renseigné. */
const brancherRelais = () => p.evaluate((u) => { window.IA_URL = u; }, `http://localhost:${PORT}/`);

const demarrer = async () => {
  await p.goto(BASE, { waitUntil: 'networkidle' });
  /* L'accueil n'apparaît qu'au tout premier lancement : les visites
     suivantes tombent directement sur la page d'accueil. */
  if (await p.locator('[data-next]').count()) {
    await p.click('[data-next]'); await p.click('[data-next]'); await p.click('[data-done]');
  }
  await brancherRelais();
};
const ouvrirAssistant = async () => {
  await demarrer();
  await p.click('.tab[data-go="lessons"]');
  await p.click('[data-chat]');
  await p.waitForTimeout(200);
};
const derniere = () => p.locator('.msg.bot >> nth=-1');

/* ---------------- 1. reformulation ---------------- */
bloc('1. Le modèle reformule');
await ouvrirAssistant();
await p.fill('#msg', 'distance de sécurité');
await p.press('#msg', 'Enter');
await p.waitForTimeout(90);
test('bulle d’attente affichée', (await p.locator('.pense').count()) === 1);
await p.waitForTimeout(700);
const txt = await derniere().textContent();
test('réponse du modèle affichée', /deux secondes/.test(txt), txt.slice(0, 60));
test('source consultable', (await derniere().locator('details.src').count()) === 1);
await derniere().locator('details.src > summary').click();
test('source tirée du cours',
  /seconde|distance/i.test(await derniere().locator('.src-c').textContent()));

/* Le point le plus important : rien d'autre que le cours ne part
   vers le modèle. */
bloc('2. Ce qui part vers le modèle');
test('question transmise', /distance de s/i.test(recu.question), recu.question);
test('extraits transmis', recu.extraits.length > 40, recu.extraits.length + ' signes');
test('extraits tirés des leçons et des questions',
  /Leçon «|Question d’examen|Définition du lexique/.test(recu.extraits));
/* La page envoie trois champs et pas un de plus : la consigne du
   modèle est écrite dans le Worker, hors de sa portée. */
test('aucune consigne envoyée depuis la page',
  !/tu es|assistant|réponds/i.test(recu.extraits) &&
  Object.keys(recu).sort().join(',') === 'extraits,mode,question',
  Object.keys(recu).join(','));
test('mode pris dans la liste fermée',
  ['expliquer', 'resume', 'erreur'].includes(recu.mode), recu.mode);

/* ---------------- 2 bis. résumer une leçon ---------------- */
bloc('2 bis. Résumer une leçon');
await demarrer();
await p.click('.tab[data-go="lessons"]');
await p.click('[data-lecon="signalisation"]');
await p.click('[data-resume]');
await p.waitForTimeout(800);
test('demande de résumé écrite pour elle',
  /Résume-moi/.test(await p.locator('.msg.moi >> nth=-1').textContent()));
test('mode « resume » envoyé au relais', recu.mode === 'resume', recu.mode);
test('la leçon entière part comme extrait',
  recu.extraits.includes('Signalisation') && recu.extraits.length > 400,
  recu.extraits.length + ' signes');
test('les blocs à retenir sont étiquetés', /À RETENIR/.test(recu.extraits));
test('résumé affiché', /deux secondes/.test(await derniere().textContent()));

/* Sans relais, le résumé doit quand même arriver : il se fabrique
   à partir des blocs faits pour être retenus. */
await demarrer();
await p.evaluate(() => { window.IA_URL = ''; });
await p.click('.tab[data-go="lessons"]');
await p.click('[data-lecon="signalisation"]');
await p.click('[data-resume]');
await p.waitForTimeout(400);
const horsLigne = await derniere().textContent();
test('résumé hors ligne fabriqué depuis le cours',
  /retenir de/.test(horsLigne) && /Triangle|Rond/.test(horsLigne), horsLigne.slice(0, 60));

/* ---------------- 2 ter. pourquoi ma réponse est fausse ---------------- */
bloc('2 ter. Pourquoi ma réponse est fausse');
await demarrer();
await p.click('[data-daily]');
/* On coche volontairement faux : la dernière proposition d'une
   question à réponse unique. */
let cible = null;
for (let i = 0; i < 12 && !cible; i++) {
  const n = await p.locator('.ans').count();
  await p.click(`.ans >> nth=${n - 1}`);
  await p.click('#go');
  await p.waitForTimeout(150);
  if (await p.locator('.fb.ko').count()) cible = true;
  else { await p.click('#go'); await p.waitForTimeout(150); }
}
test('une réponse fausse a été trouvée', !!cible);
test('le bouton nomme le vrai besoin',
  /Pourquoi ma réponse est fausse/.test(await p.locator('[data-fb-assist]').textContent()));
await p.click('[data-fb-assist]');
await p.waitForTimeout(800);
test('mode « erreur » envoyé au relais', recu.mode === 'erreur', recu.mode);
test('la réponse cochée part au modèle',
  /Réponse choisie par Mina, qui est fausse/.test(recu.extraits));
test('la bonne réponse et l’explication aussi',
  /Bonne réponse/.test(recu.extraits) && /Explication du cours/.test(recu.extraits));
test('explication affichée dans la feuille',
  /deux secondes/.test(await p.locator('.feuille .msg.bot >> nth=-1').textContent()));
await p.locator('.feuille details.src > summary').last().click();
test('la correction reste vérifiable',
  /coché/.test(await p.locator('.feuille .src-c').last().textContent()));

/* ---------------- 3. le relais tombe ---------------- */
bloc('3. Le relais tombe');
mode = 'erreur';
await ouvrirAssistant();
await p.fill('#msg', 'je peux boire combien');
await p.press('#msg', 'Enter');
await p.waitForTimeout(900);
const secours = await derniere().textContent();
test('réponse hors ligne prise en relève', /0,5|0,2|alcool/i.test(secours), secours.slice(0, 60));
test('aucune erreur montrée à l’écran', !/erreur|panne|502/i.test(secours));
test('plus de bulle d’attente', (await p.locator('.pense').count()) === 0);

/* ---------------- 4. hors ligne ---------------- */
bloc('4. Sans réseau');
mode = 'ok';
await ouvrirAssistant();
await ctx.setOffline(true);
await p.fill('#msg', 'priorité à droite');
await p.press('#msg', 'Enter');
await p.waitForTimeout(400);
test('réponse immédiate depuis le cours',
  /priorit|droite/i.test(await derniere().textContent()));
test('le relais n’a pas été appelé', (await p.locator('.pense').count()) === 0);
await ctx.setOffline(false);

/* ---------------- 4 bis. adresse renseignée mais pas encore un relais ----------------
   Cas très concret : le Worker existe et répond, mais il sert encore
   autre chose que le relais. L'application ne doit pas s'en
   apercevoir autrement qu'en répondant depuis le cours. */
bloc('4 bis. Adresse qui répond, mais pas un relais');
pannePrevue = true;
await ouvrirAssistant();
await p.evaluate(() => { window.IA_URL = location.origin + '/index.html'; });
await p.fill('#msg', 'distance de sécurité');
await p.press('#msg', 'Enter');
await p.waitForTimeout(900);
const pasUnRelais = await derniere().textContent();
test('réponse du cours servie quand même', /seconde|distance/i.test(pasUnRelais),
  pasUnRelais.slice(0, 60));
test('rien qui ressemble à une panne', !/erreur|undefined|\[object/i.test(pasUnRelais));
test('plus de bulle d’attente', (await p.locator('.pense').count()) === 0);

/* ---------------- 5. rien à reformuler ---------------- */
pannePrevue = false;
bloc('5. Quand la recherche ne trouve rien');
recu = null;
await ouvrirAssistant();
await p.fill('#msg', 'zzzz qwerty azerty');
await p.press('#msg', 'Enter');
await p.waitForTimeout(500);
test('l’assistant le dit', /je ne trouve rien/i.test(await derniere().textContent()));
test('le modèle n’est pas appelé sans extrait', recu === null,
  recu ? 'appelé avec ' + recu.extraits.slice(0, 40) : '');

await b.close();
relais.close();

console.log(`\n${ok} contrôle(s) réussi(s), ${ko} échec(s).`);
if (erreurs.length) {
  console.log('\nErreurs relevées :');
  [...new Set(erreurs)].slice(0, 8).forEach((e) => console.log('  ' + e));
}
process.exit(ko || erreurs.length ? 1 : 0);
