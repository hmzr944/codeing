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
    /* Changer d'écran est le moment calme par excellence : si une
       nouvelle version attendait la fin d'une série, elle s'applique
       ici. */
    appliquerMaj();
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
    if (meta) meta.setAttribute('content', dark ? '#1a201e' : '#e9ece8');
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
      var route = TABS.indexOf(h) >= 0 || h === 'settings' ? h : 'home';

      /* La porte d'entrée (taper son prénom) ne s'affiche qu'une
         fois par vraie ouverture de l'appli : sessionStorage s'efface
         à la fermeture de l'onglet, jamais à un simple retour à
         l'accueil depuis un autre onglet pendant la même session. */
      var CLE_SESSION = 'feuvert-session-ouverte';
      var dejaOuverte = false;
      try { dejaOuverte = sessionStorage.getItem(CLE_SESSION) === '1'; } catch (e) {}
      /* Après « quitter la session », plus personne n'est entré : on
         redemande, même au sein du même onglet. Sans cela, quitter
         n'aurait aucun effet visible. */
      if (window.Sessions && Sessions.aucuneOuverte()) dejaOuverte = false;
      if (dejaOuverte) {
        go(route);
        apresEntree();
      } else {
        try { sessionStorage.setItem(CLE_SESSION, '1'); } catch (e) {}
        Entree.view(function () { go(route); apresEntree(); });
      }
    }

    watchReminder();

    /* Si l'écriture échoue (quota plein, stockage restreint en cours de
       session), un seul avertissement suffit : mieux vaut le dire une
       fois que laisser croire, séance après séance, que tout est bien
       enregistré. */
    setInterval(function () {
      if (Store.ecritureAEchoue()) {
        UI.toast('La sauvegarde a échoué : la progression de cette séance risque de ne pas tenir.', 'alerte');
      }
    }, 4000);

    /* Tout ce qui doit attendre que Mina soit vraiment entrée : ni
       pendant l'écran « prête ? », ni avant qu'elle ait tapé son
       prénom. */
    function apresEntree() {
      /* Sans stockage local, la progression ne survit pas au
         rafraîchissement : autant le dire tout de suite. */
      if (!Store.persistant) {
        setTimeout(function () {
          UI.toast('Ce navigateur bloque la sauvegarde : la progression ne sera pas conservée.', 'alerte');
        }, 1200);
      }

      /* Une sauvegarde illisible a été remplacée par la copie de secours,
         ou à défaut par une progression neuve : Mina doit le savoir
         plutôt que de découvrir en silence que sa série a disparu. */
      var etat = Store.etatChargement();
      if (etat === 'secours') {
        setTimeout(function () {
          UI.toast('Petit souci de sauvegarde : ta progression de la veille a été récupérée.', 'alerte');
        }, 700);
      } else if (etat === 'reinitialise') {
        setTimeout(function () {
          UI.toast('Ta sauvegarde était illisible et a dû être réinitialisée.', 'alerte');
        }, 700);
      }

      /* Rappel de série : si elle est sur le point de tomber, on le dit
         une seule fois, sans culpabiliser. */
      var s = Store.liveStreak();
      if (s >= 3 && !Store.goalReached(SRS.today())) {
        setTimeout(function () {
          UI.toast('Série de ' + s + ' jours en cours', 'serie');
        }, 900);
      }

      /* Le mot de motivation d'une session, une fois entrée. */
      setTimeout(function () {
        UI.toast(window.MOTIVATION.arrivee(Store.s.profile.name), 'couronne');
      }, 500);
    }

    if ('serviceWorker' in navigator && location.protocol !== 'file:' && !window.__SINGLE_FILE__) {
      navigator.serviceWorker.register('sw.js')
        .then(function (reg) {
          veillerMaj(reg);
          verifierVersionReelle();
        })
        .catch(function () {});
    }
  }

  /* ---------------- mises à jour de l'application ----------------
     Le service worker sert la coquille depuis le cache : c'est ce qui
     fait marcher l'app dans le métro, mais sans le guet ci-dessous une
     version fraîchement publiée n'apparaît qu'au lancement SUIVANT.
     Installée sur l'écran d'accueil, l'app est mise en veille plutôt
     que fermée : ce « lancement suivant » peut ne jamais venir, et on
     croit alors que rien n'a changé. */

  var majPrete = false;

  /* Le mécanisme natif du navigateur (registration.update(), et sa
     propre vérification périodique) respecte le Cache-Control posé
     par GitHub Pages sur sw.js (10 minutes) : tant que ce délai n'est
     pas écoulé, une vraie nouvelle version peut passer inaperçue,
     même après plusieurs relances de l'appli à froid — c'était la
     cause exacte de « je ne vois jamais mes changements ». On vérifie
     donc nous-mêmes le contenu réel de sw.js, avec un fetch qui
     ignore ce cache, plutôt que d'attendre le minutage du navigateur. */
  function verifierVersionReelle() {
    if (!('caches' in window)) return;
    Promise.all([
      fetch('sw.js', { cache: 'no-store' }).then(function (r) { return r.text(); }),
      caches.keys()
    ]).then(function (res) {
      var texte = res[0], cles = res[1];
      var m = texte.match(/CACHE = '([^']+)'/);
      if (!m || !cles.length) return;          // rien à comparer
      if (cles.indexOf(m[1]) !== -1) return;    // déjà à jour
      /* Recharger effacerait une série en cours, qui ne vit qu'en
         mémoire : on attend le prochain moment calme plutôt que de
         lui faire perdre ses réponses (même logique qu'appliquerMaj). */
      if (window.Quiz && Quiz.enCours && Quiz.enCours()) return;
      /* Une version différente existe vraiment sur le serveur, mais
         le navigateur ne la verra pas de lui-même avant un moment :
         on force la main plutôt que d'attendre. */
      Promise.all(cles.map(function (k) { return caches.delete(k); }))
        .then(function () { return navigator.serviceWorker.getRegistrations(); })
        .then(function (regs) { return Promise.all(regs.map(function (r) { return r.unregister(); })); })
        .then(function () { location.reload(); });
    }).catch(function () {});
  }

  function veillerMaj(reg) {
    if (!reg) return;

    /* On attend le changement de pilote plutôt que la fin de
       l'installation : entre les deux, c'est encore l'ancien service
       worker qui répond, et recharger là ramènerait très exactement la
       version qu'on cherche à remplacer.
       La toute première prise de contrôle ne compte pas : cette
       page-là a déjà été servie par le réseau, elle est à jour, et la
       recharger couperait l'onboarding en deux. */
    var pilotee = !!navigator.serviceWorker.controller;

    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!pilotee) { pilotee = true; return; }
      majPrete = true;
      appliquerMaj();
    });

    /* Le retour au premier plan est le vrai moment où il faut aller
       voir s'il y a du neuf : c'est là qu'on rouvre l'app. */
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      if (majPrete) appliquerMaj();
      else { reg.update().catch(function () {}); verifierVersionReelle(); }
    });
  }

  /* Recharger efface la série en cours, qui ne vit qu'en mémoire :
     on attend le prochain écran calme plutôt que de lui faire perdre
     ses réponses. */
  function appliquerMaj() {
    if (!majPrete) return;
    if (window.Quiz && Quiz.enCours && Quiz.enCours()) return;
    majPrete = false;
    location.reload();
  }

  return { go: go, applyTheme: applyTheme, boot: boot };
})();

document.addEventListener('DOMContentLoaded', function () { App.boot(); });
