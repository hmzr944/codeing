/* ============================================================
   Motion - transitions de page en rideau coloré, portées par GSAP.

   Le rideau est un calque SIBLING de #app (posé sur <body>, jamais
   un ancêtre) : il peut donc s'animer en transform sans jamais
   toucher au conteneur de vue ni casser le position:sticky des
   en-têtes (.topbar, .quiz-top) qui vivent, eux, à l'intérieur de
   #app. Voir le commentaire au-dessus de .enter dans style.css.
   ============================================================ */
window.Motion = (function () {

  var veil = null;

  function reduit() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getVeil() {
    if (veil) return veil;
    veil = document.createElement('div');
    veil.className = 'motion-veil';
    veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);
    return veil;
  }

  /* Change d'écran derrière un rideau qui balaie l'écran de gauche à
     droite avec les deux couleurs de la marque (l'accent et l'ambre
     du signal), puis repart dans le même sens pour révéler la
     nouvelle vue déjà posée dessous. rendre() fait le changement de
     DOM pendant que le rideau couvre tout : rien ne « saute » à
     l'œil.
     La révélation reste courte à dessein : les entrées propres à
     chaque vue (.enter, .rise, animation-delay en cascade sur
     l'accueil) démarrent dès que rendre() les pose dans le DOM, donc
     dès le pic de couverture — un rideau qui met du temps à se
     retirer les joue en grande partie derrière lui, invisibles. Plus
     la révélation est brève, plus ce qu'elles ont à montrer le reste
     vraiment. */
  function transition(rendre) {
    if (!window.gsap || reduit()) { rendre(); return; }
    var v = getVeil();
    gsap.killTweensOf(v);
    gsap.set(v, { display: 'block', scaleX: 0, transformOrigin: 'left center', backgroundPosition: '0% 50%' });

    var tl = gsap.timeline();
    tl.to(v, { scaleX: 1, backgroundPosition: '100% 50%', duration: .14, ease: 'power2.in' })
      .call(rendre)
      .set(v, { transformOrigin: 'right center' })
      .to(v, { scaleX: 0, duration: .12, ease: 'power2.out' })
      .set(v, { display: 'none' });
  }

  /* Entrée en cascade d'une liste d'éléments (déjà dans le DOM,
     rendus par la vue) : utilisé pour les moments qu'on veut vraiment
     faire vivre sans toucher au conteneur qui les porte. */
  function cascade(els, depuis) {
    if (!window.gsap || reduit() || !els || !els.length) return;
    gsap.from(els, {
      opacity: 0, y: 14, duration: .42, ease: 'back.out(1.6)',
      stagger: .06, delay: depuis || 0
    });
  }

  return { transition: transition, cascade: cascade };
})();
