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

  /* Une icône par onglet, en plus du libellé : cinq mots courts
     suffisaient à l'œil qui les relit chaque jour, mais pas au
     premier passage, où l'icône est ce qui accroche le regard. */
  var ICONE_ONGLET = { home: 'maison', train: 'parcours', exam: 'examen', lessons: 'livre', stats: 'graphique' };

  function boot() {
    applyTheme();
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
      if ((Store.s.profile.theme || 'auto') === 'auto') applyTheme();
    });

    /* iOS n'autorise l'audio qu'après un vrai geste : ce tout premier
       appui, où qu'il ait lieu, suffit à garder le son prêt pour plus
       tard, y compris depuis un écran de résultat affiché après coup. */
    document.addEventListener('pointerdown', function armerSon() {
      document.removeEventListener('pointerdown', armerSon);
      if (window.Son) Son.armer();
    }, { once: true });

    document.querySelectorAll('.tab').forEach(function (b) {
      var go1 = b.getAttribute('data-go');
      b.insertAdjacentHTML('afterbegin', Icons.svg(ICONE_ONGLET[go1], 21));
      b.addEventListener('click', function () { go(go1); });
    });

    /* La bulle de l'assistant : posée une fois pour toutes, elle suit
       Mina quel que soit l'écran, en dehors des moments où l'assistant
       est déjà atteignable autrement (lecture d'une leçon, épreuve
       chronométrée) — voir la règle CSS qui la masque avec la barre
       d'onglets. */
    var bulle = document.getElementById('chat-fab');
    bulle.innerHTML = Icons.svg('chat', 22);
    bulle.addEventListener('click', function () { Chat.ouvrir(); });

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

    /* Le mot d'accueil d'une session : une seule fois par ouverture
       de l'appli, jamais au premier lancement (l'onboarding vient
       déjà de saluer), et jamais en revenant simplement à l'accueil
       depuis un autre onglet. */
    if (Store.s.flags.onboarded) {
      setTimeout(function () {
        UI.toast(window.MOTIVATION.arrivee(Store.s.profile.name), 'couronne');
      }, 500);
    }

    if ('serviceWorker' in navigator && location.protocol !== 'file:' && !window.__SINGLE_FILE__) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  return { go: go, applyTheme: applyTheme, boot: boot };
})();

document.addEventListener('DOMContentLoaded', function () { App.boot(); });
