/* ============================================================
   Entrée - un tout petit geste avant d'entrer dans l'appli, qui la
   fait sentir comme une session qu'on ouvre plutôt qu'une simple
   page qui s'affiche déjà. Une seule fois par ouverture réelle de
   l'appli (sessionStorage : effacé à la fermeture de l'onglet, pas
   à chaque retour à l'accueil).
   ============================================================ */
window.Entree = (function () {

  /* suite() est appelée une fois l'animation de sortie terminée :
     c'est elle qui fait réellement entrer dans l'appli (go('home') ou
     la route demandée). Sans prénom renseigné, rien à taper : on
     entre directement, il n'y a personne à saluer par son nom. */
  function view(suite) {
    var nom = Store.s.profile.name;
    if (!nom) { suite(); return; }

    document.getElementById('tabbar').hidden = true;
    document.body.classList.add('no-tabbar');

    UI.mount(
      '<div class="entree">' +
        '<div class="brand-mark lg">' + UI.logo() + '</div>' +
        '<div class="stack g4 center">' +
          '<div class="entree-salut rise">Bienvenue</div>' +
          '<h1 class="rise" style="animation-delay:60ms">Choisis ta session</h1>' +
        '</div>' +
        '<button class="entree-nom rise" style="animation-delay:140ms" data-entrer>' +
          '<span class="entree-avatar">' + UI.esc(nom.charAt(0).toUpperCase()) + '</span>' +
          '<span>' + UI.esc(nom) + '</span>' +
        '</button>' +
      '</div>'
    );

    UI.on('[data-entrer]', 'click', function () {
      UI.buzz(10);
      /* Le feu passe au vert au moment précis où on entre : la marque
         envoie son signal pendant que l'écran s'efface, comme si le
         geste de taper son prénom déclenchait littéralement le feu. */
      var marque = document.querySelector('.logo-fv');
      if (marque) marque.classList.add('logo-fv-declenche');
      document.querySelector('.entree').classList.add('entree-sortie');
      setTimeout(suite, 420);
    });
  }

  return { view: view };
})();
