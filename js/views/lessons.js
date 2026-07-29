/* ============================================================
   Fiches - l'essentiel à relire avant de dormir
   ============================================================ */
window.Fiches = (function () {

  function view() {
    var read = Store.s.lessons;

    var items = window.LESSONS.map(function (l) {
      var isRead = !!read[l.k];
      return '<details class="fiche' + (isRead ? ' read' : '') + '" data-k="' + l.k + '"' +
        (l.star ? ' open' : '') + '>' +
        '<summary><span class="ico" aria-hidden="true">' + l.e + '</span>' +
        '<span class="grow">' + UI.esc(l.n) + '</span>' +
        (isRead ? '<span class="tiny dim" style="margin-right:6px">lue</span>' : '') +
        '<span class="arw" aria-hidden="true">›</span></summary>' +
        '<div class="body">' + l.html + '</div></details>';
    }).join('');

    var nRead = Object.keys(read).filter(function (k) { return read[k]; }).length;

    var html =
      UI.topbar('Fiches', 'Le cours en version courte', false) +
      '<div class="stack g16">' +

        '<div class="card quiet stack g8">' +
          '<div class="row between"><div class="sec-t">Progression de lecture</div>' +
          '<div class="tiny dim num">' + nRead + ' / ' + window.LESSONS.length + '</div></div>' +
          '<div class="gauge thin"><i style="width:' +
            Math.round((nRead / window.LESSONS.length) * 100) + '%"></i></div>' +
          '<div class="tiny dim">Relire une fiche juste avant de dormir améliore nettement la mémorisation.</div>' +
        '</div>' +

        '<div class="stack g10">' + items + '</div>' +

        '<div style="height:8px"></div>' +
      '</div>';

    UI.mount(html);

    /* Une fiche est comptée comme lue dès qu'elle est ouverte.
       L'événement "toggle" ne se déclenche pas pour celles déjà
       ouvertes au rendu : on les marque donc à la main. */
    function markRead(k) {
      if (!k || Store.s.lessons[k]) return;
      Store.s.lessons[k] = Date.now();
      Store.s.xp += 15;
      Store.save();
      UI.celebrate(Store.checkBadges());
    }

    UI.on('.fiche', 'toggle', function () {
      if (this.open) markRead(this.getAttribute('data-k'));
    });
    var opened = document.querySelectorAll('.fiche[open]');
    for (var i = 0; i < opened.length; i++) markRead(opened[i].getAttribute('data-k'));
  }

  return { view: view };
})();
