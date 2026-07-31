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
      sel: [], locked: false, hintUsed: false,
      results: [],                       // {q, correct, chosen}
      combo: 0, bestCombo: 0,
      lives: m.lives,
      tPerQ: m.perQ, tLeft: m.perQ,
      tTotal: m.total, tTotalLeft: m.total,
      tick: null, startedAt: Date.now(),
      niveauDepart: Store.level().n
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
      o += '<span class="heart' + (i < Q.lives ? '' : ' out') + '">' + Icons.svg('survie', 15) + '</span>';
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
          '<button class="back" data-quit aria-label="Quitter la session">' +
            Icons.svg('retour', 18) + '</button>' +
          '<div class="row g8">' +
            hearts() + comboTag() + counter() +
            ((Q.tPerQ || Q.tTotal)
              ? '<span class="timer num" id="timer">' + Icons.svg('chrono', 14) +
                '<span>' + (Q.tTotal ? Q.tTotalLeft : Q.tLeft) + ' s</span></span>'
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
    body += '</div>' +
      '<div id="indice"></div>' +
      (aideDispo() && !Q.hintUsed && q.tip
        ? '<button class="hint-btn" data-hint>' + Icons.svg('ampoule', 16) + 'Un indice</button>'
        : '') +
      '<div id="fb"></div></div>';

    var cta = '<div class="cta-bar">' +
      '<button class="btn primary block" id="go" disabled>Valider</button></div>';

    UI.mount(head + body + cta + assistant());
    bind();
  }

  /* ---------------- assistant ----------------

     Un mot incompris ne doit pas obliger à quitter la série : la
     feuille se pose par-dessus et le chrono s'arrête le temps de
     lire. L'examen blanc en est exclu : ce serait sortir des
     conditions d'examen, qui sont tout l'intérêt du mode. */

  function aideDispo() { return Q.mode !== 'exam' && Q.mode !== 'boss'; }

  function assistant() {
    if (!aideDispo()) return '';
    return '<button class="aide-flottant" data-assist aria-label="Demander à l’assistant">' +
      Icons.svg('chat', 21) + '</button>';
  }

  function ouvrirAide() {
    ouvrirPour(Q.list[Q.i], 'Tu es sur cette question. Quel mot n’est pas clair ?');
  }

  function ouvrirCorrection(q) {
    ouvrirPour(q, 'On parle de cette question. Tape le mot qui bloque.');
  }

  function ouvrirErreur(q, choisi) {
    ouvrirPour(q, null, function () { Chat.expliquerErreur(q, choisi); });
  }

  function ouvrirPour(q, amorce, intention) {
    stop();
    Chat.ouvrir({
      titre: 'Question en cours',
      amorce: amorce,
      question: q.q
    }, {
      reprendre: function () { if (Q && (Q.tPerQ || Q.tTotal)) startClock(); },
      quitter: function () {
        stop(); Q = null;
        document.body.classList.remove('no-tabbar');
        document.getElementById('tabbar').hidden = false;
      }
    }, intention);
  }

  function themeName(k) { return window.themeByKey(k).n; }

  function bind() {
    UI.on('[data-quit]', 'click', function () {
      if (Q.results.length === 0 || confirm('Quitter la session ? La progression de cette session sera perdue.')) quit();
    });
    UI.on('.ans', 'click', function () { pick(+this.getAttribute('data-i')); });
    UI.on('[data-hint]', 'click', hint);
    UI.on('[data-assist]', 'click', ouvrirAide);
    var go = document.getElementById('go');
    go.addEventListener('click', function () {
      if (Q.locked) next(); else validate(false);
    });
  }

  /* Un indice par question, jamais plus : le vrai indice écrit pour
     cette question (q.tip), pas une réponse écartée au hasard. Rien
     n'est demandé à un modèle : l'indice vient déjà du cours. */
  function hint() {
    if (Q.locked || Q.hintUsed) return;
    var q = current();
    if (!q.tip) return;
    Q.hintUsed = true;
    var zone = document.getElementById('indice');
    if (zone) {
      zone.innerHTML = '<div class="indice rise">' + Icons.svg('ampoule', 16) +
        '<p>' + UI.esc(q.tip) + '</p></div>';
    }
    var btn = document.querySelector('[data-hint]');
    if (btn) btn.remove();
    UI.buzz(8);
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

  /* La petite pique amicale sur une mauvaise réponse : un mème choisi
     au hasard dans js/data/memes.js, jamais deux fois la même logique
     que l'explication qui suit juste en dessous. */
  function memeAleatoire() {
    if (!window.MEMES || !window.MEMES.length) return '';
    var m = window.MEMES[Math.floor(Math.random() * window.MEMES.length)];
    return '<figure class="fb-meme">' +
      '<img src="' + UI.esc(m.img) + '" alt="" loading="lazy">' +
      '<figcaption>' + UI.esc(m.legende) + '</figcaption></figure>';
  }

  /* Le schéma qui explique la question, montré UNIQUEMENT dans la
     correction. À côté de l'énoncé il vendrait la mèche : le dessin
     de la priorité à droite, par exemple, donne la réponse avant
     même qu'on ait réfléchi. Après avoir répondu, il n'y a plus rien
     à gâcher — et c'est là qu'on cherche à comprendre.
     On lit l'énoncé ET l'explication : le mot-clé est souvent dans
     la seconde seulement. */
  var SCHEMA_CORRECTION = [
    [/distance de s[ée]curit|deux secondes|intervalle/i, 'deux-secondes'],
    [/distance d.arr[êe]t|distance de freinage|temps de r[ée]action/i, 'distance-arret'],
    [/priorit[ée] [àa] droite/i, 'priorite-droite'],
    [/giratoire|rond-?point/i, 'giratoire'],
    [/angle mort/i, 'angle-mort'],
    [/d[ée]pass\w*[^.]{0,40}(cycliste|v[ée]lo)|(cycliste|v[ée]lo)[^.]{0,40}d[ée]pass/i, 'depassement-cycliste'],
    [/alcool[ée]mie|g\/l|verre d.alcool/i, 'alcool-temps'],
    [/bande d.arr[êe]t d.urgence|panne sur autoroute|triangle de pr[ée]signalisation/i, 'panne-autoroute'],
    [/profondeur des rainures|usure du pneu|1,6 mm/i, 'usure-pneu'],
    [/feux de croisement|feux de route|port[ée]e des feux/i, 'portee-feux'],
    [/verglas|route enneig|sur la neige|perte d.adh[ée]rence/i, 'adherence-neige'],
    [/position lat[ée]rale de s[ée]curit|pls/i, 'pls'],
    [/toutes les deux heures|pause[^.]{0,30}(conduite|route|heures)|somnolence|fatigue au volant/i, 'pause-2h'],
    [/frein moteur|descente prolong/i, 'pente'],
    [/champ visuel|vision p[ée]riph/i, 'champ-visuel']
  ];

  function schemaCorrection(q) {
    /* Une question qui montre déjà un panneau n'a pas besoin d'un
       second dessin : elle en a un sous les yeux. */
    if (q.sign) return '';
    var texte = q.q + ' ' + q.e;
    for (var i = 0; i < SCHEMA_CORRECTION.length; i++) {
      var d = SCHEMA_CORRECTION[i];
      if (d[0].test(texte) && Diagrams.has(d[1])) {
        return '<figure class="fb-schema">' + Diagrams.render(d[1]) + '</figure>';
      }
    }
    return '';
  }

  function revealCorrection(q, correct, timedOut) {
    var hintBtn = document.querySelector('[data-hint]');
    if (hintBtn) hintBtn.remove();
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
    var ico = timedOut ? 'chrono' : (correct ? 'valide' : 'fermer');
    var fb = '<div class="fb ' + (correct ? 'ok' : 'ko') + ' rise"><div class="stack g10">' +
      '<div class="fb-h">' + Icons.svg(ico, 19) + head + '</div>' +
      (correct ? '' : memeAleatoire()) +
      '<p class="fb-b">' + UI.esc(q.e) + '</p>' +
      schemaCorrection(q) +
      (q.tip ? '<div class="tip"><b>Astuce mémo.</b> ' + UI.esc(q.tip) + '</div>' : '') +
      /* Deux sorties de secours quand l'explication ne suffit pas :
         l'assistant, tout de suite et hors ligne, puis Claude avec
         la question déjà mise en forme. */
      '<div class="row wrap g12">' +
        '<button class="fb-aide" data-fb-assist>' +
          (correct || timedOut ? 'Je n’ai pas compris' : 'Pourquoi ma réponse est fausse ?') +
        '</button>' +
        '<a class="fb-aide" target="_blank" rel="noopener" href="' +
          UI.esc(window.lienClaude(window.promptCorrection(q))) + '">Demander à Claude</a>' +
      '</div>' +
      '</div></div>';
    document.getElementById('fb').innerHTML = fb;

    /* Quand elle s'est trompée, la vraie question n'est pas « c'est
       quoi ce mot » mais « pourquoi ce que j'ai coché est faux ». On
       transmet donc ce qu'elle a réellement choisi. */
    var choisi = Q.sel.map(function (i) { return q.o[i]; });
    UI.on('[data-fb-assist]', 'click', function () {
      if (!correct && !timedOut && choisi.length) ouvrirErreur(q, choisi);
      else ouvrirCorrection(q);
    });

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
    Q.sel = []; Q.locked = false; Q.hintUsed = false; Q.tLeft = Q.tPerQ;
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
    var niveauDepart = Q.niveauDepart;

    var won = Store.endSession({
      mode: Q.mode, score: score, total: total, theme: Q.theme, combo: Q.bestCombo
    });

    var niveauFin = Store.level();
    Results.show({
      mode: Q.mode, score: score, total: total, combo: Q.bestCombo,
      results: answered, theme: Q.theme, badges: won,
      niveauGagne: niveauFin.n > niveauDepart ? niveauFin : null
    });

    Q = null;
    document.body.classList.remove('no-tabbar');
    document.getElementById('tabbar').hidden = false;
  }

  /* Une série vit en mémoire : savoir qu'elle est en cours permet à
     l'application de ne pas se recharger au mauvais moment. */
  function enCours() { return !!Q; }

  return { start: start, quit: quit, enCours: enCours };
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

    var verdict, sub, tier;
    if (isExam) {
      verdict = passed ? 'Examen validé' : 'Pas encore validé';
      sub = passed
        ? 'Avec ce score, tu obtiens le code. Reste à confirmer.'
        : 'Il faut 35 bonnes réponses sur 40. Il t’en manque ' + (35 - r.score) + '.';
      tier = passed ? 'examReussi' : 'examRate';
    } else if (isBoss) {
      var tn = window.themeByKey(r.theme).n;
      verdict = passed ? 'Défi remporté' : 'Défi manqué';
      sub = passed
        ? 'Le thème « ' + tn + ' » est validé. L’étoile est à toi.'
        : 'Il faut 9 bonnes réponses sur 10. Retente quand tu veux, le thème t’attend.';
      tier = passed ? 'bien' : 'faible';
    } else if (isSurv) {
      var record = Store.s.survivalBest;
      var recordBattu = r.score >= record && r.score > 0;
      verdict = recordBattu ? 'Nouveau record' : 'Partie terminée';
      sub = recordBattu
        ? r.score + ' bonnes réponses avant la troisième erreur. C’est ton meilleur score.'
        : 'Ton record reste de ' + record + '. Il ne tiendra pas longtemps.';
      tier = recordBattu ? 'bien' : 'moyen';
    } else if (pct === 100) {
      verdict = 'Sans faute'; sub = 'Série parfaite. Ces questions sont acquises.'; tier = 'parfait';
    } else if (pct >= 80) {
      verdict = 'Bien joué'; sub = 'Le niveau est bon. On consolide les dernières erreurs.'; tier = 'bien';
    } else if (pct >= 60) {
      verdict = 'Ça vient'; sub = 'La base est là. Les erreurs reviendront automatiquement.'; tier = 'moyen';
    } else {
      verdict = 'Séance utile'; sub = 'Ces questions sont maintenant repérées. Elles reviendront vite.'; tier = 'faible';
    }
    var motivation = window.MOTIVATION.fin(tier);

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
        '<i data-anime="--pct" style="--pct:' + (p / 100) + '"></i></div></div>' +
        '<div class="v num">' + t.ok + '/' + t.n + '</div></div>';
    }).join('');

    var wrong = r.results.filter(function (x) { return !x.correct; });

    /* Ce qui compte ici, c'est la leçon à revoir, pas le texte complet
       de chaque question ratée : la question elle-même reste consultable
       question par question, réponse au tapis « Faire expliquer une
       erreur » plus bas. Les erreurs sont donc regroupées par leçon. */
    var parLecon = {};
    wrong.forEach(function (x) {
      var l = x.q.t && window.LESSONS.filter(function (ll) { return ll.theme === x.q.t; })[0];
      if (!l) return;
      var e = parLecon[l.k] || (parLecon[l.k] = { l: l, n: 0 });
      e.n++;
    });
    var lecons = Object.keys(parLecon).map(function (k) { return parLecon[k]; })
      .sort(function (a, b) { return b.n - a.n; });

    var revoir;
    if (!wrong.length) {
      revoir = UI.empty('cible', 'Aucune erreur', 'Rien à revoir sur cette série.');
    } else {
      revoir =
        '<p class="small muted">' + UI.plural(wrong.length, 'erreur') +
        (lecons.length
          ? ', surtout en ' + lecons.slice(0, 3).map(function (x) { return x.l.n; }).join(', ') + '.'
          : '.') +
        '</p>' +
        (lecons.length ? '<div class="row wrap g8">' +
          lecons.map(function (x) {
            return '<span class="pill ko">' + UI.esc(x.l.n) + ' · ' + x.n + '</span>';
          }).join('') +
        '</div>' : '');
    }

    var lvl = Store.level();

    var html =
      '<header class="topbar"><div class="grow"><div class="ttl">Résultat</div>' +
      '<div class="sub">' + UI.esc(labelOf(r)) + '</div></div></header>' +

      '<div class="stack g20">' +

        '<div class="stack g12 center">' +
          '<div class="score' + (passed ? '' : ' ko') + '" data-anime="--p" style="--p:' + pct + '">' +
            '<div><div><div class="score-n num"><span id="score-num">0</span>' +
            '<span style="font-size:20px;color:var(--txt-3)">/' + r.total + '</span></div>' +
            '<div class="score-l"><span class="num" id="score-pct">0</span><span class="num"> %</span><br>de réussite</div></div></div>' +
          '</div>' +
          '<div class="stack g4">' +
            '<h1 class="rise">' + UI.esc(verdict) + '</h1>' +
            '<p class="muted small rise" style="animation-delay:70ms">' + UI.esc(sub) + '</p>' +
          '</div>' +
        '</div>' +

        '<p class="small center rise" style="color:var(--accent-txt);font-weight:500;animation-delay:140ms">' + UI.esc(motivation) + '</p>' +

        (r.niveauGagne ? niveauCard(r.niveauGagne) : '') +

        (isExam ? examScale(r.score) : '') +
        (isBoss ? bossScale(r.score) : '') +
        (r.combo >= 3 ? comboCard(r.combo) : '') +

        (themeRows ? '<div class="card stack g12"><div class="sec-t">Par thème</div>' + themeRows + '</div>' : '') +

        '<div class="card quiet stack g10">' +
          '<div class="row between"><div class="sec-t">Niveau ' + lvl.n + ' · ' + UI.esc(lvl.name) + '</div>' +
          '<div class="tiny dim num">' + Store.s.xp + ' XP</div></div>' +
          '<div class="gauge thin"><i data-anime="--pct" style="--pct:' + (lvl.pct / 100) + '"></i></div>' +
        '</div>' +

        '<div class="stack g10">' +
          '<div class="sec-t">À revoir</div>' + revoir +
          (lecons.length ? '<button class="btn ghost block" data-lecons>' +
            (lecons.length > 1 ? 'Revoir ces leçons' : 'Revoir « ' + UI.esc(lecons[0].l.n) + ' »') +
          '</button>' : '') +
        '</div>' +

        '<div class="stack g10" style="padding-bottom:24px">' +
          '<button class="btn primary block" data-again>' + (isExam ? 'Refaire un examen blanc' : 'Nouvelle série') + '</button>' +
          (wrong.length ? '<button class="btn ghost block" data-revoir>' +
            'Faire expliquer une erreur</button>' : '') +
          '<button class="btn ghost block" data-home>Retour à l’accueil</button>' +
        '</div>' +

      '</div>';

    UI.mount(html);
    UI.animateGauges();
    var numEl = document.getElementById('score-num'), pctEl = document.getElementById('score-pct');
    if (numEl && pctEl) {
      UI.tween(700, function (e) {
        numEl.textContent = Math.round(r.score * e);
        pctEl.textContent = Math.round(pct * e);
      });
    }

    UI.on('[data-home]', 'click', function () { App.go('home'); });
    /* Une seule leçon à revoir : on y entre directement. Plusieurs :
       la liste des cours, pour choisir par laquelle commencer. */
    UI.on('[data-lecons]', 'click', function () {
      if (lecons.length === 1) Cours.lire(lecons[0].l.k);
      else App.go('lessons');
    });
    /* Après l'épreuve, l'assistant redevient accessible dans tous les
       modes : la première erreur du récapitulatif est celle qu'on a
       le plus envie de comprendre. */
    UI.on('[data-revoir]', 'click', function () {
      var e = wrong[0];
      var choisi = (e.chosen || []).map(function (i) { return e.q.o[i]; });
      Chat.ouvrir({ titre: 'Erreur à comprendre', question: e.q.q,
        amorce: 'Voici la première question ratée. Quel mot n’était pas clair ?' }, {},
        choisi.length ? function () { Chat.expliquerErreur(e.q, choisi); } : null);
    });
    UI.on('[data-again]', 'click', function () {
      if (r.mode === 'exam') Quiz.start({ mode: 'exam', questions: Store.examSet() });
      else if (r.mode === 'daily') App.go('home');
      else if (r.mode === 'sprint') Sprint.launch();
      else if (r.mode === 'survie') Survie.launch();
      else if (r.mode === 'boss') Quiz.start({ mode: 'boss', theme: r.theme, questions: Store.bossSet(r.theme) });
      else Quiz.start({ mode: 'train', theme: r.theme, questions: Store.trainSet(r.theme || 'all', 20) });
    });

    if ((passed && r.total >= 9) || r.niveauGagne) UI.confetti();
    if (pct > 50) Son.succes();
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
        '<div class="gauge ' + (score >= 9 ? 'ok' : 'ko') + '"><i data-anime="--pct" style="--pct:' + ((score * 10) / 100) + '"></i></div>' +
        '<div style="position:absolute;top:-3px;left:90%;width:2px;height:14px;background:var(--txt);border-radius:2px"></div>' +
      '</div></div>';
  }

  /* Passer un niveau est rare : ça mérite mieux qu'une ligne dans le
     bloc XP habituel. */
  function niveauCard(niveau) {
    return '<div class="card accent stack g4 center rise" style="animation-delay:200ms">' +
      '<div class="sec-t">Niveau supérieur</div>' +
      '<div style="font-weight:700;font-size:19px;letter-spacing:-.02em">' +
        'Niveau ' + niveau.n + ' · ' + UI.esc(niveau.name) +
      '</div>' +
    '</div>';
  }

  function comboCard(c) {
    return '<div class="card accent row between">' +
      '<div class="stack g4"><div class="sec-t">Meilleure série</div>' +
      '<div style="font-weight:500;font-size:16px;letter-spacing:-.02em">' +
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
        '<div class="gauge ' + (score >= 35 ? 'ok' : 'ko') + '"><i data-anime="--pct" style="--pct:' + (p / 100) + '"></i></div>' +
        '<div style="position:absolute;top:-3px;left:87.5%;width:2px;height:14px;background:var(--txt);border-radius:2px"></div>' +
      '</div>' +
      '<div class="tiny dim">Le trait marque les 35 bonnes réponses exigées le jour de l’examen.</div>' +
      '</div>';
  }

  return { show: show };
})();
