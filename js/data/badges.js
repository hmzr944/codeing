/* ============================================================
   Succès - chaque badge se débloque tout seul, sans annonce
   préalable, pour garder l'effet de surprise.
   ============================================================ */
window.BADGES = [
  {k:'start',    e:'🚗', n:'Contact !',          d:'Première session terminée',      t:function(s){return s.sessions>=1;}},
  {k:'d3',       e:'🔥', n:'Trois jours',         d:'3 jours d’affilée',              t:function(s){return s.bestStreak>=3;}},
  {k:'d7',       e:'🔥', n:'Une semaine',         d:'7 jours d’affilée',              t:function(s){return s.bestStreak>=7;}},
  {k:'d14',      e:'⚡', n:'Quinzaine',           d:'14 jours d’affilée',             t:function(s){return s.bestStreak>=14;}},
  {k:'d30',      e:'👑', n:'Un mois plein',       d:'30 jours d’affilée',             t:function(s){return s.bestStreak>=30;}},
  {k:'q100',     e:'📚', n:'Cent questions',      d:'100 questions répondues',        t:function(s){return s.answered>=100;}},
  {k:'q500',     e:'📖', n:'Cinq cents',          d:'500 questions répondues',        t:function(s){return s.answered>=500;}},
  {k:'q1000',    e:'🎓', n:'Millénaire',          d:'1000 questions répondues',       t:function(s){return s.answered>=1000;}},
  {k:'exam1',    e:'✅', n:'Premier examen validé',d:'Un examen blanc à 35/40 ou plus',t:function(s){return s.examsPassed>=1;}},
  {k:'exam3',    e:'🏅', n:'Régularité',          d:'3 examens blancs validés',        t:function(s){return s.examsPassed>=3;}},
  {k:'exam3row', e:'🏆', n:'Trois d’affilée',     d:'3 examens blancs validés à la suite', t:function(s){return s.examStreak>=3;}},
  {k:'perfect',  e:'💯', n:'Sans faute',          d:'40/40 à un examen blanc',        t:function(s){return s.examBest>=40;}},
  {k:'daily',    e:'🌟', n:'Défi parfait',        d:'Un défi du jour sans erreur',    t:function(s){return s.dailyPerfect;}},
  {k:'sprint',   e:'🏎️', n:'Sprinteur',           d:'15 bonnes réponses en sprint',   t:function(s){return s.sprintBest>=15;}},
  {k:'memo',     e:'🧠', n:'Mémoire longue',      d:'50 questions ancrées durablement',t:function(s){return s.mastered>=50;}},
  {k:'clean',    e:'🧹', n:'Carnet vide',         d:'Plus aucune erreur en attente',  t:function(s){return s.answered>=60 && s.pendingErrors===0;}},
  {k:'sig',      e:'🚸', n:'Œil de lynx',         d:'90 % en signalisation',          t:function(s){return s.themeAcc('signalisation')>=0.9 && s.themeSeen('signalisation')>=25;}},
  {k:'sec',      e:'🚑', n:'Sang-froid',          d:'90 % en premiers secours',       t:function(s){return s.themeAcc('secours')>=0.9 && s.themeSeen('secours')>=12;}},
  {k:'allthemes',e:'🗺️', n:'Tour complet',        d:'Tous les thèmes travaillés',     t:function(s){return s.themesTouched>=window.THEMES.length;}},
  /* --- collection de médailles --- */
  {k:'med1',     e:'🥉', n:'Première médaille',    d:'Un thème médaillé',              t:function(s){return s.medals.bronze+s.medals.argent+s.medals.or>=1;}},
  {k:'med8',     e:'🥈', n:'Collectionneuse',      d:'8 thèmes médaillés',             t:function(s){return s.medals.bronze+s.medals.argent+s.medals.or>=8;}},
  {k:'medall',   e:'🥇', n:'Tout en or',           d:'Tous les thèmes en or',          t:function(s){return s.medals.or>=window.THEMES.length;}},
  {k:'boss5',    e:'⭐', n:'Chasseuse de défis',    d:'5 défis de thème remportés',     t:function(s){return s.medals.boss>=5;}},
  {k:'bossall',  e:'🌟', n:'Seize sur seize',      d:'Tous les défis de thème',        t:function(s){return s.medals.boss>=window.THEMES.length;}},
  /* --- modes de jeu --- */
  {k:'surv20',   e:'♥️', n:'Survivante',           d:'20 bonnes réponses en survie',   t:function(s){return s.survivalBest>=20;}},
  {k:'surv40',   e:'💗', n:'Increvable',           d:'40 bonnes réponses en survie',   t:function(s){return s.survivalBest>=40;}},
  {k:'combo6',   e:'🔥', n:'En feu',               d:'6 bonnes réponses d’affilée',    t:function(s){return s.comboBest>=6;}},
  {k:'combo20',  e:'⛓️', n:'Sans faille',          d:'20 bonnes réponses d’affilée',   t:function(s){return s.comboBest>=20;}},
  {k:'fiches',   e:'📘', n:'Bûcheuse',            d:'Toutes les fiches consultées',   t:function(s){return s.lessonsRead>=window.LESSONS.length;}},
  {k:'night',    e:'🌙', n:'Nocturne',            d:'Une session après 22 h',         t:function(s){return s.night;}},
  {k:'morning',  e:'🌅', n:'Lève-tôt',            d:'Une session avant 8 h',          t:function(s){return s.morning;}},
  {k:'ready',    e:'🎯', n:'Prête pour le jour J',d:'3 examens blancs à 38/40 ou plus',t:function(s){return s.examsElite>=3;}}
];

/* Paliers de niveau : XP cumulée */
window.LEVELS = [
  {x:0,     n:'Au bord de la route'},
  {x:150,   n:'Ceinture bouclée'},
  {x:400,   n:'Premier démarrage'},
  {x:800,   n:'Clignotant réflexe'},
  {x:1400,  n:'Boss du rond-point'},
  {x:2200,  n:'Radar à panneaux'},
  {x:3200,  n:'Cerveau prioritaire'},
  {x:4500,  n:'Machine à 40 questions'},
  {x:6000,  n:'Objectif jour J'},
  {x:8000,  n:'Légende du code'}
];
