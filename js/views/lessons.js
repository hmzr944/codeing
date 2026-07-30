/* ============================================================
   COURS - la partie « ce qu'il faut savoir ».

   Deux écrans seulement :
     la liste, où l'on choisit une leçon ;
     le lecteur, plein écran, où il n'y a plus que la leçon.

   Le lecteur ne connaît pas le contenu : il sait dessiner sept
   formes de blocs, et c'est la leçon qui dit laquelle utiliser.
   Aucune leçon ne peut donc redevenir un pavé de texte.
   ============================================================ */
window.Cours = (function () {

  /* Ouvre Claude avec le contexte déjà rédigé : c'est le seul moyen
     d'avoir une vraie IA ici, une page publiée ne pouvant pas en
     appeler une. */
  function lienClaude(texte) {
    return 'https://claude.ai/new?q=' + encodeURIComponent(texte);
  }
  window.lienClaude = lienClaude;

  window.promptCorrection = function (q) {
    return 'Je révise le code de la route en France (examen 2026). ' +
      'Je n’ai pas compris cette question.\n\n' +
      'Question : ' + q.q + '\n' +
      'Bonne réponse : ' + q.a.map(function (i) { return q.o[i]; }).join(' + ') + '\n' +
      'Explication du cours : ' + q.e + '\n\n' +
      'Peux-tu me l’expliquer autrement, avec des mots simples et un exemple de situation réelle ?';
  };

  /* ============================================================
     Blocs
     ============================================================ */

  /* Le seul endroit où une leçon devient du HTML. */
  function bloc(b) {
    switch (b.t) {

      /* la phrase à garder si on ne retient qu'une chose */
      case 'retenir':
        return '<div class="bl bl-retenir">' +
          '<span class="bl-ico">' + Icons.svg('cle', 16) + '</span>' +
          '<p>' + UI.esc(b.txt) + '</p></div>';

      /* l'erreur classique, celle qui coûte des points */
      case 'piege':
        return '<div class="bl bl-piege">' +
          '<span class="bl-ico">' + Icons.svg('alerte', 16) + '</span>' +
          '<div><div class="bl-et">Le piège</div><p>' + UI.esc(b.txt) + '</p></div></div>';

      /* les points à retenir, un par ligne */
      case 'cle':
        return '<section class="bl-sec">' +
          titreBloc(b.titre) +
          '<ul class="liste">' + b.items.map(function (i) {
            return '<li>' + gras(i) + '</li>';
          }).join('') + '</ul></section>';

      /* un tableau de valeurs, alignées pour être comparées d'un coup d'œil */
      case 'chiffres':
        return '<section class="bl-sec">' +
          titreBloc(b.titre) +
          '<div class="tbl">' + b.lignes.map(function (l) {
            return '<div class="tbl-l">' +
              '<span class="tbl-c">' + UI.esc(l[0]) + '</span>' +
              '<span class="tbl-v num">' + UI.esc(l[1]) + '</span>' +
              (l[2] ? '<span class="tbl-p">' + UI.esc(l[2]) + '</span>' : '') +
            '</div>';
          }).join('') + '</div></section>';

      /* les panneaux du thème, dessinés grandeur lisible */
      case 'panneaux':
        return '<section class="bl-sec">' +
          titreBloc(b.titre) +
          '<div class="pan-g">' + b.signes.filter(function (s) {
            return Signs.has(s[0]);
          }).map(function (s) {
            return '<figure class="pan"><div class="pan-d">' + Signs.render(s[0]) + '</div>' +
              '<figcaption>' + UI.esc(s[1]) + '</figcaption></figure>';
          }).join('') + '</div></section>';

      /* un dessin, quand la notion ne s'explique pas par des mots */
      case 'schema':
        return Diagrams.has(b.d)
          ? '<figure class="bl-schema">' + Diagrams.render(b.d) + '</figure>'
          : '';

      /* un paragraphe court, jamais plus de trois phrases */
      default:
        return '<p class="bl-txt">' + gras(b.txt) + '</p>';
    }
  }

  function titreBloc(t) {
    return t ? '<h3 class="bl-t">' + UI.esc(t) + '</h3>' : '';
  }

  /* « Chaussée : la partie où roulent les voitures. » Le terme défini
     passe en gras, pour qu'on le retrouve en balayant la page. */
  function gras(txt) {
    var e = UI.esc(txt);
    return e.replace(/^([^:.]{2,34}) : /, '<b>$1</b> : ');
  }

  /* Texte brut d'une leçon : sert à la recherche et à l'audit. */
  function texteBloc(b) {
    if (b.t === 'cle') return (b.titre || '') + '. ' + b.items.join(' ');
    if (b.t === 'chiffres') return (b.titre || '') + '. ' + b.lignes.map(function (l) {
      return l.join(' ');
    }).join('. ');
    if (b.t === 'panneaux') return (b.titre || '') + '. ' + b.signes.map(function (s) {
      return s[1];
    }).join('. ');
    if (b.t === 'schema') return '';
    return b.txt || '';
  }

  function texteDe(l) {
    return l.n + '. ' + l.resume + ' ' + l.blocs.map(texteBloc).join(' ');
  }

  /* ============================================================
     Liste
     ============================================================ */

  function view() {
    var lues = Store.s.lessons;
    var n = window.LESSONS.length;
    var nLues = window.LESSONS.filter(function (l) { return lues[l.k]; }).length;

    var essentiel = window.LESSONS.filter(function (l) { return !l.theme; });
    var parTheme = window.LESSONS.filter(function (l) { return l.theme; });

    UI.mount(
      UI.topbar('Cours', n + ' leçons, l’essentiel et rien d’autre', false) +
      '<div class="stack g20">' +

        '<section class="card quiet stack g8">' +
          '<div class="row between">' +
            '<div class="sec-t">Leçons lues</div>' +
            '<div class="tiny dim num">' + nLues + ' / ' + n + '</div>' +
          '</div>' +
          '<div class="gauge thin"><i data-anime="--pct" style="--pct:' + (Math.round(nLues / n * 100) / 100) + '"></i></div>' +
          '<div class="tiny dim">Une leçon avant de dormir, et elle tient toute la semaine.</div>' +
        '</section>' +

        '<button class="card assist row g12" data-chat>' +
          '<span class="assist-ico">' + Icons.svg('chat', 20) + '</span>' +
          '<span class="grow" style="text-align:left">' +
            '<span class="assist-t">Un mot que tu ne comprends pas ?</span>' +
            '<span class="assist-s">Demande-le à l’assistant, il répond tout de suite.</span>' +
          '</span>' +
          '<span class="dim">' + Icons.svg('suivant', 14) + '</span>' +
        '</button>' +

        section('L’essentiel', essentiel) +
        section('Les ' + parTheme.length + ' thèmes de l’examen', parTheme) +

        '<div style="height:8px"></div>' +
      '</div>'
    );

    UI.animateGauges();
    UI.on('[data-lecon]', 'click', function () { lire(this.getAttribute('data-lecon')); });
    UI.on('[data-chat]', 'click', function () { Chat.view(); });
  }

  function section(titre, liste) {
    return '<section class="stack g10">' +
      '<div class="sec-t">' + UI.esc(titre) + '</div>' +
      liste.map(carte).join('') + '</section>';
  }

  function carte(l) {
    var lue = !!Store.s.lessons[l.k];
    return '<button class="lc' + (lue ? ' lue' : '') + '" data-lecon="' + l.k + '">' +
      '<span class="lc-ico">' + Icons.svg(l.i, 19) + '</span>' +
      '<span class="lc-txt">' +
        '<span class="lc-n">' + UI.esc(l.n) + '</span>' +
        '<span class="lc-r">' + UI.esc(l.resume) + '</span>' +
      '</span>' +
      '<span class="lc-e">' + Icons.svg(lue ? 'valide' : 'suivant', 13) + '</span>' +
    '</button>';
  }

  /* ============================================================
     Lecteur
     ============================================================ */

  function lire(k) {
    var l = window.LESSONS.filter(function (x) { return x.k === k; })[0];
    if (!l) return view();

    /* Plein écran : pendant la lecture, la barre d'onglets ne fait
       que proposer de partir ailleurs. */
    document.body.classList.add('no-tabbar');
    var bar = document.getElementById('tabbar');
    if (bar) bar.hidden = true;

    var suivante = leconSuivante(l);
    var nb = l.theme ? Store.all.filter(function (q) { return q.t === l.theme; }).length : 0;

    UI.mount(
      /* Le titre de la barre reste caché tant que le grand titre est
         visible : sinon le nom de la leçon s'affiche deux fois. */
      '<header class="topbar">' +
        '<button class="back" data-retour aria-label="Retour aux cours">' +
          Icons.svg('retour', 18) + '</button>' +
        '<div class="grow"><div class="ttl fondu" id="ttl">' + UI.esc(l.n) + '</div></div>' +
      '</header>' +

      '<article class="lecon stack g24">' +
        '<div class="lecon-tete stack g10">' +
          '<span class="lecon-ico">' + Icons.svg(l.i, 24) + '</span>' +
          '<h1>' + UI.esc(l.n) + '</h1>' +
          '<p class="lecon-r">' + UI.esc(l.resume) + '</p>' +
        '</div>' +
        l.blocs.map(bloc).join('') +
      '</article>' +

      '<div class="stack g10" style="margin-top:24px">' +
        (nb ? '<button class="btn primary block" data-reviser="' + l.theme + '">' +
          'Réviser ce thème · ' + nb + ' questions</button>' : '') +
        '<button class="btn ghost block" data-resume>Me résumer cette leçon</button>' +
        '<button class="btn ghost block" data-question>Poser une question à l’assistant</button>' +
        (suivante ? '<button class="btn ghost block" data-lecon="' + suivante.k + '">' +
          'Leçon suivante · ' + UI.esc(suivante.n) + '</button>' : '') +
        '<button class="btn ghost block" data-retour>Retour aux cours</button>' +
      '</div>' +
      '<div style="height:20px"></div>'
    );

    marquerLue(l);
    suivreDefilement();

    UI.on('[data-retour]', 'click', function () { App.go('lessons'); });
    UI.on('[data-lecon]', 'click', function () { lire(this.getAttribute('data-lecon')); });
    UI.on('[data-question]', 'click', function () { Chat.view(l); });
    UI.on('[data-resume]', 'click', function () { Chat.resumer(l); });
    UI.on('[data-reviser]', 'click', function () {
      var t = this.getAttribute('data-reviser');
      Quiz.start({ mode: 'train', theme: t, questions: Store.trainSet(t, 10) });
    });
  }

  /* Un seul écouteur pour toute la durée de vie de la page : le
     lecteur est rouvert souvent, et on ne veut pas en empiler un
     par leçon lue. */
  var defilementBranche = false;
  function suivreDefilement() {
    if (defilementBranche) return;
    defilementBranche = true;
    window.addEventListener('scroll', function () {
      var t = document.getElementById('ttl');
      if (t) t.classList.toggle('fondu', window.scrollY < 76);
    }, { passive: true });
  }

  function leconSuivante(l) {
    var i = window.LESSONS.indexOf(l);
    return window.LESSONS[i + 1] || null;
  }

  /* Ouvrir une leçon la compte comme lue : on ne demande pas à
     quelqu'un de cocher une case pour prouver qu'il a lu. */
  function marquerLue(l) {
    if (Store.s.lessons[l.k]) return;
    Store.s.lessons[l.k] = Date.now();
    Store.s.xp += 15;
    Store.save();
    UI.celebrate(Store.checkBadges());
  }

  return {
    view: view, lire: lire, bloc: bloc,
    texteDe: texteDe, texteBloc: texteBloc, lienClaude: lienClaude
  };
})();
