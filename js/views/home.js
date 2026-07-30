/* ============================================================
   Accueil - la porte d'entrée quotidienne
   ============================================================ */
window.Home = (function () {

  /* Une pastille « n étoiles » : plus lisible qu'une médaille de
     couleur, et compatible avec l'accent unique de l'application. */
  function etoiles(n, valeur) {
    var s = '';
    for (var i = 0; i < n; i++) s += Icons.svg('etoile', 12);
    return '<span class="pill">' + s + ' <span class="num">' + valeur + '</span></span>';
  }

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
        (d.done ? Icons.svg('valide', 14) : (d.count > 0 ? '<span class="num" style="font-size:10px">' + d.count + '</span>' : '')) +
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

    /* --- l'étape en cours du parcours : la réponse à « je fais quoi
           maintenant ? », qui est la vraie question du débutant --- */
    var j = Store.journey();
    var jPct = Math.round((j.etape.cur / j.etape.goal) * 100);
    var parcoursBlock =
      '<section class="card stack g12">' +
        '<div class="row between">' +
          '<div class="sec-t">Étape ' + (j.i + 1) + ' sur ' + j.etapes.length + '</div>' +
          '<div class="tiny dim num">' + j.etape.cur + ' / ' + j.etape.goal + '</div>' +
        '</div>' +
        '<div class="stack g4">' +
          '<div style="font-weight:800;font-size:16px;letter-spacing:-.02em">' +
            UI.esc(j.fini ? 'Prête pour le jour J' : j.etape.n) + '</div>' +
          '<div class="small muted">' + UI.esc(j.fini
            ? 'Tous les thèmes sont étoilés. Continue à entretenir, et passe l’examen sereinement.'
            : j.etape.d) + '</div>' +
        '</div>' +
        '<div class="steps" aria-hidden="true">' +
          j.etapes.map(function (e, i) {
            return '<i class="' + (i < j.i || j.fini ? 'done' : i === j.i ? 'now' : '') + '"></i>';
          }).join('') +
        '</div>' +
        '<div class="gauge thin"><i style="--pct:' + (jPct / 100) + '"></i></div>' +
        (j.fini ? '' : '<button class="btn sm ghost" data-etape="' + j.etape.action + '">' +
          UI.esc(j.etape.cta) + '</button>') +
      '</section>';

    /* --- coffre du jour : la petite récompense qui fait terminer
           la série au lieu de s'arrêter à la moitié --- */
    var chestBlock = Store.chestReady()
      ? '<button class="card accent chest row between" data-chest>' +
          '<div class="row g12">' +
            '<span class="chest-ico">' + Icons.svg('coffre', 25) + '</span>' +
            '<span class="stack g4" style="text-align:left">' +
              '<span style="font-weight:800;font-size:15.5px;letter-spacing:-.02em">Coffre du jour</span>' +
              '<span class="tiny dim">Objectif atteint, il est à toi</span>' +
            '</span>' +
          '</div>' +
          '<span class="dim">' + Icons.svg('suivant', 14) + '</span>' +
        '</button>'
      : '';

    /* --- avancement de la collection d'étoiles --- */
    var med = Store.medalCount();
    var nTh = window.THEMES.length;
    var medalBlock =
      '<button class="card stack g10" data-go="train" style="width:100%;text-align:left">' +
        '<div class="row between"><div class="sec-t">Collection d’étoiles</div>' +
        '<div class="tiny dim num">' + (med.bronze + med.argent + med.or) + ' / ' + nTh + '</div></div>' +
        '<div class="row wrap g8">' +
          etoiles(1, med.bronze) + etoiles(2, med.argent) + etoiles(3, med.or) +
          '<span class="pill">' + Icons.svg('defiReussi', 14) +
            ' <span class="num">' + med.boss + '</span></span>' +
        '</div>' +
        '<div class="tiny dim">' +
          (med.or === nTh ? 'Les seize thèmes sont maîtrisés. Il ne reste plus qu’à passer l’examen.'
                          : 'Chaque thème rapporte jusqu’à trois étoiles, selon les questions vraiment ancrées.') +
        '</div>' +
      '</button>';

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
              '<i style="--pct:' + (p / 100) + '"></i></div></div>' +
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
        '<button class="back" data-go="settings" aria-label="Réglages">' +
          Icons.svg('reglages', 19) + '</button>' +
      '</header>' +

      '<div class="stack g16">' +

        /* Bloc d'accueil : salutation, série, semaine */
        '<section class="hero stack g16">' +
          '<div class="row between top">' +
            '<div class="grow">' +
              '<div class="hero-greet">' + greeting() + (name ? ', ' + UI.esc(name) : '') + '</div>' +
              '<div class="hero-h">' + UI.esc(line(streak, doneToday, goal)) + '</div>' +
            '</div>' +
            '<div class="streak">' + Icons.svg('serie', 17) +
            '<span class="n num">' + streak + '</span></div>' +
          '</div>' +
          '<div class="week">' + week + '</div>' +
        '</section>' +

        countdown +
        parcoursBlock +

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

        chestBlock +

        /* Accès rapides */
        '<div class="tiles">' +
          '<button class="tile" data-exam>' +
            '<span class="ico">' + Icons.svg('examen', 22) + '</span>' +
            '<div><div class="n">Examen blanc</div><div class="s">40 questions, 20 s chacune</div></div>' +
          '</button>' +
          '<button class="tile" data-survie>' +
            '<span class="ico">' + Icons.svg('survieContour', 22) + '</span>' +
            '<div><div class="n">Survie</div><div class="s">' +
              (S.survivalBest ? 'Record : ' + S.survivalBest : 'Trois vies, sans limite') + '</div></div>' +
          '</button>' +
          '<button class="tile" data-errors' + (errors ? '' : ' disabled') + '>' +
            (errors ? '<span class="count num">' + errors + '</span>' : '') +
            '<span class="ico">' + Icons.svg('erreurs', 22) + '</span>' +
            '<div><div class="n">Mes erreurs</div><div class="s">' +
              (errors ? 'Rattraper ce qui bloque' : 'Rien à rattraper') + '</div></div>' +
          '</button>' +
          '<button class="tile" data-sprint>' +
            '<span class="ico">' + Icons.svg('sprint', 22) + '</span>' +
            '<div><div class="n">Sprint 60 s</div><div class="s">Le maximum en une minute</div></div>' +
          '</button>' +
        '</div>' +

        medalBlock +

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
    UI.on('[data-etape]', 'click', function () {
      var a = this.getAttribute('data-etape');
      if (a === 'daily') Quiz.start({ mode: 'daily', questions: Store.dailySet(Math.min(goal, 20)) });
      else App.go(a);
    });
    UI.on('[data-sprint]', 'click', function () { Sprint.intro(); });
    UI.on('[data-survie]', 'click', function () { Survie.intro(); });
    UI.on('[data-chest]', 'click', function () {
      var bonus = Store.openChest();
      if (!bonus) return;
      this.classList.add('opened');
      this.querySelector('.chest-ico').innerHTML = Icons.svg('etoile', 25);
      UI.confetti();
      UI.toast('Coffre ouvert : ' + bonus + ' XP', 'coffre', true);
      UI.celebrate(Store.checkBadges());
      setTimeout(function () { Home.view(); }, 1400);
    });
    UI.on('[data-theme]', 'click', function () {
      Quiz.start({ mode: 'train', theme: this.getAttribute('data-theme'),
                   questions: Store.trainSet(this.getAttribute('data-theme'), 15) });
    });
    UI.on('[data-go]', 'click', function () { App.go(this.getAttribute('data-go')); });
  }

  return { view: view };
})();
