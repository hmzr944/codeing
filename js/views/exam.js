/* ============================================================
   Examen blanc - conditions réelles, et Sprint 60 secondes
   ============================================================ */
window.Exam = (function () {

  function view() {
    var ex = Store.s.exams;
    var passed = ex.filter(function (e) { return e.ok; }).length;
    var best = ex.reduce(function (m, e) { return Math.max(m, e.score); }, 0);
    var last5 = ex.slice(0, 5);
    var avg = last5.length
      ? Math.round(last5.reduce(function (s, e) { return s + e.score; }, 0) / last5.length)
      : 0;

    var history = ex.length
      ? ex.slice(0, 12).map(function (e) {
          return '<div class="row between" style="padding:11px 0;border-bottom:1px solid var(--line-soft)">' +
            '<div class="stack g4"><div style="font-weight:500;font-size:14px" class="num">' +
              e.score + ' / ' + e.total + '</div>' +
            '<div class="tiny dim">' + UI.dateFR(e.d) + '</div></div>' +
            '<span class="pill ' + (e.ok ? 'ok' : 'ko') + '">' + (e.ok ? 'Validé' : 'Échoué') + '</span></div>';
        }).join('')
      : UI.empty('examen', 'Aucun examen blanc', 'Le premier sert de photographie de ton niveau. Il est normal qu’il soit bas.');

    var readiness = '';
    if (last5.length >= 3) {
      var ready = avg >= 36;
      readiness =
        '<div class="card ' + (ready ? 'accent' : 'quiet') + ' stack g8 rise" style="animation-delay:60ms">' +
          '<div class="sec-t">État de préparation</div>' +
          '<div style="font-weight:500;font-size:16px;letter-spacing:-.02em">' +
            (ready ? 'Niveau du jour J atteint' : 'Encore un peu de marge') + '</div>' +
          '<div class="small muted">Moyenne sur tes ' + last5.length + ' derniers examens blancs : ' +
            '<b class="num">' + avg + ' / 40</b>. ' +
            (ready ? 'Continue à ce rythme jusqu’à l’examen.'
                   : 'Vise 36 de moyenne pour aborder l’examen sereinement.') + '</div>' +
        '</div>';
    }

    var html =
      UI.topbar('Examen blanc', 'Les conditions du jour J, sans la pression', false) +
      '<div class="stack g20">' +

        '<section class="card stack g14 rise">' +
          '<div class="stack g10">' +
            rule('40 questions', 'Tirées de tous les thèmes, comme à l’examen officiel.') +
            rule('20 secondes par question', 'Le chrono ne s’arrête pas. Pas de retour en arrière.') +
            rule('35 bonnes réponses pour valider', '5 erreurs autorisées, pas une de plus.') +
            rule('Correction à la fin', 'Aucun indice pendant l’épreuve, comme le jour J.') +
          '</div>' +
          '<button class="btn primary block" data-start>Lancer l’examen blanc</button>' +
        '</section>' +

        readiness +

        (ex.length ? '<div class="kpi rise" style="animation-delay:120ms">' +
          '<div><div class="n num">' + ex.length + '</div><div class="l">Passés</div></div>' +
          '<div><div class="n num">' + passed + '</div><div class="l">Validés</div></div>' +
          '<div><div class="n num">' + best + '</div><div class="l">Meilleur</div></div>' +
        '</div>' : '') +

        '<div class="card stack g4 rise" style="animation-delay:180ms">' +
          '<div class="sec-t" style="margin-bottom:6px">Historique</div>' + history + '</div>' +

        '<div style="height:8px"></div>' +
      '</div>';

    UI.mount(html);
    UI.on('[data-start]', 'click', function () {
      Quiz.start({ mode: 'exam', questions: Store.examSet() });
    });
  }

  function rule(t, s) {
    return '<div class="row top g10">' +
      '<span style="color:var(--accent);display:flex;margin-top:1px">' + Icons.svg('valide', 15) + '</span>' +
      '<div class="grow"><div style="font-weight:500;font-size:14px">' + UI.esc(t) + '</div>' +
      '<div class="tiny dim" style="margin-top:2px">' + UI.esc(s) + '</div></div></div>';
  }

  /* Lancement direct depuis l'accueil */
  function intro() { App.go('exam'); }

  return { view: view, intro: intro };
})();


