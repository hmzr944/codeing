/* ============================================================
   COURS - la partie « ce qu'il faut savoir ».

   Deux écrans seulement :
     la liste, où l'on choisit une leçon ;
     le lecteur, plein écran, où il n'y a plus que la leçon.

   Le lecteur ne connaît pas le contenu : il sait dessiner sept
   formes de blocs, et c'est la leçon qui dit laquelle utiliser.
   Aucune leçon ne peut donc redevenir un pavé de texte.
   ============================================================ */
window.Cours = (function () {

  /* Ouvre Claude avec le contexte déjà rédigé : c'est le seul moyen
     d'avoir une vraie IA ici, une page publiée ne pouvant pas en
     appeler une. */
  function lienClaude(texte) {
    return 'https://claude.ai/new?q=' + encodeURIComponent(texte);
  }
  window.lienClaude = lienClaude;

  window.promptCorrection = function (q) {
    return 'Je révise le code de la route en France (examen 2026). ' +
      'Je n’ai pas compris cette question.\n\n' +
      'Question : ' + q.q + '\n' +
      'Bonne réponse : ' + q.a.map(function (i) { return q.o[i]; }).join(' + ') + '\n' +
      'Explication du cours : ' + q.e + '\n\n' +
      'Peux-tu me l’expliquer autrement, avec des mots simples et un exemple de situation réelle ?';
  };

  /* ============================================================
     Blocs
     ============================================================ */

  /* Quelques termes se comprennent d'un coup d'œil si on les montre.
     La correspondance est rangée par leçon, et non par mot seul :
     « Rouge » désigne un feu tricolore dans Signalisation et un voyant
     du tableau de bord dans Véhicule — un dessin choisi sur le mot
     seul se tromperait une fois sur deux. */
  var VIGNETTES = {
    lexique: {
      'BAU':               ['d', 'panne-autoroute'],
      'Agglomération':     ['p', 'agglomeration'],
      'Giratoire':         ['d', 'giratoire'],
      'Céder le passage':  ['p', 'cedez'],
      'Marquer l’arrêt':   ['p', 'stop'],
      'Frein moteur':      ['d', 'pente'],
      'Angle mort':        ['d', 'angle-mort'],
      'ADAS':              ['d', 'aides-conduite'],
      'PLS':               ['d', 'pls']
    },
    signalisation: {
      'Rouge':             ['p', 'feu-rouge'],
      'Orange fixe':       ['p', 'feu-orange'],
      'Orange clignotant': ['p', 'feu-jaune-clignotant']
    },
    vehicule: {
      'Profondeur minimale des rainures': ['d', 'usure-pneu']
    }
  };

  function vignette(lecon, item) {
    if (!lecon || !lecon.k) return '';
    var t = /^([^:]{2,34}) : /.exec(item);
    var m = t && VIGNETTES[lecon.k] && VIGNETTES[lecon.k][t[1].trim()];
    if (!m) return '';
    if (m[0] === 'p' && Signs.has(m[1])) {
      return '<div class="li-dessin pan-d">' + Signs.render(m[1]) + '</div>';
    }
    if (m[0] === 'd' && Diagrams.has(m[1])) {
      return '<figure class="li-dessin bl-schema">' + Diagrams.render(m[1]) + '</figure>';
    }
    return '';
  }

  /* Le seul endroit où une leçon devient du HTML. */
  function bloc(b, lecon) {
    switch (b.t) {

      /* la phrase à garder si on ne retient qu'une chose */
      case 'retenir':
        return '<div class="bl bl-retenir">' +
          '<span class="bl-ico">' + Icons.svg('cle', 16) + '</span>' +
          '<p>' + UI.esc(b.txt) + '</p></div>';

      /* l'erreur classique, celle qui coûte des points */
      case 'piege':
        return '<div class="bl bl-piege">' +
          '<span class="bl-ico">' + Icons.svg('alerte', 16) + '</span>' +
          '<div><div class="bl-et">Le piège</div><p>' + UI.esc(b.txt) + '</p></div></div>';

      /* les points à retenir, un par ligne */
      case 'cle':
        return '<section class="bl-sec">' +
          titreBloc(b.titre) +
          '<ul class="liste">' + b.items.map(function (i) {
            return '<li>' + gras(i) + vignette(lecon, i) + '</li>';
          }).join('') + '</ul></section>';

      /* un tableau de valeurs, alignées pour être comparées d'un coup d'œil */
      case 'chiffres':
        return '<section class="bl-sec">' +
          titreBloc(b.titre) +
          '<div class="tbl">' + b.lignes.map(function (l) {
            return '<div class="tbl-l">' +
              '<span class="tbl-c">' + UI.esc(l[0]) + '</span>' +
              '<span class="tbl-v num">' + UI.esc(l[1]) + '</span>' +
              (l[2] ? '<span class="tbl-p">' + UI.esc(l[2]) + '</span>' : '') +
            '</div>';
          }).join('') + '</div></section>';

      /* les panneaux du thème, dessinés grandeur lisible */
      case 'panneaux':
        return '<section class="bl-sec">' +
          titreBloc(b.titre) +
          '<div class="pan-g">' + b.signes.filter(function (s) {
            return Signs.has(s[0]);
          }).map(function (s) {
            return '<figure class="pan"><div class="pan-d">' + Signs.render(s[0]) + '</div>' +
              '<figcaption>' + UI.esc(s[1]) + '</figcaption></figure>';
          }).join('') + '</div></section>';

      /* un dessin, quand la notion ne s'explique pas par des mots */
      case 'schema':
        return Diagrams.has(b.d)
          ? '<figure class="bl-schema">' + Diagrams.render(b.d) + '</figure>'
          : '';

      /* un paragraphe court, jamais plus de trois phrases */
      default:
        return '<p class="bl-txt">' + gras(b.txt) + '</p>';
    }
  }

  function titreBloc(t) {
    return t ? '<h3 class="bl-t">' + UI.esc(t) + '</h3>' : '';
  }

  /* « Chaussée : la partie où roulent les voitures. » Le terme défini
     passe en gras, pour qu'on le retrouve en balayant la page. */
  function gras(txt) {
    var e = UI.esc(txt);
    return e.replace(/^([^:.]{2,34}) : /, '<b>$1</b> : ');
  }

  /* Texte brut d'une leçon : sert à la recherche et à l'audit. */
  function texteBloc(b) {
    if (b.t === 'cle') return (b.titre || '') + '. ' + b.items.join(' ');
    if (b.t === 'chiffres') return (b.titre || '') + '. ' + b.lignes.map(function (l) {
      return l.join(' ');
    }).join('. ');
    if (b.t === 'panneaux') return (b.titre || '') + '. ' + b.signes.map(function (s) {
      return s[1];
    }).join('. ');
    if (b.t === 'schema') return '';
    return b.txt || '';
  }

  function texteDe(l) {
    return l.n + '. ' + l.resume + ' ' + l.blocs.map(texteBloc).join(' ');
  }

  /* ============================================================
     Liste
     ============================================================ */

  function view() {
    var lues = Store.s.lessons;
    var n = window.LESSONS.length;
    var nLues = window.LESSONS.filter(function (l) { return lues[l.k]; }).length;

    var essentiel = window.LESSONS.filter(function (l) { return !l.theme; });
    var parTheme = window.LESSONS.filter(function (l) { return l.theme; });

    UI.mount(
      UI.topbar('Cours', n + ' leçons, l’essentiel et rien d’autre', false) +
      '<div class="stack g20">' +

        '<section class="card quiet stack g8">' +
          '<div class="row between">' +
            '<div class="sec-t">Leçons lues</div>' +
            '<div class="tiny dim num">' + nLues + ' / ' + n + '</div>' +
          '</div>' +
          '<div class="gauge thin"><i data-anime="--pct" style="--pct:' + (Math.round(nLues / n * 100) / 100) + '"></i></div>' +
          '<div class="tiny dim">Une leçon avant de dormir, et elle tient toute la semaine.</div>' +
        '</section>' +

        '<button class="card assist row g12" data-chat>' +
          '<span class="assist-ico">' + Icons.svg('chat', 20) + '</span>' +
          '<span class="grow" style="text-align:left">' +
            '<span class="assist-t">Un mot que tu ne comprends pas ?</span>' +
            '<span class="assist-s">Demande-le à l’assistant, il répond tout de suite.</span>' +
          '</span>' +
          '<span class="dim">' + Icons.svg('suivant', 14) + '</span>' +
        '</button>' +

        section('L’essentiel', essentiel) +
        section('Les ' + parTheme.length + ' thèmes de l’examen', parTheme) +

        '<div style="height:8px"></div>' +
      '</div>'
    );

    UI.animateGauges();
    UI.on('[data-lecon]', 'click', function () { lire(this.getAttribute('data-lecon')); });
    UI.on('[data-chat]', 'click', function () { Chat.view(); });
  }

  function section(titre, liste) {
    return '<section class="stack g10">' +
      '<div class="sec-t">' + UI.esc(titre) + '</div>' +
      liste.map(carte).join('') + '</section>';
  }

  function carte(l) {
    var lue = !!Store.s.lessons[l.k];
    return '<button class="lc' + (lue ? ' lue' : '') + '" data-lecon="' + l.k + '">' +
      '<span class="lc-ico">' + Icons.svg(l.i, 19) + '</span>' +
      '<span class="lc-txt">' +
        '<span class="lc-n">' + UI.esc(l.n) + '</span>' +
        '<span class="lc-r">' + UI.esc(l.resume) + '</span>' +
      '</span>' +
      '<span class="lc-e">' + Icons.svg(lue ? 'valide' : 'suivant', 13) + '</span>' +
    '</button>';
  }

  /* ============================================================
     Lecteur - une idée par écran, comme une série de fiches plutôt
     qu'une longue page à faire défiler. C'est ce qui manquait :
     on peut dessiner sept formes de blocs, mais en empiler quinze
     sur une seule page, ça reste un pavé qu'on abandonne à mi-chemin.
     ============================================================ */

  var lecon = null;      // la leçon en cours de lecture
  var etape = 0;         // 0 = intro, 1..N = blocs[0..N-1], N+1 = fin
  var sens = 'd';        // 'd' (suivant, glisse depuis la droite) ou 'g' (précédent)
  var derniereProgression = 0;   // pct de la barre affichée avant ce rendu

  function lire(k) {
    var l = window.LESSONS.filter(function (x) { return x.k === k; })[0];
    if (!l) return view();

    /* Plein écran : pendant la lecture, la barre d'onglets ne fait
       que proposer de partir ailleurs. */
    document.body.classList.add('no-tabbar');
    var bar = document.getElementById('tabbar');
    if (bar) bar.hidden = true;

    lecon = l;
    etape = 0;
    sens = 'd';
    derniereProgression = 0;
    marquerLue(l);
    brancherBalayage();
    rendreEtape();
  }

  function rendreEtape() {
    var total = lecon.blocs.length;
    var couverture = etape === 0;
    var fin = etape === total + 1;
    var pct = couverture ? 0 : fin ? 1 : etape / total;

    UI.mount(entete(total, couverture, fin) + corpsEtape(total, couverture, fin, sens));

    /* La barre de progression reste ouverte pendant toute la lecture :
       elle doit avancer (ou reculer) depuis là où elle en était, jamais
       repartir de zéro à chaque étape comme le ferait le rejeu générique
       des autres jauges de l'appli. */
    var barre = document.querySelector('.lecon-progres');
    if (barre && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      barre.style.setProperty('--pct', derniereProgression);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { barre.style.setProperty('--pct', pct); });
      });
    }
    derniereProgression = pct;

    UI.on('[data-retour]', 'click', function () { App.go('lessons'); });
    UI.on('[data-lecon]', 'click', function () { lire(this.getAttribute('data-lecon')); });
    UI.on('[data-question]', 'click', function () { Chat.view(lecon); });
    UI.on('[data-resume]', 'click', function () { Chat.resumer(lecon); });
    UI.on('[data-reviser]', 'click', function () {
      var t = this.getAttribute('data-reviser');
      Quiz.start({ mode: 'train', theme: t, questions: Store.trainSet(t, 10) });
    });
    UI.on('[data-suivant]', 'click', suivant);
    UI.on('[data-precedent]', 'click', precedent);
  }

  function entete(total, couverture, fin) {
    if (couverture || fin) {
      return '<header class="topbar">' +
        '<button class="back" data-retour aria-label="Retour aux cours">' + Icons.svg('retour', 18) + '</button>' +
        '<div class="grow"><div class="ttl">' + UI.esc(lecon.n) + '</div></div>' +
      '</header>';
    }
    return '<header class="topbar">' +
      '<button class="back" data-retour aria-label="Retour aux cours">' + Icons.svg('retour', 18) + '</button>' +
      '<div class="grow"><div class="gauge thin">' +
        '<i class="lecon-progres" style="--pct:' + (etape / total) + '"></i>' +
      '</div></div>' +
      '<div class="tiny dim num" style="flex:0 0 auto">' + etape + ' / ' + total + '</div>' +
    '</header>';
  }

  function corpsEtape(total, couverture, fin, sens) {
    if (couverture) {
      /* Un dessin plutôt qu'une pastille : c'est la première chose
         qu'on voit en ouvrant la leçon, et ça annonce le sujet sans
         une ligne de texte de plus. */
      return '<div class="lecon-etape stack g20 glisse-' + sens + '">' +
        '<div class="lecon-tete stack g10 center">' +
          (Illus.has(lecon.k)
            ? '<div class="lecon-illus">' + Illus.render(lecon.k) + '</div>'
            : '<span class="lecon-ico">' + Icons.svg(lecon.i, 24) + '</span>') +
          '<h1>' + UI.esc(lecon.n) + '</h1>' +
          '<p class="lecon-r">' + UI.esc(lecon.resume) + '</p>' +
          '<div class="tiny dim">' + total + ' étapes, à ton rythme</div>' +
        '</div>' +
        '<button class="btn primary block" data-suivant>Commencer</button>' +
      '</div>';
    }
    if (fin) {
      var suivante = leconSuivante(lecon);
      var nb = lecon.theme ? Store.all.filter(function (q) { return q.t === lecon.theme; }).length : 0;
      return '<div class="lecon-etape stack g20 glisse-' + sens + '">' +
        '<div class="lecon-tete stack g10 center">' +
          '<span class="lecon-ico ok">' + Icons.svg('valide', 24) + '</span>' +
          '<h1>Leçon terminée</h1>' +
          '<p class="lecon-r">' + UI.esc(lecon.n) + ', c’est vu.</p>' +
        '</div>' +
        '<div class="stack g10">' +
          (nb ? '<button class="btn primary block" data-reviser="' + lecon.theme + '">' +
            'Réviser ce thème · ' + nb + ' questions</button>' : '') +
          '<button class="btn ghost block" data-resume>Me résumer cette leçon</button>' +
          '<button class="btn ghost block" data-question>Poser une question à l’assistant</button>' +
          (suivante ? '<button class="btn ghost block" data-lecon="' + suivante.k + '">' +
            'Leçon suivante · ' + UI.esc(suivante.n) + '</button>' : '') +
        '</div>' +
      '</div>';
    }
    return '<div class="lecon-etape stack g20 glisse-' + sens + '">' +
      '<div class="lecon-corps">' + bloc(lecon.blocs[etape - 1], lecon) + '</div>' +
      '<div class="row g10">' +
        (etape > 1 ? '<button class="btn ghost" data-precedent>Précédent</button>' : '') +
        '<button class="btn primary block grow" data-suivant>' +
          (etape >= total ? 'Terminer' : 'Suivant') +
        '</button>' +
      '</div>' +
    '</div>';
  }

  function suivant() {
    var total = lecon.blocs.length;
    if (etape <= total) { sens = 'd'; etape++; rendreEtape(); }
  }

  function precedent() {
    if (etape > 0) { sens = 'g'; etape--; rendreEtape(); }
  }

  /* Glisser fait suivre la page au doigt, et non déclencher une
     animation à la fin du geste. La différence se sent : tant que la
     page ne bouge pas pendant qu'on la pousse, l'écran paraît mort le
     temps du glissement, et on ne sait pas si le geste est pris en
     compte avant de l'avoir terminé.

     Trois détails y suffisent : la page colle au doigt au pixel près,
     elle résiste progressivement quand il n'y a plus rien derrière —
     plutôt que de se bloquer net, ce qui se lit comme un plantage —,
     et au relâcher c'est l'élan qui décide, pas seulement la distance.
     Un geste vif et court doit tourner la page ; un geste lent et long
     qui revient en arrière ne doit pas. */
  var balayageBranche = false;

  /* Plus on tire au-delà du bord, moins la page suit : c'est ce que
     font les choses réelles avant de s'arrêter. */
  function resistance(depassement, largeur) {
    var k = 0.55;
    return (depassement * largeur * k) / (largeur + k * Math.abs(depassement));
  }

  /* Où le geste finirait s'il continuait sur son élan, comme le
     défilement inertiel. C'est ce point-là qui décide, et non la
     position au moment précis où le doigt se lève. */
  function projection(vitesse) {
    /* 0,99 et non 0,998 : la seconde est la constante du défilement
       inertiel, faite pour des vitesses de lancer. Pour décider de
       tourner une page elle est bien trop généreuse — elle ajoute
       50 px pour un doigt à 100 px/s, si bien qu'un glissement lent
       et court tournait la page alors qu'il n'en avait pas
       l'intention. */
    var d = 0.99;
    return (vitesse / 1000) * d / (1 - d);
  }

  /* Le retour de page est un ressort, pas une durée fixe. Une durée
     fixe ignore la vitesse qu'avait le doigt au moment du relâcher :
     il reste une couture visible entre le glissement, qui allait vite,
     et l'animation, qui repart de zéro. Un ressort part au contraire
     de la position ET de la vitesse du geste, donc rien ne se voit.
     Il repart aussi toujours de la valeur affichée, ce qui le rend
     interruptible : reprendre la page en plein retour la reprend là où
     elle est, sans saut. */
  function ressortVers0(el, depart, vitesse, fini) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = ''; if (fini) fini(); return;
    }
    /* Amortissement critique : la page revient sans osciller. Le geste
       n'a pas suffi à tourner, donc rien ne justifie un rebond — ce
       serait un rebond de jouet.
       La vitesse est bornée avant d'entrer dans le ressort : deux
       points de mesure très rapprochés donnent une vitesse énorme, et
       la page partait alors à 320 px hors de l'écran avant de revenir.
       Un doigt réel dépasse rarement 1 200 px/s. */
    vitesse = Math.max(-1200, Math.min(1200, vitesse || 0));
    var z = 1, w = 2 * Math.PI / 0.34;
    var x = depart, v = vitesse, dernier = null;
    function pas(t) {
      if (dernier === null) dernier = t;
      var dt = Math.min((t - dernier) / 1000, 0.032);
      dernier = t;
      v += (-w * w * x - 2 * z * w * v) * dt;
      x += v * dt;
      if (Math.abs(x) < 0.4 && Math.abs(v) < 12) {
        el.style.transform = ''; el.style.willChange = '';
        if (fini) fini();
        return;
      }
      el.style.transform = 'translateX(' + x.toFixed(2) + 'px)';
      requestAnimationFrame(pas);
    }
    requestAnimationFrame(pas);
  }

  function brancherBalayage() {
    if (balayageBranche) return;
    balayageBranche = true;

    var page = null, x0 = 0, y0 = 0, suit = false, hist = [];

    function largeur() { return page ? page.getBoundingClientRect().width : 320; }
    function peutPrec() { return etape > 0; }
    function peutSuiv() { return etape <= lecon.blocs.length; }

    function poser(dx) {
      /* dx > 0 : on revient en arrière. dx < 0 : on avance. */
      var l = largeur();
      if ((dx > 0 && !peutPrec()) || (dx < 0 && !peutSuiv())) return resistance(dx, l);
      return dx;
    }

    document.addEventListener('pointerdown', function (e) {
      page = document.querySelector('.lecon-etape');
      if (!page) return;
      /* Un geste qui part d'un bouton lui appartient. */
      if (e.target.closest && e.target.closest('button,a,summary,input')) { page = null; return; }
      x0 = e.clientX; y0 = e.clientY; suit = false;
      hist = [{ x: e.clientX, t: e.timeStamp }];
    }, { passive: true });

    document.addEventListener('pointermove', function (e) {
      if (!page) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      if (!suit) {
        /* Dix pixels avant de s'engager : en dessous, c'est une
           hésitation, pas un geste. Et un mouvement plus vertical
           qu'horizontal appartient au défilement. */
        if (Math.abs(dx) < 10) return;
        if (Math.abs(dx) < Math.abs(dy) * 1.2) { page = null; return; }
        suit = true;
        page.style.transition = 'none';
        page.style.willChange = 'transform';
      }
      hist.push({ x: e.clientX, t: e.timeStamp });
      if (hist.length > 5) hist.shift();
      page.style.transform = 'translateX(' + poser(dx).toFixed(1) + 'px)';
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    function relacher(e) {
      if (!page) return;
      var courant = page;
      page = null;
      if (!suit) return;

      var dx = e.clientX - x0;
      var v = 0;
      if (hist.length > 1) {
        var a = hist[0], b = hist[hist.length - 1];
        var dt = b.t - a.t;
        if (dt > 0) v = (b.x - a.x) / dt * 1000;      // px par seconde
      }
      var vise = dx + projection(v);
      var seuil = largeur() * 0.28;

      courant.style.willChange = '';
      var versSuiv = vise < -seuil && peutSuiv();
      var versPrec = vise > seuil && peutPrec();

      if (versSuiv || versPrec) {
        courant.style.transition = 'transform .18s var(--ease), opacity .18s var(--ease)';
        courant.style.transform = 'translateX(' + (versSuiv ? -largeur() : largeur()) + 'px)';
        courant.style.opacity = '0';
        setTimeout(function () { if (versSuiv) suivant(); else precedent(); }, 150);
      } else {
        /* Rien ne se passe : la page revient se poser, en reprenant la
           vitesse qu'avait le doigt plutôt qu'en repartant de zéro. */
        courant.style.transition = 'none';
        ressortVers0(courant, poser(dx), v);
      }
    }

    document.addEventListener('pointerup', relacher, { passive: true });
    document.addEventListener('pointercancel', function () {
      if (page && suit) {
        page.style.transition = 'transform .3s var(--ease)';
        page.style.transform = 'translateX(0)';
      }
      page = null;
    }, { passive: true });
  }

  function leconSuivante(l) {
    var i = window.LESSONS.indexOf(l);
    return window.LESSONS[i + 1] || null;
  }

  /* Ouvrir une leçon la compte comme lue : on ne demande pas à
     quelqu'un de cocher une case pour prouver qu'il a lu. */
  function marquerLue(l) {
    if (Store.s.lessons[l.k]) return;
    Store.s.lessons[l.k] = Date.now();
    Store.s.xp += 15;
    Store.save();
    UI.celebrate(Store.checkBadges());
  }

  return {
    view: view, lire: lire, bloc: bloc,
    texteDe: texteDe, texteBloc: texteBloc, lienClaude: lienClaude
  };
})();
