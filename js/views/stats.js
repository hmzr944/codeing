/* ============================================================
   Progrès - où j'en suis vraiment
   ============================================================ */
window.Stats = (function () {

  function view() {
    var S = Store.s, s = Store.snapshot(), lvl = Store.level();
    var acc = s.answered ? Math.round((s.correct / s.answered) * 100) : 0;

    /* --- activité des 14 derniers jours --- */
    var days = [], maxD = 1;
    for (var i = 13; i >= 0; i--) {
      var iso = SRS.addDays(SRS.today(), -i);
      var n = S.days[iso] || 0;
      if (n > maxD) maxD = n;
      days.push({ iso: iso, n: n });
    }
    var spark = days.map(function (d) {
      var h = d.n ? Math.max(8, Math.round((d.n / maxD) * 100)) : 0;
      return '<i class="' + (d.n ? '' : 'none') + '" style="height:' + (d.n ? h : 4) + '%"' +
        ' title="' + UI.dateFR(d.iso) + ' : ' + d.n + '"></i>';
    }).join('');

    /* --- mémoire : répartition dans les boîtes de révision --- */
    var boxes = [0, 0, 0, 0, 0, 0];
    for (var id in S.cards) boxes[S.cards[id].b - 1]++;
    var totalCards = Store.all.length;
    var neverSeen = totalCards - Object.keys(S.cards).length;

    /* --- maîtrise par thème --- */
    var themeRows = window.THEMES.map(function (t) {
      var st = S.themes[t.k];
      if (!st || !st.seen) return null;
      var p = Math.round((st.ok / st.seen) * 100);
      return { k: t.k, n: t.n, p: p, seen: st.seen };
    }).filter(Boolean).sort(function (a, b) { return b.p - a.p; });

    var themeBlock = themeRows.length
      ? themeRows.map(function (r) {
          return '<div class="bar">' +
            '<div class="l">' + UI.esc(r.n) + '</div>' +
            '<div class="grow"><div class="gauge thin ' + (r.p >= 80 ? 'ok' : r.p < 50 ? 'ko' : '') + '">' +
            '<i style="--pct:' + (r.p / 100) + '"></i></div></div>' +
            '<div class="v num">' + r.p + ' %</div></div>';
        }).join('')
      : UI.empty('graphique', 'Pas encore de données', 'Fais une première série pour voir tes points forts apparaître.');

    /* --- succès --- */
    var badges = window.BADGES.map(function (b) {
      var on = !!S.badges[b.k];
      return '<div class="bdg' + (on ? ' on' : '') + '">' +
        '<div class="e">' + Icons.svg(b.i, 22) + '</div>' +
        '<div class="n">' + UI.esc(b.n) + '</div>' +
        '<div class="d">' + UI.esc(b.d) + '</div></div>';
    }).join('');
    var nBadges = Object.keys(S.badges).length;

    var html =
      UI.topbar('Progrès', 'Tout est calculé sur ce téléphone', false) +
      '<div class="stack g20">' +

        '<section class="card level">' +
          '<div class="lv num">' + lvl.n + '</div>' +
          '<div class="grow stack g8">' +
            '<div class="row between">' +
              '<div style="font-weight:500;font-size:15px;letter-spacing:-.02em">' + UI.esc(lvl.name) + '</div>' +
              '<div class="tiny dim num">' + S.xp + ' XP</div></div>' +
            '<div class="gauge thin"><i style="--pct:' + (lvl.pct / 100) + '"></i></div>' +
            '<div class="tiny dim">' + (lvl.max ? 'Niveau maximum atteint'
              : 'Encore ' + (lvl.to - S.xp) + ' XP avant le niveau ' + (lvl.n + 1)) + '</div>' +
          '</div>' +
        '</section>' +

        '<div class="kpi">' +
          '<div><div class="n num">' + s.answered + '</div><div class="l">Réponses</div></div>' +
          '<div><div class="n num">' + acc + ' %</div><div class="l">Réussite</div></div>' +
          '<div><div class="n num">' + s.streak + '</div><div class="l">Série</div></div>' +
        '</div>' +

        '<section class="card stack g12">' +
          '<div class="row between"><div class="sec-t">14 derniers jours</div>' +
          '<div class="tiny dim">Meilleure série : <b class="num">' + s.bestStreak + '</b></div></div>' +
          '<div class="spark">' + spark + '</div>' +
        '</section>' +

        '<section class="card stack g12">' +
          '<div class="sec-t">Mémoire à long terme</div>' +
          '<div class="small muted">Chaque bonne réponse fait monter une question d’un cran. ' +
          'Plus elle est haute, plus l’intervalle avant sa réapparition est long.</div>' +
          memoryBars(boxes, neverSeen, totalCards) +
        '</section>' +

        '<section class="card stack g12">' +
          '<div class="sec-t">Réussite par thème</div>' + themeBlock +
        '</section>' +

        '<section class="stack g12">' +
          '<div class="row between"><div class="sec-t">Succès</div>' +
          '<div class="tiny dim num">' + nBadges + ' / ' + window.BADGES.length + '</div></div>' +
          '<div class="badges">' + badges + '</div>' +
        '</section>' +

        '<div style="height:8px"></div>' +
      '</div>';

    UI.mount(html);
  }

  function memoryBars(boxes, neverSeen, total) {
    var labels = ['À découvrir', 'Fragile', 'En cours', 'Solide', 'Bien ancré', 'Acquis', 'Automatique'];
    var vals = [neverSeen].concat(boxes);
    return vals.map(function (v, i) {
      var p = total ? Math.round((v / total) * 100) : 0;
      return '<div class="bar">' +
        '<div class="l">' + labels[i] + '</div>' +
        '<div class="grow"><div class="gauge thin' + (i >= 5 ? ' ok' : '') + '">' +
        '<i style="--pct:' + (p / 100) + '"></i></div></div>' +
        '<div class="v num">' + v + '</div></div>';
    }).join('');
  }

  return { view: view };
})();