/* ============================================================
   Sprint 60 secondes - la séance express quand il reste 2 minutes
   ============================================================ */
window.Sprint = (function () {

  function intro() {
    var html =
      UI.topbar('Sprint 60 secondes', 'Pour les jours où il n’y a pas le temps') +
      '<div class="stack g20">' +
        '<section class="card stack g14 rise">' +
          '<h2>Une minute, un maximum de bonnes réponses</h2>' +
          '<p class="small muted">Uniquement des questions à réponse unique. Le chrono tourne en continu : ' +
          'on répond à l’instinct, et la correction s’affiche immédiatement. ' +
          'Idéal pour entretenir les réflexes sans y passer la soirée.</p>' +
          '<div class="row between card quiet">' +
            '<div class="stack g4"><div class="sec-t">Ton record</div>' +
            '<div style="font-weight:500;font-size:20px" class="num">' + Store.s.sprintBest + '</div></div>' +
            '<div class="tiny dim" style="text-align:right;max-width:50%">bonnes réponses<br>en une minute</div>' +
          '</div>' +
          '<button class="btn primary block" data-go>Lancer le sprint</button>' +
        '</section>' +
      '</div>';
    UI.mount(html);
    UI.on('[data-back]', 'click', function () { App.go('home'); });
    UI.on('[data-go]', 'click', launch);
  }

  function launch() {
    var pool = Store.sprintSet().filter(function (q) { return q.a.length === 1; });
    Quiz.start({ mode: 'sprint', questions: pool });
  }

  return { intro: intro, launch: launch };
})();


/* ============================================================
   Survie - trois vies, aucune limite de questions
   ============================================================ */
window.Survie = (function () {

  function intro() {
    var best = Store.s.survivalBest;
    var html =
      UI.topbar('Survie', 'Trois erreurs et la partie s’arrête') +
      '<div class="stack g20">' +
        '<section class="card stack g14 rise">' +
          '<div class="row g6" style="color:var(--ko)">' +
            Icons.svg('survie', 26) + Icons.svg('survie', 26) + Icons.svg('survieContour', 26) + '</div>' +
          '<h2>Jusqu’où peux-tu aller ?</h2>' +
          '<p class="small muted">Les questions s’enchaînent sans fin, 15 secondes chacune. ' +
          'Chaque erreur coûte une vie. Les bonnes réponses consécutives font monter un multiplicateur : ' +
          '3 d’affilée passent en ×2, 6 d’affilée en ×3.</p>' +
          '<div class="row between card quiet">' +
            '<div class="stack g4"><div class="sec-t">Record</div>' +
            '<div style="font-weight:500;font-size:22px" class="num">' + best + '</div></div>' +
            '<div class="tiny dim" style="text-align:right;max-width:52%">bonnes réponses<br>avant la 3<sup>e</sup> erreur</div>' +
          '</div>' +
          '<button class="btn primary block" data-go>Lancer une partie</button>' +
        '</section>' +
        '<p class="tiny dim center rise" style="padding:0 14px;animation-delay:80ms">Le mode survie compte comme une révision : ' +
        'les questions ratées reviennent dans le défi du jour.</p>' +
      '</div>';
    UI.mount(html);
    UI.on('[data-back]', 'click', function () { App.go('home'); });
    UI.on('[data-go]', 'click', launch);
  }

  function launch() {
    Quiz.start({ mode: 'survie', questions: Store.survivalSet() });
  }

  return { intro: intro, launch: launch };
})();
