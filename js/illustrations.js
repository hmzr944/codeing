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

  /* Une voiture de profil en trois formes : assez pour qu'on la
     reconnaisse, assez peu pour rester lisible en petit. */
  function auto(x, y, w, cls) {
    var c = cls || 'ill-mid', h = w * 0.34;
    var n = function (v) { return (+v).toFixed(1); };
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<rect class="' + c + '" x="0" y="' + n(h * 0.42) + '" width="' + w +
        '" height="' + n(h * 0.58) + '" rx="' + n(h * 0.26) + '"/>' +
      '<path class="' + c + '" d="M' + n(w * 0.24) + ' ' + n(h * 0.46) +
        ' l' + n(w * 0.1) + ' -' + n(h * 0.4) + ' h' + n(w * 0.32) +
        ' l' + n(w * 0.12) + ' ' + n(h * 0.4) + ' z"/>' +
      '<circle class="ill-fort" cx="' + n(w * 0.26) + '" cy="' + n(h) + '" r="' + n(h * 0.22) + '"/>' +
      '<circle class="ill-fort" cx="' + n(w * 0.74) + '" cy="' + n(h) + '" r="' + n(h * 0.22) + '"/>' +
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
        '<path class="ill-mid" d="M28 26 L15 50 L41 50 Z"/>' +
        '<circle class="ill-acc" cx="60" cy="38" r="13"/>' +
        '<rect class="ill-acc" x="56" y="31" width="8" height="14" rx="2" fill="var(--accent-ink)"/>' +
        '<rect class="ill-mid" x="80" y="26" width="24" height="24" rx="4"/>' +
        '<rect class="ill-bg" x="26" y="50" width="4" height="16"/>' +
        '<rect class="ill-bg" x="58" y="51" width="4" height="15"/>' +
        '<rect class="ill-bg" x="90" y="50" width="4" height="16"/>' + SOL,
        'Les formes des panneaux : triangle, rond, carré');
    },

    /* Deux voitures qui se rencontrent : à qui le tour ?
       Vue de dessus, seul point de vue où un carrefour se lit — et où
       une voiture reste reconnaissable quel que soit son cap. */
    priorites: function () {
      var dessus = function (x, y, rot, cls) {
        return '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')">' +
          '<rect class="' + cls + '" x="-14" y="-6.5" width="28" height="13" rx="4"/>' +
          '<rect class="ill-vitre" x="-2" y="-5" width="9" height="10" rx="2"/>' +
        '</g>';
      };
      return svg(
        '<rect class="ill-bg" x="44" y="4" width="32" height="72"/>' +
        '<rect class="ill-bg" x="6" y="28" width="108" height="32"/>' +
        '<path class="ill-l" d="M60 8 v12 M60 66 v6" stroke-dasharray="5 5"/>' +
        '<path class="ill-l" d="M12 44 h14 M96 44 h12" stroke-dasharray="5 5"/>' +
        dessus(24, 44, 0, 'ill-mid') +
        dessus(60, 16, 90, 'ill-acc'),
        'Deux voitures arrivent au même carrefour');
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
        '<rect class="ill-bg" x="6" y="34" width="108" height="28" rx="2"/>' +
        '<path class="ill-l" d="M10 48 h14 M34 48 h14 M58 48 h14 M82 48 h14 M106 48 h6" stroke-dasharray="0"/>' +
        auto(64, 50, 40, 'ill-mid') +
        auto(14, 24, 40, 'ill-acc') +
        '<path class="ill-la" d="M12 44 q22 -18 46 -10 q22 8 46 -6"/>' +
        '<path class="ill-la" d="M98 26 l6 2 -2 6"/>',
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
        auto(24, 44, 28, 'ill-mid') +
        '<circle class="ill-acc" cx="92" cy="26" r="15"/>' +
        T(92, 32, 'P', 'ill-t-acc', 17) + SOL,
        'Où l’on peut s’arrêter et stationner');
    },

    /* Celui qui tient le volant : fatigue, alcool, vigilance. */
    conducteur: function () {
      return svg(
        '<circle class="ill-mid" cx="46" cy="26" r="13"/>' +
        '<path class="ill-mid" d="M26 62 a20 20 0 0 1 40 0 z"/>' +
        '<circle class="ill-la" cx="88" cy="44" r="17" stroke-width="4"/>' +
        '<circle class="ill-acc" cx="88" cy="44" r="5"/>' +
        '<path class="ill-la" d="M88 27 v10 M73 50 l10 -4 M103 50 l-10 -4" stroke-width="3"/>',
        'Le conducteur : vigilance, fatigue, alcool');
    },

    /* Piéton, cycliste, voiture : on partage la route. */
    usagers: function () {
      return svg(
        '<circle class="ill-mid" cx="20" cy="24" r="6"/>' +
        '<path class="ill-mid" d="M20 32 v14 M20 38 l-7 6 M20 38 l7 6 M20 46 l-6 12 M20 46 l6 12" ' +
          'stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity=".26"/>' +
        '<circle class="ill-la" cx="49" cy="56" r="8" stroke-width="3"/>' +
        '<circle class="ill-la" cx="73" cy="56" r="8" stroke-width="3"/>' +
        '<path class="ill-la" d="M49 56 L60 40 h9 M60 40 L73 56" stroke-width="3"/>' +
        '<circle class="ill-acc" cx="63" cy="30" r="5"/>' +
        auto(88, 50, 26, 'ill-mid') + SOL,
        'Piétons, cyclistes et voitures partagent la route');
    },

    /* Ce qu'on contrôle avant de partir : pneu et feu. */
    vehicule: function () {
      return svg(
        '<circle class="ill-mid" cx="42" cy="42" r="24"/>' +
        '<circle class="ill-bg" cx="42" cy="42" r="15"/>' +
        '<circle class="ill-la" cx="42" cy="42" r="15" stroke-width="2.5"/>' +
        '<path class="ill-la" d="M42 30 v6 M42 48 v6 M30 42 h6 M48 42 h6" stroke-width="2.5"/>' +
        '<circle class="ill-acc" cx="42" cy="42" r="4"/>' +
        '<path class="ill-acc" d="M84 30 a14 14 0 0 1 0 24 z"/>' +
        '<path class="ill-la" d="M102 34 h8 M102 42 h10 M102 50 h8"/>' + SOL,
        'Pneus, feux et équipements du véhicule');
    },

    /* La voiture qui voit à votre place. */
    technologie: function () {
      return svg(
        auto(18, 44, 44, 'ill-mid') +
        '<path class="ill-la" d="M70 40 a12 12 0 0 1 0 20"/>' +
        '<path class="ill-la" d="M80 33 a22 22 0 0 1 0 34" opacity=".6"/>' +
        '<path class="ill-la" d="M90 26 a32 32 0 0 1 0 48" opacity=".35"/>' +
        '<circle class="ill-acc" cx="64" cy="50" r="4"/>' + SOL,
        'Les aides électroniques à la conduite');
    },

    /* Pluie, nuit, brouillard : on ne voit plus pareil. */
    conditions: function () {
      return svg(
        '<path class="ill-mid" d="M34 30 a12 12 0 0 1 23 -4 a10 10 0 0 1 15 10 a9 9 0 0 1 -2 8 H38 a10 10 0 0 1 -4 -14 z"/>' +
        '<path class="ill-la" d="M40 50 l-4 10 M54 50 l-4 10 M68 50 l-4 10 M82 50 l-4 10" stroke-width="3"/>' +
        '<rect class="ill-bg" x="6" y="64" width="108" height="10"/>' +
        '<path class="ill-acc" d="M84 44 a11 11 0 0 1 0 18 z"/>',
        'Pluie, nuit et brouillard');
    },

    /* Protéger, alerter, secourir. */
    secours: function () {
      return svg(
        '<path class="ill-mid" d="M34 24 L17 54 L51 54 Z"/>' +
        T(34, 50, '!', 'ill-t', 15) +
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
        '<path class="ill-acc" d="M60 16 a30 30 0 0 1 30 30 a30 30 0 0 1 -30 -30 z" ' +
          'transform="rotate(20 70 30)"/>' +
        '<path class="ill-la" d="M78 26 q-14 14 -20 34" stroke-width="3"/>' +
        auto(20, 46, 34, 'ill-mid') +
        '<path class="ill-l" d="M12 52 h8 M8 58 h12" stroke-width="3"/>' + SOL,
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
