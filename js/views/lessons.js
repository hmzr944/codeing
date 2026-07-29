/* ============================================================
   Aide - poser une question, obtenir une réponse tout de suite.

   La recherche fonctionne hors ligne sur les 459 questions et les
   16 fiches. Quand ça ne suffit pas, un bouton ouvre Claude avec
   la question déjà écrite : c'est le seul moyen d'avoir une vraie
   IA ici, une page publiée ne pouvant pas en appeler une.
   ============================================================ */
window.Fiches = (function () {

  var requete = '';

  /* Ouvre Claude avec le contexte déjà rédigé */
  function lienClaude(texte) {
    return 'https://claude.ai/new?q=' + encodeURIComponent(texte);
  }

  function promptQuestion(q) {
    return 'Je révise le code de la route en France (examen 2026). ' +
      'Explique-moi simplement, avec un exemple concret : ' + q;
  }

  window.promptCorrection = function (q) {
    return 'Je révise le code de la route en France (examen 2026). ' +
      'Je n’ai pas compris cette question.\n\n' +
      'Question : ' + q.q + '\n' +
      'Bonne réponse : ' + q.a.map(function (i) { return q.o[i]; }).join(' + ') + '\n' +
      'Explication du cours : ' + q.e + '\n\n' +
      'Peux-tu me l’expliquer autrement, avec des mots simples et un exemple de situation réelle ?';
  };
  window.lienClaude = lienClaude;

  function view() {
    var lues = Store.s.lessons;
    var nLues = Object.keys(lues).filter(function (k) { return lues[k]; }).length;

    var html =
      UI.topbar('Aide', 'Une question ? Tape-la, la réponse est ici', false) +
      '<div class="stack g16">' +

        '<section class="card stack g12">' +
          '<div class="chercher">' +
            '<span class="chercher-ico">' + Icons.svg('chercher', 17) + '</span>' +
            '<input id="q" type="search" autocomplete="off" ' +
              'placeholder="« alcool jeune permis », « distance de sécurité »…" ' +
              'value="' + UI.esc(requete) + '" aria-label="Poser une question">' +
            '<button class="chercher-x" id="vider" aria-label="Effacer"' +
              (requete ? '' : ' hidden') + '>' + Icons.svg('effacer', 13) + '</button>' +
          '</div>' +
          '<div class="row wrap g8" id="suggestions">' +
            Recherche.suggestions.slice(0, 6).map(function (s) {
              return '<button class="pill" data-sugg="' + UI.esc(s) + '">' + UI.esc(s) + '</button>';
            }).join('') +
          '</div>' +
        '</section>' +

        '<div id="resultats"></div>' +

        '<div id="cours">' + blocFiches(nLues) + '</div>' +

        '<div style="height:8px"></div>' +
      '</div>';

    UI.mount(html);
    brancher();
    if (requete) lancer(requete);
  }

  /* ---------------- résultats ---------------- */

  function lancer(txt) {
    requete = txt;
    var res = Recherche.chercher(txt);
    var cible = document.getElementById('resultats');
    var cours = document.getElementById('cours');
    if (!cible) return;

    var sugg = document.getElementById('suggestions');
    if (!txt.trim()) {
      cible.innerHTML = ''; cours.hidden = false; if (sugg) sugg.hidden = false;
      return;
    }
    // pendant une recherche, les suggestions ne font qu'occuper l'écran
    cours.hidden = true;
    if (sugg) sugg.hidden = true;

    var out = '';

    if (res.fiches.length) {
      out += '<section class="stack g10"><div class="sec-t">Dans le cours</div>' +
        res.fiches.map(function (f) {
          return '<div class="card stack g8">' +
            '<div class="row g8">' + Icons.svg(f.fiche.i, 18) +
            '<span style="font-weight:750;font-size:14px">' + UI.esc(f.titre) + '</span></div>' +
            '<div class="fiche"><div class="body" style="padding:0">' + f.html + '</div></div>' +
          '</div>';
        }).join('') + '</section>';
    }

    if (res.questions.length) {
      out += '<section class="stack g10" style="margin-top:16px">' +
        '<div class="sec-t">Questions sur ce sujet</div>' +
        res.questions.map(function (q) {
          return '<details class="fiche">' +
            '<summary>' + Icons.svg(window.themeByKey(q.t).i, 18) +
            '<span class="grow" style="font-weight:700;font-size:13.5px;line-height:1.35">' +
            UI.esc(q.q) + '</span><span class="arw">' + Icons.svg('suivant', 13) + '</span></summary>' +
            '<div class="body">' +
              '<p style="color:var(--txt)"><b>Réponse : </b>' +
              UI.esc(q.a.map(function (i) { return q.o[i]; }).join(' + ')) + '</p>' +
              '<p style="margin-top:8px">' + UI.esc(q.e) + '</p>' +
              (q.tip ? '<span class="key"><b>Astuce.</b> ' + UI.esc(q.tip) + '</span>' : '') +
            '</div></details>';
        }).join('') + '</section>';
    }

    if (!res.fiches.length && !res.questions.length) {
      out += UI.empty('question', 'Rien trouvé sur ce sujet',
        'Essaie avec d’autres mots, ou demande directement à Claude ci-dessous.');
    }

    out += '<section class="card accent stack g10" style="margin-top:16px">' +
      '<div class="stack g4">' +
        '<div style="font-weight:800;font-size:15.5px;letter-spacing:-.02em">Toujours pas clair ?</div>' +
        '<div class="tiny dim">Ouvre Claude avec ta question déjà écrite. Il faut une connexion.</div>' +
      '</div>' +
      '<a class="btn primary block" target="_blank" rel="noopener" href="' +
        UI.esc(lienClaude(promptQuestion(txt))) + '">Demander à Claude</a>' +
    '</section>';

    cible.innerHTML = out;
    cible.classList.add('rise');
  }

  /* ---------------- fiches de cours ---------------- */

  function blocFiches(nLues) {
    var items = window.LESSONS.map(function (l) {
      var lue = !!Store.s.lessons[l.k];
      return '<details class="fiche' + (lue ? ' read' : '') + '" data-k="' + l.k + '"' +
        (l.star ? ' open' : '') + '>' +
        '<summary>' + Icons.svg(l.i, 18) +
        '<span class="grow">' + UI.esc(l.n) + '</span>' +
        (lue ? '<span class="tiny dim" style="margin-right:6px">lue</span>' : '') +
        '<span class="arw">' + Icons.svg('suivant', 13) + '</span></summary>' +
        '<div class="body">' + l.html + '</div></details>';
    }).join('');

    return '<div class="stack g16">' +
      '<div class="card quiet stack g8">' +
        '<div class="row between"><div class="sec-t">Fiches lues</div>' +
        '<div class="tiny dim num">' + nLues + ' / ' + window.LESSONS.length + '</div></div>' +
        '<div class="gauge thin"><i style="width:' +
          Math.round((nLues / window.LESSONS.length) * 100) + '%"></i></div>' +
        '<div class="tiny dim">Relire une fiche juste avant de dormir aide vraiment à retenir.</div>' +
      '</div>' +
      '<div class="stack g10">' + items + '</div>' +
    '</div>';
  }

  /* ---------------- interactions ---------------- */

  function brancher() {
    var champ = document.getElementById('q');
    var croix = document.getElementById('vider');
    var minuteur = null;

    champ.addEventListener('input', function () {
      croix.hidden = !this.value;
      clearTimeout(minuteur);
      var v = this.value;
      minuteur = setTimeout(function () { lancer(v); }, 220);
    });
    champ.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { clearTimeout(minuteur); lancer(this.value); this.blur(); }
    });

    croix.addEventListener('click', function () {
      champ.value = ''; croix.hidden = true; lancer('');
      champ.focus();
    });

    UI.on('[data-sugg]', 'click', function () {
      var s = this.getAttribute('data-sugg');
      champ.value = s; croix.hidden = false; lancer(s);
    });

    marquerLues();
  }

  /* Une fiche ouverte compte comme lue */
  function marquerLues() {
    function lue(k) {
      if (!k || Store.s.lessons[k]) return;
      Store.s.lessons[k] = Date.now();
      Store.s.xp += 15;
      Store.save();
      UI.celebrate(Store.checkBadges());
    }
    UI.on('.fiche[data-k]', 'toggle', function () {
      if (this.open) lue(this.getAttribute('data-k'));
    });
    var ouvertes = document.querySelectorAll('.fiche[data-k][open]');
    for (var i = 0; i < ouvertes.length; i++) lue(ouvertes[i].getAttribute('data-k'));
  }

  return { view: view };
})();
