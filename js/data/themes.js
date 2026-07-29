/* Thèmes de révision, inspirés du découpage officiel de l'ETG et
   réorganisés en blocs courts pour des sessions de 5 minutes.

   Note design : les thèmes ne portent volontairement PAS de couleur
   propre. L'app tient sur un seul accent (le jaune signalétique) ;
   le vert et le rouge sont réservés au sens "juste / faux". */
window.THEMES = [
  { k:'signalisation', n:'Signalisation',              e:'🚸', d:'Panneaux, feux, marquages au sol' },
  { k:'priorites',     n:'Priorités & intersections',  e:'🔀', d:'Qui passe en premier, giratoires, stop' },
  { k:'vitesse',       n:'Vitesses & distances',       e:'⚡', d:'Limitations, distances d’arrêt' },
  { k:'manoeuvres',    n:'Dépassement & manœuvres',    e:'↔️', d:'Croiser, dépasser, s’insérer, tourner' },
  { k:'autoroute',     n:'Autoroute & voies rapides',  e:'🛣️', d:'Insertion, BAU, règles spécifiques' },
  { k:'stationnement', n:'Arrêt & stationnement',      e:'🅿️', d:'Où, comment, quelles interdictions' },
  { k:'conducteur',    n:'Le conducteur',              e:'🧠', d:'Alcool, fatigue, vigilance, santé' },
  { k:'usagers',       n:'Les autres usagers',         e:'🚴', d:'Piétons, deux-roues, poids lourds' },
  { k:'vehicule',      n:'Véhicule & équipements',     e:'🔧', d:'Mécanique, pneus, feux, chargement' },
  { k:'technologie',   n:'Aides à la conduite',        e:'🤖', d:'ADAS, électrique, écrans' },
  { k:'conditions',    n:'Conditions difficiles',      e:'🌧️', d:'Nuit, pluie, brouillard, tunnel' },
  { k:'secours',       n:'Premiers secours',           e:'🚑', d:'Protéger, alerter, secourir' },
  { k:'environnement', n:'Éco-conduite',               e:'🌱', d:'Consommation, pollution, ZFE' },
  { k:'admin',         n:'Papiers & réglementation',   e:'📄', d:'Assurance, carte grise, contrôle technique' },
  { k:'sanctions',     n:'Infractions & sanctions',    e:'⚖️', d:'Barèmes, contrôles, permis à points' },
  { k:'trajet',        n:'Préparer son trajet',        e:'🧭', d:'Chargement, longs trajets, étranger' }
];

window.themeByKey = function (k) {
  for (var i = 0; i < window.THEMES.length; i++) if (window.THEMES[i].k === k) return window.THEMES[i];
  return { k: k, n: k, e: '❓', d: '' };
};

/* Répartition d'un examen blanc, calée sur le poids réel de chaque
   thème à l'épreuve officielle. Le total fait exactement 40. */
window.EXAM_QUOTA = {
  signalisation: 6, priorites: 4, vitesse: 4, manoeuvres: 3,
  autoroute: 3, stationnement: 2, conducteur: 3, usagers: 3,
  vehicule: 3, technologie: 2, conditions: 2, secours: 1,
  environnement: 1, admin: 1, sanctions: 1, trajet: 1
};
