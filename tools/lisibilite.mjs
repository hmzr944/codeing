/* ============================================================
   Audit de lisibilité de la banque de questions.

   Objectif : une phrase doit être comprise du premier coup par
   quelqu'un qui découvre le code. On distingue deux cas :

   - JARGON INUTILE : un mot savant là où un mot courant suffit.
     À remplacer, sans exception.
   - VOCABULAIRE D'EXAMEN : un terme qui tombe réellement à l'ETG
     (PTAC, BAU, PLS...). On le garde, mais il doit être expliqué
     en clair au moins une fois dans la banque ou les fiches.

   Lancer : node tools/lisibilite.mjs
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);

const noop = () => {};
const sandbox = { console, window: {}, document: { addEventListener: noop }, navigator: {},
  localStorage: { getItem: () => null, setItem: noop }, setTimeout, setInterval,
  matchMedia: () => ({ matches: false, addEventListener: noop }) };
sandbox.window = sandbox; vm.createContext(sandbox);
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f }); }
  catch { /* les vues ont besoin d'un vrai DOM, sans importance ici */ }
}
const W = sandbox.window;

/* --- mots savants à bannir : un équivalent courant existe --- */
const JARGON = {
  'post-prandial': 'après le repas',
  'hypovigilance': 'baisse de vigilance',
  'directivité': 'possibilité de diriger',
  'accidentogène': 'cause beaucoup d’accidents',
  'surreprésenté': 'beaucoup plus souvent concerné',
  'physiologique': 'naturel',
  'ressuer': 'devenir gras et glissant',
  'attroupement': 'rassemblement',
  'ayants droit': 'personnes autorisées',
  'mesure conservatoire': 'mesure provisoire',
  'emballement thermique': 'surchauffe qui s’emballe',
  'délégation de conduite': 'conduite déléguée à la voiture',
  'prime sur': 'l’emporte sur',
  'primer sur': 'l’emporter sur',
  'proscrit': 'interdit',
  'induit': 'entraîne',
  'consécutivement': 'à la suite',
  'nonobstant': 'malgré',
  'susceptible de': 'qui peut',
  'à l’instar de': 'comme',
  'en sus': 'en plus',
  'idoine': 'adapté',
  'occulter': 'masquer',
  'obtempérer': 'obéir',
  'impérativement': 'obligatoirement',
  'a fortiori': 'encore plus',
  'de facto': 'en pratique',
  'sus-mentionné': 'cité plus haut'
};

/* --- vocabulaire d'examen : à garder, mais à expliquer une fois --- */
const A_EXPLIQUER = {
  'PTAC': /poids total autorisé/i,
  'PTRA': /poids total roulant/i,
  'BAU': /bande d’arrêt d’urgence/i,
  'PLS': /position latérale de sécurité/i,
  'DAE': /défibrillateur/i,
  'ZFE': /zone[s]? à faibles émissions/i,
  'EDPM': /engin[s]? de déplacement personnel/i,
  'AAC': /conduite accompagnée/i,
  'ISA': /adaptation intelligente de la vitesse/i,
  'AEB': /freinage d’urgence automatique/i,
  'AVAS': /son artificiel|système sonore/i,
  'eCall': /appelle automatiquement les secours/i,
  'ADAS': /aides? à la conduite/i,
  'ABS': /blocage des roues/i,
  'ESP': /trajectoire/i,
  'porte-à-faux': /élargir|déborde/i,
  'louvoiement': /balance|oscill/i,
  'sous-virage': /l’avant (glisse|part)/i,
  'entrecroisement': /les flux se croisent|se croisent/i
};

const MAX_MOTS_PHRASE = 26;   // au-delà, la phrase se relit deux fois

/* --- collecte de tout le texte visible --- */
const banks = ['Q_SIGNALISATION','Q_CIRCULATION','Q_CONDUCTEUR','Q_VEHICULE','Q_USAGERS',
  'Q_SECOURS','Q_TECHNOLOGIE','Q_SANCTIONS','Q_TRAJET','Q_PLUS_ROUTE','Q_PLUS_PRATIQUE'];
