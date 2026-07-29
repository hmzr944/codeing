/* ============================================================
   Accueil - la porte d'entrée quotidienne
   ============================================================ */
window.Home = (function () {

  function greeting() {
    var h = new Date().getHours();
    if (h < 6)  return 'Il est tard';
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  /* Le message change chaque jour pour que l'accueil ne devienne
     jamais un décor qu'on ne lit plus. */
  function line(streak, doneToday, goal) {
    if (doneToday >= goal) {
      var done = [
        'Objectif du jour atteint.',
        'C’est fait pour aujourd’hui.',
        'Journée validée. Le reste est du bonus.'
      ];
      return done[new Date().getDate() % done.length];
    }
    if (streak >= 7) return 'Série de ' + streak + ' jours. On ne la casse pas aujourd’hui.';
    if (streak >= 3) return 'Trois jours tenus. Le plus dur est passé.';
    if (streak === 0) return 'Cinq minutes suffisent pour relancer la série.';
    return 'On enchaîne sur la lancée d’hier.';
  }

  function view() {
    var S = Store.s;
    var streak = Store.liveStreak();
    var goal = S.profile.goal || 20;
    var doneToday = S.days[SRS.today()] || 0;
    var pct = Math.min(100, Math.round((doneToday / goal) * 100));
    var errors = Store.weakOnes().length;
    var dueN = Store.due().length;
    var toExam = Store.daysToExam();
    var name = S.profile.name;

    /* --- bandeau semaine --- */
    var week = Store.week().map(function (d) {
      return '<div class="d"><div class="dot' + (d.done ? ' done' : '') + (d.today ? ' today' : '') + '">' +
        (d.done ? '✓' : (d.count > 0 ? '<span class="num" style="font-size:10px">' + d.count + '</span>' : '')) +
        '</div>' + d.label + '</div>';
    }).join('');

    /* --- compte à rebours examen --- */
    var countdown = '';
    if (toExam !== null && toExam >= 0) {
      var perDay = toExam > 0 ? Math.ceil((Store.all.length - Store.snapshot().mastered) / Math.max(toExam, 1)) : 0;
      countdown =
        '<div class="card accent row between">' +
          '<div class="stack g4"><div class="sec-t">Jour J</div>' +
          '<div style="font-weight:800;font-size:16px;letter-spacing:-.02em">' +
            (toExam === 0 ? 'C’est aujourd’hui' : UI.plural(toExam, 'jour') + ' avant l’examen') + '</div></div>' +
          (toExam > 0 ? '<div class="tiny dim" style="text-align:right;max-width:44%">Rythme conseillé<br><b class="num" style="color:var(--txt)">' +
            Math.min(perDay, 60) + ' questions par jour</b></div>' : '') +
        '</div>';
    }

    /* --- thèmes fragiles --- */
    var weak = Store.weakThemes(3);
    var weakBlock = '';
    if (weak.length) {
      weakBlock =
        '<div class="card stack g12">' +
          '<div class="row between"><div class="sec-t">À consolider</div>' +
          '<button class="tiny dim" data-go="train" style="font-weight:700">Tout voir ›</button></div>' +
          weak.map(function (w) {
            var p = Math.round(w.acc * 100);
            return '<button class="bar" data-theme="' + w.k + '" style="width:100%">' +
              '<div class="l">' + UI.esc(window.themeByKey(w.k).n) + '</div>' +
              '<div class="grow"><div class="gauge thin ' + (p < 50 ? 'ko' : p >= 80 ? 'ok' : '') + '">' +
              '<i style="width:' + p + '%"></i></div></div>' +
              '<div class="v num">' + p + ' %</div></button>';
          }).join('') +
        '</div>';
    }

    var missionDone = doneToday >= goal;

    var html =
      '<header class="topbar">' +
        '<div class="brand grow"><div class="brand-mark" aria-hidden="true">FV</div>' +
        '<div><div class="brand-name">Feu Vert</div>' +
        '<div class="brand-sub">Code de la route 2026</div></div></div>' +
        '<button class="back" data-go="settings" aria-label="Réglages">⚙</button>' +
      '</header>' +

      '<div class="stack g16">' +

        /* Bloc d'accueil : salutation, série, semaine */
        '<section class="hero stack g16">' +
          '<div class="row between top">' +
            '<div class="grow">' +
              '<div class="hero-greet">' + greeting() + (name ? ', ' + UI.esc(name) : '') + '</div>' +
              '<div class="hero-h">' + UI.esc(line(streak, doneToday, goal)) + '</div>' +
            '</div>' +
            '<div class="streak"><span aria-hidden="true">🔥</span>' +
            '<span class="n num">' + streak + '</span></div>' +
          '</div>' +
          '<div class="week">' + week + '</div>' +
        '</section>' +

        countdown +

        /* Mission du jour */
        '<section class="card ' + (missionDone ? '' : 'accent') + ' stack g14">' +
          '<div class="mission">' +
            '<div class="ring" style="--p:' + pct + '"><span class="num">' + pct + '%</span></div>' +
            '<div class="grow stack g4">' +
              '<div style="font-weight:800;font-size:16px;letter-spacing:-.02em">' +
                (missionDone ? 'Objectif atteint' : 'Défi du jour') + '</div>' +
              '<div class="small muted">' + doneToday + ' question' + (doneToday > 1 ? 's' : '') +
              ' sur ' + goal + (dueN ? ' · ' + dueN + ' à réviser' : '') + '</div>' +
            '</div>' +
          '</div>' +
          '<button class="btn ' + (missionDone ? 'ghost' : 'primary') + ' block" data-daily>' +
            (missionDone ? 'Continuer quand même' : (doneToday > 0 ? 'Reprendre le défi' : 'Commencer, 5 minutes')) +
          '</button>' +
        '</section>' +

        /* Accès rapides */
        '<div class="tiles">' +
          '<button class="tile" data-exam>' +
            '<span class="ico" aria-hidden="true">⏱️</span>' +
            '<div><div class="n">Examen blanc</div><div class="s">40 questions, 20 s chacune</div></div>' +
          '</button>' +
          '<button class="tile" data-errors' + (errors ? '' : ' disabled') + '>' +
            (errors ? '<span class="count num">' + errors + '</span>' : '') +
            '<span class="ico" aria-hidden="true">🩹</span>' +
            '<div><div class="n">Mes erreurs</div><div class="s">' +
              (errors ? 'Rattraper ce qui bloque' : 'Rien à rattraper') + '</div></div>' +
          '</button>' +
          '<button class="tile" data-go="train">' +
            '<span class="ico" aria-hidden="true">🎯</span>' +
            '<div><div class="n">Par thème</div><div class="s">Choisir ce qu’on travaille</div></div>' +
          '</button>' +
          '<button class="tile" data-sprint>' +
            '<span class="ico" aria-hidden="true">🏎️</span>' +
            '<div><div class="n">Sprint 60 s</div><div class="s">Le maximum en une minute</div></div>' +
          '</button>' +
        '</div>' +

        weakBlock +

        '<div style="height:8px"></div>' +
      '</div>';

    UI.mount(html);

    UI.on('[data-daily]', 'click', function () {
      Quiz.start({ mode: 'daily', questions: Store.dailySet(Math.min(goal, 20)) });
    });
    UI.on('[data-exam]', 'click', function () {
      Exam.intro();
    });
    UI.on('[data-errors]', 'click', function () {
      var list = Store.weakOnes().slice(0, 15);
      if (!list.length) return;
      Quiz.start({ mode: 'errors', questions: list });
    });
    UI.on('[data-sprint]', 'click', function () { Sprint.intro(); });
    UI.on('[data-theme]', 'click', function () {
      Quiz.start({ mode: 'train', theme: this.getAttribute('data-theme'),
                   questions: Store.trainSet(this.getAttribute('data-theme'), 15) });
    });
    UI.on('[data-go]', 'click', function () { App.go(this.getAttribute('data-go')); });
  }

  return { view: view };
})();
