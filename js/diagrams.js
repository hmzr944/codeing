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
    }
  };

  return {
    has: function (n) { return !!D[n]; },
    render: function (n) { return D[n] ? D[n]() : ''; },
    list: function () { return Object.keys(D); }
  };
})();
