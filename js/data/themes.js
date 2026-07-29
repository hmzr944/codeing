/* Thèmes de révision, inspirés du découpage officiel de l'ETG et
   réorganisés en blocs courts pour des sessions de 5 minutes.

   Note design : les thèmes ne portent volontairement PAS de couleur
   propre. L'app tient sur un seul accent (le jaune signalétique) ;
   le vert et le rouge sont réservés au sens "juste / faux".

   Le champ i renvoie à une icône de js/icons.js (Phosphor). */
window.THEMES = [
  { k:'signalisation', i:'signalisation', n:'Signalisation',               d:'Panneaux, feux, marquages au sol' },
  { k:'priorites', i:'priorites',     n:'Priorités & intersections',   d:'Qui passe en premier, giratoires, stop' },
  { k:'vitesse', i:'vitesse',       n:'Vitesses & distances',        d:'Limitations, distances d’arrêt' },
  { k:'manoeuvres', i:'manoeuvres',    n:'Dépassement & manœuvres',     d:'Croiser, dépasser, s’insérer, tourner' },
  { k:'autoroute', i:'autoroute',     n:'Autoroute & voies rapides',   d:'Insertion, BAU, règles spécifiques' },
  { k:'stationnement', i:'stationnement', n:'Arrêt & stationnement',       d:'Où, comment, quelles interdictions' },
  { k:'conducteur', i:'conducteur',    n:'Le conducteur',               d:'Alcool, fatigue, vigilance, santé' },
  { k:'usagers', i:'usagers',       n:'Les autres usagers',          d:'Piétons, deux-roues, poids lourds' },
  { k:'vehicule', i:'vehicule',      n:'Véhicule & équipements',      d:'Mécanique, pneus, feux, chargement' },
  { k:'technologie', i:'technologie',   n:'Aides à la conduite',         d:'ADAS, électrique, écrans' },
  { k:'conditions', i:'conditions',    n:'Conditions difficiles',       d:'Nuit, pluie, brouillard, tunnel' },
  { k:'secours', i:'secours',       n:'Premiers secours',            d:'Protéger, alerter, secourir' },
  { k:'environnement', i:'environnement', n:'Éco-conduite',                d:'Consommation, pollution, ZFE' },
  { k:'admin', i:'admin',         n:'Papiers & réglementation',    d:'Assurance, carte grise, contrôle technique' },
  { k:'sanctions', i:'sanctions',     n:'Infractions & sanctions',     d:'Barèmes, contrôles, permis à points' },
  { k:'trajet', i:'trajet',        n:'Préparer son trajet',         d:'Chargement, longs trajets, étranger' }
];

window.themeByKey = function (k) {
  for (var i = 0; i < window.THEMES.length; i++) if (window.THEMES[i].k === k) return window.THEMES[i];
  return { k: k, i: 'question', n: k, d: '' };
};

/* Répartition d'un examen blanc, calée sur le poids réel de chaque
   thème à l'épreuve officielle. Le total fait exactement 40. */
window.EXAM_QUOTA = {
  signalisation: 6, priorites: 4, vitesse: 4, manoeuvres: 3,
  autoroute: 3, stationnement: 2, conducteur: 3, usagers: 3,
  vehicule: 3, technologie: 2, conditions: 2, secours: 1,
  environnement: 1, admin: 1, sanctions: 1, trajet: 1
};
