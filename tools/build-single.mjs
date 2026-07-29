/* Concatène tout dans un seul fichier HTML autonome.
   Possible uniquement parce que l'app n'utilise pas de modules ES :
   l'ordre des <script> de index.html suffit.
   Lancer : node tools/build-single.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

const html = read('index.html');
const css = read('css/style.css');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
const icon = read('assets/icon.svg');
const iconData = 'data:image/svg+xml;base64,' + Buffer.from(icon).toString('base64');

const js = scripts.map((f) => `/* ===== ${f} ===== */\n${read(f)}`).join('\n');

const out = html
  .replace(/<link rel="manifest"[^>]*>\s*/, '')
  .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="${iconData}" type="image/svg+xml">`)
  .replace(/<link rel="apple-touch-icon"[^>]*>/, `<link rel="apple-touch-icon" href="${iconData}">`)
  .replace(/<link rel="stylesheet"[^>]*>/, `<style>\n${css}\n</style>`)
  .replace(/<script src="[^"]+"><\/script>\s*/g, '')
  .replace('</body>', `<script>\n${js}\n</script>\n</body>`)
  // pas de service worker dans la version fichier unique
  .replace('</head>', '<script>window.__SINGLE_FILE__=true;</script>\n</head>');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const dest = path.join(root, 'dist/feu-vert.html');
fs.writeFileSync(dest, out);

console.log(`dist/feu-vert.html  ${(Buffer.byteLength(out) / 1024).toFixed(0)} Ko`);
console.log(`${scripts.length} scripts intégrés, aucune dépendance externe.`);
