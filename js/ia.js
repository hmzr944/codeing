/* ============================================================
   IA - reformulation, jamais invention.

   Le modèle ne connaît pas le code de la route ici : on ne lui
   demande pas ce qu'il sait, on lui donne les passages du cours
   qui répondent et on lui demande de les redire simplement, avec
   un exemple. C'est ce qui empêche « 90 km/h » de sortir là où le
   cours dit 80.

   Les extraits viennent de la recherche hors ligne, qui travaille
   sur les 19 leçons et les 460 questions vérifiées. Si elle ne
   trouve rien, on n'appelle pas le modèle : il n'aurait rien à
   reformuler et se mettrait à improviser.
   ============================================================ */
window.IA = (function () {

  var ECHECS = 0;                     // relais en panne : on cesse d'insister
  /* Neuf secondes. Un modèle rapide répond en deux, un résumé en
     quatre ; au-delà, la réponse hors ligne est préférable à une
     bulle qui clignote. C'est aussi le pire cas d'attente si
     l'adresse du relais ne répond pas du tout. */
  var DELAI = 9000;

  /* HTTPS obligatoire : depuis une page servie en HTTPS, un appel en
     clair serait bloqué par le navigateur avant même de partir. Seul
     un relais local, utilisé pour les essais, y échappe. */
  function configuree() {
    return typeof window.IA_URL === 'string' &&
      /^(https:\/\/|http:\/\/(localhost|127\.0\.0\.1)[:/])/.test(window.IA_URL);
  }

  /* Trois échecs d'affilée et on laisse le relais tranquille pour
     la session : mieux vaut une réponse hors ligne immédiate qu'une
     attente de treize secondes à chaque question. */
  function disponible() {
    return configuree() && ECHECS < 3 && navigator.onLine !== false;
  }

  /* ---------------- les extraits ----------------

     Ce que le modèle a le droit d'utiliser, et rien d'autre. Un
     assembleur par sorte de demande, parce qu'expliquer un mot,
     résumer une leçon et décortiquer une erreur ne s'appuient pas
     sur la même matière. */

  var EXTRAITS = {

    expliquer: function (d) {
      var out = [];
      if (d.def) out.push('Définition du lexique — ' + d.def.terme + ' : ' + d.def.def);
      d.res.blocs.slice(0, 3).forEach(function (b) {
        out.push('Leçon « ' + b.lecon.n + ' » — ' + b.titre + ' : ' + Cours.texteBloc(b.bloc));
      });
      d.res.questions.slice(0, 3).forEach(function (q) {
        out.push(question(q));
      });
      return out.join('\n\n');
    },

    /* La leçon entière : c'est tout l'objet d'un résumé. */
    resume: function (d) {
      if (!d.lecon) return '';
      var out = ['Leçon « ' + d.lecon.n + ' » — ' + d.lecon.resume];
      d.lecon.blocs.forEach(function (b) {
        var t = Cours.texteBloc(b);
        if (!t) return;
        var etiquette = b.t === 'retenir' ? 'À RETENIR' :
          b.t === 'piege' ? 'PIÈGE FRÉQUENT' :
          b.t === 'chiffres' ? 'CHIFFRES' : '';
        out.push((etiquette ? etiquette + ' — ' : '') + t);
      });
      return out.join('\n\n');
    },

    /* La question ratée, ce qu'elle a coché, et de quoi le justifier. */
    erreur: function (d) {
      var q = d.q;
      var out = [question(q),
        'Réponse choisie par Mina, qui est fausse : ' + d.choisi.join(' + ')];
      if (q.tip) out.push('Astuce du cours : ' + q.tip);
      d.res.blocs.slice(0, 2).forEach(function (b) {
        out.push('Leçon « ' + b.lecon.n + ' » — ' + b.titre + ' : ' + Cours.texteBloc(b.bloc));
      });
      return out.join('\n\n');
    }
  };

  function question(q) {
    return 'Question d’examen : ' + q.q +
      (q.ctx ? ' (situation : ' + q.ctx + ')' : '') +
      ' / Bonne réponse : ' + q.a.map(function (i) { return q.o[i]; }).join(' + ') +
      ' / Explication du cours : ' + q.e;
  }

  /* ---------------- l'appel ---------------- */

  /* d : { mode, demande, res, def, lecon, q, choisi } */
  function demander(d) {
    var mode = EXTRAITS[d.mode] ? d.mode : 'expliquer';
    var texte = EXTRAITS[mode](d);
    if (!texte) return Promise.reject(new Error('rien à reformuler'));

    var abandon = new AbortController();
    var minuteur = setTimeout(function () { abandon.abort(); }, DELAI);

    return fetch(window.IA_URL, {
      method: 'POST',
      signal: abandon.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: d.demande, extraits: texte, mode: mode })
    }).then(function (r) {
      clearTimeout(minuteur);
      if (!r.ok) throw new Error('relais ' + r.status);
      return r.json();
    }).then(function (d) {
      if (!d.reponse) throw new Error('réponse vide');
      ECHECS = 0;
      return d.reponse;
    }).catch(function (e) {
      clearTimeout(minuteur);
      /* Une adresse qui ne répond pas du tout — nom introuvable,
         connexion refusée, en-têtes d'origine manquants — est un
         problème de réglage, pas un incident passager : ça compte
         double, pour ne pas faire attendre trois fois de suite. Un
         dépassement de délai ou un 500, eux, peuvent n'être qu'un
         mauvais moment. */
      ECHECS += (e instanceof TypeError) ? 2 : 1;
      throw e;
    });
  }

  return { disponible: disponible, configuree: configuree, demander: demander };
})();
