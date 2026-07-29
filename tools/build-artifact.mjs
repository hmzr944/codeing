/* Génère dist/artifact.html : la même application, mais au format
   attendu par une page publiée (le titre, le style, le balisage et
   le script, sans <html>, <head> ni <body> qui sont ajoutés autour).

   Lancer : node tools/build-artifact.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

const html = read('index.html');
const css = read('css/font.css') + '\n' + read('css/style.css');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

/* Balisage : le contenu de <body>, débarrassé des balises <script> */
const corps = html
  .slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))
  .replace(/<script src="[^"]+"><\/script>\s*/g, '')
  .trim();

/* Le code, concaténé dans l'ordre de chargement. La séquence
   </script> est neutralisée au cas où elle apparaîtrait dans une
   chaîne : elle fermerait le bloc en plein milieu. */
const js = scripts
  .map((f) => `/* ===== ${f} ===== */\n${read(f)}`)
  .join('\n')
  .replace(/<\/script/gi, '<\\/script');

const out = [
  '<title>Feu Vert · Code de la route 2026</title>',
  `<style>\n${css}\n</style>`,
  corps,
  `<script>\nwindow.__SINGLE_FILE__ = true;\n${js}\n</script>`
].join('\n\n');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const dest = path.join(root, 'dist/artifact.html');
fs.writeFileSync(dest, out);

const ko = (Buffer.byteLength(out) / 1024).toFixed(0);
console.log(`dist/artifact.html  ${ko} Ko`);
console.log(`${scripts.length} scripts intégrés, aucune ressource externe.`);
if (/<(!doctype|html|head|body)\b/i.test(out)) {
  console.error('ERREUR : le fichier contient une balise de document.');
  process.exit(1);
}
