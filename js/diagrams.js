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
     déformer, contrairement au profil. Le pare-brise indique le sens. */
  function voitureDessus(cx, cy, l, rot, cls) {
    var w = l * 0.46;
    return '<g class="' + (cls || 'dg-veh') + '" transform="translate(' + cx + ',' + cy +
      ') rotate(' + (rot || 0) + ')">' +
      '<rect x="' + (-l / 2) + '" y="' + (-w / 2) + '" width="' + l + '" height="' + w +
      '" rx="' + (w * 0.3).toFixed(1) + '"/>' +
      '<rect class="dg-vitre" x="' + (l * 0.08) + '" y="' + (-w * 0.32) + '" width="' +
      (l * 0.26) + '" height="' + (w * 0.64) + '" rx="2"/></g>';
  }

  /* Petite voiture vue de côté, réutilisée partout */
  function voiture(x, y, l, cls) {
    var h = l * 0.42;
    return '<g class="' + (cls || 'dg-veh') + '" transform="translate(' + x + ',' + y + ')">' +
      '<path d="M0 ' + h + ' h' + l + ' a3 3 0 0 0 3-3 v-' + (h * 0.42) +
      ' a3 3 0 0 0-2.4-2.9 l-' + (l * 0.17) + '-0.9 -' + (l * 0.13) + '-' + (h * 0.42) +
      ' a4 4 0 0 0-3-1.6 h-' + (l * 0.42) + ' a4 4 0 0 0-3 1.6 l-' + (l * 0.13) + '-' + (h * 0.42) +
      ' -' + (l * 0.17) + ' 0.9 a3 3 0 0 0-2.4 2.9 v' + (h * 0.42) + ' a3 3 0 0 0 3 3 z"/>' +
      '<circle cx="' + (l * 0.24) + '" cy="' + (h + 1) + '" r="' + (l * 0.1) + '"/>' +
      '<circle cx="' + (l * 0.76) + '" cy="' + (h + 1) + '" r="' + (l * 0.1) + '"/></g>';
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
        '<g class="dg-veh"><circle cx="52" cy="88" r="7" fill="none" stroke-width="2.5"/>' +
        '<circle cx="76" cy="88" r="7" fill="none" stroke-width="2.5"/>' +
        '<path d="M52 88 L64 76 L76 88 M64 76 L68 66" fill="none" stroke-width="2.5"/>' +
        '<circle cx="70" cy="60" r="4.5"/></g>' +
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
        voiture(60, 86, 46) +
        '<g class="dg-accent-f">' + Icons.raw('p_pieton', 26, 216, 128) + '</g>' +
        T(150, 14, 'Je sors par la droite et je passe la glissière', 'dg-titre', 11) +
        T(60, 100, 'BAU', 'dg-lg', 9, 'start') +
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
      return svg('0 0 300 120',
        '<path d="M20 100 H280" class="dg-sol"/>' +
        '<g class="dg-veh" transform="rotate(-90 150 74)">' +
        Icons.raw('p_pieton', 78, 150, 74) + '</g>' +
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
        '<g class="dg-accent-f" transform="translate(96,84) rotate(-10)">' +
        '<rect x="-7" y="-4" width="14" height="9" rx="2"/></g>' +
        T(150, 16, 'En descente, je braque vers le trottoir', 'dg-titre', 11) +
        T(96, 110, 'roues tournées', 'dg-lg-acc', 10),
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
        T(150, 14, 'Ce que surveille une voiture récente', 'dg-titre', 11) +
        voitureDessus(150, 100, 70, -90) +
        '<path d="M150 58 V22" class="dg-cote"/>' +
        T(150, 18, 'ISA + freinage d’urgence', 'dg-lg-acc', 9.5) +
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
    }
  };

  return {
    has: function (n) { return !!D[n]; },
    render: function (n) { return D[n] ? D[n]() : ''; },
    list: function () { return Object.keys(D); }
  };
})();