const all = banks.flatMap(b => W[b] || []);

const morceaux = [];
for (const q of all) {
  if (q.ctx) morceaux.push({ id: q.id, champ: 'situation', txt: q.ctx });
  morceaux.push({ id: q.id, champ: 'question', txt: q.q });
  q.o.forEach((o, i) => morceaux.push({ id: q.id, champ: 'réponse ' + 'ABCD'[i], txt: o }));
  morceaux.push({ id: q.id, champ: 'explication', txt: q.e });
  if (q.tip) morceaux.push({ id: q.id, champ: 'astuce', txt: q.tip });
}
for (const l of W.LESSONS || []) {
  morceaux.push({ id: 'fiche:' + l.k, champ: 'fiche', txt: l.html.replace(/<[^>]+>/g, ' ') });
}

const texteGlobal = morceaux.map(m => m.txt).join(' ');

/* --- 1. jargon inutile --- */
const jargonTrouve = [];
for (const [mot, remplacement] of Object.entries(JARGON)) {
  const re = new RegExp(mot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  for (const m of morceaux) {
    if (re.test(m.txt)) jargonTrouve.push({ ...m, mot, remplacement });
  }
}

/* --- 2. sigles jamais expliqués --- */
const jamaisExplique = [];
for (const [sigle, attendu] of Object.entries(A_EXPLIQUER)) {
  const utilise = new RegExp('\\b' + sigle.replace('-', '\\-') + '\\b').test(texteGlobal);
  if (utilise && !attendu.test(texteGlobal)) jamaisExplique.push(sigle);
}

/* --- 3. phrases trop longues --- */
const tropLongues = [];
for (const m of morceaux) {
  if (m.champ === 'fiche') continue;                  // les fiches sont du cours, pas du quiz
  for (const phrase of m.txt.split(/(?<=[.!?:])\s+/)) {
    const mots = phrase.trim().split(/\s+/).filter(Boolean).length;
    if (mots > MAX_MOTS_PHRASE) tropLongues.push({ ...m, mots, phrase: phrase.trim() });
  }
}

/* --- 4. mots longs et rares : filet pour ce que la liste ci-dessus
       n'aurait pas prévu. Le vocabulaire courant du code est
       explicitement toléré. --- */
const TOLERE = new Set([
  'agglomération','agglomérations','signalisation','stationnement','stationner','stationné','stationnée',
  'immatriculation','contravention','contraventions','circulation','circulaire','intersection','intersections',
  'réglementation','réglementaire','réglementé','réglementée','dépassement','dépassements','ralentissement',
  'ralentissements','rétroviseur','rétroviseurs','automatiquement','automatique','automatisé','automatisée',
  'obligatoire','obligatoirement','obligation','obligations','responsabilité','responsable','probatoire',
  'accompagnée','accompagné','clignotant','clignotants','conducteur','conducteurs','conductrice',
  'immobilisation','immobilisé','immobiliser','immobile','identification','considérablement','particulièrement',
  'systématiquement','systématique','effectivement','définitivement','généralement','notamment','uniquement',
  'principalement','progressivement','immédiatement','normalement','naturellement','correctement','totalement',
  'entièrement','exclusivement','fréquemment','nettement','directement','indirectement','environnement',
  'fonctionnement','fonctionne','fonctionnent','déclenchement','déclenche','avertisseur','présignalisation',
  'refroidissement','fonctionnalité','emplacement','emplacements','équipements','équipement','établissement',
  'aménagement','aménagements','déplacement','déplacements','comportement','comportements','département',
  'départements','renseigner','remplacement','remplacer','électronique','électroniques','électrique',
  'électriques','hydraulique','pneumatique','kilométrique','kilomètre','kilomètres','pourcentage',
  'suffisamment','conséquence','conséquences','circonstances','caractéristiques','catégorie','catégories',
  'homologué','homologuée','homologation','réfléchissant','réfléchissante','perpendiculairement','vulnérable',
  'vulnérables','vulnérabilité','giratoire','giratoires','carrefour','carrefours','accotement','accotements',
  'chaussée','chaussées','marquage','panonceau','panonceaux','prescription','prescriptions','franchissement',
  'franchissable','discontinue','discontinues','continue','continues','tricolores','tricolore','probatoires',
  'sensibilisation','récupération','invalidation','annulation','suspension','confiscation','fourrière',
  'assurance','assureur','certificat','attestation','déclaration','vérification','vérifications','entretien',
  'consommation','carburant','pollution','polluant','polluants','émissions','particules','recharge',
  'régénératif','autonomie','batterie','batteries','accélération','accélérateur','décélération','freinage',
  'amortisseur','amortisseurs','plaquettes','sculptures','gonflage','pression','adhérence','aquaplaning',
  'éblouissement','éblouissant','éblouissants','visibilité','luminosité','brouillard','intempéries',
  'somnolence','vigilance','distraction','alcoolémie','stupéfiants','médicaments','éthylotest','antidémarrage',
  'défibrillateur','compression','compressions','hémorragie','inconsciente','inconscient','réanimation',
  'traumatisme','secouriste','intervention','interventions','ambulance','gendarmerie','préfecture',
  'préfectoral','municipal','municipale','communale','nationale','européenne','européen','international',
  'covoiturage','trottinette','trottinettes','cyclomoteur','cyclomoteurs','motocyclette','remorque',
  'caravane','chargement','arrimage','arrimé','dispositif','dispositifs','signalement','avertissement',
  'ceinture','ceintures','airbag','appuie-tête','habitacle','carrosserie','pare-brise','essuie-glaces',
  'essuie-glace','manoeuvre','manœuvre','manœuvres','manoeuvres','insertion','rabattement','entrecroisement',
  'contournement','déviation','déviations','itinéraire','itinéraires','destination','kilométrage'
]);
const motsLongs = new Map();
for (const m of morceaux) {
  for (const mot of m.txt.toLowerCase().match(/[a-zà-öø-ÿ'’-]{13,}/g) || []) {
    const propre = mot.replace(/^['’-]+|['’-]+$/g, '');
    if (TOLERE.has(propre) || propre.length < 13) continue;
    if (!motsLongs.has(propre)) motsLongs.set(propre, []);
    motsLongs.get(propre).push(m.id + ' ' + m.champ);
  }
}

/* --- rapport --- */
const court = s => s.length > 96 ? s.slice(0, 93) + '...' : s;

console.log(`Textes analysés : ${morceaux.length} (sur ${all.length} questions)\n`);

console.log(`JARGON INUTILE : ${jargonTrouve.length}`);
for (const j of jargonTrouve) {
  console.log(`  ${j.id} ${j.champ} : « ${j.mot} » -> « ${j.remplacement} »`);
  console.log(`     ${court(j.txt)}`);
}

console.log(`\nSIGLES JAMAIS EXPLIQUÉS : ${jamaisExplique.length}`);
for (const s of jamaisExplique) console.log(`  ${s}`);

console.log(`\nPHRASES DE PLUS DE ${MAX_MOTS_PHRASE} MOTS : ${tropLongues.length}`);
for (const t of tropLongues.sort((a, b) => b.mots - a.mots)) {
  console.log(`  ${t.id} ${t.champ} (${t.mots} mots)`);
  console.log(`     ${court(t.phrase)}`);
}

console.log(`\nMOTS LONGS À VÉRIFIER : ${motsLongs.size}`);
for (const [mot, ou] of [...motsLongs].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${mot} (${ou.length}) : ${ou.slice(0, 3).join(', ')}`);
}

const total = jargonTrouve.length + jamaisExplique.length + tropLongues.length;
console.log(`\nÀ corriger : ${total}   (mots longs : ${motsLongs.size}, à juger au cas par cas)`);
process.exit(total ? 1 : 0);
