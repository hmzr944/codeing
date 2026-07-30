/* ============================================================
   Motivation - les mots qui accompagnent, pas ceux qui notent.

   Deux moments : l'arrivée sur l'appli (une fois par session, pas
   à chaque retour à l'accueil) et la fin d'une série de questions.
   Tout tourne autour d'un seul objectif : avoir le code.
   ============================================================ */
window.MOTIVATION = (function () {

  /* Avec prénom : utilisées seulement si un prénom a été renseigné */
  var ARRIVEE_NOM = [
    '{n}, t’es prête à tout arracher aujourd’hui ?',
    'On y retourne, {n} : le code n’a aucune chance.',
    '{n}, la boss est de retour.',
    'Let’s go {n}, encore une série et tu gères encore plus.'
  ];

  var ARRIVEE = [
    'Debout, on va tout arracher aujourd’hui.',
    'Le code de la route ne sait pas à qui il a affaire.',
    'T’es là, c’est déjà la moitié du travail. Vas-y à fond.',
    'On lâche rien : encore une série et t’es encore plus forte.',
    'Aujourd’hui, c’est le jour où tu prends de l’avance.',
    'Chaque question, c’est un point de plus vers le permis. Go.',
    'Cinq minutes, et t’en ressors plus forte qu’avant.',
    'Tu gères. Prouve-le, une question à la fois.',
    'Le code, tu vas l’avoir. Reste juste à le décider aujourd’hui.'
  ];

  function arrivee(name) {
    var pool = name ? ARRIVEE_NOM.concat(ARRIVEE) : ARRIVEE;
    var m = pool[Math.floor(Math.random() * pool.length)];
    return m.replace('{n}', name || '');
  }

  /* Fin de session, par palier. L'examen a ses propres messages :
     c'est le seul moment où « avoir le code » se joue vraiment. */
  var FIN = {
    examReussi: [
      'Bam. Ce score, c’est celui qui décroche le code.',
      'T’as tout arraché. Le code, c’est presque signé.',
      'Ce niveau-là le jour J, et le code est à toi. Direct.'
    ],
    examRate: [
      'Pas encore, mais t’es pas loin. La prochaine, tu l’arraches.',
      'C’est un blanc, pas le vrai. Retente, tu vas gérer.',
      'Il manque quelques points, pas le niveau. On y retourne.'
    ],
    parfait: [
      'Sans faute. T’as juste tout défoncé.',
      'Parfait. À ce rythme, le code, c’est couru d’avance.',
      'Zéro erreur. T’es une machine.'
    ],
    bien: [
      'Solide. Encore deux-trois séries comme ça et t’as le code.',
      'Tu gères clairement. Continue sur cette lancée.',
      'Ce niveau-là, c’est exactement celui qui mène au code.'
    ],
    moyen: [
      'C’est bon, tu progresses. Une série de plus et tu montes encore.',
      'La base est là. Encore un peu et tu vas tout arracher.',
      'Chaque série compte. Celle-ci t’a fait avancer, point.'
    ],
    faible: [
      'Séance utile : ces erreurs, tu les reverras plus.',
      'Pas la meilleure série, et alors ? On rebondit direct.',
      'Ces questions sont repérées. La prochaine fois, tu les as.'
    ]
  };

  function fin(tier) {
    var pool = FIN[tier] || FIN.moyen;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return { arrivee: arrivee, fin: fin };
})();
