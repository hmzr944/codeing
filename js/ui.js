/* ============================================================
   UI - petites briques partagées (rendu, toasts, retours tactiles)
   ============================================================ */
window.UI = (function () {

  var app = null, toaster = null;

  function root() { return app || (app = document.getElementById('app')); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Remplace le contenu de la vue et remonte en haut */
  function mount(html) {
    var r = root();
    r.innerHTML = html;
    r.classList.remove('enter');
    void r.offsetWidth;                 // force le redémarrage de l'animation
    r.classList.add('enter');
    window.scrollTo(0, 0);
    return r;
  }

  /* Délégation : on branche les gestionnaires après chaque rendu */
  function on(sel, ev, fn, ctx) {
    var nodes = (ctx || root()).querySelectorAll(sel);
    for (var i = 0; i < nodes.length; i++) nodes[i].addEventListener(ev, fn);
    return nodes;
  }

  function topbar(title, sub, onBack) {
    return '<header class="topbar">' +
      (onBack !== false ? '<button class="back" data-back aria-label="Retour">' +
        Icons.svg('retour', 18) + '</button>' : '') +
      '<div class="grow"><div class="ttl">' + esc(title) + '</div>' +
      (sub ? '<div class="sub">' + esc(sub) + '</div>' : '') + '</div></header>';
  }

  /* ---------- toasts ---------- */
  function toast(msg, icone, win) {
    toaster = toaster || document.getElementById('toaster');
    var n = document.createElement('div');
    n.className = 'toast' + (win ? ' win' : '');
    n.innerHTML = (icone ? '<span class="e">' + Icons.svg(icone, 19) + '</span>' : '') +
      '<span>' + esc(msg) + '</span>';
    toaster.appendChild(n);
    setTimeout(function () {
      n.style.transition = 'opacity .3s var(--ease), transform .3s var(--ease)';
      n.style.opacity = '0'; n.style.transform = 'translateY(-10px)';
      setTimeout(function () { n.remove(); }, 320);
    }, 2600);
  }

  /* Les succès s'annoncent un par un, sans confettis : ceux-ci sont
     réservés à une vraie réussite, sinon ils ne veulent plus rien dire. */
  function celebrate(badges) {
    if (!badges || !badges.length) return;
    badges.forEach(function (b, i) {
      setTimeout(function () { toast('Succès débloqué : ' + b.n, b.i, true); }, i * 900);
    });
  }

  /* ---------- confettis (uniquement sur une vraie réussite) ---------- */
  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var wrap = document.createElement('div');
    wrap.className = 'confetti';
    var colors = ['#f5c400', '#3ad57f', '#ffffff', '#ff6076'];
    for (var i = 0; i < 42; i++) {
      var p = document.createElement('i');
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (1.5 + Math.random() * 1.4) + 's';
      p.style.animationDelay = (Math.random() * 0.4) + 's';
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 3600);
  }

  /* ---------- retour tactile discret ---------- */
  function buzz(ms) {
    if (navigator.vibrate) { try { navigator.vibrate(ms || 12); } catch (e) {} }
  }

  /* ---------- états vides ---------- */
  function empty(icone, title, text) {
    return '<div class="empty"><span class="e">' + Icons.svg(icone, 30) + '</span>' +
      '<div class="t">' + esc(title) + '</div>' + esc(text) + '</div>';
  }

  /* ---------- formatage ---------- */
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

  function plural(n, one, many) { return n + ' ' + (n > 1 ? (many || one + 's') : one); }

  function dateFR(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    var m = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    return (+p[2]) + ' ' + m[+p[1] - 1];
  }

  return {
    root: root, esc: esc, mount: mount, on: on, topbar: topbar,
    toast: toast, celebrate: celebrate, confetti: confetti, buzz: buzz,
    empty: empty, pct: pct, plural: plural, dateFR: dateFR
  };
})();
