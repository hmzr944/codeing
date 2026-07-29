/* ============================================================
   App - routeur, thème, rappel local
   ============================================================ */
window.App = (function () {

  var current = 'home';

  var ROUTES = {
    home:     function () { Home.view(); },
    train:    function () { Train.view(); },
    exam:     function () { Exam.view(); },
    lessons:  function () { Cours.view(); },
    stats:    function () { Stats.view(); },
    settings: function () { Settings.view(); }
  };

  var TABS = ['home', 'train', 'exam', 'lessons', 'stats'];

  function go(route) {
    if (!ROUTES[route]) route = 'home';
    current = route;
    document.body.classList.remove('no-tabbar');
    var bar = document.getElementById('tabbar');
    bar.hidden = false;
    ROUTES[route]();
    paintTabs();
    bindBack();
    try { history.replaceState({ r: route }, '', '#' + route); } catch (e) {}
  }

  function paintTabs() {
    var t = document.querySelectorAll('.tab');
    for (var i = 0; i < t.length; i++) {
      t[i].classList.toggle('on', t[i].getAttribute('data-go') === current);
    }
  }

  /* Le bouton retour des sous-vues ramène toujours à l'accueil */
  function bindBack() {
    UI.on('[data-back]', 'click', function () { go('home'); });
  }

  /* ---------------- thème ---------------- */

  function applyTheme() {
    var pref = Store.s.profile.theme || 'auto';
    var dark = pref === 'nuit' ||
      (pref === 'auto' && !window.matchMedia('(prefers-color-scheme: light)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'nuit' : 'jour');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0e1116' : '#f4f5f8');
  }

  /* ---------------- rappel local ---------------- */

  /* Une page web fermée ne peut rien envoyer : ce rappel ne se
     déclenche donc que si l'app est ouverte au bon moment. Le
     rappel fiable est celui du calendrier (voir Réglages). */
  function watchReminder() {
    setInterval(function () {
      var P = Store.s.profile;
      if (!P.reminder || !('Notification' in window) || Notification.permission !== 'granted') return;
      var now = new Date();
      var hhmm = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
      if (hhmm !== P.reminder) return;
      if (sessionStorage.getItem('fv-notified') === SRS.today()) return;
      if (Store.goalReached(SRS.today())) return;
      sessionStorage.setItem('fv-notified', SRS.today());
      try {
        new Notification('Défi du jour', {
          body: 'Dix minutes suffisent pour garder la série.',
          icon: 'assets/icon.svg'
        });
      } catch (e) {}
    }, 30000);
  }

  /* ---------------- démarrage ---------------- */

  function boot() {
    applyTheme();
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
      if ((Store.s.profile.theme || 'auto') === 'auto') applyTheme();
    });

    document.querySelectorAll('.tab').forEach(function (b) {
      b.addEventListener('click', function () { go(b.getAttribute('data-go')); });
    });

    if (!Store.s.flags.onboarded) {
      Onboarding.view();
    } else {
      var h = (location.hash || '').replace('#', '');
      go(TABS.indexOf(h) >= 0 || h === 'settings' ? h : 'home');
    }

    watchReminder();

    /* Sans stockage local, la progression ne survit pas au
       rafraîchissement : autant le dire tout de suite. */
    if (!Store.persistant) {
      setTimeout(function () {
        UI.toast('Ce navigateur bloque la sauvegarde : la progression ne sera pas conservée.', 'alerte');
      }, 1200);
    }

    /* Rappel de série : si elle est sur le point de tomber, on le dit
       une seule fois, sans culpabiliser. */
    var s = Store.liveStreak();
    if (s >= 3 && !Store.goalReached(SRS.today())) {
      setTimeout(function () {
        UI.toast('Série de ' + s + ' jours en cours', 'serie');
      }, 900);
    }

    if ('serviceWorker' in navigator && location.protocol !== 'file:' && !window.__SINGLE_FILE__) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  return { go: go, applyTheme: applyTheme, boot: boot };
})();

document.addEventListener('DOMContentLoaded', function () { App.boot(); });
