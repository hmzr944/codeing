/* ============================================================
   Entrée - un tout petit geste avant d'entrer dans l'appli, qui la
   fait sentir comme une session qu'on ouvre plutôt qu'une simple
   page qui s'affiche déjà. Une seule fois par ouverture réelle de
   l'appli (sessionStorage : effacé à la fermeture de l'onglet, pas
   à chaque retour à l'accueil).
   ============================================================ */
window.Entree = (function () {

  function salutation() {
    var h = new Date().getHours();
    if (h < 6)  return 'Il est tard';
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

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
        '<div class="brand-mark lg" aria-hidden="true">FV</div>' +
        '<div class="stack g4 center">' +
          '<div class="entree-salut rise">' + UI.esc(salutation()) + '</div>' +
          '<h1 class="rise" style="animation-delay:60ms">Prête, ' + UI.esc(nom) + ' ?</h1>' +
        '</div>' +
        '<button class="entree-nom rise" style="animation-delay:140ms" data-entrer>' +
          '<span class="entree-avatar">' + UI.esc(nom.charAt(0).toUpperCase()) + '</span>' +
          '<span>' + UI.esc(nom) + '</span>' +
        '</button>' +
      '</div>'
    );

    UI.on('[data-entrer]', 'click', function () {
      UI.buzz(10);
      document.querySelector('.entree').classList.add('entree-sortie');
      setTimeout(suite, 420);
    });
  }

  return { view: view };
})();
