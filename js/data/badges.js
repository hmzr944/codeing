/* ============================================================
   Succès - chaque badge se débloque tout seul, sans annonce
   préalable, pour garder l'effet de surprise.
   ============================================================ */
window.BADGES = [
  {k:'start',    i:'cle', n:'Contact !',          d:'Première session terminée',      t:function(s){return s.sessions>=1;}},
  {k:'d3',       i:'serie', n:'Trois jours',         d:'3 jours d’affilée',              t:function(s){return s.bestStreak>=3;}},
  {k:'d7',       i:'serie', n:'Une semaine',         d:'7 jours d’affilée',              t:function(s){return s.bestStreak>=7;}},
  {k:'d14',      i:'sprint', n:'Quinzaine',           d:'14 jours d’affilée',             t:function(s){return s.bestStreak>=14;}},
  {k:'d30',      i:'couronne', n:'Un mois plein',       d:'30 jours d’affilée',             t:function(s){return s.bestStreak>=30;}},
  {k:'q100',     i:'livre', n:'Cent questions',      d:'100 questions répondues',        t:function(s){return s.answered>=100;}},
  {k:'q500',     i:'livre', n:'Cinq cents',          d:'500 questions répondues',        t:function(s){return s.answered>=500;}},
  {k:'q1000',    i:'diplome', n:'Millénaire',          d:'1000 questions répondues',       t:function(s){return s.answered>=1000;}},
  {k:'exam1',    i:'valide', n:'Premier examen validé',d:'Un examen blanc à 35/40 ou plus',t:function(s){return s.examsPassed>=1;}},
  {k:'exam3',    i:'medaille', n:'Régularité',          d:'3 examens blancs validés',        t:function(s){return s.examsPassed>=3;}},
  {k:'exam3row', i:'niveau', n:'Trois d’affilée',     d:'3 examens blancs validés à la suite', t:function(s){return s.examStreak>=3;}},
  {k:'perfect',  i:'cible', n:'Sans faute',          d:'40/40 à un examen blanc',        t:function(s){return s.examBest>=40;}},
  {k:'daily',    i:'etoile', n:'Défi parfait',        d:'Un défi du jour sans erreur',    t:function(s){return s.dailyPerfect;}},
  {k:'sprint',   i:'sprint', n:'Sprinteur',           d:'15 bonnes réponses en sprint',   t:function(s){return s.sprintBest>=15;}},
  {k:'memo',     i:'conducteur', n:'Mémoire longue',      d:'50 questions ancrées durablement',t:function(s){return s.mastered>=50;}},
  {k:'clean',    i:'valide', n:'Carnet vide',         d:'Plus aucune erreur en attente',  t:function(s){return s.answered>=60 && s.pendingErrors===0;}},
  {k:'sig',      i:'vue', n:'Œil de lynx',         d:'90 % en signalisation',          t:function(s){return s.themeAcc('signalisation')>=0.9 && s.themeSeen('signalisation')>=25;}},
  {k:'sec',      i:'secours', n:'Sang-froid',          d:'90 % en premiers secours',       t:function(s){return s.themeAcc('secours')>=0.9 && s.themeSeen('secours')>=12;}},
  {k:'allthemes',i:'parcours', n:'Tour complet',        d:'Tous les thèmes travaillés',     t:function(s){return s.themesTouched>=window.THEMES.length;}},
  /* --- collection de médailles --- */
  {k:'med1',     i:'etoile', n:'Première étoile',      d:'Un thème étoilé',              t:function(s){return s.medals.bronze+s.medals.argent+s.medals.or>=1;}},
  {k:'med8',     i:'medaille', n:'Collectionneuse',      d:'8 thèmes étoilés',             t:function(s){return s.medals.bronze+s.medals.argent+s.medals.or>=8;}},
  {k:'medall',   i:'couronne', n:'Sans faute',           d:'Les 16 thèmes à trois étoiles',          t:function(s){return s.medals.or>=window.THEMES.length;}},
  {k:'boss5',    i:'defiReussi', n:'Chasseuse de défis',    d:'5 défis de thème remportés',     t:function(s){return s.medals.boss>=5;}},
  {k:'bossall',  i:'drapeau', n:'Seize sur seize',      d:'Tous les défis de thème',        t:function(s){return s.medals.boss>=window.THEMES.length;}},
  /* --- modes de jeu --- */
  {k:'surv20',   i:'survie', n:'Survivante',           d:'20 bonnes réponses en survie',   t:function(s){return s.survivalBest>=20;}},
  {k:'surv40',   i:'survie', n:'Increvable',           d:'40 bonnes réponses en survie',   t:function(s){return s.survivalBest>=40;}},
  {k:'combo6',   i:'serie', n:'En feu',               d:'6 bonnes réponses d’affilée',    t:function(s){return s.comboBest>=6;}},
  {k:'combo20',  i:'lien', n:'Sans faille',          d:'20 bonnes réponses d’affilée',   t:function(s){return s.comboBest>=20;}},
  {k:'fiches',   i:'fiches', n:'Bûcheuse',            d:'Toutes les fiches consultées',   t:function(s){return s.lessonsRead>=window.LESSONS.length;}},
  {k:'night',    i:'lune', n:'Nocturne',            d:'Une session après 22 h',         t:function(s){return s.night;}},
  {k:'morning',  i:'soleil', n:'Lève-tôt',            d:'Une session avant 8 h',          t:function(s){return s.morning;}},
  {k:'ready',    i:'drapeau', n:'Prête pour le jour J',d:'3 examens blancs à 38/40 ou plus',t:function(s){return s.examsElite>=3;}}
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
