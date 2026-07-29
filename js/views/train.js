/* ============================================================
   Réviser - choix du thème et de la longueur de série
   ============================================================ */
window.Train = (function () {

  var length = 15;

  function view() {
    var S = Store.s;

    var rows = window.THEMES.map(function (t) {
      var st = S.themes[t.k] || { seen: 0, ok: 0 };
      var total = Store.byTheme(t.k).length;
      var acc = st.seen ? Math.round((st.ok / st.seen) * 100) : null;

      /* couverture : combien de questions du thème ont déjà été vues */
      var seenIds = 0;
      Store.byTheme(t.k).forEach(function (q) { if (S.cards[q.id]) seenIds++; });
      var cov = total ? Math.round((seenIds / total) * 100) : 0;

      return '<button class="card row between" data-t="' + t.k + '" style="width:100%;text-align:left;gap:13px">' +
        '<span style="font-size:20px" aria-hidden="true">' + t.e + '</span>' +
        '<span class="grow stack g8">' +
          '<span class="stack g4">' +
            '<span style="font-weight:750;font-size:14.5px;letter-spacing:-.015em">' + UI.esc(t.n) + '</span>' +
            '<span class="tiny dim">' + UI.esc(t.d) + '</span>' +
          '</span>' +
          '<span class="gauge thin"><i style="width:' + cov + '%"></i></span>' +
          '<span class="tiny dim num">' + seenIds + ' / ' + total + ' questions vues' +
            (acc !== null ? ' · ' + acc + ' % de réussite' : '') + '</span>' +
        '</span>' +
        '<span class="dim" aria-hidden="true">›</span>' +
      '</button>';
    }).join('');

    var html =
      UI.topbar('Réviser', 'Choisis un thème, la série s’adapte à ton niveau', false) +
      '<div class="stack g16">' +

        '<div class="card quiet stack g10">' +
          '<div class="sec-t">Longueur de la série</div>' +
          '<div class="seg" id="len">' +
            [10, 15, 20, 30].map(function (n) {
              return '<button data-len="' + n + '" class="' + (n === length ? 'on' : '') + '">' + n + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<button class="btn primary block" data-all>Mélange de tous les thèmes</button>' +

        '<div class="stack g10">' +
          '<div class="sec-t">Par thème</div>' + rows +
        '</div>' +

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
  }

  return { view: view };
})();
