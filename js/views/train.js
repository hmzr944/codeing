/* ============================================================
   Parcours - les thèmes vus comme une collection à compléter.
   Chaque thème rapporte jusqu'à trois étoiles selon les questions
   réellement ancrées, plus un sceau si son défi est remporté. C'est
   ce qui pousse à couvrir TOUS les thèmes plutôt que ses préférés.
   ============================================================ */
window.Train = (function () {

  var length = 15;
  /* Trois paliers, montrés par des étoiles plutôt que par des
     médailles de couleur : une seule couleur d'accent dans toute
     l'application, et un niveau lisible d'un coup d'œil. */
  /* Un seul vocabulaire pour les paliers : ces mots servent aussi de
     libellés dans la rangée de médailles, et deux jeux de termes pour
     la même chose se contredisent à l'écran. */
  var PALIERS = ['', 'Débuté', 'Solide', 'Acquis'];

  function etoiles(n, taille) {
    var s = '';
    for (var i = 1; i <= 3; i++) {
      s += '<span class="et' + (i <= n ? '' : ' vide') + '">' +
        Icons.svg(i <= n ? 'etoile' : 'etoileVide', taille || 13) + '</span>';
    }
    return '<span class="etoiles">' + s + '</span>';
  }

  function view() {
    var stats = Store.allThemeStats();
    var m = Store.medalCount();
    var total = window.THEMES.length;
    var done = m.bronze + m.argent + m.or;

    var rows = stats.map(function (s) {
      var t = window.themeByKey(s.k);
      var pct = Math.round(s.mast * 100);
      var covPct = Math.round(s.cov * 100);

      /* Le défi se débloque dès qu'on a vu au moins autant de questions
         qu'il en contient : une seule série suffit. Le verrouiller plus
         longtemps priverait du premier moment de jeu. */
      var canBoss = s.seen >= 10;

      return '<article class="theme' + (s.boss ? ' cleared' : '') + '">' +
        '<div class="row top g12">' +
          '<span class="theme-ico">' + Icons.svg(t.i, 22) + '</span>' +
          '<div class="grow stack g6">' +
            '<div class="row between g8">' +
              '<span class="theme-n">' + UI.esc(t.n) + '</span>' +
              '<span class="theme-medal" title="' +
                (s.medal ? PALIERS[s.medal] : 'Pas encore commencé') +
                (s.boss ? ' · défi remporté' : '') + '">' +
                etoiles(s.medal) +
                (s.boss ? '<span class="sceau">' + Icons.svg('defiReussi', 15) + '</span>' : '') +
              '</span>' +
            '</div>' +
            '<div class="gauge thin' + (s.medal === 3 ? ' ok' : '') + '"><i data-anime="--pct" style="--pct:' + (pct / 100) + '"></i></div>' +
            '<div class="tiny dim num">' + s.mastered + ' / ' + s.total + ' ancrées' +
              (covPct ? ' · ' + covPct + ' % découvert' : '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="row g8" style="margin-top:12px">' +
          '<button class="btn sm grow" data-t="' + s.k + '">Réviser</button>' +
          (canBoss
            ? '<button class="btn sm ' + (s.boss ? 'ghost' : 'primary') + '" data-boss="' + s.k + '">' +
              (s.boss ? 'Refaire le défi' : 'Défi') + '</button>'
            : '<span class="btn sm ghost locked" aria-disabled="true" ' +
              'title="Encore ' + (10 - s.seen) + ' question' + (10 - s.seen > 1 ? 's' : '') +
              ' à découvrir">Défi · ' + s.seen + '/10</span>') +
        '</div>' +
      '</article>';
    }).join('');

    /* Le message d'objectif suit la progression : annoncer d'emblée
       « l'or sur 16 thèmes » à quelqu'un qui débute est décourageant. */
    var nextGoal;
    if (done === 0)          nextGoal = 'Première étape : ancrer 40 % d’un thème pour gagner une étoile.';
    else if (m.or === total) nextGoal = 'Les seize thèmes sont maîtrisés. Il ne reste plus qu’à passer l’examen.';
    else if (done < total)   nextGoal = 'Encore ' + (total - done) + ' thème' + (total - done > 1 ? 's' : '') + ' sans étoile.';
    else                     nextGoal = 'Tous les thèmes étoilés. Vise les trois étoiles sur les ' + (total - m.or) + ' derniers.';

    var html =
      UI.topbar('Parcours', 'Jusqu’à trois étoiles par thème, seize à décrocher', false) +
      '<div class="stack g20">' +

        '<section class="card stack g12">' +
          '<div class="row between">' +
            '<div class="sec-t">Collection</div>' +
            '<div class="tiny dim num">' + done + ' / ' + total + '</div>' +
          '</div>' +
          '<div class="medal-row">' +
            palier(1, m.bronze, PALIERS[1], '40 % ancrées') +
            palier(2, m.argent, PALIERS[2], '70 % ancrées') +
            palier(3, m.or, PALIERS[3], '90 % ancrées') +
            palier(0, m.boss, 'Défis', '9 sur 10') +
          '</div>' +
          '<div class="tiny dim">' + UI.esc(nextGoal) + '</div>' +
        '</section>' +

        '<section class="card quiet stack g10">' +
          '<div class="sec-t">Longueur des séries</div>' +
          '<div class="seg" id="len">' +
            [10, 15, 20, 30].map(function (n) {
              return '<button data-len="' + n + '" class="' + (n === length ? 'on' : '') + '">' + n + '</button>';
            }).join('') +
          '</div>' +
        '</section>' +

        '<button class="btn primary block" data-all>Mélange de tous les thèmes</button>' +

        '<div class="stack g10">' + rows + '</div>' +

        '<div style="height:8px"></div>' +
      '</div>';

    UI.mount(html);
    UI.animateGauges();

    UI.on('[data-len]', 'click', function () {
      length = +this.getAttribute('data-len');
      var b = document.querySelectorAll('#len button');
      for (var i = 0; i < b.length; i++) b[i].classList.toggle('on', b[i] === this);
    });
    UI.on('[data-all]', 'click', function () {
      Quiz.start({ mode: 'train', theme: 'all', questions: Store.trainSet('all', length) });
    });
    UI.on('[data-t]', 'click', function () {
      var k = this.getAttribute('data-t');
      Quiz.start({ mode: 'train', theme: k, questions: Store.trainSet(k, length) });
    });
    UI.on('[data-boss]', 'click', function () {
      var k = this.getAttribute('data-boss');
      Quiz.start({ mode: 'boss', theme: k, questions: Store.bossSet(k) });
    });
  }

  function palier(niveau, n, nom, regle) {
    return '<div class="medal-box' + (n ? ' on' : '') + '">' +
      '<div class="s">' + (niveau ? etoiles(niveau, 11) : Icons.svg('defiReussi', 17)) + '</div>' +
      '<div class="n num">' + n + '</div>' +
      '<div class="l">' + nom + '</div>' +
      '<div class="r">' + regle + '</div></div>';
  }

  return { view: view };
})();
