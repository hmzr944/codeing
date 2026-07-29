/* ============================================================
   Parcours - les thèmes vus comme une collection à compléter.
   Chaque thème donne une médaille selon les questions réellement
   ancrées, et une étoile si son défi est remporté. C'est ce qui
   pousse à couvrir TOUS les thèmes plutôt que ses préférés.
   ============================================================ */
window.Train = (function () {

  var length = 15;
  var MEDALS = ['', '🥉', '🥈', '🥇'];
  var MEDAL_NAMES = ['', 'Bronze', 'Argent', 'Or'];

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
          '<span class="theme-ico" aria-hidden="true">' + t.e + '</span>' +
          '<div class="grow stack g6">' +
            '<div class="row between g8">' +
              '<span class="theme-n">' + UI.esc(t.n) + '</span>' +
              '<span class="theme-medal">' +
                (s.boss ? '<span class="star" title="Défi remporté">★</span>' : '') +
                (s.medal ? '<span title="Médaille ' + MEDAL_NAMES[s.medal] + '">' + MEDALS[s.medal] + '</span>' : '') +
              '</span>' +
            '</div>' +
            '<div class="gauge thin' + (s.medal === 3 ? ' ok' : '') + '"><i style="width:' + pct + '%"></i></div>' +
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
    if (done === 0)          nextGoal = 'Première étape : ancrer 40 % d’un thème pour décrocher le bronze.';
    else if (m.or === total) nextGoal = 'Tous les thèmes en or. Il ne reste plus qu’à passer l’examen.';
    else if (done < total)   nextGoal = 'Encore ' + (total - done) + ' thème' + (total - done > 1 ? 's' : '') + ' sans médaille.';
    else                     nextGoal = 'Tous les thèmes médaillés. Vise l’or sur les ' + (total - m.or) + ' derniers.';

    var html =
      UI.topbar('Parcours', 'Une médaille par thème, seize à collectionner', false) +
      '<div class="stack g16">' +

        '<section class="card stack g12">' +
          '<div class="row between">' +
            '<div class="sec-t">Collection</div>' +
            '<div class="tiny dim num">' + done + ' / ' + total + '</div>' +
          '</div>' +
          '<div class="medal-row">' +
            medalBox('🥉', m.bronze, 'Bronze', '40 % ancrées') +
            medalBox('🥈', m.argent, 'Argent', '70 % ancrées') +
            medalBox('🥇', m.or, 'Or', '90 % ancrées') +
            medalBox('★', m.boss, 'Défis', '9 sur 10') +
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

  function medalBox(sym, n, name, rule) {
    return '<div class="medal-box' + (n ? ' on' : '') + '">' +
      '<div class="s" aria-hidden="true">' + sym + '</div>' +
      '<div class="n num">' + n + '</div>' +
      '<div class="l">' + name + '</div>' +
      '<div class="r">' + rule + '</div></div>';
  }

  return { view: view };
})();
