/* ============================================================
   Recherche - fonctionne hors ligne, sans serveur.

   Mina pose sa question avec ses mots ; on retrouve les questions
   et les blocs de leçon qui y répondent. Un petit dictionnaire
   traduit le langage courant vers le vocabulaire du code, parce
   que personne ne tape « alcoolémie en période probatoire ».
   ============================================================ */
window.Recherche = (function () {

  /* --- mots du quotidien vers mots du code --- */
  var SYNONYMES = {
    'boire': 'alcool verre gramme', 'bu': 'alcool', 'bourre': 'alcool ivre',
    'verre': 'alcool', 'biere': 'alcool', 'apero': 'alcool',
    'joint': 'stupefiants cannabis', 'drogue': 'stupefiants',
    'portable': 'telephone', 'gsm': 'telephone', 'sms': 'telephone',
    'flic': 'police controle', 'gendarme': 'police controle',
    'pv': 'amende contravention', 'prune': 'amende contravention',
    'rond': 'giratoire rond-point', 'rondpoint': 'giratoire',
    'papier': 'carte grise assurance permis document',
    'papiers': 'carte grise assurance permis document',
    'point': 'permis points retrait', 'points': 'permis retrait',
    'phare': 'feux croisement route', 'phares': 'feux croisement route',
    'warning': 'detresse', 'warnings': 'detresse',
    'clim': 'climatisation', 'essence': 'carburant consommation',
    'gonfler': 'pression pneu', 'creve': 'pneu crevaison',
    'depasser': 'depassement doubler', 'doubler': 'depassement',
    'garer': 'stationnement', 'gare': 'stationnement', 'parking': 'stationnement',
    'accident': 'secours victime', 'blesse': 'secours victime',
    'urgence': 'secours 112 samu', 'pompier': 'secours 18',
    'neige': 'chaines hiver montagne', 'verglas': 'glissant hiver',
    'pluie': 'mouille aquaplaning', 'nuit': 'obscurite eclairage',
    'velo': 'cycliste cycle', 'moto': 'deux-roues motard',
    'camion': 'poids lourd', 'bus': 'transport commun autobus',
    'trottinette': 'edpm engin deplacement',
    'electrique': 'batterie recharge',
    'jeune': 'probatoire novice', 'debutant': 'probatoire novice',
    'vite': 'vitesse exces', 'radar': 'controle vitesse exces',
    'distance': 'securite arret freinage', 'freiner': 'freinage distance',
    'stop': 'arret absolu', 'ceder': 'priorite passage',
    'panneau': 'signalisation', 'ligne': 'marquage sol',
    'ceinture': 'securite retenue', 'enfant': 'siege retenue',
    'autoroute': 'bau insertion', 'peage': 'autoroute',
    'amende': 'contravention sanction', 'prison': 'delit sanction',
    'assurance': 'responsabilite civile tiers',
    'controle': 'technique visite'
  };

  var VIDES = new Set(('le la les un une des du de d l et ou mais donc or ni car ' +
    'a au aux en dans sur sous pour par avec sans que qui quoi dont ou est sont ' +
    'ce cet cette ces mon ma mes ton ta tes son sa ses je tu il elle on nous vous ils ' +
    'elles se me te ne pas plus moins tres quand comment pourquoi combien quel quelle ' +
    'faire fait faut dois doit peut peux etre avoir ai as ont avons c s n y').split(' '));

  function normaliser(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')   // accents
      .replace(/[’']/g, ' ')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Expressions traitées avant les mots isolés : sans cela, « rond
     point » se comprend comme « les points du permis ». */
  var EXPRESSIONS = [
    [/\brond[- ]?points?\b/g, ' giratoire '],
    [/\bpremiers? secours\b/g, ' secours victime '],
    [/\bau volant\b/g, ' conduite '],
    [/\ben conduisant\b/g, ' conduite '],
    [/\bcode de la route\b/g, ' '],
    [/\bpermis a points?\b/g, ' permis points retrait '],
    [/\bceinture de securite\b/g, ' ceinture '],
    [/\bpoids lourds?\b/g, ' camion poids-lourd '],
    [/\bfeu rouge\b/g, ' feu rouge tricolore '],
    [/\bpassage pietons?\b/g, ' passage pieton traverser '],
    [/\bboite noire\b/g, ' enregistreur donnees '],
    [/\bjeune conducteur\b/g, ' probatoire novice ']
  ];

  function motsDe(s) {
    var txt = ' ' + normaliser(s) + ' ';
    EXPRESSIONS.forEach(function (e) { txt = txt.replace(e[0], e[1]); });
    return txt.split(' ').filter(function (m) {
      return m.length > 1 && !VIDES.has(m);
    });
  }

  /* --- index construit une seule fois --- */
  var INDEX = null;

  function construire() {
    if (INDEX) return INDEX;
    INDEX = { questions: [], blocs: [] };

    Store.all.forEach(function (q) {
      var theme = window.themeByKey(q.t);
      INDEX.questions.push({
        q: q,
        fort: normaliser([q.q, q.ctx || '', q.tip || '', theme.n].join(' ')),
        faible: normaliser([q.e, q.o.join(' ')].join(' '))
      });
    });

    /* On indexe bloc par bloc, jamais la leçon entière : renvoyer
       vingt lignes pour un mot situé au milieu ne répond à rien. */
    (window.LESSONS || []).forEach(function (l) {
      l.blocs.forEach(function (b) {
        var texte = Cours.texteBloc(b);
        if (texte.length < 24) return;
        INDEX.blocs.push({
          lecon: l, bloc: b, titre: b.titre || l.n,
          fort: normaliser(l.n + ' ' + (b.titre || '')),
          faible: normaliser(texte)
        });
      });
    });

    return INDEX;
  }

  /* --- score d'un enregistrement pour une liste de mots --- */
  function score(rec, mots, phrase) {
    var total = 0;
    /* La question posée telle quelle dans un intitulé : c'est le
       meilleur signal possible, il doit dominer le classement. */
    if (phrase && phrase.length > 6) {
      if (rec.fort.indexOf(phrase) >= 0) total += 40;
      else if (rec.faible.indexOf(phrase) >= 0) total += 15;
    }
    for (var i = 0; i < mots.length; i++) {
      var m = mots[i];
      var re = new RegExp('\\b' + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      var f = (rec.fort.match(re) || []).length;
      var w = (rec.faible.match(re) || []).length;
      if (f + w === 0) continue;
      total += f * 6 + w * 2;
      total += 3;                       // bonus : le mot est présent
    }
    // un résultat qui ne contient qu'un mot sur cinq n'est pas une réponse
    var couverts = mots.filter(function (m) {
      var re = new RegExp('\\b' + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      return re.test(rec.fort) || re.test(rec.faible);
    }).length;
    return total * (couverts / mots.length);
  }

  function chercher(requete) {
    var base = motsDe(requete);
    if (!base.length) return { questions: [], blocs: [], mots: [] };

    /* enrichissement par synonymes */
    var mots = base.slice();
    base.forEach(function (m) {
      if (SYNONYMES[m]) mots = mots.concat(motsDe(SYNONYMES[m]));
    });
    mots = mots.filter(function (m, i) { return mots.indexOf(m) === i; });

    var idx = construire();

    /* Ne garder que ce qui approche le meilleur résultat : sans ce
       seuil, un mot commun ramène six réponses hors sujet. */
    var phrase = normaliser(requete);
    function meilleurs(liste, max, sortie) {
      var notes = liste.map(function (r) { return { r: r, s: score(r, mots, phrase) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; });
      if (!notes.length) return [];
      var seuil = notes[0].s * 0.4;
      return notes.filter(function (x) { return x.s >= seuil; })
        .slice(0, max).map(sortie);
    }

    var qs = meilleurs(idx.questions, 6, function (x) { return x.r.q; });
    var bs = meilleurs(idx.blocs, 3, function (x) { return x.r; });

    return { questions: qs, blocs: bs, mots: base };
  }

  return { chercher: chercher, normaliser: normaliser };
})();
