/* ============================================================
   Schémas - dessins explicatifs des notions qui ne se retiennent
   pas par du texte : distances, priorités, angles morts.

   Tout est vectoriel et sans dépendance. Les couleurs viennent des
   variables du thème, donc les schémas suivent le mode nuit ou jour.
   ============================================================ */
window.Diagrams = (function () {

  function svg(vb, inner, label) {
    return '<svg class="dg" viewBox="' + vb + '" role="img" aria-label="' +
      String(label).replace(/"/g, '&quot;') + '">' + inner + '</svg>';
  }

  var T = function (x, y, txt, cls, taille, ancre) {
    return '<text x="' + x + '" y="' + y + '" class="' + (cls || 'dg-t') + '" ' +
      'font-size="' + (taille || 11) + '" text-anchor="' + (ancre || 'middle') + '">' + txt + '</text>';
  };

  /* Vue de dessus, orientable. Sur un plan d'intersection c'est le
     bon point de vue, et des rectangles se pivotent sans se
     déformer, contrairement au profil. Pare-brise ET lunette arrière,
     plus les rétroviseurs qui dépassent de la carrosserie : sans eux
     un rectangle ne se distingue pas d'un carton. */
  function voitureDessus(cx, cy, l, rot, cls) {
    var w = l * 0.46, mw = l * 0.07, mh = w * 0.2;
    return '<g class="' + (cls || 'dg-veh') + '" transform="translate(' + cx + ',' + cy +
      ') rotate(' + (rot || 0) + ')">' +
      '<rect x="' + (-l / 2) + '" y="' + (-w / 2) + '" width="' + l + '" height="' + w +
      '" rx="' + (w * 0.3).toFixed(1) + '"/>' +
      '<rect x="' + (l * 0.16) + '" y="' + (-w / 2 - mh) + '" width="' + mw + '" height="' + mh + '" rx="1.2"/>' +
      '<rect x="' + (l * 0.16) + '" y="' + (w / 2) + '" width="' + mw + '" height="' + mh + '" rx="1.2"/>' +
      '<rect class="dg-vitre" x="' + (l * 0.06) + '" y="' + (-w * 0.30) + '" width="' +
      (l * 0.24) + '" height="' + (w * 0.60) + '" rx="2"/>' +
      '<rect class="dg-vitre" x="' + (-l * 0.40) + '" y="' + (-w * 0.26) + '" width="' +
      (l * 0.16) + '" height="' + (w * 0.52) + '" rx="2"/></g>';
  }

  /* Petite voiture vue de côté, réutilisée partout : même silhouette
     détaillée que la voiture de couverture des leçons (deux vitres
     séparées, jantes creusées) plutôt qu'un simple galet plein, mais
     paramétrée en x/y/largeur pour se poser telle quelle sur une
     route de schéma. */
  function voiture(x, y, l, cls) {
    var k = l / 100;
    return '<g class="' + (cls || 'dg-veh') + '" transform="translate(' + x + ',' +
      (y + 0.13 * l).toFixed(2) + ') scale(' + k.toFixed(4) + ')">' +
      '<path d="M3 26 Q3 20 10 18.5 L30 17 L42 6.5 L64 6 L76 17 L90 18.5 Q96 19.5 96 26 ' +
        'L96 29 L85 29 A7.5 7.5 0 0 0 70 29 L37 29 A7.5 7.5 0 0 0 22 29 L3 29 Z"/>' +
      '<path class="dg-vitre" d="M33 17 L43.5 8 L52 8 L52 17 Z"/>' +
      '<path class="dg-vitre" d="M56 8 L63 8 L72.5 17 L56 17 Z"/>' +
      '<path class="dg-cote" d="M54 18 L54 28"/>' +
      '<path class="dg-cote" d="M58 22 h6"/>' +
      '<rect class="dg-vitre" x="3.5" y="20" width="6" height="4" rx="1.5"/>' +
      '<circle cx="29.5" cy="27" r="7"/><circle cx="77.5" cy="27" r="7"/>' +
      '<circle class="dg-vitre" cx="29.5" cy="27" r="2.8"/>' +
      '<circle class="dg-vitre" cx="77.5" cy="27" r="2.8"/></g>';
  }

  /* Un membre : capsule pleine reliant deux points, utilisée pour
     construire une silhouette humaine articulée (PLS) sans dépendre
     d'un contour à main levée. */
  function membre(x1, y1, x2, y2, w, cls) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    var ang = Math.atan2(dy, dx) * 180 / Math.PI;
    return '<rect class="' + (cls || 'dg-veh') + '" x="0" y="' + (-w / 2).toFixed(1) +
      '" width="' + len.toFixed(1) + '" height="' + w + '" rx="' + (w / 2).toFixed(1) +
      '" transform="translate(' + x1.toFixed(1) + ',' + y1.toFixed(1) + ') rotate(' + ang.toFixed(2) + ')"/>';
  }

  var D = {

    /* ---- La distance d'arrêt se décompose en deux ---- */
    'distance-arret': function () {
      return svg('0 0 300 120',
        T(150, 14, 'À 90 km/h sur route sèche', 'dg-titre', 12) +
        '<rect x="10" y="30" width="83" height="22" rx="4" class="dg-neutre"/>' +
        '<rect x="93" y="30" width="187" height="22" rx="4" class="dg-accent-f"/>' +
        T(51, 45, '25 m', 'dg-sur', 11) + T(186, 45, '56 m', 'dg-sur-acc', 11) +
        T(51, 68, 'réaction', 'dg-lg', 10) + T(186, 68, 'freinage', 'dg-lg', 10) +
        T(51, 80, '1 seconde', 'dg-lg2', 9) + T(186, 80, 'pédale enfoncée', 'dg-lg2', 9) +
        '<path d="M10 96 H280" class="dg-cote"/>' +
        '<path d="M10 92 V100 M280 92 V100" class="dg-cote"/>' +
        T(145, 112, '81 mètres pour s’arrêter', 'dg-titre', 12),
        'La distance d’arrêt est la somme de la distance de réaction et de la distance de freinage');
    },

    /* ---- La règle des deux secondes ---- */
    'deux-secondes': function () {
      return svg('0 0 300 110',
        '<rect x="0" y="34" width="300" height="46" class="dg-route"/>' +
        '<path d="M0 57 H300" class="dg-bande"/>' +
        voiture(20, 40, 52) + voiture(200, 40, 52) +
        '<path d="M80 96 H196" class="dg-cote"/>' +
        '<path d="M80 92 V100 M196 92 V100" class="dg-cote"/>' +
        T(138, 92, '2 secondes', 'dg-titre', 12) +
        T(150, 22, 'Je compte « mille-un, mille-deux »', 'dg-lg', 11),
        'Deux secondes d’écart entre deux véhicules');
    },

    /* ---- Priorité à droite ---- */
    'priorite-droite': function () {
      return svg('0 0 220 190',
        '<rect x="78" y="0" width="64" height="190" class="dg-route"/>' +
        '<rect x="0" y="70" width="220" height="60" class="dg-route"/>' +
        voitureDessus(110, 158, 42, -90) +
        voitureDessus(180, 100, 44, 180, 'dg-veh-acc') +
        '<path d="M150 100 H128" class="dg-fleche-c"/>' +
        '<path d="M132 94 l-11 6 11 6 z" class="dg-fleche-p"/>' +
        T(110, 186, 'moi', 'dg-lg', 10) +
        T(180, 74, 'lui', 'dg-lg-acc', 10) +
        '<g class="dg-stop"><circle cx="66" cy="146" r="12"/>' +
        '<path d="M60 146 H72" class="dg-stop-barre"/></g>' +
        T(110, 22, 'Il arrive à ma droite : il passe avant moi', 'dg-titre', 11),
        'Sans panneau, le véhicule venant de droite est prioritaire');
    },

    /* ---- Entrée dans un giratoire ---- */
    'giratoire': function () {
      return svg('0 0 220 190',
        '<circle cx="110" cy="95" r="62" class="dg-route-c"/>' +
        '<circle cx="110" cy="95" r="26" class="dg-ilot"/>' +
        '<rect x="94" y="157" width="32" height="33" class="dg-route"/>' +
        '<rect x="94" y="0" width="32" height="33" class="dg-route"/>' +
        '<rect x="0" y="79" width="48" height="32" class="dg-route"/>' +
        '<rect x="172" y="79" width="48" height="32" class="dg-route"/>' +
        '<path d="M110 40 A55 55 0 0 1 158 118" class="dg-fleche-c"/>' +
        '<path d="M152 108 l12 12 -17 4 z" class="dg-fleche-p"/>' +
        voitureDessus(110, 174, 34, -90, 'dg-veh-acc') +
        '<g class="dg-stop"><circle cx="72" cy="174" r="11"/>' +
        '<path d="M66 174 H78" class="dg-stop-barre"/></g>' +
        T(166, 178, 'j’attends', 'dg-lg-acc', 10) +
        T(110, 92, 'ils passent', 'dg-lg', 9) +
        T(110, 104, 'd’abord', 'dg-lg', 9),
        'Les véhicules déjà engagés dans l’anneau passent en premier');
    },

    /* ---- Angles morts d'un poids lourd ---- */
    'angle-mort': function () {
      return svg('0 0 300 150',
        '<path d="M60 20 L60 130 L18 118 L18 32 Z" class="dg-danger-z"/>' +
        '<path d="M240 26 L292 8 L292 142 L240 124 Z" class="dg-danger-z"/>' +
        '<path d="M62 130 L240 130 L240 148 L62 148 Z" class="dg-danger-z"/>' +
        '<rect x="62" y="30" width="70" height="62" rx="5" class="dg-veh"/>' +
        '<rect x="136" y="18" width="104" height="86" rx="4" class="dg-veh"/>' +
        '<rect x="66" y="36" width="20" height="50" rx="3" class="dg-vitre"/>' +
        /* Les rétroviseurs, justement ceux qu'on ne voit pas depuis
           la zone d'angle mort : les dessiner rend le titre du schéma
           concret plutôt qu'une simple formule. */
        '<rect x="100" y="21" width="10" height="10" rx="2" class="dg-veh"/>' +
        '<rect x="100" y="91" width="10" height="10" rx="2" class="dg-veh"/>' +
        '<rect x="140" y="59" width="96" height="4" rx="2" class="dg-accent-f" opacity=".85"/>' +
        '<circle cx="86" cy="100" r="9" class="dg-veh"/>' +
        '<circle cx="200" cy="112" r="9" class="dg-veh"/>' +
        T(34, 78, 'angle', 'dg-lg-ko', 9) + T(34, 89, 'mort', 'dg-lg-ko', 9) +
        T(268, 78, 'angle', 'dg-lg-ko', 9) + T(268, 89, 'mort', 'dg-lg-ko', 9) +
        T(150, 143, 'angle mort', 'dg-lg-ko', 9) +
        T(150, 12, 'Si je ne vois pas ses rétroviseurs, il ne me voit pas', 'dg-titre', 11),
        'Les zones où le chauffeur d’un poids lourd ne voit rien');
    },

    /* ---- Écart pour dépasser un cycliste ---- */
    'depassement-cycliste': function () {
      return svg('0 0 300 130',
        '<rect x="0" y="26" width="300" height="80" class="dg-route"/>' +
        '<path d="M0 66 H300" class="dg-bande"/>' +
        /* Les deux roues étaient posées avec fill="none" et sans
           contour : invisibles, faute d'une seule propriété capable
           de les peindre. Des roues pleines avec un moyeu clair,
           comme sur les voitures, se voient et restent cohérentes. */
        '<circle cx="52" cy="88" r="7" class="dg-veh"/>' +
        '<circle cx="76" cy="88" r="7" class="dg-veh"/>' +
        '<circle cx="52" cy="88" r="3" class="dg-vitre"/>' +
        '<circle cx="76" cy="88" r="3" class="dg-vitre"/>' +
        '<path d="M52 88 L64 76 L76 88 M64 76 L68 66 M59 82 L73 82" class="dg-cote" fill="none" stroke-width="2.2"/>' +
        '<circle cx="70" cy="60" r="4.5" class="dg-veh"/>' +
        voiture(168, 34, 58, 'dg-veh-acc') +
        '<path d="M80 58 H166" class="dg-cote"/>' +
        '<path d="M80 52 V64 M166 52 V64" class="dg-cote"/>' +
        T(123, 48, '1,50 m', 'dg-titre', 12) +
        T(150, 18, 'Hors agglomération', 'dg-lg', 11) +
        T(150, 122, 'En ville : 1 mètre suffit', 'dg-lg', 10),
        'Écart minimal pour dépasser un cycliste');
    },

    /* ---- Panne sur autoroute ---- */
    'panne-autoroute': function () {
      return svg('0 0 300 140',
        '<rect x="0" y="20" width="300" height="62" class="dg-route"/>' +
        '<rect x="0" y="82" width="300" height="26" class="dg-bau"/>' +
        '<path d="M0 51 H300" class="dg-bande"/>' +
        '<path d="M0 82 H300" class="dg-continue"/>' +
        '<path d="M0 116 H300" class="dg-glissiere"/>' +
        '<path d="M40 112 V124 M120 112 V124 M200 112 V124 M280 112 V124" class="dg-glissiere"/>' +
        voiture(100, 86, 46) +
        '<g class="dg-accent-f">' + Icons.raw('p_pieton', 26, 216, 128) + '</g>' +
        T(150, 14, 'Je sors par la droite et je passe la glissière', 'dg-titre', 11) +
        T(15, 99, 'BAU', 'dg-lg', 9, 'start') +
        T(258, 134, 'à l’abri', 'dg-lg-acc', 10),
        'En panne sur autoroute, on se met à l’abri derrière la glissière');
    },

    /* ---- Vitesses selon la route ---- */
    'vitesses': function () {
      var lignes = [['Agglomération', '50'], ['Route à double sens', '80'],
        ['Chaussées séparées', '110'], ['Autoroute', '130']];
      var s = '';
      lignes.forEach(function (l, i) {
        var y = 26 + i * 30;
        s += '<rect x="8" y="' + y + '" width="200" height="22" rx="4" class="dg-neutre"/>' +
          T(16, y + 15, l[0], 'dg-sur', 11, 'start') +
          '<rect x="216" y="' + y + '" width="72" height="22" rx="4" class="dg-accent-f"/>' +
          T(252, y + 15, l[1] + ' km/h', 'dg-sur-acc', 11);
      });
      return svg('0 0 300 152', T(150, 14, 'Par temps sec, sans panneau contraire', 'dg-titre', 11) + s,
        'Vitesses maximales selon le type de route');
    },

    /* ---- Position latérale de sécurité ---- */
    'pls': function () {
      /* Une vraie silhouette articulée plutôt que l'icône piétonne
         générique pivotée : la jambe repliée devant et la tête
         basculée sont justement les deux détails que cette leçon
         demande de repérer, ils doivent donc se voir clairement. */
      var epaule = [132, 74], hanche = [192, 82], tete = [118, 63],
        main = [104, 56], genou = [218, 57], pied = [233, 93], talon = [248, 90];
      return svg('0 0 300 120',
        '<path d="M20 100 H280" class="dg-sol"/>' +
        membre(hanche[0], hanche[1], talon[0], talon[1], 15) +
        membre(epaule[0], epaule[1], hanche[0], hanche[1], 22) +
        membre(hanche[0], hanche[1], genou[0], genou[1], 15) +
        membre(genou[0], genou[1], pied[0], pied[1], 13) +
        '<circle cx="' + genou[0] + '" cy="' + genou[1] + '" r="7.5" class="dg-veh"/>' +
        '<circle cx="' + hanche[0] + '" cy="' + hanche[1] + '" r="10" class="dg-veh"/>' +
        membre(epaule[0], epaule[1], main[0], main[1], 10) +
        '<circle cx="' + epaule[0] + '" cy="' + epaule[1] + '" r="10" class="dg-veh"/>' +
        '<circle cx="' + main[0] + '" cy="' + main[1] + '" r="6" class="dg-veh"/>' +
        '<circle cx="' + tete[0] + '" cy="' + tete[1] + '" r="13" class="dg-veh"/>' +
        '<path d="M92 44 q16 6 24 16" class="dg-fleche-c"/>' +
        '<path d="M110 54 l8 12 3-14 z" class="dg-fleche-p"/>' +
        T(150, 20, 'Inconsciente mais elle respire : sur le côté', 'dg-titre', 11) +
        T(74, 38, 'tête basculée', 'dg-lg-acc', 10) +
        T(214, 112, 'jambe repliée devant', 'dg-lg', 10),
        'Position latérale de sécurité');
    },

    /* ---- Ce que disent les feux ---- */
    'feux': function () {
      var f = [['#ff2d20', 'Rouge', 'Je m’arrête'],
               ['#ffb100', 'Jaune', 'Je m’arrête si je peux'],
               ['#22d36a', 'Vert', 'Je passe si c’est dégagé']];
      var s = '';
      f.forEach(function (x, i) {
        var y = 18 + i * 38;
        s += '<circle cx="30" cy="' + (y + 12) + '" r="13" fill="' + x[0] + '"/>' +
          T(56, y + 10, x[1], 'dg-sur', 12, 'start') +
          T(56, y + 24, x[2], 'dg-lg', 10, 'start');
      });
      return svg('0 0 300 132', s, 'Signification des trois feux');
    },

    /* ---- Stationnement en pente ---- */
    'pente': function () {
      return svg('0 0 300 120',
        '<path d="M10 90 L290 40" class="dg-sol"/>' +
        '<g transform="rotate(-10 110 60)">' + voiture(80, 48, 60) + '</g>' +
        '<path d="M150 96 h60" class="dg-trottoir"/>' +
        /* Une flèche vers la roue avant plutôt qu'un pavé posé
           dessus : la voiture est assez détaillée maintenant pour
           que masquer la roue soit dommage, et une flèche fait le
           même travail sans rien cacher. */
        '<path d="M120 98 Q126 82 129 74" class="dg-fleche-c"/>' +
        '<path d="M123 80 l7 -3 -1.5 9 z" class="dg-fleche-p"/>' +
        T(150, 16, 'En descente, je braque vers le trottoir', 'dg-titre', 11) +
        T(128, 110, 'roues tournées', 'dg-lg-acc', 10),
        'Roues braquées vers le trottoir en stationnement en pente');
    },

    /* ---- Rien n'accélère la baisse de l'alcoolémie ---- */
    'alcool-temps': function () {
      var faux = ['Le café', 'La douche froide', 'Le sport'];
      var s = T(150, 16, 'Rien n’accélère la baisse de l’alcool dans le sang', 'dg-titre', 11);
      faux.forEach(function (m, i) {
        var y = 42 + i * 28;
        s += '<circle cx="26" cy="' + y + '" r="12" class="dg-neg"/>' +
          '<line x1="18" y1="' + (y - 8) + '" x2="34" y2="' + (y + 8) + '" class="dg-neg"/>' +
          T(48, y + 4, m, 'dg-lg', 11.5, 'start');
      });
      var y2 = 42 + 3 * 28 + 8;
      s += '<path d="M14 ' + (y2 - 4) + ' l8 8 16-16" class="dg-check"/>' +
        T(48, y2 + 4, 'Seul le temps : 0,10 à 0,15 g/L par heure', 'dg-lg-acc', 11.5, 'start');
      return svg('0 0 300 ' + (y2 + 24), s,
        'Rien n’accélère l’élimination de l’alcool dans le sang, seul le temps qui passe compte');
    },

    /* ---- Le champ de vision se referme avec la vitesse ---- */
    'champ-visuel': function () {
      return svg('0 0 300 150',
        T(150, 14, 'Le champ de vision se referme avec la vitesse', 'dg-titre', 11) +
        '<path d="M150 138 L34 40 L266 40 Z" class="dg-neutre" opacity=".55"/>' +
        '<path d="M150 138 L118 40 L182 40 Z" class="dg-accent-f" opacity=".85"/>' +
        T(70, 58, '100°', 'dg-lg', 12) + T(70, 72, 'à l’arrêt', 'dg-lg', 9) +
        T(150, 58, '30°', 'dg-sur-acc', 12) + T(150, 72, 'vitesse élevée', 'dg-lg-acc', 9) +
        '<circle cx="150" cy="138" r="7" class="dg-veh"/>',
        'Le champ de vision passe d’environ 100 degrés à l’arrêt à moins de 30 degrés à vitesse élevée');
    },

    /* ---- Portée des feux ---- */
    'portee-feux': function () {
      var lignes = [['Feux de croisement', '30'], ['Feux de route', '100']];
      var s = T(150, 14, 'Distance éclairée par les feux', 'dg-titre', 11);
      lignes.forEach(function (l, i) {
        var y = 32 + i * 44;
        s += '<rect x="8" y="' + y + '" width="200" height="24" rx="4" class="dg-neutre"/>' +
          T(18, y + 16, l[0], 'dg-sur', 11.5, 'start') +
          '<rect x="220" y="' + y + '" width="72" height="24" rx="4" class="dg-accent-f"/>' +
          T(256, y + 16, l[1] + ' m', 'dg-sur-acc', 12);
      });
      return svg('0 0 300 130', s,
        'Les feux de croisement portent à 30 mètres, les feux de route à 100 mètres');
    },

    /* ---- Usure des pneus ---- */
    'usure-pneu': function () {
      return svg('0 0 300 150',
        T(150, 14, 'Profondeur des rainures : neuf contre limite légale', 'dg-titre', 11) +
        '<rect x="70" y="30" width="46" height="90" rx="4" class="dg-neutre"/>' +
        '<rect x="70" y="30" width="46" height="90" rx="4" class="dg-accent-f"/>' +
        '<rect x="184" y="30" width="46" height="90" rx="4" class="dg-neutre"/>' +
        '<rect x="184" y="102" width="46" height="18" rx="3" class="dg-accent-f"/>' +
        T(93, 22, 'Pneu neuf', 'dg-lg', 10) +
        T(207, 22, 'Pneu à la limite', 'dg-lg-ko', 10) +
        T(93, 134, '≈ 8 mm', 'dg-sur', 11) +
        T(207, 134, '1,6 mm', 'dg-lg-ko', 11),
        'La profondeur minimale légale des rainures est de 1,6 millimètre, contre environ 8 mm au neuf');
    },

    /* ---- Ce que surveille une voiture récente ---- */
    'aides-conduite': function () {
      return svg('0 0 300 190',
        T(150, 10, 'Ce que surveille une voiture récente', 'dg-titre', 11) +
        voitureDessus(150, 100, 70, -90) +
        '<path d="M150 58 V28" class="dg-cote"/>' +
        T(150, 24, 'ISA + freinage d’urgence', 'dg-lg-acc', 9.5) +
        '<path d="M114 100 H36" class="dg-cote"/>' +
        T(36, 92, 'Maintien', 'dg-lg', 9.5, 'start') + T(36, 104, 'de voie', 'dg-lg', 9.5, 'start') +
        '<path d="M186 100 H264" class="dg-cote"/>' +
        T(264, 92, 'Alerte de', 'dg-lg', 9.5, 'start') + T(264, 104, 'somnolence', 'dg-lg', 9.5, 'start') +
        '<path d="M150 142 V172" class="dg-cote"/>' +
        T(150, 184, 'Aide au recul + eCall', 'dg-lg-acc', 9.5),
        'Un aperçu des aides à la conduite à l’avant, sur les côtés et à l’arrière');
    },

    /* ---- Ce qui peut arriver au permis ---- */
    'parcours-sanction': function () {
      var etapes = [
        ['Infraction', ''], ['Rétention', '72 h'],
        ['Décision', 'du préfet'], ['Suspension', 'ou annulation']
      ];
      var s = T(150, 14, 'Ce qui peut arriver au permis', 'dg-titre', 11);
      var w = 66, gap = 8, x = 4, y = 34;
      etapes.forEach(function (e, i) {
        var dernier = i === etapes.length - 1;
        s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="46" rx="6" class="' +
          (dernier ? 'dg-accent-f' : 'dg-neutre') + '"/>' +
          T(x + w / 2, y + 20, e[0], dernier ? 'dg-sur-acc' : 'dg-sur', 9.5) +
          T(x + w / 2, y + 34, e[1], dernier ? 'dg-sur-acc' : 'dg-lg', 9.5);
        if (!dernier) {
          s += '<path d="M' + (x + w + 2) + ' ' + (y + 23) + ' H' + (x + w + gap - 2) + '" class="dg-fleche-c"/>' +
            '<path d="M' + (x + w + gap - 6) + ' ' + (y + 18) + ' l6 5 -6 5 z" class="dg-fleche-p"/>';
        }
        x += w + gap;
      });
      return svg('0 0 300 100', s,
        'Rétention du permis, puis décision du préfet, puis suspension ou annulation selon la gravité');
    },

    /* ---- Ce qui augmente la consommation ---- */
    'conso-carburant': function () {
      var lignes = [
        ['130 au lieu de 110 km/h', 20],
        ['Coffre de toit', 15],
        ['Climatisation en ville', 15]
      ];
      var s = T(150, 14, 'Ce qui augmente la consommation', 'dg-titre', 11);
      lignes.forEach(function (l, i) {
        var y = 36 + i * 34;
        var w = (l[1] / 25) * 120;
        s += T(8, y - 6, l[0], 'dg-lg', 10, 'start') +
          '<rect x="8" y="' + y + '" width="' + w + '" height="18" rx="4" class="dg-neutre"/>' +
          '<rect x="' + (w + 12) + '" y="' + y + '" width="46" height="18" rx="4" class="dg-accent-f"/>' +
          T((w + 35), y + 13, '+' + l[1] + ' %', 'dg-sur-acc', 10.5);
      });
      return svg('0 0 300 140', s,
        'Rouler plus vite, transporter un coffre de toit ou climatiser en ville augmentent nettement la consommation');
    },

    /* ---- Le coefficient bonus-malus ---- */
    'bonus-malus': function () {
      return svg('0 0 300 150',
        T(150, 14, 'Le coefficient bonus-malus', 'dg-titre', 11) +
        '<path d="M20 40 L20 130 H280" class="dg-cote"/>' +
        '<path d="M20 60 L60 66 L100 72 L140 78 L180 84 L220 90 L260 96" class="dg-fleche-c"/>' +
        '<path d="M140 78 L160 50" class="dg-neg"/>' +
        T(20, 52, '1,00', 'dg-sur', 10, 'start') +
        T(260, 108, '0,50', 'dg-lg-acc', 10, 'end') +
        T(178, 44, 'accident : +25 %', 'dg-lg-ko', 9.5) +
        T(150, 142, '−5 % par an sans accident responsable', 'dg-lg', 10),
        'Le coefficient baisse de 5 % chaque année sans accident, avec un plancher à 0,50, et augmente de 25 % après un accident responsable');
    },

    /* ---- Un objet non attaché devient un projectile ---- */
    'objet-projectile': function () {
      return svg('0 0 300 140',
        T(150, 14, 'Un objet non attaché devient un projectile', 'dg-titre', 11) +
        '<rect x="46" y="76" width="30" height="30" rx="4" class="dg-neutre"/>' +
        T(61, 122, '5 kg', 'dg-sur', 11) +
        '<path d="M96 90 H150" class="dg-fleche-c"/>' +
        '<path d="M142 84 l10 6 -10 6 z" class="dg-fleche-p"/>' +
        T(123, 76, 'à 50 km/h', 'dg-lg-acc', 10) +
        '<rect x="180" y="40" width="74" height="66" rx="6" class="dg-accent-f"/>' +
        T(217, 122, '≈ 100 kg', 'dg-sur', 12),
        'À 50 km/h, un objet de 5 kilos non attaché frappe avec l’équivalent de 100 kilos');
    },

    /* ---- Une pause toutes les deux heures ---- */
    'pause-2h': function () {
      return svg('0 0 300 110',
        T(150, 14, 'Une pause toutes les deux heures', 'dg-titre', 11) +
        '<rect x="10" y="40" width="110" height="26" rx="5" class="dg-neutre"/>' +
        T(65, 57, '2 h de route', 'dg-sur', 11) +
        '<path d="M124 53 H158" class="dg-fleche-c"/>' +
        '<path d="M150 47 l10 6 -10 6 z" class="dg-fleche-p"/>' +
        '<rect x="162" y="40" width="128" height="26" rx="5" class="dg-accent-f"/>' +
        T(226, 57, '15 à 20 min de pause', 'dg-sur-acc', 11) +
        T(150, 90, 'La vigilance baisse avant qu’on ne le sente', 'dg-lg', 10),
        'Toutes les deux heures de route, une pause de quinze à vingt minutes s’impose');
    },

    /* ---- Adhérence sur neige tassée ---- */
    'adherence-neige': function () {
      return svg('0 0 300 130',
        T(150, 14, 'Adhérence sur neige tassée', 'dg-titre', 11) +
        T(10, 40, 'Route sèche', 'dg-sur', 11, 'start') +
        '<rect x="10" y="46" width="220" height="22" rx="4" class="dg-accent-f"/>' +
        T(10, 88, 'Neige tassée', 'dg-lg-ko', 11, 'start') +
        '<rect x="10" y="94" width="30" height="22" rx="4" class="dg-neutre"/>' +
        T(52, 109, 'adhérence divisée par 5 à 10', 'dg-lg-ko', 10, 'start'),
        'Sur neige tassée, l’adhérence peut être divisée par cinq à dix par rapport à une route sèche');
    },

    /* ---- Qui commande, en cas de contradiction ---- */
    'hierarchie-priorite': function () {
      var niveaux = [
        ['1', 'Un agent qui règle la circulation'],
        ['2', 'Les feux tricolores'],
        ['3', 'Les panneaux'],
        ['4', 'Le marquage au sol'],
        ['5', 'La priorité à droite']
      ];
      var y0 = 30, h = 28, gap = 8, n = niveaux.length;
      var yc0 = y0 + h / 2, ycN = y0 + (n - 1) * (h + gap) + h / 2;
      var s = T(150, 14, 'En cas de contradiction, dans cet ordre', 'dg-titre', 11) +
        '<path d="M40 ' + yc0 + ' V' + (ycN - 15) + '" class="dg-fleche-c"/>' +
        '<path d="M40 ' + (ycN - 15) + ' l-5 -9 10 0 z" class="dg-fleche-p"/>';
      niveaux.forEach(function (niv, i) {
        var y = y0 + i * (h + gap), yc = y + h / 2, fort = i === 0;
        s += '<rect x="56" y="' + y + '" width="200" height="' + h + '" rx="6" class="' +
          (fort ? 'dg-accent-f' : 'dg-neutre') + '"/>' +
          '<circle cx="40" cy="' + yc + '" r="13" class="' + (fort ? 'dg-accent-f' : 'dg-neutre') + '"/>' +
          T(40, yc + 4, niv[0], fort ? 'dg-sur-acc' : 'dg-sur', 12) +
          T(66, yc + 4, niv[1], fort ? 'dg-sur-acc' : 'dg-sur', 10.5, 'start');
      });
      return svg('0 0 300 ' + (y0 + n * (h + gap)), s,
        'En cas de contradiction, l’agent prime sur les feux, qui priment sur les panneaux, puis le marquage au sol, et enfin la priorité à droite');
    },

    /* ---- Les gestes de l'agent qui règle la circulation ---- */
    'agent-circulation': function () {
      /* Épaules décalées de part et d'autre de la tête (pas dessous) :
         sinon le bras levé traverse visuellement le crâne. */
      function bonhomme(cx, brasHaut, brasHoriz) {
        var s = '<circle cx="' + cx + '" cy="38" r="9" class="dg-veh"/>' +
          '<circle cx="' + cx + '" cy="47" r="9" class="dg-veh"/>' +
          membre(cx, 48, cx, 80, 20) +
          membre(cx, 80, cx - 12, 102, 12) +
          membre(cx, 80, cx + 12, 102, 12) +
          '<circle cx="' + cx + '" cy="80" r="10" class="dg-veh"/>';
        s += brasHaut
          ? membre(cx - 13, 50, cx - 13, 14, 9)
          : membre(cx - 13, 50, cx - 10, 76, 9);
        s += '<circle cx="' + (cx - 13) + '" cy="50" r="9" class="dg-veh"/>';
        s += brasHoriz
          ? membre(cx + 13, 50, cx + 42, 46, 9)
          : membre(cx + 13, 50, cx + 10, 76, 9);
        s += '<circle cx="' + (cx + 13) + '" cy="50" r="9" class="dg-veh"/>';
        return s;
      }
      return svg('0 0 300 156',
        T(150, 12, 'Les gestes de l’agent priment sur feux et panneaux', 'dg-titre', 10) +
        bonhomme(65, true, true) +
        bonhomme(230, false, false) +
        '<path d="M190 116 H260" class="dg-fleche-c"/>' +
        '<path d="M252 110 l8 6 -8 6 z" class="dg-fleche-p"/>' +
        T(65, 132, 'Tous s’arrêtent', 'dg-lg-acc', 10) +
        T(230, 132, 'Le passage est libre', 'dg-lg', 10) +
        T(65, 146, 'bras levé, ou vu de face', 'dg-lg', 8.5) +
        T(230, 146, 'agent vu de profil', 'dg-lg', 8.5),
        'Bras levé ou agent vu de face : tout le monde s’arrête. Bras tendu horizontalement : ceux vers qui il pointe s’arrêtent. Agent vu de profil : le passage est autorisé');
    },

    /* ---- Le corridor de sécurité, en cas de bouchon ---- */
    'corridor-securite': function () {
      return svg('0 0 220 190',
        T(110, 12, 'Bouchon : un couloir libre au centre', 'dg-titre', 10) +
        '<rect x="20" y="22" width="180" height="156" class="dg-route"/>' +
        '<path d="M110 22 V178" class="dg-bande"/>' +
        voitureDessus(48, 56, 38, -90) +
        voitureDessus(48, 134, 38, -90) +
        voitureDessus(172, 56, 38, -90) +
        voitureDessus(172, 134, 38, -90) +
        '<path d="M28 56 H12" class="dg-fleche-c"/><path d="M16 51 l-6 5 6 5 z" class="dg-fleche-p"/>' +
        '<path d="M28 134 H12" class="dg-fleche-c"/><path d="M16 129 l-6 5 6 5 z" class="dg-fleche-p"/>' +
        '<path d="M192 56 H208" class="dg-fleche-c"/><path d="M204 51 l6 5 -6 5 z" class="dg-fleche-p"/>' +
        '<path d="M192 134 H208" class="dg-fleche-c"/><path d="M204 129 l6 5 -6 5 z" class="dg-fleche-p"/>' +
        voitureDessus(110, 95, 42, -90, 'dg-accent-f') +
        '<rect x="105" y="88" width="10" height="6" rx="1.5" class="dg-vitre"/>' +
        T(40, 168, 'à gauche', 'dg-lg', 9) +
        T(180, 168, 'à droite', 'dg-lg', 9) +
        T(110, 168, 'secours', 'dg-lg-acc', 9),
        'En cas de bouchon, les véhicules de la voie de gauche se serrent à gauche, tous les autres à droite, pour laisser un couloir libre au centre aux secours');
    },

    /* ---- Les 5 mètres avant un passage piéton ---- */
    'zone-passage-pietons': function () {
      return svg('0 0 300 140',
        T(150, 14, 'Les 5 m avant un passage restent libres', 'dg-titre', 10.5) +
        '<rect x="0" y="44" width="300" height="52" class="dg-route"/>' +
        '<path d="M0 70 H300" class="dg-bande"/>' +
        '<rect x="234" y="44" width="8" height="52" class="dg-ilot"/>' +
        '<rect x="248" y="44" width="8" height="52" class="dg-ilot"/>' +
        '<rect x="262" y="44" width="8" height="52" class="dg-ilot"/>' +
        '<rect x="276" y="44" width="8" height="52" class="dg-ilot"/>' +
        '<path d="M174 32 H228" class="dg-cote"/>' +
        '<path d="M174 28 V36 M228 28 V36" class="dg-cote"/>' +
        T(201, 26, '5 m', 'dg-titre', 11) +
        voiture(88, 54, 44) +
        '<path d="M100 44 l6 8 10 -14" class="dg-check"/>' +
        voiture(183, 54, 44) +
        '<path d="M193 42 l14 14 M207 42 l-14 14" class="dg-neg"/>' +
        T(110, 122, 'correct', 'dg-lg-acc', 10) +
        T(205, 122, 'interdit', 'dg-lg-ko', 10),
        'Se garer dans les cinq mètres avant un passage piéton est interdit, pour que le piéton reste visible avant de traverser');
    },

    /* ---- La nuit, je vois moins loin qu'il ne faut pour m'arrêter ---- */
    'nuit-eclairage': function () {
      return svg('0 0 300 145',
        T(150, 12, 'La nuit, je vois moins loin qu’il ne faut pour m’arrêter', 'dg-titre', 9.5) +
        '<path d="M0 96 H300" class="dg-sol"/>' +
        '<path d="M54 78 L160 66 L160 96 Z" class="dg-accent-f" opacity=".38"/>' +
        '<rect x="160" y="60" width="120" height="38" rx="2" class="dg-danger-z"/>' +
        voiture(6, 62, 46) +
        '<path d="M54 108 H160" class="dg-cote"/><path d="M54 104 V112 M160 104 V112" class="dg-cote"/>' +
        T(107, 122, '30 m : mes feux de croisement', 'dg-lg-acc', 9) +
        '<path d="M54 130 H280" class="dg-cote"/><path d="M54 126 V134 M280 126 V134" class="dg-cote"/>' +
        T(167, 143, '81 m : distance d’arrêt à 90 km/h', 'dg-lg-ko', 9),
        'La nuit, les feux de croisement éclairent à 30 mètres, mais il faut 81 mètres pour s’arrêter à 90 km/h : au-delà de 30 mètres, je roule sur ce que je ne vois pas');
    },

    /* ---- Où poser le triangle de présignalisation ---- */
    'triangle-secours': function () {
      return svg('0 0 300 130',
        T(150, 14, 'Le triangle se pose à 30 m, plus loin avant un virage', 'dg-titre', 10) +
        '<path d="M0 90 H300" class="dg-sol"/>' +
        '<path d="M112 68 L100 88 H124 Z" fill="var(--surface)" stroke="var(--ko)" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M104 88 l-4 7 M120 88 l4 7" class="dg-cote"/>' +
        voiture(210, 64, 50) +
        '<rect x="212" y="82" width="5" height="5" rx="1" class="dg-accent-f"/>' +
        '<rect x="248" y="82" width="5" height="5" rx="1" class="dg-accent-f"/>' +
        '<path d="M112 56 H210" class="dg-cote"/><path d="M112 52 V60 M210 52 V60" class="dg-cote"/>' +
        T(161, 48, '30 m', 'dg-titre', 12) +
        T(150, 116, 'feux de détresse allumés, gilet enfilé avant de sortir', 'dg-lg', 9.5),
        'Le triangle de présignalisation se pose à environ 30 mètres du véhicule, bien plus loin avant un virage ou un sommet de côte');
    },

    /* ---- Le sas vélo, devant la ligne d'arrêt des voitures ---- */
    'sas-velo': function () {
      return svg('0 0 300 130',
        T(150, 14, 'Le sas vélo : jamais une voiture dessus', 'dg-titre', 11) +
        '<rect x="0" y="40" width="300" height="56" class="dg-route"/>' +
        '<path d="M0 68 H88" class="dg-bande"/>' +
        '<rect x="95" y="40" width="65" height="56" class="dg-accent-f" opacity=".22"/>' +
        '<path d="M90 40 V96" class="dg-cote"/>' +
        '<path d="M160 40 V96" class="dg-cote"/>' +
        voiture(28, 50, 46) +
        '<circle cx="112" cy="82" r="7" class="dg-veh"/><circle cx="136" cy="82" r="7" class="dg-veh"/>' +
        '<circle cx="112" cy="82" r="3" class="dg-vitre"/><circle cx="136" cy="82" r="3" class="dg-vitre"/>' +
        '<path d="M112 82 L124 68 L136 82 M124 68 L128 58 M119 76 L131 76" class="dg-cote" fill="none" stroke-width="2.2"/>' +
        '<circle cx="128" cy="55" r="4.5" class="dg-veh"/>' +
        '<rect x="185" y="44" width="4" height="34" class="dg-veh"/>' +
        '<rect x="178" y="40" width="18" height="16" rx="3" class="dg-veh"/>' +
        '<circle cx="187" cy="48" r="4.5" fill="#ff2d20"/>' +
        T(127, 116, 'sas vélo', 'dg-lg-acc', 10) +
        T(28, 116, 'voiture', 'dg-lg', 9.5, 'start'),
        'Le sas vélo, entre la ligne d’arrêt des voitures et le feu, laisse les cyclistes s’avancer et démarrer en premier, bien visibles');
    },

    /* ---- La règle du zip, un véhicule sur deux ---- */
    'fermeture-eclair': function () {
      /* Deux voies qui se resserrent en une seule, avec un vrai
         entonnoir dessiné (pas juste une flèche) : c'est le
         rétrécissement qui explique pourquoi on alterne. Les numéros
         sont posés à côté de chaque voiture, jamais au-dessus, pour
         ne pas se superposer au titre. */
      var cars = [[95, 48, '4'], [95, 92, '3'], [172, 48, '2'], [172, 92, '1']];
      var s = T(150, 12, 'Je m’insère un véhicule sur deux', 'dg-titre', 11) +
        '<rect x="0" y="28" width="210" height="84" class="dg-route"/>' +
        '<path d="M210 28 L232 50 L232 90 L210 112 Z" class="dg-route"/>' +
        '<rect x="232" y="50" width="58" height="40" class="dg-route"/>' +
        '<path d="M0 70 H210" class="dg-bande"/>' +
        '<path d="M172 92 Q206 92 210 78" class="dg-fleche-c"/>' +
        '<path d="M203 80 l7 -2 0 8 z" class="dg-fleche-p"/>';
      cars.forEach(function (c) {
        s += voitureDessus(c[0], c[1], 30) +
          '<circle cx="' + (c[0] - 24) + '" cy="' + c[1] + '" r="10" class="dg-accent-f"/>' +
          T(c[0] - 24, c[1] + 4, c[2], 'dg-sur-acc', 11);
      });
      s += T(150, 128, 'une seule voie ensuite', 'dg-lg', 10);
      return svg('0 0 300 138', s,
        'À l’approche d’un rétrécissement, on s’insère alternativement, un véhicule sur deux, au dernier moment plutôt que de se rabattre trop tôt');
    }
  };

  return {
    has: function (n) { return !!D[n]; },
    render: function (n) { return D[n] ? D[n]() : ''; },
    list: function () { return Object.keys(D); }
  };
})();
