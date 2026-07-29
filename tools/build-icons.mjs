/* ============================================================
   Génère js/icons.js à partir de la bibliothèque Phosphor.

   Les icônes ne sont pas dessinées à la main : elles sont extraites
   de @phosphor-icons/core, puis intégrées au fichier pour que
   l'application reste utilisable hors ligne et sans requête réseau.

   Installation puis génération :
     npm install --no-save @phosphor-icons/core
     node tools/build-icons.mjs
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'node_modules/@phosphor-icons/core/assets');

/* nom local -> [nom Phosphor, graisse]
   « light » partout pour un trait fin et régulier ; « fill » réservé
   aux éléments qui doivent se lire d'un coup d'œil à petite taille. */
const ICONES = {
  /* thèmes */
  signalisation: ['traffic-sign', 'light'],
  priorites:     ['arrows-split', 'light'],
  vitesse:       ['speedometer', 'light'],
  manoeuvres:    ['arrows-left-right', 'light'],
  autoroute:     ['road-horizon', 'light'],
  stationnement: ['car-profile', 'light'],
  conducteur:    ['brain', 'light'],
  usagers:       ['person-simple-walk', 'light'],
  vehicule:      ['wrench', 'light'],
  technologie:   ['robot', 'light'],
  conditions:    ['cloud-rain', 'light'],
  secours:       ['first-aid-kit', 'light'],
  environnement: ['leaf', 'light'],
  admin:         ['identification-card', 'light'],
  sanctions:     ['scales', 'light'],
  trajet:        ['compass', 'light'],

  /* fiches particulières */
  chiffres:      ['list-numbers', 'light'],
  lexique:       ['translate', 'light'],
  nouveautes:    ['sparkle', 'light'],

  /* navigation et commandes */
  retour:        ['caret-left', 'bold'],
  suivant:       ['caret-right', 'bold'],
  reglages:      ['gear', 'light'],
  chercher:      ['magnifying-glass', 'bold'],
  effacer:       ['x', 'bold'],
  fermer:        ['x', 'light'],
  ouvrir:        ['arrow-square-out', 'light'],
  chat:          ['chat-teardrop-dots', 'light'],
  envoyer:       ['paper-plane-tilt', 'fill'],

  /* modes de révision */
  examen:        ['exam', 'light'],
  survie:        ['heart', 'fill'],
  survieContour: ['heart', 'light'],
  erreurs:       ['bandaids', 'light'],
  sprint:        ['lightning', 'light'],
  parcours:      ['path', 'light'],
  fiches:        ['book-open', 'light'],

  /* progression */
  chrono:        ['timer', 'light'],
  serie:         ['fire', 'fill'],
  coffre:        ['gift', 'light'],
  valide:        ['check', 'bold'],
  etoile:        ['star', 'fill'],
  etoileVide:    ['star', 'light'],
  defiReussi:    ['seal-check', 'fill'],
  niveau:        ['trophy', 'light'],
  cible:         ['target', 'light'],
  graphique:     ['chart-line-up', 'light'],
  calendrier:    ['calendar-dots', 'light'],
  horloge:       ['clock', 'light'],
  diplome:       ['graduation-cap', 'light'],
  alerte:        ['warning', 'light'],
  question:      ['question', 'light'],
  ampoule:       ['lightbulb', 'light'],
  livre:         ['books', 'light'],
  vue:           ['eye', 'light'],
  lune:          ['moon', 'light'],
  soleil:        ['sun', 'light'],
  telecharger:   ['download-simple', 'light'],
  poubelle:      ['trash', 'light'],
  cle:           ['key', 'light'],
  main:          ['hand-palm', 'light'],
  vitesseMax:    ['gauge', 'light'],
  couronne:      ['crown-simple', 'fill'],
  medaille:      ['medal', 'light'],
  drapeau:       ['flag-checkered', 'light'],
  lien:          ['link-simple', 'light'],
  personne:      ['user', 'light'],
  maison:        ['house', 'light'],

  /* Pictogrammes des panneaux : graisse pleine, comme les silhouettes
     noires des vrais panneaux routiers. Préfixe p_ pour les distinguer. */
  p_enfant:      ['baby', 'fill'],
  p_pieton:      ['person-simple-walk', 'fill'],
  p_velo:        ['bicycle', 'fill'],
  p_animal:      ['paw-print', 'fill'],
  p_troupeau:    ['cow', 'fill'],
  p_cheval:      ['horse', 'fill'],
  p_travaux:     ['traffic-cone', 'fill'],
  p_feux:        ['traffic-signal', 'fill'],
  p_vent:        ['wind', 'bold'],
  p_voiture:     ['car', 'fill'],
  p_train:       ['train-simple', 'fill'],
  p_camion:      ['truck', 'fill'],
  p_klaxon:      ['megaphone', 'fill'],
  p_neige:       ['snowflake', 'bold'],
  p_hopital:     ['first-aid', 'fill'],
  p_demiTour:    ['arrow-u-up-left', 'bold'],
  p_exclamation: ['exclamation-mark', 'fill'],
  p_tracteur:    ['tractor', 'fill']
};

