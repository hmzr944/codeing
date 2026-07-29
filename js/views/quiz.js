/* ============================================================
   Quiz - moteur unique pour tous les modes de révision
   ============================================================ */
window.Quiz = (function () {

  var Q = null;   // session en cours

  var MODES = {
    daily:  { title: 'Défi du jour',   instant: true,  perQ: 0,  total: 0,  label: 'Question' },
    train:  { title: 'Entraînement',   instant: true,  perQ: 0,  total: 0,  label: 'Question' },
    errors: { title: 'Mes erreurs',    instant: true,  perQ: 0,  total: 0,  label: 'Question' },
    exam:   { title: 'Examen blanc',   instant: false, perQ: 20, total: 0,  label: 'Question' },
    sprint: { title: 'Sprint 60 s',    instant: true,  perQ: 0,  total: 60, label: 'Question' }
  };

  function start(cfg) {
    var m = MODES[cfg.mode];
    Q = {
      mode: cfg.mode, conf: m, theme: cfg.theme || '',
      list: cfg.questions, i: 0,
      sel: [], locked: false,
      results: [],                       // {q, correct, chosen}
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

  function pips() {
    var out = '';
    for (var i = 0; i < Q.list.length; i++) {
      var r = Q.results[i];
      var c = r ? (r.correct ? 'ok' : (Q.conf.instant ? 'ko' : 'ok')) : (i === Q.i ? 'now' : '');
      // en mode examen on ne révèle rien : toutes les répondues sont neutres
      if (!Q.conf.instant && r) c = 'now';
      out += '<i class="' + c + '"></i>';
    }
    return '<div class="pips">' + out + '</div>';
  }

  function render() {
    var q = current(), multi = q.a.length > 1;

    var head =
      '<div class="quiz-top stack g10">' +
        '<div class="row between">' +
          '<button class="back" data-quit aria-label="Quitter la session">‹</button>' +
          '<div class="row g8">' +
            '<span class="pill num">' + (Q.i + 1) + ' / ' + Q.list.length + '</span>' +
            ((Q.tPerQ || Q.tTotal)
              ? '<span class="timer num" id="timer">⏱ <span>' + (Q.tTotal ? Q.tTotalLeft : Q.tLeft) + ' s</span></span>'
              : '<span class="pill">' + UI.esc(themeName(q.t)) + '</span>') +
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

    Q.locked = true;
    Q.results[Q.i] = { q: q, correct: correct, chosen: Q.sel.slice(), timedOut: !!timedOut };
    Store.answer(q, correct);

    if (Q.conf.instant) {
      revealCorrection(q, correct, timedOut);
    } else {
      // examen blanc : aucun retour, on enchaîne comme le jour J
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
    go.textContent = (Q.i + 1 >= Q.list.length) ? 'Voir mon résultat' : 'Question suivante';
    go.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function next() {
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
    var total = Q.mode === 'sprint' ? answered.length : Q.list.length;

    var won = Store.endSession({
      mode: Q.mode, score: score, total: total, theme: Q.theme
    });

    Results.show({
      mode: Q.mode, score: score, total: total,
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
    var passed = isExam ? r.score >= 35 : pct >= 80;

    var verdict, sub;
    if (isExam) {
      verdict = passed ? 'Examen validé' : 'Pas encore validé';
      sub = passed
        ? 'Avec ce score, tu obtiens le code. Reste à confirmer.'
        : 'Il faut 35 bonnes réponses sur 40. Il t’en manque ' + (35 - r.score) + '.';
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
      else Quiz.start({ mode: 'train', theme: r.theme, questions: Store.trainSet(r.theme || 'all', 20) });
    });

    if (passed && r.total >= 10) UI.confetti();
    UI.celebrate(r.badges);
  }

  function labelOf(r) {
    return { daily: 'Défi du jour', train: 'Entraînement', exam: 'Examen blanc',
             sprint: 'Sprint 60 secondes', errors: 'Séance de rattrapage' }[r.mode] || '';
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
