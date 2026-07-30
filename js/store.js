/* ============================================================
   Store - tout est gardé en local (localStorage), rien ne part
   sur un serveur. Aucun compte, aucune donnée personnelle.
   ============================================================ */
window.Store = (function () {

  var KEY = 'feuvert.v1';

  /* --- banque de questions consolidée --- */
  var ALL = []
    .concat(window.Q_SIGNALISATION  || [])
    .concat(window.Q_CIRCULATION    || [])
    .concat(window.Q_CONDUCTEUR     || [])
    .concat(window.Q_VEHICULE       || [])
    .concat(window.Q_USAGERS        || [])
    .concat(window.Q_SECOURS        || [])
    .concat(window.Q_TECHNOLOGIE    || [])
    .concat(window.Q_SANCTIONS      || [])
    .concat(window.Q_TRAJET         || [])
    .concat(window.Q_PLUS_ROUTE     || [])
    .concat(window.Q_PLUS_PRATIQUE  || []);

  var BY_ID = {};
  for (var i = 0; i < ALL.length; i++) BY_ID[ALL[i].id] = ALL[i];

  /* --- état par défaut --- */
  function blank() {
    return {
      v: 1,
      profile: { name: '', examDate: '', goal: 20, reminder: '', theme: 'jour', son: true },
      xp: 0,
      cards: {},                                  // id -> fiche SRS
      themes: {},                                 // clé thème -> {seen, ok}
      streak: { cur: 0, best: 0, last: '', freezes: 2 },
      days: {},                                   // 'YYYY-MM-DD' -> nb de questions
      daily: { d: '', done: 0, perfect: false },
      history: [],                                // 60 dernières sessions
      exams: [],                                  // examens blancs
      badges: {},
      lessons: {},                                // fiches consultées
      sprintBest: 0,
      sessions: 0,
      /* --- couche jeu --- */
      bosses: {},                                 // thème -> date du défi réussi
      survivalBest: 0,                            // record du mode survie
      comboBest: 0,                               // plus longue série de bonnes réponses
      chest: { d: '', taken: false },             // coffre quotidien
      flags: { night: false, morning: false, onboarded: false }
    };
  }

  /* Le stockage local peut être refusé (navigation privée, page
     isolée, réglages stricts). Mieux vaut le savoir et le dire que
     de laisser une progression disparaître sans explication. */
  var PERSISTANT = (function () {
    try {
      var t = KEY + '.test';
      localStorage.setItem(t, '1');
      localStorage.removeItem(t);
      return true;
    } catch (e) { return false; }
  })();

  var S = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      var d = JSON.parse(raw);
      var base = blank();
      for (var k in base) if (!(k in d)) d[k] = base[k];
      for (var p in base.profile) if (!(p in d.profile)) d.profile[p] = base.profile[p];
      for (var f in base.flags) if (!(f in d.flags)) d.flags[f] = base.flags[f];
      return d;
    } catch (e) { return blank(); }
  }

  var pending = null;
  function save() {
    if (pending) return;
    pending = setTimeout(function () {
      pending = null;
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    }, 120);
  }
  function saveNow() {
    if (pending) { clearTimeout(pending); pending = null; }
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  /* ---------------- sélection de questions ---------------- */

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function byTheme(k) {
    return ALL.filter(function (q) { return q.t === k; });
  }

  /* Questions dont l'échéance de révision est atteinte */
  function due() {
    return ALL.filter(function (q) {
      var c = S.cards[q.id];
      return c && SRS.isDue(c);
    });
  }

  /* Questions jamais vues */
  function unseen() {
    return ALL.filter(function (q) { return !S.cards[q.id]; });
  }

  /* Questions ratées au moins une fois et pas encore ancrées */
  function weakOnes() {
    return ALL.filter(function (q) {
      var c = S.cards[q.id];
      return c && c.ko > 0 && c.b < 5;
    }).sort(function (a, b) {
      return (S.cards[b.id].ko - S.cards[b.id].ok) - (S.cards[a.id].ko - S.cards[a.id].ok);
    });
  }

  /* Le défi du jour : un mélange qui a du sens pédagogiquement.
     Priorité aux révisions dues, puis aux erreurs passées, puis à
     la découverte. C'est ce mélange qui fait progresser vite. */
  function dailySet(n) {
    n = n || S.profile.goal || 20;
    var picked = [], used = {};
    function push(list, max) {
      list = shuffle(list);
      for (var i = 0; i < list.length && max > 0; i++) {
        if (used[list[i].id]) continue;
        used[list[i].id] = 1; picked.push(list[i]); max--;
      }
    }
    push(due(), Math.ceil(n * 0.45));
    push(weakOnes(), Math.ceil(n * 0.25));
    push(unseen(), n - picked.length);
    if (picked.length < n) push(ALL, n - picked.length);
    return shuffle(picked).slice(0, n);
  }

  /* Examen blanc : 40 questions réparties comme à l'examen, en
     évitant de tirer deux fois la même. */
  function examSet() {
    var quota = {}, src = window.EXAM_QUOTA;
    for (var q in src) quota[q] = src[q];
    var out = [], used = {};
    for (var k in quota) {
      var pool = shuffle(byTheme(k));
      for (var i = 0; i < pool.length && quota[k] > 0; i++) {
        if (used[pool[i].id]) continue;
        used[pool[i].id] = 1; out.push(pool[i]); quota[k]--;
      }
    }
    var rest = shuffle(ALL.filter(function (q) { return !used[q.id]; }));
    while (out.length < 40 && rest.length) out.push(rest.pop());
    return shuffle(out).slice(0, 40);
  }

  function trainSet(themeKey, n) {
    var pool = themeKey === 'all' ? ALL : byTheme(themeKey);
    // les questions faibles ou dues remontent en tête du paquet
    var scored = pool.map(function (q) {
      var c = S.cards[q.id];
      var s = Math.random();
      if (!c) s += 1.2;
      else {
        if (SRS.isDue(c)) s += 1.6;
        if (c.ko > c.ok) s += 1.0;
        s += (6 - c.b) * 0.15;
      }
      return { q: q, s: s };
    }).sort(function (a, b) { return b.s - a.s; });
    return scored.slice(0, n || 20).map(function (x) { return x.q; })
      .sort(function () { return Math.random() - 0.5; });
  }

  function sprintSet() { return shuffle(ALL).slice(0, 60); }

  /* Mode survie : un paquet long, mêlé, pour ne jamais tomber à court */
  function survivalSet() { return shuffle(ALL); }

  /* Défi du thème : 10 questions tirées dans tout le thème.
     C'est une épreuve de maîtrise, donc le tirage est purement
     aléatoire : pas de faveur aux questions déjà connues. */
  function bossSet(k) { return shuffle(byTheme(k)).slice(0, 10); }

  /* ---------------- maîtrise par thème ---------------- */

  /* Une question compte comme maîtrisée à partir de la boîte 4 :
     elle a été réussie plusieurs fois, à plusieurs jours d'écart. */
  function themeStat(k) {
    var qs = byTheme(k), seen = 0, mastered = 0;
    for (var i = 0; i < qs.length; i++) {
      var c = S.cards[qs[i].id];
      if (c) { seen++; if (c.b >= 4) mastered++; }
    }
    var t = S.themes[k] || { seen: 0, ok: 0 };
    var mast = qs.length ? mastered / qs.length : 0;
    return {
      k: k, total: qs.length, seen: seen, mastered: mastered,
      cov: qs.length ? seen / qs.length : 0,
      mast: mast,
      acc: t.seen ? t.ok / t.seen : 0,
      answered: t.seen,
      boss: !!S.bosses[k],
      medal: mast >= 0.9 ? 3 : mast >= 0.7 ? 2 : mast >= 0.4 ? 1 : 0
    };
  }

  function allThemeStats() {
    return window.THEMES.map(function (t) { return themeStat(t.k); });
  }

  /* Nombre d'étoiles obtenues, tous thèmes confondus */
  function medalCount() {
    var n = { bronze: 0, argent: 0, or: 0, boss: 0 };
    allThemeStats().forEach(function (s) {
      if (s.medal === 1) n.bronze++;
      if (s.medal === 2) n.argent++;
      if (s.medal === 3) n.or++;
      if (s.boss) n.boss++;
    });
    return n;
  }

  function clearBoss(k) {
    if (!S.bosses[k]) { S.bosses[k] = SRS.today(); S.xp += 80; saveNow(); return true; }
    return false;
  }

  /* ---------------- coffre quotidien ---------------- */

  /* Disponible une fois par jour, une fois l'objectif atteint.
     Petite récompense variable : c'est ce qui donne envie de finir
     la série plutôt que de s'arrêter à la moitié. */
  function chestReady() {
    var d = SRS.today();
    if (S.chest.d !== d) { S.chest = { d: d, taken: false }; }
    return goalReached(d) && !S.chest.taken;
  }

  function openChest() {
    if (!chestReady()) return 0;
    var bonus = 20 + Math.floor(Math.random() * 5) * 10;   // 20 à 60 XP
    if (liveStreak() >= 7) bonus += 20;                    // série longue récompensée
    S.chest.taken = true;
    S.xp += bonus;
    saveNow();
    return bonus;
  }

  /* ---------------- enregistrement des réponses ---------------- */

  function answer(q, correct, mult) {
    S.cards[q.id] = SRS.grade(S.cards[q.id], correct);

    var t = S.themes[q.t] || (S.themes[q.t] = { seen: 0, ok: 0 });
    t.seen++; if (correct) t.ok++;

    var d = SRS.today();
    S.days[d] = (S.days[d] || 0) + 1;
    if (S.daily.d !== d) S.daily = { d: d, done: 0, perfect: false };
    S.daily.done++;

    // le multiplicateur de combo ne s'applique qu'aux bonnes réponses
    S.xp += correct ? 10 * (mult || 1) : 2;

    var h = new Date().getHours();
    if (h >= 22 || h < 5) S.flags.night = true;
    if (h >= 5 && h < 8) S.flags.morning = true;

    save();
  }

  /* Fin de session : streak, historique, succès */
  function endSession(meta) {
    var d = SRS.today();
    S.sessions++;

    S.history.unshift({
      d: d, mode: meta.mode, score: meta.score, total: meta.total,
      theme: meta.theme || '', at: Date.now()
    });
    if (S.history.length > 60) S.history.length = 60;

    if (meta.mode === 'exam') {
      S.exams.unshift({ d: d, score: meta.score, total: meta.total, ok: meta.score >= 35 });
      if (S.exams.length > 30) S.exams.length = 30;
      S.xp += meta.score >= 35 ? 120 : 40;
    }
    if (meta.mode === 'sprint' && meta.score > S.sprintBest) S.sprintBest = meta.score;
    if (meta.mode === 'survie' && meta.score > S.survivalBest) S.survivalBest = meta.score;
    if (meta.mode === 'daily' && meta.score === meta.total && meta.total > 0) S.daily.perfect = true;
    if (meta.combo && meta.combo > S.comboBest) S.comboBest = meta.combo;
    if (meta.mode === 'boss' && meta.score >= 9 && meta.theme) clearBoss(meta.theme);

    touchStreak();
    var won = checkBadges();
    saveNow();
    return won;
  }

  /* ---------------- série de jours ---------------- */

  function goalReached(day) {
    return (S.days[day] || 0) >= (S.profile.goal || 20);
  }

  function touchStreak() {
    var d = SRS.today();
    if (!goalReached(d)) return;              // l'objectif du jour n'est pas atteint
    if (S.streak.last === d) return;          // déjà compté aujourd'hui

    var gap = S.streak.last ? SRS.daysBetween(S.streak.last, d) : 999;
    if (gap === 1) S.streak.cur++;
    else if (gap === 2 && S.streak.freezes > 0) {
      // un jour sauté : on consomme un joker plutôt que de tout casser
      S.streak.freezes--; S.streak.cur++;
    } else S.streak.cur = 1;

    S.streak.last = d;
    if (S.streak.cur > S.streak.best) S.streak.best = S.streak.cur;
    // un joker regagné toutes les 10 journées tenues, plafonné à 2
    if (S.streak.cur % 10 === 0 && S.streak.freezes < 2) S.streak.freezes++;
  }

  /* La série est-elle encore vivante aujourd'hui ? */
  function liveStreak() {
    if (!S.streak.last) return 0;
    var gap = SRS.daysBetween(S.streak.last, SRS.today());
    if (gap <= 1) return S.streak.cur;
    if (gap === 2 && S.streak.freezes > 0) return S.streak.cur;
    return 0;
  }

  /* ---------------- statistiques ---------------- */

  function snapshot() {
    var answered = 0, correct = 0, mastered = 0, pendingErrors = 0, themesTouched = 0;
    for (var id in S.cards) {
      var c = S.cards[id];
      answered += c.seen; correct += c.ok;
      if (SRS.isMastered(c)) mastered++;
      if (c.ko > 0 && c.b < 4) pendingErrors++;
    }
    for (var t in S.themes) if (S.themes[t].seen > 0) themesTouched++;

    var examsPassed = 0, examBest = 0, examsElite = 0, examStreak = 0, run = 0;
    for (var i = 0; i < S.exams.length; i++) {
      var e = S.exams[i];
      if (e.ok) examsPassed++;
      if (e.score > examBest) examBest = e.score;
      if (e.score >= 38) examsElite++;
    }
    for (var j = 0; j < S.exams.length; j++) {           // examens récents consécutifs réussis
      if (S.exams[j].ok) { run++; if (run > examStreak) examStreak = run; } else run = 0;
    }

    var lessonsRead = 0;
    for (var l in S.lessons) if (S.lessons[l]) lessonsRead++;

    return {
      answered: answered, correct: correct, mastered: mastered,
      pendingErrors: pendingErrors, themesTouched: themesTouched,
      sessions: S.sessions, bestStreak: S.streak.best, streak: liveStreak(),
      examsPassed: examsPassed, examBest: examBest, examsElite: examsElite, examStreak: examStreak,
      dailyPerfect: !!S.daily.perfect, sprintBest: S.sprintBest, lessonsRead: lessonsRead,
      survivalBest: S.survivalBest, comboBest: S.comboBest,
      medals: medalCount(),
      night: S.flags.night, morning: S.flags.morning,
      themeAcc: function (k) { var t = S.themes[k]; return t && t.seen ? t.ok / t.seen : 0; },
      themeSeen: function (k) { var t = S.themes[k]; return t ? t.seen : 0; }
    };
  }

  function checkBadges() {
    var s = snapshot(), won = [];
    for (var i = 0; i < window.BADGES.length; i++) {
      var b = window.BADGES[i];
      if (!S.badges[b.k]) {
        var ok = false;
        try { ok = b.t(s); } catch (e) { ok = false; }
        if (ok) { S.badges[b.k] = Date.now(); won.push(b); }
      }
    }
    return won;
  }

  function level() {
    var L = window.LEVELS, idx = 0;
    for (var i = 0; i < L.length; i++) if (S.xp >= L[i].x) idx = i;
    var next = L[idx + 1];
    return {
      n: idx + 1, name: L[idx].n,
      from: L[idx].x, to: next ? next.x : L[idx].x,
      pct: next ? Math.round(((S.xp - L[idx].x) / (next.x - L[idx].x)) * 100) : 100,
      max: !next
    };
  }

  /* ---------------- parcours d'apprentissage ----------------
     Six étapes, dans l'ordre où on progresse vraiment : découvrir,
     comprendre, ancrer, se tester, viser le seuil, être prête.
     L'accueil n'affiche que l'étape en cours : savoir quoi faire
     maintenant vaut mieux qu'une liste de tout ce qui reste. */

  function journey() {
    var s = snapshot(), m = medalCount();
    var fiches = 0;
    for (var l in S.lessons) if (S.lessons[l]) fiches++;
    var medailles = m.bronze + m.argent + m.or;
    var nbThemes = window.THEMES.length;

    var etapes = [
      { k: 'decouvrir', n: 'Faire connaissance',
        d: 'Voir 100 questions, sans pression sur le score',
        cur: Math.min(s.answered, 100), goal: 100, action: 'daily', cta: 'Lancer le défi du jour' },
      { k: 'comprendre', n: 'Comprendre les bases',
        d: 'Lire 5 fiches de cours',
        cur: Math.min(fiches, 5), goal: 5, action: 'lessons', cta: 'Ouvrir les fiches' },
      { k: 'ancrer', n: 'Ancrer les thèmes',
        d: 'Décrocher 4 étoiles',
        cur: Math.min(medailles, 4), goal: 4, action: 'train', cta: 'Voir le parcours' },
      { k: 'tester', n: 'Se tester en vrai',
        d: 'Passer un premier examen blanc',
        cur: Math.min(S.exams.length, 1), goal: 1, action: 'exam', cta: 'Passer un examen blanc' },
      { k: 'viser', n: 'Viser les 35 sur 40',
        d: 'Valider 3 examens blancs',
        cur: Math.min(s.examsPassed, 3), goal: 3, action: 'exam', cta: 'Refaire un examen blanc' },
      { k: 'prete', n: 'Prête pour le jour J',
        d: 'Au moins une étoile sur chacun des ' + nbThemes + ' thèmes',
        cur: medailles, goal: nbThemes, action: 'train', cta: 'Compléter la collection' }
    ];

    var courante = etapes.length - 1;
    for (var i = 0; i < etapes.length; i++) {
      if (etapes[i].cur < etapes[i].goal) { courante = i; break; }
    }
    return { etapes: etapes, i: courante, etape: etapes[courante],
             fini: etapes[etapes.length - 1].cur >= etapes[etapes.length - 1].goal };
  }

  /* Jours restants avant l'examen, si une date a été renseignée */
  function daysToExam() {
    if (!S.profile.examDate) return null;
    return SRS.daysBetween(SRS.today(), S.profile.examDate);
  }

  /* Les 7 derniers jours, du plus ancien au plus récent */
  function week() {
    // Ma / Me pour ne pas confondre mardi et mercredi
    var out = [], names = ['D', 'L', 'Ma', 'Me', 'J', 'V', 'S'];
    for (var i = 6; i >= 0; i--) {
      var iso = SRS.addDays(SRS.today(), -i);
      var dt = new Date(+iso.split('-')[0], +iso.split('-')[1] - 1, +iso.split('-')[2]);
      out.push({
        iso: iso, label: names[dt.getDay()],
        count: S.days[iso] || 0, done: goalReached(iso), today: i === 0
      });
    }
    return out;
  }

  /* Thèmes les plus fragiles (au moins 4 questions vues) */
  function weakThemes(n) {
    var out = [];
    for (var i = 0; i < window.THEMES.length; i++) {
      var k = window.THEMES[i].k, t = S.themes[k];
      if (t && t.seen >= 4) out.push({ k: k, acc: t.ok / t.seen, seen: t.seen });
    }
    out.sort(function (a, b) { return a.acc - b.acc; });
    return out.slice(0, n || 3);
  }

  function reset() { S = blank(); saveNow(); }

  return {
    get s() { return S; },
    persistant: PERSISTANT,
    all: ALL, byId: BY_ID, byTheme: byTheme, shuffle: shuffle,
    save: save, saveNow: saveNow, reset: reset,
    due: due, unseen: unseen, weakOnes: weakOnes,
    dailySet: dailySet, examSet: examSet, trainSet: trainSet, sprintSet: sprintSet,
    survivalSet: survivalSet, bossSet: bossSet,
    themeStat: themeStat, allThemeStats: allThemeStats, medalCount: medalCount,
    chestReady: chestReady, openChest: openChest,
    answer: answer, endSession: endSession,
    snapshot: snapshot, level: level, week: week, weakThemes: weakThemes, journey: journey,
    liveStreak: liveStreak, goalReached: goalReached, daysToExam: daysToExam,
    checkBadges: checkBadges
  };
})();
