/* ============================================================
   Signs - rendu SVG des panneaux (stylisés, sans image externe)
   La forme et la couleur sont fidèles (c'est ce qui se retient) ;
   les pictogrammes sont volontairement simplifiés.
   ============================================================ */
window.Signs = (function () {

  var R = '#d8002a',   // rouge signalisation
      B = '#00509e',   // bleu
      K = '#161616',   // noir
      W = '#ffffff',
      Y = '#ffcf00',
      GR = '#9aa3ad';  // gris (fin de prescription)

  /* Pictogramme vectoriel au centre d'un panneau. Les emoji, utilisés
     au départ, juraient avec le reste de l'interface et rendaient mal
     à petite taille. */
  function picto(nom, taille, cx, cy, couleur) {
    return '<g fill="' + (couleur || K) + '">' +
      Icons.raw(nom, taille || 34, cx || 50, cy || 62) + '</g>';
  }

  function wrap(inner, label) {
    return '<svg viewBox="0 0 100 100" role="img" aria-label="' + esc(label || 'panneau') + '">' + inner + '</svg>';
  }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function glyph(g, size, y, fill) {
    if (!g) return '';
    /* un nom de pictogramme plutôt qu'un caractère : on insère le
       tracé vectoriel, centré sur la même position optique */
    if (/^p_/.test(g) && window.Icons && Icons.has(g)) {
      return '<g fill="' + (fill || K) + '">' +
        Icons.raw(g, size, 50, y - size * 0.35) + '</g>';
    }
    if (/^[a-zA-Z0-9À-ÿ.,' -]+$/.test(g)) {
      return '<text x="50" y="' + y + '" text-anchor="middle" font-family="ui-sans-serif,system-ui,Arial" ' +
             'font-weight="800" font-size="' + size + '" fill="' + (fill || K) + '">' + esc(g) + '</text>';
    }
    return '<text x="50" y="' + y + '" text-anchor="middle" font-size="' + size + '">' + g + '</text>';
  }

  /* ---- formes de base ---- */

  // Triangle de danger (pointe en haut)
  function danger(nomPicto, label) {
    return dangerRaw(picto(nomPicto, 30, 50, 68), label);
  }

  // Même triangle, mais avec un pictogramme dessiné plutôt qu'un glyphe.
  // Les flèches et les pentes rendues en texte étaient illisibles.
  function dangerRaw(inner, label) {
    return wrap(
      '<path d="M50 4 L97 88 Q99 93 93 93 L7 93 Q1 93 3 88 Z" fill="' + R + '"/>' +
      '<path d="M50 18 L86 84 Q87 86 84 86 L16 86 Q13 86 14 84 Z" fill="' + W + '"/>' +
      inner, label);
  }

  // Cercle d'interdiction (fond blanc, bord rouge)
  function interdiction(g, label, size) {
    return wrap(
      '<circle cx="50" cy="50" r="47" fill="' + R + '"/>' +
      '<circle cx="50" cy="50" r="36" fill="' + W + '"/>' +
      glyph(g, size || 34, 62), label);
  }

  // Cercle d'obligation (fond bleu)
  function obligation(g, label, size) {
    return wrap(
      '<circle cx="50" cy="50" r="47" fill="' + W + '"/>' +
      '<circle cx="50" cy="50" r="44" fill="' + B + '"/>' +
      glyph(g, size || 34, 62, W), label);
  }

  // Carré / rectangle bleu d'indication
  function indication(g, label, size) {
    return wrap(
      '<rect x="4" y="4" width="92" height="92" rx="7" fill="' + W + '"/>' +
      '<rect x="8" y="8" width="84" height="84" rx="5" fill="' + B + '"/>' +
      glyph(g, size || 36, 64, W), label);
  }

  // Barre rouge oblique (fin/interdiction)
  function slash(col) {
    return '<line x1="20" y1="80" x2="80" y2="20" stroke="' + (col || R) + '" stroke-width="9" stroke-linecap="round"/>';
  }

  /* ---- flèches vectorielles (obligation de direction) ---- */
  function arrow(rot) {
    return '<g transform="rotate(' + (rot || 0) + ' 50 50)">' +
           '<path d="M50 20 L68 44 H58 V78 H42 V44 H32 Z" fill="' + W + '"/></g>';
  }
  function arrowBend(dir) { // 'd' = droite, 'g' = gauche
    var m = dir === 'g' ? ' transform="scale(-1,1) translate(-100,0)"' : '';
    return '<g' + m + '><path d="M42 80 V56 Q42 44 54 44 H62 V32 L82 50 L62 68 V56 H58 Q58 56 58 60 V80 Z" fill="' + W + '"/></g>';
  }

  /* ============================================================
     Catalogue des panneaux utilisés dans les questions
     ============================================================ */
  var LIB = {
    /* --- intersection & priorité --- */
    'stop': function () {
      return wrap(
        '<path d="M31 3 H69 L97 31 V69 L69 97 H31 L3 69 V31 Z" fill="' + W + '"/>' +
        '<path d="M33 8 H67 L92 33 V67 L67 92 H33 L8 67 V33 Z" fill="' + R + '"/>' +
        '<text x="50" y="62" text-anchor="middle" font-family="ui-sans-serif,system-ui,Arial" ' +
        'font-weight="800" font-size="27" fill="' + W + '" letter-spacing="1">STOP</text>',
        'Panneau STOP');
    },
    'cedez': function () {
      return wrap(
        '<path d="M4 8 Q2 3 8 3 H92 Q98 3 96 8 L54 90 Q50 96 46 90 Z" fill="' + R + '"/>' +
        '<path d="M17 14 Q15 11 19 11 H81 Q85 11 83 14 L52 76 Q50 79 48 76 Z" fill="' + W + '"/>',
        'Cédez le passage');
    },
    'priorite-a-droite': function () {
      return danger('', 'Intersection : priorité à droite')
        .replace('</svg>',
          '<rect x="46" y="42" width="8" height="38" fill="' + K + '"/>' +
          '<rect x="28" y="56" width="44" height="8" fill="' + K + '"/></svg>');
    },
    'route-prioritaire': function () {
      return wrap(
        '<path d="M50 3 L97 50 L50 97 L3 50 Z" fill="' + W + '"/>' +
        '<path d="M50 14 L86 50 L50 86 L14 50 Z" fill="' + Y + '"/>',
        'Route à caractère prioritaire');
    },
    'fin-route-prioritaire': function () {
      return wrap(
        '<path d="M50 3 L97 50 L50 97 L3 50 Z" fill="' + W + '"/>' +
        '<path d="M50 14 L86 50 L50 86 L14 50 Z" fill="' + Y + '"/>' +
        '<line x1="22" y1="78" x2="78" y2="22" stroke="' + K + '" stroke-width="7"/>',
        'Fin de route prioritaire');
    },
    'cedez-giratoire': function () {
      return wrap(
        '<path d="M4 8 Q2 3 8 3 H92 Q98 3 96 8 L54 90 Q50 96 46 90 Z" fill="' + R + '"/>' +
        '<path d="M17 14 Q15 11 19 11 H81 Q85 11 83 14 L52 76 Q50 79 48 76 Z" fill="' + W + '"/>' +
        '<circle cx="50" cy="36" r="13" fill="none" stroke="' + K + '" stroke-width="5"/>',
        'Cédez le passage au carrefour giratoire');
    },
    'sens-giratoire': function () {
      return wrap(
        '<circle cx="50" cy="50" r="47" fill="' + W + '"/>' +
        '<circle cx="50" cy="50" r="44" fill="' + B + '"/>' +
        '<g fill="none" stroke="' + W + '" stroke-width="7" stroke-linecap="round">' +
        '<path d="M50 26 A24 24 0 0 1 71 62"/>' +
        '<path d="M64 66 A24 24 0 0 1 26 55"/>' +
        '<path d="M31 42 A24 24 0 0 1 45 27"/></g>' +
        '<path d="M71 56 l7 12 l-14 1 z" fill="' + W + '"/>',
        'Carrefour à sens giratoire');
    },

    /* --- danger --- */
    'danger-virage-droite': function () {
      return dangerRaw(
        '<path d="M42 84 V65 Q42 57 52 57 H56" fill="none" stroke="' + K + '" stroke-width="9" stroke-linecap="butt"/>' +
        '<path d="M54 47 L70 57 L54 67 Z" fill="' + K + '"/>', 'Virage à droite');
    },
    'danger-double-virage': function () {
      return dangerRaw(
        '<path d="M40 84 V76 Q40 68 50 65 Q60 62 60 54" fill="none" stroke="' + K + '" stroke-width="9"/>' +
        '<path d="M51 54 L60 40 L69 54 Z" fill="' + K + '"/>', 'Succession de virages');
    },
    'danger-enfants':        function(){ return danger('p_enfant','Endroit fréquenté par des enfants'); },
    'danger-pietons':        function(){ return danger('p_pieton','Passage pour piétons'); },
    'danger-cyclistes':      function(){ return danger('p_velo','Débouché de cyclistes'); },
    'danger-animaux':        function(){ return danger('p_animal','Passage d’animaux sauvages'); },
    'danger-troupeau':       function(){ return danger('p_troupeau','Passage d’animaux domestiques'); },
    'danger-travaux':        function(){ return danger('p_travaux','Travaux'); },
    'danger-glissant': function () {
      // voiture + traces de dérapage : bien plus parlant qu'une spirale
      return dangerRaw(
        '<g fill="' + K + '">' +
        '<path d="M35 63 h30 a3 3 0 0 0 3-3 v-4 a3 3 0 0 0-2.5-3 l-6-1 -4-5 a4 4 0 0 0-3.2-1.6 H47.7 ' +
        'a4 4 0 0 0-3.2 1.6 l-4 5 -6 1 a3 3 0 0 0-2.5 3 v4 a3 3 0 0 0 3 3 z"/>' +
        '<circle cx="40" cy="65" r="3.4"/><circle cx="60" cy="65" r="3.4"/></g>' +
        '<g fill="none" stroke="' + K + '" stroke-width="3.4" stroke-linecap="round">' +
        '<path d="M28 76 q5-5 10 0 t10 0 t10 0 t10 0"/>' +
        '<path d="M30 84 q5-5 10 0 t10 0 t10 0"/></g>', 'Chaussée glissante');
    },
    'danger-feux':           function(){ return danger('p_feux','Feux tricolores'); },
    'danger-descente': function () {
      return dangerRaw(
        '<path d="M24 82 L78 82 L24 52 Z" fill="' + K + '"/>' +
        '<text x="41" y="79" text-anchor="middle" font-family="ui-sans-serif,system-ui,Arial" ' +
        'font-weight="800" font-size="12" fill="' + W + '">10%</text>', 'Descente dangereuse');
    },
    'danger-retrecissement': function () {
      return dangerRaw(
        '<g stroke="' + K + '" stroke-width="8" stroke-linecap="round">' +
        '<path d="M28 84 L38 52"/><path d="M72 84 L62 52"/></g>', 'Chaussée rétrécie');
    },
    'danger-vent':           function(){ return danger('p_vent','Vent latéral'); },
    'danger-bouchon':        function(){ return danger('p_voiture','Risque de bouchon'); },
    'danger-train':          function(){ return danger('p_train','Passage à niveau'); },
    'danger-autre':          function(){ return danger('p_exclamation','Autre danger'); },

    /* --- interdiction --- */
    'sens-interdit': function () {
      return wrap(
        '<circle cx="50" cy="50" r="47" fill="' + W + '"/>' +
        '<circle cx="50" cy="50" r="44" fill="' + R + '"/>' +
        '<rect x="22" y="43" width="56" height="14" rx="2" fill="' + W + '"/>',
        'Sens interdit');
    },
    'circulation-interdite': function () {
      return wrap(
        '<circle cx="50" cy="50" r="47" fill="' + R + '"/>' +
        '<circle cx="50" cy="50" r="36" fill="' + W + '"/>',
        'Circulation interdite à tout véhicule');
    },
    'interdit-depasser': function () {
      return wrap('<circle cx="50" cy="50" r="47" fill="' + R + '"/>' +
        '<circle cx="50" cy="50" r="36" fill="' + W + '"/>' +
        '<g fill="' + K + '">' + Icons.raw('p_voiture', 26, 38, 50) + '</g>' +
        '<g fill="' + R + '">' + Icons.raw('p_voiture', 26, 64, 50) + '</g>',
        'Interdiction de dépasser');
    },
    'interdit-demi-tour': function(){ return interdiction('p_demiTour','Interdiction de faire demi-tour', 36); },
    'interdit-klaxon':    function(){ return interdiction('p_klaxon','Usage de l’avertisseur sonore interdit', 32); },
    'interdit-pl':        function(){ return interdiction('p_camion','Accès interdit aux poids lourds', 32); },
    'interdit-velo':      function(){ return interdiction('p_velo','Accès interdit aux cycles', 32); },
    'interdit-pietons':   function(){ return interdiction('p_pieton','Accès interdit aux piétons', 32); },
    'hauteur-limitee':    function(){ return interdiction('3m5','Hauteur limitée', 26); },

    'limite-30':  function(){ return interdiction('30','Vitesse limitée à 30', 38); },
    'limite-50':  function(){ return interdiction('50','Vitesse limitée à 50', 38); },
    'limite-70':  function(){ return interdiction('70','Vitesse limitée à 70', 38); },
    'limite-80':  function(){ return interdiction('80','Vitesse limitée à 80', 38); },
    'limite-90':  function(){ return interdiction('90','Vitesse limitée à 90', 38); },
    'limite-110': function(){ return interdiction('110','Vitesse limitée à 110', 31); },
    'limite-130': function(){ return interdiction('130','Vitesse limitée à 130', 31); },

    'fin-limite-70': function () {
      return wrap('<circle cx="50" cy="50" r="47" fill="' + W + '"/>' +
        '<circle cx="50" cy="50" r="44" fill="none" stroke="' + GR + '" stroke-width="4"/>' +
        glyph('70', 38, 62, GR) + slash(GR), 'Fin de limitation à 70');
    },
    'fin-interdictions': function () {
      return wrap('<circle cx="50" cy="50" r="47" fill="' + W + '"/>' +
        '<circle cx="50" cy="50" r="44" fill="none" stroke="' + GR + '" stroke-width="4"/>' +
        '<g stroke="' + GR + '" stroke-width="6" stroke-linecap="round">' +
        '<line x1="24" y1="76" x2="76" y2="24"/><line x1="31" y1="79" x2="79" y2="31"/></g>',
        'Fin de toutes les interdictions');
    },

    'stationnement-interdit': function () {
      return wrap(
        '<circle cx="50" cy="50" r="47" fill="' + R + '"/>' +
        '<circle cx="50" cy="50" r="40" fill="' + B + '"/>' +
        slash(R), 'Stationnement interdit');
    },
    'arret-stationnement-interdit': function () {
      return wrap(
        '<circle cx="50" cy="50" r="47" fill="' + R + '"/>' +
        '<circle cx="50" cy="50" r="40" fill="' + B + '"/>' +
        slash(R) +
        '<line x1="20" y1="20" x2="80" y2="80" stroke="' + R + '" stroke-width="9" stroke-linecap="round"/>',
        'Arrêt et stationnement interdits');
    },

    /* --- obligation --- */
    'obl-tout-droit': function(){ return wrap('<circle cx="50" cy="50" r="47" fill="'+W+'"/><circle cx="50" cy="50" r="44" fill="'+B+'"/>'+arrow(0),'Obligation d’aller tout droit'); },
    'obl-droite':     function(){ return wrap('<circle cx="50" cy="50" r="47" fill="'+W+'"/><circle cx="50" cy="50" r="44" fill="'+B+'"/>'+arrowBend('d'),'Obligation de tourner à droite'); },
    'obl-gauche':     function(){ return wrap('<circle cx="50" cy="50" r="47" fill="'+W+'"/><circle cx="50" cy="50" r="44" fill="'+B+'"/>'+arrowBend('g'),'Obligation de tourner à gauche'); },
    'contournement-droite': function(){ return wrap('<circle cx="50" cy="50" r="47" fill="'+W+'"/><circle cx="50" cy="50" r="44" fill="'+B+'"/>'+arrow(45),'Contournement obligatoire par la droite'); },
    'obl-velo':       function(){ return obligation('p_velo','Piste ou bande cyclable obligatoire', 34); },
    'obl-pietons':    function(){ return obligation('p_pieton','Chemin obligatoire pour piétons', 34); },
    'obl-chaines':    function(){ return obligation('p_neige','Chaînes à neige obligatoires', 34); },
    'vitesse-mini-30':function(){ return obligation('30','Vitesse minimale obligatoire 30 km/h', 36); },

    /* --- indication --- */
    'autoroute': function () {
      return wrap('<rect x="4" y="14" width="92" height="72" rx="7" fill="'+W+'"/>' +
        '<rect x="8" y="18" width="84" height="64" rx="5" fill="'+B+'"/>' +
        '<g fill="'+W+'"><path d="M22 74 L34 30 h8 L34 74 Z"/><path d="M78 74 L66 30 h-8 L66 74 Z"/>' +
        '<rect x="44" y="30" width="12" height="44"/><rect x="18" y="24" width="64" height="6" rx="2"/></g>',
        'Autoroute');
    },
    'fin-autoroute': function () {
      return wrap('<rect x="4" y="14" width="92" height="72" rx="7" fill="'+W+'"/>' +
        '<rect x="8" y="18" width="84" height="64" rx="5" fill="'+B+'"/>' +
        '<g fill="'+W+'"><path d="M22 74 L34 30 h8 L34 74 Z"/><path d="M78 74 L66 30 h-8 L66 74 Z"/>' +
        '<rect x="44" y="30" width="12" height="44"/><rect x="18" y="24" width="64" height="6" rx="2"/></g>' +
        '<line x1="14" y1="82" x2="86" y2="18" stroke="'+R+'" stroke-width="7"/>',
        'Fin d’autoroute');
    },
    'voie-rapide': function () {
      // silhouette blanche dessinée : l'emoji voiture rouge sur fond
      // bleu donnait un panneau qui n'existe pas
      return wrap('<rect x="4" y="4" width="92" height="92" rx="7" fill="' + W + '"/>' +
        '<rect x="8" y="8" width="84" height="84" rx="5" fill="' + B + '"/>' +
        '<g fill="' + W + '">' +
        '<path d="M24 62 h52 a5 5 0 0 0 5-5 v-7 a5 5 0 0 0-4-5 l-10-2 -7-9 a6 6 0 0 0-5-2 H45 ' +
        'a6 6 0 0 0-5 2 l-7 9 -10 2 a5 5 0 0 0-4 5 v7 a5 5 0 0 0 5 5 z"/>' +
        '<circle cx="34" cy="64" r="6"/><circle cx="66" cy="64" r="6"/></g>',
        'Route à accès réglementé (voie rapide)');
    },
    'passage-pietons':  function(){ return indication('p_pieton','Passage pour piétons', 36); },
    'parking':          function(){ return indication('P','Parking', 52); },
    'impasse': function () {
      return wrap('<rect x="4" y="4" width="92" height="92" rx="7" fill="' + W + '"/>' +
        '<rect x="8" y="8" width="84" height="84" rx="5" fill="' + B + '"/>' +
        '<rect x="44" y="40" width="12" height="42" fill="' + W + '"/>' +
        '<rect x="26" y="28" width="48" height="12" rx="2" fill="' + R + '"/>',
        'Voie sans issue');
    },
    'hopital':          function(){ return indication('p_hopital','Établissement de santé', 34); },

    'agglomeration': function () {
      return wrap('<rect x="4" y="22" width="92" height="56" rx="5" fill="'+K+'"/>' +
        '<rect x="7" y="25" width="86" height="50" rx="3" fill="'+W+'"/>' +
        '<text x="50" y="59" text-anchor="middle" font-family="ui-sans-serif,system-ui,Arial" font-weight="700" font-size="20" fill="'+K+'">VILLE</text>',
        'Entrée d’agglomération');
    },
    'fin-agglomeration': function () {
      return wrap('<rect x="4" y="22" width="92" height="56" rx="5" fill="'+K+'"/>' +
        '<rect x="7" y="25" width="86" height="50" rx="3" fill="'+W+'"/>' +
        '<text x="50" y="59" text-anchor="middle" font-family="ui-sans-serif,system-ui,Arial" font-weight="700" font-size="20" fill="'+K+'">VILLE</text>' +
        '<line x1="12" y1="72" x2="88" y2="28" stroke="'+R+'" stroke-width="6"/>',
        'Sortie d’agglomération');
    },
    'zone-30': function () {
      return wrap('<rect x="8" y="4" width="84" height="92" rx="7" fill="'+W+'"/>' +
        '<rect x="12" y="8" width="76" height="84" rx="5" fill="none" stroke="'+K+'" stroke-width="3"/>' +
        '<circle cx="50" cy="40" r="24" fill="'+R+'"/><circle cx="50" cy="40" r="18" fill="'+W+'"/>' +
        glyph('30', 21, 47) +
        '<text x="50" y="82" text-anchor="middle" font-family="ui-sans-serif,system-ui,Arial" font-weight="800" font-size="15" fill="'+K+'">ZONE</text>',
        'Entrée de zone 30');
    },
    'zone-rencontre': function () {
      return wrap('<rect x="8" y="4" width="84" height="92" rx="7" fill="'+W+'"/>' +
        '<rect x="12" y="8" width="76" height="84" rx="5" fill="'+B+'"/>' +
        '<g fill="' + W + '">' + Icons.raw('p_pieton', 22, 38, 38) +
        Icons.raw('p_velo', 24, 63, 38) + '</g>' +
        '<text x="50" y="76" text-anchor="middle" font-family="ui-sans-serif,system-ui,Arial" font-weight="800" font-size="21" fill="'+W+'">20</text>',
        'Zone de rencontre');
    },

    /* --- feux --- */
    'feu-rouge':   function(){ return feux(0); },
    'feu-orange':  function(){ return feux(1); },
    'feu-vert':    function(){ return feux(2); },
    'feu-jaune-clignotant': function(){ return feux(3); }
  };

  function feux(on) {
    var off = '#2a2f36';
    var c = [on === 0 ? '#ff2d20' : off, (on === 1 || on === 3) ? '#ffb100' : off, on === 2 ? '#22d36a' : off];
    return wrap(
      '<rect x="28" y="4" width="44" height="92" rx="10" fill="#1b1f25"/>' +
      '<circle cx="50" cy="24" r="13" fill="' + c[0] + '"/>' +
      '<circle cx="50" cy="50" r="13" fill="' + c[1] + '"/>' +
      '<circle cx="50" cy="76" r="13" fill="' + c[2] + '"/>',
      'Feu tricolore');
  }

  return {
    has: function (id) { return !!LIB[id]; },
    render: function (id) { return LIB[id] ? LIB[id]() : ''; },
    list: function () { return Object.keys(LIB); },
    danger: danger, interdiction: interdiction, obligation: obligation, indication: indication
  };
})();
