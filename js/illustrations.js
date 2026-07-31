/* ============================================================
   Illustrations - une scène par leçon, affichée en grand sur sa
   couverture.

   Ce ne sont pas des schémas : un schéma explique une notion (voir
   js/diagrams.js), une illustration annonce un sujet. Elle donne à
   chaque leçon un visage reconnaissable, et coupe l'impression de
   pavé de texte dès l'ouverture.

   Tout est vectoriel, en currentColor et en var(--accent) : les
   dessins suivent donc le thème nuit ou jour sans réglage.
   ============================================================ */
window.Illus = (function () {

  function svg(inner, label) {
    return '<svg class="ill" viewBox="0 0 120 80" role="img" aria-label="' +
      String(label).replace(/"/g, '&quot;') + '">' + inner + '</svg>';
  }

  function T(x, y, txt, cls, taille) {
    return '<text x="' + x + '" y="' + y + '" class="' + (cls || 'ill-t') + '" ' +
      'font-size="' + (taille || 12) + '" text-anchor="middle">' + txt + '</text>';
  }

  var SOL = '<rect class="ill-mid" x="8" y="64" width="104" height="3" rx="1.5"/>';

  /* Une voiture de profil.

     Dessinée une fois dans un repère normalisé de 100 de long : capot
     qui descend vers l'avant, pare-brise incliné, custode, passages de
     roue creusés dans le bas de caisse. Les deux vitres sont séparées
     par un montant central, sinon l'habitacle lit comme une bulle.

     Le rapport hauteur/longueur reste 0,34 — celui d'une vraie
     berline, et celui de l'ancien dessin, pour que les scènes qui
     posaient la voiture à une hauteur donnée ne bougent pas : le sol
     est toujours à y + 0,34 × largeur. */
  function auto(x, y, w, cls) {
    var c = cls || 'ill-mid', k = (w / 100).toFixed(4);
    return '<g transform="translate(' + x + ',' + y + ') scale(' + k + ')">' +
      /* carrosserie : capot, pare-brise, pavillon, custode, malle,
         puis le bas de caisse évidé au-dessus des deux roues */
      '<path class="' + c + '" d="M3 26 Q3 20 10 18.5 L30 17 L42 6.5 L64 6 ' +
        'L76 17 L90 18.5 Q96 19.5 96 26 L96 29 L85 29 ' +
        'A7.5 7.5 0 0 0 70 29 L37 29 A7.5 7.5 0 0 0 22 29 L3 29 Z"/>' +
      '<path class="ill-vitre" d="M33 17 L43.5 8 L52 8 L52 17 Z"/>' +
      '<path class="ill-vitre" d="M56 8 L63 8 L72.5 17 L56 17 Z"/>' +
      '<path class="ill-l" d="M54 18 L54 28" stroke-width="1.4"/>' +
      '<path class="ill-l" d="M58 22 h6" stroke-width="1.6"/>' +
      '<rect class="ill-vitre" x="3.5" y="20" width="6" height="4" rx="1.5"/>' +
      '<circle class="ill-fort" cx="29.5" cy="27" r="7"/>' +
      '<circle class="ill-fort" cx="77.5" cy="27" r="7"/>' +
      '<circle class="ill-vitre" cx="29.5" cy="27" r="2.8"/>' +
      '<circle class="ill-vitre" cx="77.5" cy="27" r="2.8"/>' +
    '</g>';
  }

  var I = {

    /* Les chiffres qu'on récite : trois plaques de vitesse. */
    memo: function () {
      return svg(
        '<rect class="ill-bg" x="12" y="24" width="28" height="28" rx="7"/>' +
        '<rect class="ill-bg" x="46" y="24" width="28" height="28" rx="7"/>' +
        '<rect class="ill-acc" x="80" y="24" width="28" height="28" rx="7"/>' +
        T(26, 43, '50') + T(60, 43, '80') + T(94, 43, '130', 'ill-t-acc', 11) + SOL,
        'Les vitesses à connaître par cœur');
    },

    /* Le mot qu'on cherche, et la loupe qui le trouve. */
    lexique: function () {
      return svg(
        '<rect class="ill-bg" x="20" y="18" width="62" height="44" rx="6"/>' +
        '<rect class="ill-mid" x="28" y="27" width="30" height="3.5" rx="1.75"/>' +
        '<rect class="ill-mid" x="28" y="36" width="44" height="3.5" rx="1.75"/>' +
        '<rect class="ill-mid" x="28" y="45" width="24" height="3.5" rx="1.75"/>' +
        '<circle class="ill-la" cx="82" cy="46" r="14"/>' +
        '<path class="ill-la" d="M92 56 L104 68"/>',
        'Un mot du code expliqué simplement');
    },

    /* Ce qui vient de changer : une page de calendrier qui brille. */
    nouveautes: function () {
      return svg(
        '<rect class="ill-bg" x="30" y="16" width="60" height="50" rx="8"/>' +
        '<rect class="ill-acc" x="30" y="16" width="60" height="12" rx="8"/>' +
        '<rect class="ill-acc" x="30" y="22" width="60" height="6"/>' +
        '<rect class="ill-mid" x="38" y="36" width="12" height="10" rx="2"/>' +
        '<rect class="ill-mid" x="54" y="36" width="12" height="10" rx="2"/>' +
        '<rect class="ill-mid" x="38" y="50" width="12" height="10" rx="2"/>' +
        '<rect class="ill-acc" x="54" y="50" width="12" height="10" rx="2"/>' +
        '<path class="ill-la" d="M96 30 v10 M91 35 h10"/>',
        'Les nouveautés récentes du code');
    },

    /* Les trois formes qui disent tout : triangle, rond, carré. */
    signalisation: function () {
      return svg(
        /* Chaque panneau a son bord et son fond clair : c'est ce qui
           distingue un vrai panneau d'une forme pleine. Le triangle
           pointe vers le haut — c'est le danger, en France il ne
           pointe jamais vers le bas. */
        '<path class="ill-mid" d="M28 22 L13 50 L43 50 Z"/>' +
        '<path class="ill-vitre" d="M28 29 L19 46 L37 46 Z"/>' +
        '<path class="ill-fort" d="M26.8 33 h2.4 l-.5 7.5 h-1.4 z"/>' +
        '<circle class="ill-fort" cx="28" cy="43" r="1.2"/>' +
        '<circle class="ill-acc" cx="60" cy="36" r="14"/>' +
        '<rect class="ill-vitre" x="51" y="33" width="18" height="6" rx="1.5"/>' +
        '<rect class="ill-mid" x="78" y="22" width="28" height="28" rx="4"/>' +
        '<path class="ill-vitre" d="M92 28 l7 8 h-4 v8 h-6 v-8 h-4 z"/>' +
        '<rect class="ill-bg" x="26" y="50" width="4" height="16"/>' +
        '<rect class="ill-bg" x="58" y="50" width="4" height="16"/>' +
        '<rect class="ill-bg" x="90" y="50" width="4" height="16"/>' + SOL,
        'Les formes des panneaux : triangle, rond, carré');
    },

    /* Deux voitures qui se rencontrent : à qui le tour ?
       Vue de dessus, seul point de vue où un carrefour se lit — et où
       une voiture reste reconnaissable quel que soit son cap. */
    priorites: function () {
      /* Vue de dessus : l'avant est vers +x. Les roues dépassent un peu
         du bas de caisse et le pare-brise est plus étroit que la
         lunette — ce sont ces deux détails qui donnent le sens de
         marche, sans quoi on ne voit qu'un rectangle. */
      var dessus = function (x, y, rot, cls) {
        return '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ') scale(1.2)">' +
          '<rect class="ill-fort" x="-11" y="-7.8" width="6" height="2.6" rx="1.3"/>' +
          '<rect class="ill-fort" x="-11" y="5.2" width="6" height="2.6" rx="1.3"/>' +
          '<rect class="ill-fort" x="5" y="-7.8" width="6" height="2.6" rx="1.3"/>' +
          '<rect class="ill-fort" x="5" y="5.2" width="6" height="2.6" rx="1.3"/>' +
          '<rect class="' + cls + '" x="-14" y="-6.2" width="28" height="12.4" rx="4.5"/>' +
          /* un seul habitacle, en pointe vers l'avant : deux vitres
             séparées empilaient trois taches claires et la voiture vue
             de dessus finissait par ressembler à un feu tricolore */
          '<path class="ill-vitre" d="M-8 -4.6 h12 l3 4.6 -3 4.6 h-12 z"/>' +
          '<rect class="ill-vitre" x="11.4" y="-4.2" width="2.2" height="2.6" rx=".8"/>' +
          '<rect class="ill-vitre" x="11.4" y="1.6" width="2.2" height="2.6" rx=".8"/>' +
        '</g>';
      };
      return svg(
        '<rect class="ill-bg" x="40" y="4" width="38" height="72"/>' +
        '<rect class="ill-bg" x="6" y="26" width="108" height="36"/>' +
        '<path class="ill-l" d="M59 6 v12 M59 68 v6" stroke-dasharray="5 5"/>' +
        '<path class="ill-l" d="M10 44 h18 M90 44 h22" stroke-dasharray="5 5"/>' +
        dessus(22, 44, 0, 'ill-mid') +
        dessus(59, 15, 90, 'ill-mid') +
        /* le losange « route prioritaire » : c'est lui qui dit de quoi
           parle la leçon. Sans panneau, deux voitures à un croisement
           ne racontent rien. */
        '<g transform="translate(99,15) rotate(45)">' +
          '<rect class="ill-acc" x="-9" y="-9" width="18" height="18" rx="2.5"/>' +
          '<rect class="ill-vitre" x="-6.2" y="-6.2" width="12.4" height="12.4" rx="1.6"/>' +
          '<rect class="ill-acc" x="-3.6" y="-3.6" width="7.2" height="7.2" rx="1"/>' +
        '</g>',
        'Deux voitures à un carrefour et le panneau de priorité');
    },

    /* Le compteur, et la distance qu'il faut derrière. */
    vitesse: function () {
      return svg(
        '<path class="ill-l" d="M22 54 A28 28 0 0 1 78 54" stroke-width="7"/>' +
        '<path class="ill-la" d="M22 54 A28 28 0 0 1 40 28" stroke-width="7"/>' +
        '<circle class="ill-fort" cx="50" cy="54" r="4"/>' +
        '<path class="ill-la" d="M50 54 L38 36" stroke-width="3"/>' +
        '<rect class="ill-acc" x="84" y="30" width="26" height="10" rx="5"/>' +
        T(97, 38, '2 s', 'ill-t-acc', 8) +
        '<path class="ill-l" d="M84 50 h26 M84 46 v8 M110 46 v8"/>' + SOL,
        'La vitesse et la distance de sécurité');
    },

    /* On déboîte, on double, on se rabat. */
    manoeuvres: function () {
      return svg(
        '<rect class="ill-bg" x="6" y="32" width="108" height="32" rx="2"/>' +
        '<path class="ill-l" d="M10 48 h13 M31 48 h13 M52 48 h13 M73 48 h13 M94 48 h13"/>' +
        /* la trajectoire complète : on quitte sa file, on longe, on
           revient. Tracée avant les voitures pour passer derrière
           elles plutôt que par-dessus. */
        '<path class="ill-la" d="M8 58 q18 1 25 -11 q7 -11 23 -11 h18 q17 0 24 11 q7 11 18 11"/>' +
        '<path class="ill-la" d="M108 53 l6 5 -7 4"/>' +
        auto(58, 47, 38, 'ill-mid') +
        auto(10, 31, 38, 'ill-acc'),
        'Déboîter, dépasser, se rabattre');
    },

    /* Trois voies et un portique : on est sur l'autoroute. */
    autoroute: function () {
      return svg(
        '<rect class="ill-bg" x="6" y="30" width="108" height="36"/>' +
        '<path class="ill-l" d="M8 42 h12 M28 42 h12 M48 42 h12 M68 42 h12 M88 42 h12 M108 42 h4"/>' +
        '<path class="ill-l" d="M8 54 h12 M28 54 h12 M48 54 h12 M68 54 h12 M88 54 h12 M108 54 h4"/>' +
        '<rect class="ill-mid" x="16" y="8" width="5" height="24" rx="2"/>' +
        '<rect class="ill-mid" x="99" y="8" width="5" height="24" rx="2"/>' +
        '<rect class="ill-acc" x="16" y="8" width="88" height="13" rx="3"/>' +
        T(60, 18, '130', 'ill-t-acc', 9) +
        auto(70, 52, 34, 'ill-mid'),
        'Les voies et la signalisation d’autoroute');
    },

    /* La place, les lignes, et le grand P. */
    stationnement: function () {
      return svg(
        '<path class="ill-l" d="M20 30 v38 M56 30 v38 M92 30 v38"/>' +
        '<path class="ill-l" d="M20 30 h72"/>' +
        auto(24, 52, 30, 'ill-mid') +
        '<circle class="ill-acc" cx="92" cy="26" r="15"/>' +
        T(92, 32, 'P', 'ill-t-acc', 17) + SOL,
        'Où l’on peut s’arrêter et stationner');
    },

    /* Celui qui tient le volant : fatigue, alcool, vigilance. */
    conducteur: function () {
      return svg(
        /* Un conducteur au volant, de face : la tête et les épaules
           derrière, le volant devant, les mains posées dessus. Le
           volant seul ne montrait personne, et la silhouette seule ne
           montrait pas qu'elle conduisait. */
        '<path class="ill-mid" d="M36 70 a24 24 0 0 1 48 0 z"/>' +
        '<rect class="ill-mid" x="55" y="20" width="10" height="14" rx="4"/>' +
        '<circle class="ill-mid" cx="60" cy="17" r="10.5"/>' +
        '<circle class="ill-la" cx="60" cy="49" r="20" stroke-width="5"/>' +
        '<circle class="ill-acc" cx="60" cy="49" r="6"/>' +
        '<path class="ill-la" d="M43 47 h11 M77 47 h-11 M60 55 v14" stroke-width="4"/>' +
        '<rect class="ill-fort" x="36" y="44" width="9" height="9" rx="4.5"/>' +
        '<rect class="ill-fort" x="75" y="44" width="9" height="9" rx="4.5"/>',
        'Le conducteur : vigilance, fatigue, alcool');
    },

    /* Piéton, cycliste, voiture : on partage la route. */
    usagers: function () {
      return svg(
        /* Un piéton qui marche (jambes écartées, bras balancés), un
           vélo avec quelqu'un dessus, une voiture : les trois posés sur
           le même sol, à la même échelle. Avant, le cycliste n'avait
           qu'une tête flottante au-dessus du cadre. */
        '<circle class="ill-fort" cx="17" cy="20" r="6"/>' +
        '<path d="M17 27 v14 M17 30 l-8 8 M17 30 l7 7 M17 41 l-7 22 M17 41 l8 22" ' +
          'stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round" ' +
          'stroke-linejoin="round" opacity=".45"/>' +
        /* Le cadre doit rester ouvert : à cette taille, un triangle de
           15 unités tracé à 2,6 d'épaisseur se referme et se lit comme
           une forme pleine. Roues plus grandes, traits plus fins. */
        '<circle class="ill-l" cx="44" cy="52" r="11" stroke-width="2.2"/>' +
        '<circle class="ill-l" cx="82" cy="52" r="11" stroke-width="2.2"/>' +
        '<path class="ill-la" d="M44 52 L62 52 L55 30 Z M55 30 L76 36 M62 52 L76 36 ' +
          'M76 36 L82 52 M74 33 l7 1" stroke-width="2.2"/>' +
        '<circle class="ill-fort" cx="52" cy="17" r="5.5"/>' +
        '<path d="M52 23 L54 30 M53 26 L75 35 M54 30 L62 52" stroke="currentColor" ' +
          'stroke-width="3" fill="none" stroke-linecap="round" opacity=".45"/>' +
        auto(86, 54, 26, 'ill-mid') + SOL,
        'Piétons, cyclistes et voitures partagent la route');
    },

    /* Ce qu'on contrôle avant de partir : pneu et feu. */
    vehicule: function () {
      return svg(
        /* Un vrai pneu : gomme épaisse, sculptures sur la bande de
           roulement, jante à cinq branches. Les quatre traits croisés
           d'avant se lisaient comme une mire de viseur. */
        (function () {
          var s = '', i, a;
          for (i = 0; i < 16; i++) {
            a = i * Math.PI / 8;
            s += '<path class="ill-l" d="M' + (40 + 24 * Math.cos(a)).toFixed(1) + ' ' +
              (40 + 24 * Math.sin(a)).toFixed(1) + ' L' + (40 + 18.5 * Math.cos(a)).toFixed(1) +
              ' ' + (40 + 18.5 * Math.sin(a)).toFixed(1) + '" stroke-width="2.6"/>';
          }
          var r = '';
          for (i = 0; i < 5; i++) {
            a = i * 2 * Math.PI / 5 - Math.PI / 2;
            r += '<path class="ill-la" d="M40 40 L' + (40 + 13 * Math.cos(a)).toFixed(1) + ' ' +
              (40 + 13 * Math.sin(a)).toFixed(1) + '" stroke-width="3.2"/>';
          }
          return '<circle class="ill-fort" cx="40" cy="40" r="24"/>' + s +
            '<circle class="ill-bg" cx="40" cy="40" r="15"/>' +
            '<circle class="ill-la" cx="40" cy="40" r="15" stroke-width="2.5"/>' +
            r + '<circle class="ill-acc" cx="40" cy="40" r="4.5"/>';
        }()) +
        /* Un phare, avec sa vitre et son faisceau. */
        '<path class="ill-mid" d="M74 32 L94 26 q5 1 5 6 v16 q0 5 -5 6 L74 48 z"/>' +
        '<path class="ill-vitre" d="M79 34.5 L93 30.5 q2.5 .5 2.5 3.5 v12 q0 3 -2.5 3.5 L79 45.5 z"/>' +
        '<circle class="ill-fort" cx="88" cy="40" r="4.5"/>' +
        '<path class="ill-la" d="M103 33 h6 M103 40 h11 M103 47 h6"/>' + SOL,
        'Pneus, feux et équipements du véhicule');
    },

    /* La voiture qui voit à votre place. */
    technologie: function () {
      return svg(
        auto(12, 49, 46, 'ill-mid') +
        '<circle class="ill-acc" cx="57" cy="60" r="3.5"/>' +
        '<path class="ill-la" d="M64 50 a12 12 0 0 1 0 20"/>' +
        '<path class="ill-la" d="M74 43 a22 22 0 0 1 0 34" opacity=".6"/>' +
        '<path class="ill-la" d="M84 36 a32 32 0 0 1 0 48" opacity=".35"/>' + SOL,
        'Les aides électroniques à la conduite');
    },

    /* Pluie, nuit, brouillard : on ne voit plus pareil. */
    conditions: function () {
      return svg(
        /* Le nuage, la pluie, et surtout la voiture dont les feux
           éclairent au travers : c'est le faisceau qui raconte la
           mauvaise visibilité, pas les gouttes toutes seules. */
        '<path class="ill-mid" d="M16 30 a12 12 0 0 1 23 -5 a11 11 0 0 1 16 11 a9 9 0 0 1 -3 8 H21 a11 11 0 0 1 -5 -14 z"/>' +
        '<rect class="ill-bg" x="6" y="66" width="108" height="8"/>' +
        '<path class="ill-acc" d="M58 55 L30 48 L30 66 Z" opacity=".18"/>' +
        auto(58, 51, 46, 'ill-mid') +
        '<path class="ill-la" d="M20 44 l-4 9 M32 44 l-4 9 M44 44 l-4 9 M26 56 l-3 7 M38 56 l-3 7" ' +
          'stroke-width="2.8"/>',
        'Pluie, nuit et brouillard');
    },

    /* Protéger, alerter, secourir. */
    secours: function () {
      return svg(
        '<path class="ill-mid" d="M34 20 L15 54 L53 54 Z"/>' +
        '<path class="ill-vitre" d="M34 29 L23 49 L45 49 Z"/>' +
        '<path class="ill-fort" d="M32.5 34 h3 l-.6 8.5 h-1.8 z"/>' +
        '<circle class="ill-fort" cx="34" cy="46" r="1.5"/>' +
        '<circle class="ill-acc" cx="82" cy="38" r="20"/>' +
        '<rect x="78" y="28" width="8" height="20" rx="2" fill="var(--accent-ink)"/>' +
        '<rect x="72" y="34" width="20" height="8" rx="2" fill="var(--accent-ink)"/>' + SOL,
        'Protéger, alerter, secourir');
    },

    /* Le papier qu'on ne veut pas recevoir. */
    sanctions: function () {
      return svg(
        '<rect class="ill-bg" x="24" y="14" width="58" height="52" rx="6"/>' +
        '<rect class="ill-mid" x="32" y="24" width="34" height="4" rx="2"/>' +
        '<rect class="ill-mid" x="32" y="34" width="42" height="4" rx="2"/>' +
        '<rect class="ill-mid" x="32" y="44" width="26" height="4" rx="2"/>' +
        '<circle class="ill-acc" cx="86" cy="52" r="17"/>' +
        T(86, 58, '-6', 'ill-t-acc', 14),
        'Amendes et retraits de points');
    },

    /* Rouler souple, consommer moins. */
    environnement: function () {
      return svg(
        /* Une feuille avec sa nervure centrale et ses nervures
           latérales : sans elles, la forme se lit comme une tache. */
        '<path class="ill-acc" d="M104 12 C78 14 60 30 60 52 q0 4 3 5 C88 54 104 36 104 12 Z"/>' +
        '<path stroke="var(--accent-ink)" stroke-width="2" fill="none" opacity=".4" ' +
          'stroke-linecap="round" d="M101 16 q-22 12 -35 40"/>' +
        '<path stroke="var(--accent-ink)" stroke-width="1.5" fill="none" opacity=".26" ' +
          'stroke-linecap="round" d="M92 24 l-9 -3 M83 34 l-10 -2"/>' +
        auto(14, 52, 36, 'ill-mid') +
        '<path class="ill-l" d="M8 58 h8 M4 64 h11" stroke-width="3"/>' + SOL,
        'Conduire souple et consommer moins');
    },

    /* Les papiers qu'on doit pouvoir présenter. */
    admin: function () {
      return svg(
        '<rect class="ill-bg" x="18" y="22" width="48" height="34" rx="5" transform="rotate(-7 42 39)"/>' +
        '<rect class="ill-mid" x="30" y="28" width="48" height="34" rx="5" transform="rotate(4 54 45)"/>' +
        '<circle class="ill-bg" cx="46" cy="42" r="7"/>' +
        '<rect class="ill-fort" x="58" y="38" width="18" height="3" rx="1.5"/>' +
        '<rect class="ill-fort" x="58" y="46" width="14" height="3" rx="1.5"/>' +
        '<circle class="ill-acc" cx="92" cy="50" r="14"/>' +
        '<path d="M86 50 l4 4 8 -9" stroke="var(--accent-ink)" stroke-width="3" fill="none" ' +
          'stroke-linecap="round" stroke-linejoin="round"/>',
        'Permis, carte grise et assurance');
    },

    /* D'où l'on part, où l'on va, et la pause au milieu. */
    trajet: function () {
      return svg(
        '<rect class="ill-bg" x="12" y="16" width="96" height="52" rx="8"/>' +
        '<path class="ill-la" d="M28 58 q10 -22 30 -18 q22 4 32 -22" stroke-width="3" stroke-dasharray="6 5"/>' +
        '<circle class="ill-fort" cx="28" cy="58" r="5"/>' +
        '<path class="ill-acc" d="M90 8 a11 11 0 0 1 11 11 c0 8 -11 19 -11 19 s-11 -11 -11 -19 a11 11 0 0 1 11 -11 z"/>' +
        '<circle cx="90" cy="19" r="4" fill="var(--accent-ink)"/>',
        'Préparer son itinéraire et ses pauses');
    }
  };

  return {
    has: function (k) { return !!I[k]; },
    render: function (k) { return I[k] ? I[k]() : ''; },
    list: function () { return Object.keys(I); }
  };
})();