const manquantes = [];
const sorties = {};

for (const [cle, [nom, graisse]] of Object.entries(ICONES)) {
  const suffixe = graisse === 'regular' ? '' : '-' + graisse;
  const fichier = path.join(src, graisse, `${nom}${suffixe}.svg`);
  if (!fs.existsSync(fichier)) { manquantes.push(`${cle} (${nom}/${graisse})`); continue; }

  const brut = fs.readFileSync(fichier, 'utf8');
  /* on ne garde que le contenu : le <svg> englobant est reconstruit
     à l'affichage, avec la taille et l'étiquette voulues */
  const dedans = brut
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<rect[^>]*fill="none"[^>]*\/>/g, '')   // le cadre vide de Phosphor
    .replace(/\s+/g, ' ')
    .trim();
  sorties[cle] = dedans;
}

if (manquantes.length) {
  console.error('Icônes introuvables :\n  ' + manquantes.join('\n  '));
  process.exit(1);
}

const js = `/* ============================================================
   Icônes - extraites de Phosphor Icons (MIT) par tools/build-icons.mjs.
   NE PAS MODIFIER À LA MAIN : relancer le script pour régénérer.

   Les tracés utilisent currentColor : une icône prend donc la
   couleur du texte qui l'entoure, sans réglage supplémentaire.
   ============================================================ */
window.Icons = (function () {

  var P = ${JSON.stringify(sorties, null, 0)};

  /* Rend une icône. Décorative par défaut (invisible aux lecteurs
     d'écran) ; passer un libellé la rend annonçable. */
  function svg(nom, taille, libelle) {
    var d = P[nom];
    if (!d) return '';
    var t = taille || 20;
    return '<svg class="ico" viewBox="0 0 256 256" width="' + t + '" height="' + t + '" ' +
      'fill="currentColor" ' +
      (libelle ? 'role="img" aria-label="' + String(libelle).replace(/"/g, '&quot;') + '"'
               : 'aria-hidden="true" focusable="false"') +
      '>' + d + '</svg>';
  }

  /* Tracé brut, sans balise <svg> : utilisé par les panneaux, qui
     insèrent le pictogramme dans leur propre dessin. Phosphor est en
     repère 256x256, d'où la mise à l'échelle. */
  function raw(nom, taille, cx, cy) {
    var d = P[nom];
    if (!d) return '';
    var e = (taille || 32) / 256;
    return '<g transform="translate(' + ((cx || 50) - (taille || 32) / 2) + ',' +
      ((cy || 50) - (taille || 32) / 2) + ') scale(' + e.toFixed(5) + ')">' + d + '</g>';
  }

  function has(nom) { return !!P[nom]; }
  function list() { return Object.keys(P); }

  return { svg: svg, raw: raw, has: has, list: list };
})();
`;

fs.writeFileSync(path.join(root, 'js/icons.js'), js);
const ko = (Buffer.byteLength(js) / 1024).toFixed(1);
console.log(`js/icons.js  ${Object.keys(sorties).length} icônes  ${ko} Ko`);
