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
  { k:'conducteur',    n:'Le conducteur',              e:'🧠', d:'Alcool, fatigue, permis à points' },
  { k:'usagers',       n:'Les autres usagers',         e:'🚴', d:'Piétons, deux-roues, poids lourds' },
  { k:'vehicule',      n:'Véhicule & équipements',     e:'🔧', d:'Mécanique, pneus, feux, chargement' },
  { k:'conditions',    n:'Conditions difficiles',      e:'🌧️', d:'Nuit, pluie, brouillard, tunnel' },
  { k:'secours',       n:'Premiers secours',           e:'🚑', d:'Protéger, alerter, secourir' },
  { k:'environnement', n:'Éco-conduite',               e:'🌱', d:'Consommation, pollution, ZFE' },
  { k:'admin',         n:'Papiers & réglementation',   e:'📄', d:'Assurance, carte grise, contrôle technique' }
];

window.themeByKey = function (k) {
  for (var i = 0; i < window.THEMES.length; i++) if (window.THEMES[i].k === k) return window.THEMES[i];
  return { k: k, n: k, e: '❓', d: '' };
};
