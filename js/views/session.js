/* ============================================================
   Entrée - qui ouvre l'appli ?

   Sur un appareil partagé, chaque personne a sa session : sa
   progression, ses erreurs, ses leçons lues. Rien ne passe d'une
   session à l'autre, et rien ne quitte l'appareil.

   L'écran s'affiche une fois par vraie ouverture de l'appli
   (sessionStorage : effacé à la fermeture de l'onglet, pas à chaque
   retour à l'accueil). Quand il n'y a qu'une session et qu'elle n'a
   pas de code, on entre d'un seul geste — la porte ne doit pas
   devenir une corvée quotidienne.
   ============================================================ */
window.Entree = (function () {

  var terminer = null;

  function masquerBarre() {
    document.getElementById('tabbar').hidden = true;
    document.body.classList.add('no-tabbar');
  }

  function initiale(nom) {
    return (nom || '?').trim().charAt(0).toUpperCase() || '?';
  }

  /* « aujourd'hui », « hier », sinon la date : à trois jours, savoir
     que c'était un mardi n'aide personne à reconnaître sa session. */
  function quand(ts) {
    if (!ts) return 'jamais ouverte';
    var j = Math.floor((Date.now() - ts) / 86400000);
    if (j <= 0) return 'ouverte aujourd’hui';
    if (j === 1) return 'ouverte hier';
    if (j < 30) return 'ouverte il y a ' + j + ' jours';
    return 'ouverte il y a longtemps';
  }

  function sortir() {
    var marque = document.querySelector('.logo-fv');
    if (marque) marque.classList.add('logo-fv-declenche');
    var e = document.querySelector('.entree');
    if (e) e.classList.add('entree-sortie');
    setTimeout(function () { Sessions.marquerVue(); terminer(); }, 420);
  }

  /* ---------------- écran : choisir sa session ---------------- */

  function ecranListe() {
    var liste = Sessions.liste();
    var lignes = liste.map(function (s, i) {
      return '<button class="sess-ligne rise" style="animation-delay:' + (80 + i * 45) + 'ms" ' +
          'data-sess="' + UI.esc(s.id) + '">' +
        '<span class="entree-avatar">' + UI.esc(initiale(s.nom)) + '</span>' +
        '<span class="sess-txt">' +
          '<span class="sess-nom">' + UI.esc(s.nom || 'Sans nom') + '</span>' +
          '<span class="sess-meta">' + quand(s.vu) + '</span>' +
        '</span>' +
        (s.code ? '<span class="sess-cle" aria-label="session verrouillée">' + Icons.svg('cle', 17) + '</span>' : '') +
      '</button>';
    }).join('');

    UI.mount(
      '<div class="entree">' +
        '<div class="brand-mark lg">' + UI.logo() + '</div>' +
        '<div class="stack g4 center">' +
          '<div class="entree-salut rise">Bienvenue</div>' +
          '<h1 class="rise" style="animation-delay:60ms">Qui révise ?</h1>' +
        '</div>' +
        '<div class="sess-liste">' + lignes + '</div>' +
        '<button class="sess-plus rise" style="animation-delay:' + (110 + liste.length * 45) + 'ms" data-neuve>' +
          Icons.svg('personne', 17) + 'Nouvelle session' +
        '</button>' +
        '<p class="sess-note rise" style="animation-delay:' + (160 + liste.length * 45) + 'ms">' +
          'Chaque session garde sa progression sur cet appareil. Rien n’est envoyé nulle part.' +
        '</p>' +
      '</div>'
    );

    UI.on('[data-sess]', 'click', function () {
      var id = this.getAttribute('data-sess');
      UI.buzz(10);
      if (Sessions.verrouillee(id)) { ecranCode(id); return; }
      entrerDans(id);
    });

    UI.on('[data-neuve]', 'click', function () { UI.buzz(10); ecranNouvelle(); });
  }

  /* Changer de session recharge la page : le magasin lit sa clé une
     seule fois, au chargement du script. Rester sur place afficherait
     l'accueil de la session précédente. */
  function entrerDans(id) {
    var courante = Sessions.actif();
    if (courante && courante.id === id) { Sessions.ouvrir(id); sortir(); return; }
    Sessions.basculer(id);
  }

  /* ---------------- écran : le code d'une session ---------------- */

  function ecranCode(id) {
    var s = Sessions.liste().filter(function (x) { return x.id === id; })[0];
    UI.mount(
      '<div class="entree">' +
        '<div class="brand-mark lg">' + UI.logo() + '</div>' +
        '<div class="stack g4 center">' +
          '<div class="entree-salut rise">' + UI.esc(s ? (s.nom || 'Session') : 'Session') + '</div>' +
          '<h1 class="rise" style="animation-delay:60ms">Ton code</h1>' +
        '</div>' +
        '<input class="sess-code rise" style="animation-delay:100ms" id="sess-code" ' +
          'inputmode="numeric" maxlength="4" autocomplete="off" aria-label="Code à quatre chiffres">' +
        '<p class="sess-err" id="sess-err" hidden>Ce n’est pas le bon code.</p>' +
        '<button class="lien rise" style="animation-delay:150ms" data-retour>Choisir une autre session</button>' +
      '</div>'
    );

    var champ = document.getElementById('sess-code');
    setTimeout(function () { champ.focus(); }, 260);

    champ.addEventListener('input', function () {
      champ.value = champ.value.replace(/\D/g, '').slice(0, 4);
      document.getElementById('sess-err').hidden = true;
      if (champ.value.length < 4) return;
      if (Sessions.verifierCode(id, champ.value)) { UI.buzz(10); entrerDans(id); return; }
      document.getElementById('sess-err').hidden = false;
      champ.value = '';
      champ.classList.remove('shake');
      void champ.offsetWidth;
      champ.classList.add('shake');
      UI.buzz(30);
    });

    UI.on('[data-retour]', 'click', ecranListe);
  }

  /* ---------------- écran : créer une session ---------------- */

  function ecranNouvelle() {
    UI.mount(
      '<div class="entree">' +
        '<div class="brand-mark lg">' + UI.logo() + '</div>' +
        '<div class="stack g4 center">' +
          '<div class="entree-salut rise">Nouvelle session</div>' +
          '<h1 class="rise" style="animation-delay:60ms">Ton prénom</h1>' +
        '</div>' +
        '<input class="sess-nom-champ rise" style="animation-delay:100ms" id="sess-nom" ' +
          'maxlength="18" autocomplete="off" placeholder="Mina" aria-label="Prénom">' +
        '<button class="btn primary block rise" style="animation-delay:150ms" data-creer>Commencer</button>' +
        '<button class="lien rise" style="animation-delay:190ms" data-retour>Retour</button>' +
      '</div>'
    );

    var champ = document.getElementById('sess-nom');
    setTimeout(function () { champ.focus(); }, 260);
    champ.addEventListener('keydown', function (e) { if (e.key === 'Enter') creer(); });

    function creer() {
      var nom = champ.value.trim();
      if (!nom) { champ.focus(); return; }
      UI.buzz(10);
      Sessions.creer(nom);
      /* Une session neuve n'a pas de progression : après le
         rechargement, le magasin repart d'un coffre vide et
         l'accueil des premiers pas s'affiche tout seul. */
      try { sessionStorage.setItem('feuvert-session-ouverte', '1'); } catch (e) {}
      try { sessionStorage.setItem('feuvert-prenom-neuf', nom); } catch (e) {}
      location.reload();
    }

    UI.on('[data-creer]', 'click', creer);
    UI.on('[data-retour]', 'click', ecranListe);
  }

  /* ---------------- point d'entrée ---------------- */

  function view(suite) {
    terminer = suite;
    masquerBarre();

    var liste = Sessions.liste();
    var courante = Sessions.actif();

    /* Une seule session, sans code : la porte s'ouvre d'un geste,
       comme avant. On ne fait choisir que s'il y a un choix. */
    if (liste.length === 1 && !liste[0].code) {
      var nom = liste[0].nom || Store.s.profile.name;
      if (!nom) { Sessions.marquerVue(); suite(); return; }
      UI.mount(
        '<div class="entree">' +
          '<div class="brand-mark lg">' + UI.logo() + '</div>' +
          '<div class="stack g4 center">' +
            '<div class="entree-salut rise">Bienvenue</div>' +
            '<h1 class="rise" style="animation-delay:60ms">Choisis ta session</h1>' +
          '</div>' +
          '<button class="entree-nom rise" style="animation-delay:140ms" data-entrer>' +
            '<span class="entree-avatar">' + UI.esc(initiale(nom)) + '</span>' +
            '<span>' + UI.esc(nom) + '</span>' +
          '</button>' +
          '<button class="sess-plus rise" style="animation-delay:190ms" data-neuve>' +
            Icons.svg('personne', 17) + 'Nouvelle session' +
          '</button>' +
        '</div>'
      );
      UI.on('[data-entrer]', 'click', function () { UI.buzz(10); sortir(); });
      UI.on('[data-neuve]', 'click', function () { UI.buzz(10); ecranNouvelle(); });
      return;
    }

    if (courante && Sessions.verrouillee(courante.id)) { ecranListe(); return; }
    ecranListe();
  }

  return { view: view, listeView: ecranListe };
})();
