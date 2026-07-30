/* ============================================================
   Génère css/font.css : la police intégrée en base64.

   Lexend est dessinée par Google avec une recherche en lisibilité
   (Thomas Jockin / BDS) : proportions ouvertes, espacement généreux,
   pensée pour réduire la fatigue de lecture. C'est précisément ce
   qu'il faut pour un examen révisé sur mobile, souvent en écran de
   nuit ou en trajet.

   Elle est intégrée au CSS plutôt que chargée depuis un CDN, pour
   deux raisons : l'application doit fonctionner hors ligne, et une
   police distante qui n'arrive pas fait basculer toute la mise en
   page sur une police de repli.

     npm install --no-save @fontsource-variable/lexend
     node tools/build-font.mjs
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dossier = path.join(root, 'node_modules/@fontsource-variable/lexend/files');
const fichier = path.join(dossier, 'lexend-latin-wght-normal.woff2');

if (!fs.existsSync(fichier)) {
  console.error('Police introuvable. Lancer d’abord :\n  npm install --no-save @fontsource-variable/lexend');
  process.exit(1);
}

const b64 = fs.readFileSync(fichier).toString('base64');

const css = `/* ============================================================
   Police - Lexend Variable (SIL Open Font License 1.1)
   Générée par tools/build-font.mjs. NE PAS MODIFIER À LA MAIN.

   Intégrée en base64 : aucune requête réseau, donc pas de bascule
   sur une police de repli si la connexion manque.
   ============================================================ */
@font-face{
  font-family:'Lexend';
  font-style:normal;
  font-weight:100 900;
  font-display:swap;
  src:url(data:font/woff2;base64,${b64}) format('woff2-variations');
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,
    U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
`;

fs.writeFileSync(path.join(root, 'css/font.css'), css);
console.log(`css/font.css  ${(Buffer.byteLength(css) / 1024).toFixed(0)} Ko  (woff2 de ${(b64.length * 0.75 / 1024).toFixed(0)} Ko)`);
