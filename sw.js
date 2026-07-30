/* ============================================================
   Service worker - l'app doit fonctionner dans le métro
   Stratégie : cache d'abord pour la coquille, réseau ensuite
   pour se mettre à jour en arrière-plan.
   ============================================================ */
/* Le nom change à chaque modification de la liste ci-dessous : sans
   cela, un ancien cache resservirait une coquille à laquelle il
   manque les nouveaux fichiers. */
var CACHE = 'feuvert-v12';

var SHELL = [
  './', './index.html', './manifest.webmanifest',
  './css/font.css', './css/style.css', './assets/icon.svg',
  './js/config.js',
  './js/icons.js',
  './js/data/themes.js',
  './js/data/questions-signalisation.js',
  './js/data/questions-circulation.js',
  './js/data/questions-conducteur.js',
  './js/data/questions-vehicule.js',
  './js/data/questions-usagers.js',
  './js/data/questions-secours.js',
  './js/data/questions-technologie.js',
  './js/data/questions-sanctions.js',
  './js/data/questions-trajet.js',
  './js/data/questions-plus-route.js',
  './js/data/questions-plus-pratique.js',
  './js/data/lessons.js',
  './js/data/badges.js',
  './js/data/memes.js',
  './js/data/motivation.js',
  './js/signs.js', './js/diagrams.js', './js/search.js', './js/ia.js', './js/store.js', './js/sound.js', './js/srs.js', './js/ui.js',
  './js/views/home.js', './js/views/train.js', './js/views/quiz.js',
  './js/views/exam.js', './js/views/lessons.js', './js/views/chat.js', './js/views/stats.js',
  './js/views/settings.js', './js/views/onboarding.js',
  './js/app.js',
  './assets/memes/deadass.jpg', './assets/memes/look-at-this.jpg',
  './assets/memes/spongebob-smug.jpg', './assets/memes/thumbs-up.jpg',
  './assets/memes/phone-confused.jpg', './assets/memes/robot-poker-face.jpg',
  './assets/memes/pixar-choc.jpg', './assets/memes/portrait-dramatique.jpg',
  './assets/memes/chien-durag.jpg', './assets/memes/chien-blase.jpg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      var live = fetch(e.request).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || live;
    })
  );
});
