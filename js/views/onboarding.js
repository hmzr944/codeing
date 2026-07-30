/* ============================================================
   Premier lancement - trois écrans, puis on entre dans le vif
   ============================================================ */
window.Onboarding = (function () {

  /* Prénom pré-rempli : cette version est préparée pour Mina.
     Le champ reste modifiable si quelqu'un d'autre l'utilise. */
  var step = 0, draft = { name: 'Mina', examDate: '', goal: 20 };

  function view() { step = 0; render(); }

  function render() {
    document.getElementById('tabbar').hidden = true;
    document.body.classList.add('no-tabbar');
    [intro, profile, rhythm][step]();
  }

  function shell(inner) {
    return '<div class="stack g20" style="padding-top:calc(28px + env(safe-area-inset-top));min-height:100dvh">' +
      inner + '</div>';
  }

  function dots() {
    var o = '';
    for (var i = 0; i < 3; i++) {
      o += '<i style="width:' + (i === step ? '20px' : '6px') + ';height:6px;border-radius:3px;background:' +
        (i === step ? 'var(--accent)' : 'var(--surface-3)') + ';transition:width .25s var(--ease)"></i>';
    }
    return '<div class="row g8" style="justify-content:center">' + o + '</div>';
  }

  function intro() {
    UI.mount(shell(
      '<div class="stack g20" style="flex:1">' +
        '<div class="brand"><div class="brand-mark" aria-hidden="true">FV</div>' +
        '<div><div class="brand-name">Feu Vert</div>' +
        '<div class="brand-sub">Code de la route 2026</div></div></div>' +

        '<h1>Le code, dix minutes par jour.</h1>' +
        '<p class="muted" style="font-size:15px;line-height:1.6">' +
          'Chaque question ratée revient d’elle-même, de plus en plus espacée jusqu’à ce ' +
          'qu’elle soit acquise. Chaque bonne réponse est expliquée. ' +
          'Et quand tu te sens prête, l’examen blanc reproduit les conditions du jour J.' +
        '</p>' +

        '<div class="card quiet stack g12">' +
          point('parcours', 'Répétition espacée', 'Ce que tu rates revient vite, ce que tu maîtrises s’espace.') +
          point('examen', 'Conditions réelles', '40 questions, 20 secondes chacune, seuil à 35 sur 40.') +
          point('serie', 'Une série à tenir', 'Un objectif par jour, et un joker quand la vie s’en mêle.') +
        '</div>' +
      '</div>' +
      '<div class="stack g12" style="padding-bottom:calc(20px + env(safe-area-inset-bottom))">' +
        dots() +
        '<button class="btn primary block" data-next>Commencer</button>' +
      '</div>'
    ));
    UI.on('[data-next]', 'click', function () { step = 1; render(); });
  }

  function point(ico, t, s) {
    return '<div class="row top g12"><span class="pt-ico">' + Icons.svg(ico, 19) + '</span>' +
      '<div class="grow"><div style="font-weight:700;font-size:14px">' + t + '</div>' +
      '<div class="tiny dim" style="margin-top:2px">' + s + '</div></div></div>';
  }

  function profile() {
    UI.mount(shell(
      '<div class="stack g20" style="flex:1">' +
        '<div class="stack g8">' +
          '<h1>On fait connaissance ?</h1>' +
          '<p class="muted small">Les deux champs sont facultatifs. Rien ne quitte ton téléphone.</p>' +
        '</div>' +
        '<div class="stack g16">' +
          '<div class="field"><label for="o-name">Ton prénom</label>' +
          '<input id="o-name" type="text" maxlength="20" placeholder="Ton prénom" value="' + UI.esc(draft.name) + '"></div>' +
          '<div class="field"><label for="o-date">Date de l’examen, si elle est connue</label>' +
          '<input id="o-date" type="date" value="' + UI.esc(draft.examDate) + '">' +
          '<div class="help">Un compte à rebours apparaîtra sur l’accueil.</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="stack g12" style="padding-bottom:calc(20px + env(safe-area-inset-bottom))">' +
        dots() +
        '<button class="btn primary block" data-next>Continuer</button>' +
        '<button class="btn ghost block" data-skip>Passer</button>' +
      '</div>'
    ));
    UI.on('[data-next]', 'click', function () {
      draft.name = document.getElementById('o-name').value.trim();
      draft.examDate = document.getElementById('o-date').value;
      step = 2; render();
    });
    UI.on('[data-skip]', 'click', function () { step = 2; render(); });
  }

  function rhythm() {
    UI.mount(shell(
      '<div class="stack g20" style="flex:1">' +
        '<div class="stack g8">' +
          '<h1>Quel rythme te ressemble ?</h1>' +
          '<p class="muted small">Ce nombre valide ta journée. Il se change à tout moment dans les réglages.</p>' +
        '</div>' +
        '<div class="stack g10">' +
          choice(10, 'Tranquille', '10 questions, environ 3 minutes') +
          choice(20, 'Régulier', '20 questions, environ 6 minutes') +
          choice(30, 'Intensif', '30 questions, environ 10 minutes') +
          choice(40, 'Avant-examen', '40 questions, la longueur d’une épreuve') +
        '</div>' +
      '</div>' +
      '<div class="stack g12" style="padding-bottom:calc(20px + env(safe-area-inset-bottom))">' +
        dots() +
        '<button class="btn primary block" data-done>C’est parti</button>' +
      '</div>'
    ));
    UI.on('[data-g]', 'click', function () {
      draft.goal = +this.getAttribute('data-g');
      var n = document.querySelectorAll('[data-g]');
      for (var i = 0; i < n.length; i++) n[i].classList.toggle('accent', n[i] === this);
    });
    UI.on('[data-done]', 'click', finish);
  }

  function choice(n, t, s) {
    return '<button class="card ' + (draft.goal === n ? 'accent' : '') + ' row between" data-g="' + n + '" ' +
      'style="width:100%;text-align:left">' +
      '<span class="stack g4"><span style="font-weight:750;font-size:15px">' + t + '</span>' +
      '<span class="tiny dim">' + s + '</span></span>' +
      '<span class="num" style="font-weight:850;font-size:19px">' + n + '</span></button>';
  }

  function finish() {
    var P = Store.s.profile;
    P.name = draft.name; P.examDate = draft.examDate; P.goal = draft.goal;
    Store.s.flags.onboarded = true;
    Store.saveNow();
    document.body.classList.remove('no-tabbar');
    document.getElementById('tabbar').hidden = false;
    App.go('home');
    UI.toast((P.name ? P.name + ', b' : 'B') + 'ienvenue. Première série quand tu veux.', 'valide');
  }

  return { view: view };
})();
