/* ============================================================
   Quiz - moteur unique pour tous les modes de révision
   ============================================================ */
window.Quiz = (function () {

  var Q = null;   // session en cours

  var MODES = {
    daily:  { title: 'Défi du jour',  instant: true,  perQ: 0,  total: 0,  lives: 0 },
    train:  { title: 'Entraînement',  instant: true,  perQ: 0,  total: 0,  lives: 0 },
    errors: { title: 'Mes erreurs',   instant: true,  perQ: 0,  total: 0,  lives: 0 },
    exam:   { title: 'Examen blanc',  instant: false, perQ: 20, total: 0,  lives: 0 },
    sprint: { title: 'Sprint 60 s',   instant: true,  perQ: 0,  total: 60, lives: 0 },
    /* Survie : le chrono par question et les trois vies créent la
       tension. C'est le mode qu'on relance « juste une dernière fois ». */
    survie: { title: 'Survie',        instant: true,  perQ: 15, total: 0,  lives: 3 },
    /* Défi du thème : un mini-examen, sans correction pendant
       l'épreuve, qu'il faut passer à 9 sur 10. */
    boss:   { title: 'Défi du thème', instant: false, perQ: 20, total: 0,  lives: 0 }
  };

  /* Le combo récompense la régularité, pas la chance : il faut
     enchaîner sans erreur pour multiplier les points. */
  function comboMult(c) { return c >= 6 ? 3 : c >= 3 ? 2 : 1; }

  function start(cfg) {
    var m = MODES[cfg.mode];
    Q = {
      mode: cfg.mode, conf: m, theme: cfg.theme || '',
      list: cfg.questions, i: 0,
      sel: [], locked: false,
      results: [],                       // {q, correct, chosen}
      combo: 0, bestCombo: 0,
      lives: m.lives,
      tPerQ: m.perQ, tLeft: m.perQ,
      tTotal: m.total, tTotalLeft: m.total,
      tick: null, startedAt: Date.now()
    };
    document.body.classList.add('no-tabbar');
    document.getElementById('tabbar').hidden = true;
    render();
    if (m.perQ || m.total) startClock();
  }

  function stop() {
    if (Q && Q.tick) { clearInterval(Q.tick); Q.tick = null; }
  }

  function quit() {
    stop(); Q = null;
    document.body.classList.remove('no-tabbar');
    document.getElementById('tabbar').hidden = false;
    App.go('home');
  }

  /* ---------------- horloge ---------------- */

  function startClock() {
    stop();
    Q.tick = setInterval(function () {
      if (!Q) return;
      if (Q.tTotal) {
        Q.tTotalLeft--;
        paintTimer();
        if (Q.tTotalLeft <= 0) { stop(); finish(); }
      } else {
        if (Q.locked) return;            // le chrono ne tourne pas pendant la correction
        Q.tLeft--;
        paintTimer();
        if (Q.tLeft <= 0) validate(true);
      }
    }, 1000);
  }

  function paintTimer() {
    var el = document.getElementById('timer');
    if (!el) return;
    var v = Q.tTotal ? Q.tTotalLeft : Q.tLeft;
    el.querySelector('span').textContent = v + ' s';
    el.className = 'timer num' + (v <= 5 ? ' crit' : v <= 10 ? ' warn' : '');
  }

  /* ---------------- rendu ---------------- */

  function current() { return Q.list[Q.i]; }

  /* En survie, la longueur est inconnue : on affiche le score plutôt
     qu'une barre de progression qui n'aurait aucun sens. */
  function endless() { return Q.mode === 'survie'; }

  function pips() {
    if (endless()) return '';
    var out = '';
    for (var i = 0; i < Q.list.length; i++) {
      var r = Q.results[i];
      var c = r ? (r.correct ? 'ok' : 'ko') : (i === Q.i ? 'now' : '');
      // en mode examen on ne révèle rien : toutes les répondues sont neutres
      if (!Q.conf.instant && r) c = 'now';
      out += '<i class="' + c + '"></i>';
    }
    return '<div class="pips">' + out + '</div>';
  }

  function hearts() {
    if (!Q.conf.lives) return '';
    var o = '';
    for (var i = 0; i < Q.conf.lives; i++) {
      o += '<span class="heart' + (i < Q.lives ? '' : ' out') + '" aria-hidden="true">♥</span>';
    }
    return '<span class="lives" role="status" aria-label="' + Q.lives + ' vies restantes">' + o + '</span>';
  }

  function comboTag() {
    var m = comboMult(Q.combo);
    if (m < 2) return '';
    return '<span class="combo num">×' + m + '</span>';
  }

  function counter() {
    if (endless()) {
      var ok = Q.results.filter(function (r) { return r && r.correct; }).length;
      return '<span class="pill num">' + ok + ' pt' + (ok > 1 ? 's' : '') + '</span>';
    }
    return '<span class="pill num">' + (Q.i + 1) + ' / ' + Q.list.length + '</span>';
  }

  function render() {
    var q = current(), multi = q.a.length > 1;

    var head =
      '<div class="quiz-top stack g10">' +
        '<div class="row between">' +
          '<button class="back" data-quit aria-label="Quitter la session">‹</button>' +
          '<div class="row g8">' +
            hearts() + comboTag() + counter() +
            ((Q.tPerQ || Q.tTotal)
              ? '<span class="timer num" id="timer">⏱ <span>' + (Q.tTotal ? Q.tTotalLeft : Q.tLeft) + ' s</span></span>'
              : '') +
          '</div>' +
        '</div>' + pips() +
      '</div>';

    var body = '<div class="stack g16" id="qbody">';
    if (q.sign && Signs.has(q.sign)) body += '<div class="q-sign">' + Signs.render(q.sign) + '</div>';
    if (q.ctx) body += '<div class="q-ctx">' + UI.esc(q.ctx) + '</div>';
    body += '<div class="stack g8">' +
      (multi ? '<div class="q-multi">Plusieurs réponses attendues</div>' : '') +
      '<h2 class="q-txt">' + UI.esc(q.q) + '</h2></div>';

    body += '<div class="answers" id="answers">';
    var letters = 'ABCD';
    for (var i = 0; i < q.o.length; i++) {
      body += '<button class="ans" data-i="' + i + '">' +
        '<span class="k">' + letters[i] + '</span><span class="grow">' + UI.esc(q.o[i]) + '</span></button>';
    }
    body += '</div><div id="fb"></div></div>';

    var cta = '<div class="cta-bar">' +
      '<button class="btn primary block" id="go" disabled>Valider</button></div>';

    UI.mount(head + body + cta);
    bind();
  }

  function themeName(k) { return window.themeByKey(k).n; }

  function bind() {
    UI.on('[data-quit]', 'click', function () {
      if (Q.results.length === 0 || confirm('Quitter la session ? La progression de cette session sera perdue.')) quit();
    });
    UI.on('.ans', 'click', function () { pick(+this.getAttribute('data-i')); });
    var go = document.getElementById('go');
    go.addEventListener('click', function () {
      if (Q.locked) next(); else validate(false);
    });
  }

  function pick(i) {
    if (Q.locked) return;
    var q = current(), multi = q.a.length > 1;
    if (multi) {
      var at = Q.sel.indexOf(i);
      if (at >= 0) Q.sel.splice(at, 1); else Q.sel.push(i);
    } else {
      Q.sel = [i];
    }
    UI.buzz(8);
    var nodes = document.querySelectorAll('.ans');
    for (var n = 0; n < nodes.length; n++) {
      nodes[n].classList.toggle('sel', Q.sel.indexOf(n) >= 0);
    }
    document.getElementById('go').disabled = Q.sel.length === 0;
  }

  /* ---------------- validation ---------------- */

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var s = a.slice().sort().join(','), t = b.slice().sort().join(',');
    return s === t;
  }

  function validate(timedOut) {
    if (Q.locked) return;
    var q = current();
    var correct = !timedOut && Q.sel.length > 0 && sameSet(Q.sel, q.a);

    if (correct) {
      Q.combo++;
      if (Q.combo > Q.bestCombo) Q.bestCombo = Q.combo;
    } else {
      Q.combo = 0;
      if (Q.conf.lives) Q.lives--;
    }

    Q.locked = true;
    Q.results[Q.i] = { q: q, correct: correct, chosen: Q.sel.slice(), timedOut: !!timedOut };
    Store.answer(q, correct, comboMult(Q.combo));

    if (Q.conf.instant) {
      revealCorrection(q, correct, timedOut);
    } else {
      // examen blanc et défi de thème : aucun retour, comme le jour J
      next();
    }
  }

  function revealCorrection(q, correct, timedOut) {
    var nodes = document.querySelectorAll('.ans');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].disabled = true;
      nodes[i].classList.remove('sel');
      var isGood = q.a.indexOf(i) >= 0, isPicked = Q.sel.indexOf(i) >= 0;
      if (isGood && isPicked) nodes[i].classList.add('good');
      else if (isGood) nodes[i].classList.add('miss');
      else if (isPicked) nodes[i].classList.add('bad');
    }

    var head = timedOut ? 'Temps écoulé' : (correct ? 'Bonne réponse' : 'Réponse incorrecte');
    var emo = timedOut ? '⏱' : (correct ? '✅' : '❌');
    var fb = '<div class="fb ' + (correct ? 'ok' : 'ko') + ' rise"><div class="stack g10">' +
      '<div class="fb-h"><span aria-hidden="true">' + emo + '</span>' + head + '</div>' +
      '<p class="fb-b">' + UI.esc(q.e) + '</p>' +
      (q.tip ? '<div class="tip"><b>Astuce mémo.</b> ' + UI.esc(q.tip) + '</div>' : '') +
      '</div></div>';
    document.getElementById('fb').innerHTML = fb;

    UI.buzz(correct ? 10 : [18, 40, 18]);
    if (!correct) {
      var b = document.getElementById('qbody');
      b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
    }

    var go = document.getElementById('go');
    go.disabled = false;
    var last = (Q.i + 1 >= Q.list.length) || (Q.conf.lives && Q.lives <= 0);
    go.textContent = last ? 'Voir mon résultat' : 'Question suivante';
    go.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    // en survie, la perte d'une vie doit se voir immédiatement
    if (Q.conf.lives && !correct) {
      var l = document.querySelector('.lives');
      if (l) { l.classList.remove('hit'); void l.offsetWidth; l.classList.add('hit'); }
    }
  }

  function next() {
    if (Q.conf.lives && Q.lives <= 0) { stop(); finish(); return; }
    Q.i++;
    Q.sel = []; Q.locked = false; Q.tLeft = Q.tPerQ;
    if (Q.i >= Q.list.length) { stop(); finish(); return; }
    render();
    paintTimer();
  }

  /* ---------------- fin de session ---------------- */

  function finish() {
    stop();
    var answered = Q.results.filter(Boolean);
    var score = answered.filter(function (r) { return r.correct; }).length;
    var open = (Q.mode === 'sprint' || Q.mode === 'survie');
    var total = open ? answered.length : Q.list.length;

    var won = Store.endSession({
      mode: Q.mode, score: score, total: total, theme: Q.theme, combo: Q.bestCombo
    });

    Results.show({
      mode: Q.mode, score: score, total: total, combo: Q.bestCombo,
      results: answered, theme: Q.theme, badges: won
    });

    Q = null;
    document.body.classList.remove('no-tabbar');
    document.getElementById('tabbar').hidden = false;
  }

  return { start: start, quit: quit };
})();


