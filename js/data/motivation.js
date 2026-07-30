/* ============================================================
   Motivation - les mots qui accompagnent, pas ceux qui notent.

   Deux moments : l'arrivée sur l'appli (une fois par session, pas
   à chaque retour à l'accueil) et la fin d'une série de questions.
   Tout tourne autour d'un seul objectif : avoir le code.
   ============================================================ */
window.MOTIVATION = (function () {

  /* Avec prénom : utilisées seulement si un prénom a été renseigné */
  var ARRIVEE_NOM = [
    'Contente de te revoir {n} : encore quelques questions et le code est à toi.',
    'Prête à grappiller quelques points, {n} ?',
    'La boss du code, c’est toi, {n}.',
    '{n}, la régularité gagne toujours. On y va ?'
  ];

  var ARRIVEE = [
    'Bienvenue. Le code ne se révise pas tout seul, mais toi, tu es là.',
    'On reprend là où tu t’es arrêtée.',
    'Le permis se joue maintenant, une question à la fois.',
    'Chaque série te rapproche du jour J.',
    'La régularité gagne toujours contre la révision de dernière minute.',
    'Encore là, encore motivée : c’est comme ça qu’on l’a, le code.',
    'Cinq minutes aujourd’hui valent une heure la veille de l’examen.',
    'Chaque question vue aujourd’hui est une de moins à réviser demain.',
    'Bienvenue, la boss du code de la route.'
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
      'Avec ce score, le code est pour ainsi dire dans la poche.',
      'C’est exactement ce niveau qu’il faut le jour de l’examen.',
      'Le travail a payé. Le code est à portée.'
    ],
    examRate: [
      'Il manque quelques points, pas la méthode. Le code va suivre.',
      'C’est pour ça qu’il existe, l’examen blanc : mieux vaut rater ici que là-bas.',
      'Chaque examen blanc raté en évite un vrai. Recommence quand tu veux.'
    ],
    parfait: [
      'Sans faute. À ce rythme, le code ne t’échappera pas.',
      'C’est ce niveau-là qu’il faut tenir jusqu’à l’examen.',
      'Ces questions sont acquises. Direction les suivantes.'
    ],
    bien: [
      'Solide. Encore quelques séries comme celle-ci et le code est acquis.',
      'Le niveau est bon. Ne t’arrête pas en si bon chemin.',
      'C’est exactement le rythme qui mène au code.'
    ],
    moyen: [
      'C’est en avançant comme ça qu’on finit par l’avoir, ce code.',
      'La base est là. Les prochaines séries vont solidifier tout ça.',
      'Chaque série compte, même celle-ci.'
    ],
    faible: [
      'Une séance utile : ces erreurs ne reviendront pas par hasard.',
      'Le code se gagne sur la durée, pas sur une seule série.',
      'Ces questions sont repérées. Elles reviendront, et tu les auras.'
    ]
  };

  function fin(tier) {
    var pool = FIN[tier] || FIN.moyen;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return { arrivee: arrivee, fin: fin };
})();
