/* ============================================================
   Store - tout est gardé en local (localStorage), rien ne part
   sur un serveur. Aucun compte, aucune donnée personnelle.
   ============================================================ */
window.Store = (function () {

  var KEY = 'feuvert.v1';

  /* --- banque de questions consolidée --- */
  var ALL = []
    .concat(window.Q_SIGNALISATION || [])
    .concat(window.Q_CIRCULATION   || [])
    .concat(window.Q_CONDUCTEUR    || [])
    .concat(window.Q_VEHICULE      || [])
    .concat(window.Q_USAGERS       || [])
    .concat(window.Q_SECOURS       || []);

  var BY_ID = {};
  for (var i = 0; i < ALL.length; i++) BY_ID[ALL[i].id] = ALL[i];

  /* --- état par défaut --- */
  function blank() {
    return {
      v: 1,
      profile: { name: '', examDate: '', goal: 20, reminder: '', theme: 'auto' },
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
      flags: { night: false, morning: false, onboarded: false }
    };
  }

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
    var quota = {
      signalisation: 7, priorites: 5, vitesse: 4, manoeuvres: 4,
      autoroute: 3, stationnement: 3, conducteur: 4, usagers: 3,
      vehicule: 3, conditions: 2, secours: 1, environnement: 1
    };
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

  /* ---------------- enregistrement des réponses ---------------- */

  function answer(q, correct) {
    S.cards[q.id] = SRS.grade(S.cards[q.id], correct);

    var t = S.themes[q.t] || (S.themes[q.t] = { seen: 0, ok: 0 });
    t.seen++; if (correct) t.ok++;

    var d = SRS.today();
    S.days[d] = (S.days[d] || 0) + 1;
    if (S.daily.d !== d) S.daily = { d: d, done: 0, perfect: false };
    S.daily.done++;

    S.xp += correct ? 10 : 2;

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
    if (meta.mode === 'daily' && meta.score === meta.total && meta.total > 0) S.daily.perfect = true;

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
    all: ALL, byId: BY_ID, byTheme: byTheme, shuffle: shuffle,
    save: save, saveNow: saveNow, reset: reset,
    due: due, unseen: unseen, weakOnes: weakOnes,
    dailySet: dailySet, examSet: examSet, trainSet: trainSet, sprintSet: sprintSet,
    answer: answer, endSession: endSession,
    snapshot: snapshot, level: level, week: week, weakThemes: weakThemes,
    liveStreak: liveStreak, goalReached: goalReached, daysToExam: daysToExam,
    checkBadges: checkBadges
  };
})();