/* ============================================================
   Results - écran de fin de session
   ============================================================ */
window.Results = (function () {

  function show(r) {
    var pct = r.total ? Math.round((r.score / r.total) * 100) : 0;
    var isExam = r.mode === 'exam';
    var isBoss = r.mode === 'boss';
    var isSurv = r.mode === 'survie';
    var passed = isExam ? r.score >= 35 : isBoss ? r.score >= 9 : pct >= 80;

    var verdict, sub;
    if (isExam) {
      verdict = passed ? 'Examen validé' : 'Pas encore validé';
      sub = passed
        ? 'Avec ce score, tu obtiens le code. Reste à confirmer.'
        : 'Il faut 35 bonnes réponses sur 40. Il t’en manque ' + (35 - r.score) + '.';
    } else if (isBoss) {
      var tn = window.themeByKey(r.theme).n;
      verdict = passed ? 'Défi remporté' : 'Défi manqué';
      sub = passed
        ? 'Le thème « ' + tn + ' » est validé. L’étoile est à toi.'
        : 'Il faut 9 bonnes réponses sur 10. Retente quand tu veux, le thème t’attend.';
    } else if (isSurv) {
      var record = Store.s.survivalBest;
      verdict = (r.score >= record && r.score > 0) ? 'Nouveau record' : 'Partie terminée';
      sub = (r.score >= record && r.score > 0)
        ? r.score + ' bonnes réponses avant la troisième erreur. C’est ton meilleur score.'
        : 'Ton record reste de ' + record + '. Il ne tiendra pas longtemps.';
    } else if (pct === 100) {
      verdict = 'Sans faute'; sub = 'Série parfaite. Ces questions sont acquises.';
    } else if (pct >= 80) {
      verdict = 'Bien joué'; sub = 'Le niveau est bon. On consolide les dernières erreurs.';
    } else if (pct >= 60) {
      verdict = 'Ça vient'; sub = 'La base est là. Les erreurs reviendront automatiquement.';
    } else {
      verdict = 'Séance utile'; sub = 'Ces questions sont maintenant repérées. Elles reviendront vite.';
    }

    /* répartition par thème sur cette session */
    var byT = {};
    r.results.forEach(function (x) {
      var t = byT[x.q.t] || (byT[x.q.t] = { ok: 0, n: 0 });
      t.n++; if (x.correct) t.ok++;
    });
    var themeRows = Object.keys(byT).sort(function (a, b) {
      return (byT[a].ok / byT[a].n) - (byT[b].ok / byT[b].n);
    }).map(function (k) {
      var t = byT[k], p = Math.round((t.ok / t.n) * 100);
      return '<div class="bar">' +
        '<div class="l">' + UI.esc(window.themeByKey(k).n) + '</div>' +
        '<div class="grow"><div class="gauge thin ' + (p >= 80 ? 'ok' : p < 50 ? 'ko' : '') + '">' +
        '<i style="width:' + p + '%"></i></div></div>' +
        '<div class="v num">' + t.ok + '/' + t.n + '</div></div>';
    }).join('');

    var wrong = r.results.filter(function (x) { return !x.correct; });
    var recap = wrong.length
      ? wrong.map(function (x) {
          return '<div class="recap"><div class="q">' + UI.esc(x.q.q) + '</div>' +
            '<div class="a"><b>Réponse : </b>' +
            UI.esc(x.q.a.map(function (i) { return x.q.o[i]; }).join(' + ')) + '<br>' +
            UI.esc(x.q.e) + '</div></div>';
        }).join('')
      : UI.empty('🎯', 'Aucune erreur', 'Rien à revoir sur cette série.');

    var lvl = Store.level();

    var html =
      '<header class="topbar"><div class="grow"><div class="ttl">Résultat</div>' +
      '<div class="sub">' + UI.esc(labelOf(r)) + '</div></div></header>' +

      '<div class="stack g20">' +

        '<div class="stack g12 center">' +
          '<div class="score' + (passed ? '' : ' ko') + '" style="--p:' + pct + '">' +
            '<div><div><div class="score-n num">' + r.score + '<span style="font-size:20px;color:var(--txt-3)">/' + r.total + '</span></div>' +
            '<div class="score-l"><span class="num">' + pct + ' %</span><br>de réussite</div></div></div>' +
          '</div>' +
          '<div class="stack g4">' +
            '<h1>' + UI.esc(verdict) + '</h1>' +
            '<p class="muted small">' + UI.esc(sub) + '</p>' +
          '</div>' +
        '</div>' +

        (isExam ? examScale(r.score) : '') +
        (isBoss ? bossScale(r.score) : '') +
        (r.combo >= 3 ? comboCard(r.combo) : '') +

        (themeRows ? '<div class="card stack g12"><div class="sec-t">Par thème</div>' + themeRows + '</div>' : '') +

        '<div class="card quiet stack g10">' +
          '<div class="row between"><div class="sec-t">Niveau ' + lvl.n + ' · ' + UI.esc(lvl.name) + '</div>' +
          '<div class="tiny dim num">' + Store.s.xp + ' XP</div></div>' +
          '<div class="gauge thin"><i style="width:' + lvl.pct + '%"></i></div>' +
        '</div>' +

        '<div class="stack g10">' +
          '<div class="sec-t">À revoir (' + wrong.length + ')</div>' + recap +
        '</div>' +

        '<div class="stack g10" style="padding-bottom:24px">' +
          '<button class="btn primary block" data-again>' + (isExam ? 'Refaire un examen blanc' : 'Nouvelle série') + '</button>' +
          '<button class="btn ghost block" data-home>Retour à l’accueil</button>' +
        '</div>' +

      '</div>';

    UI.mount(html);

    UI.on('[data-home]', 'click', function () { App.go('home'); });
    UI.on('[data-again]', 'click', function () {
      if (r.mode === 'exam') Quiz.start({ mode: 'exam', questions: Store.examSet() });
      else if (r.mode === 'daily') App.go('home');
      else if (r.mode === 'sprint') Sprint.launch();
      else if (r.mode === 'survie') Survie.launch();
      else if (r.mode === 'boss') Quiz.start({ mode: 'boss', theme: r.theme, questions: Store.bossSet(r.theme) });
      else Quiz.start({ mode: 'train', theme: r.theme, questions: Store.trainSet(r.theme || 'all', 20) });
    });

    if (passed && r.total >= 9) UI.confetti();
    UI.celebrate(r.badges);
  }

  function labelOf(r) {
    if (r.mode === 'boss') return 'Défi du thème · ' + window.themeByKey(r.theme).n;
    return { daily: 'Défi du jour', train: 'Entraînement', exam: 'Examen blanc',
             sprint: 'Sprint 60 secondes', errors: 'Séance de rattrapage',
             survie: 'Mode survie' }[r.mode] || '';
  }

  /* Seuil du défi de thème : 9 sur 10 */
  function bossScale(score) {
    return '<div class="card stack g10">' +
      '<div class="row between"><div class="sec-t">Seuil du défi</div>' +
      '<div class="tiny dim">9 / 10 requis</div></div>' +
      '<div style="position:relative">' +
        '<div class="gauge ' + (score >= 9 ? 'ok' : 'ko') + '"><i style="width:' + (score * 10) + '%"></i></div>' +
        '<div style="position:absolute;top:-3px;left:90%;width:2px;height:14px;background:var(--txt);border-radius:2px"></div>' +
      '</div></div>';
  }

  function comboCard(c) {
    return '<div class="card accent row between">' +
      '<div class="stack g4"><div class="sec-t">Meilleure série</div>' +
      '<div style="font-weight:800;font-size:16px;letter-spacing:-.02em">' +
      c + ' bonnes réponses d’affilée</div></div>' +
      '<div class="combo num" style="font-size:15px">×' + (c >= 6 ? 3 : 2) + '</div></div>';
  }

  /* Barème officiel rendu lisible : où se situe le score */
  function examScale(score) {
    var p = Math.min(100, Math.round((score / 40) * 100));
    return '<div class="card stack g10">' +
      '<div class="row between"><div class="sec-t">Seuil de réussite</div>' +
      '<div class="tiny dim">35 / 40 requis</div></div>' +
      '<div style="position:relative">' +
        '<div class="gauge ' + (score >= 35 ? 'ok' : 'ko') + '"><i style="width:' + p + '%"></i></div>' +
        '<div style="position:absolute;top:-3px;left:87.5%;width:2px;height:14px;background:var(--txt);border-radius:2px"></div>' +
      '</div>' +
      '<div class="tiny dim">Le trait marque les 35 bonnes réponses exigées le jour de l’examen.</div>' +
      '</div>';
  }

  return { show: show };
})();
