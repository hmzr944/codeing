/* ============================================================
   ASSISTANT - poser une question avec ses mots.

   Il ne devine rien : il cherche dans les 19 leçons et les 460
   questions, et il connaît par cœur le vocabulaire du code, qu'il
   relit directement dans les leçons plutôt que d'en garder une
   copie qui finirait par diverger.

   Ce n'est pas une IA, et il le dit. Quand il ne trouve pas, il
   passe la main à Claude avec la question déjà rédigée : une page
   publiée ne peut pas appeler un modèle elle-même.
   ============================================================ */
window.Chat = (function () {

  var fil = [];                       // le fil de la conversation, en mémoire
  var contexte = null;                // la leçon d'où l'on vient, s'il y en a une

  /* ============================================================
     Ce que l'assistant sait
     ============================================================ */

  /* Le lexique n'est pas recopié ici : il est lu dans les leçons.
     Toute ligne de la forme « Terme : explication » en fait partie. */
  var LEXIQUE = null;

  function lexique() {
    if (LEXIQUE) return LEXIQUE;
    LEXIQUE = [];
    window.LESSONS.forEach(function (l) {
      l.blocs.forEach(function (b) {
        if (b.t !== 'cle') return;
        b.items.forEach(function (item) {
          var m = /^([^:]{2,34}) : (.+)$/.exec(item);
          if (!m) return;
          LEXIQUE.push({
            terme: m[1].trim(),
            cle: Recherche.normaliser(m[1]),
            def: m[2].trim(),
            lecon: l
          });
        });
      });
    });
    /* Les termes longs d'abord : « carte grise » doit gagner sur « carte ». */
    LEXIQUE.sort(function (a, b) { return b.cle.length - a.cle.length; });
    return LEXIQUE;
  }

  var POLITESSE = [
    [/^(bonjour|salut|coucou|hello|bonsoir|hey)\b/, 'Salut Mina. Pose ta question comme elle te vient, même en langage de tous les jours.'],
    [/(merci|super|nickel|top|cool)\b/, 'Avec plaisir. Autre chose ?'],
    [/^(ca va|comment ca va|tu vas bien)/, 'Toujours prêt. Et toi, tu en es à combien de jours de série ?'],
    [/(au revoir|bye|a plus|ciao)\b/, 'À tout à l’heure. Reviens demain, c’est là que ça rentre.']
  ];

  var IDEES = [
    'C’est quoi un accotement ?',
    'Je peux boire combien avec un permis probatoire ?',
    'Distance de sécurité',
    'Qui passe dans un rond-point ?',
    'C’est quoi le PTAC ?',
    'Vitesse sous la pluie'
  ];

  /* ============================================================
     La réponse
     ============================================================ */

  /* Ce que l'assistant a trouvé dans le cours. C'est la seule
     matière dont on dispose : la réponse hors ligne s'en déduit,
     et c'est aussi tout ce que le modèle a le droit de reformuler. */
  function chercherTout(txt) {
    var norme = Recherche.normaliser(txt);

    for (var i = 0; i < POLITESSE.length; i++) {
      if (POLITESSE[i][0].test(norme) && norme.split(' ').length < 6) {
        return { politesse: POLITESSE[i][1] };
      }
    }
    var def = definition(norme);
    var res = Recherche.chercher(txt);
    return { def: def, res: res, sur: !!(def || res.blocs.length || res.questions.length) };
  }

  /* Un mot expliqué se retient mieux avec l'image sous les yeux. On
     montre donc le schéma du sujet quand il en existe un — c'est le
     plus parlant — et sinon le dessin de la leçon citée, qui existe
     toujours. Rien n'est inventé ni téléchargé : tous ces dessins
     sont déjà dans l'application, et fonctionnent hors ligne. */
  var SCHEMA_DU_MOT = [
    [/distance de s|deux secondes|intervalle|s[ée]curit[ée]/i, 'deux-secondes'],
    [/distance d.arr|freinage|temps de r[ée]action/i, 'distance-arret'],
    [/priorit[ée] [àa] droite|c[ée]der le passage|cedez/i, 'priorite-droite'],
    [/giratoire|rond.?point/i, 'giratoire'],
    [/angle mort/i, 'angle-mort'],
    [/cycliste|v[ée]lo/i, 'depassement-cycliste'],
    [/alcool|boire|verre|gramme|alcool[ée]mie/i, 'alcool-temps'],
    [/pneu|usure|sculpture|t[ée]moin/i, 'usure-pneu'],
    [/phare|feux de croisement|plein phare|codes/i, 'portee-feux'],
    [/neige|verglas|adh[ée]rence|pluie/i, 'adherence-neige'],
    [/pause|fatigue|somnolen/i, 'pause-2h'],
    [/position lat[ée]rale|pls|inconscient/i, 'pls'],
    [/panne|bande d.arr[êe]t|triangle/i, 'panne-autoroute'],
    [/point|retrait de permis|infraction/i, 'parcours-sanction'],
    [/vitesse|km\/h|limitation/i, 'vitesses'],
    [/bo[îi]te noire|aide [àa] la conduite|r[ée]gulateur/i, 'aides-conduite']
  ];

  function visuel(question, lecon) {
    for (var i = 0; i < SCHEMA_DU_MOT.length; i++) {
      var d = SCHEMA_DU_MOT[i];
      if (d[0].test(question) && Diagrams.has(d[1])) {
        return '<div class="chat-bloc"><figure class="bl-schema">' +
          Diagrams.render(d[1]) + '</figure></div>';
      }
    }
    if (lecon && window.Illus && Illus.has(lecon.k)) {
      return '<div class="chat-illus">' + Illus.render(lecon.k) + '</div>';
    }
    return '';
  }

  function repondre(txt, trouve) {
    if (trouve.politesse) {
      return { html: '<p>' + UI.esc(trouve.politesse) + '</p>', sur: true };
    }

    var def = trouve.def;
    var res = trouve.res;
    var out = '';
    var sur = false;

    if (def) {
      sur = true;
      out += '<p><b>' + UI.esc(def.terme) + '</b> — ' + UI.esc(def.def) + '</p>' +
        visuel(txt, def.lecon) +
        lien(def.lecon, 'Lire « ' + def.lecon.n + ' »');
    }

    if (!def && res.blocs.length) {
      sur = true;
      var b = res.blocs[0];
      /* Un bloc « panneaux » ou « schéma » se dessine déjà tout seul :
         n'ajouter une image que lorsque le passage cité est du texte. */
      var dejaDessine = b.bloc.t === 'panneaux' || b.bloc.t === 'schema';
      out += '<div class="chat-bloc">' + Cours.bloc(b.bloc) + '</div>' +
        (dejaDessine ? '' : visuel(txt, b.lecon)) +
        lien(b.lecon, 'Lire « ' + b.lecon.n + ' »');
    }

    if (!sur && res.questions.length) {
      sur = true;
      out += '<p>Je n’ai pas de définition, mais l’examen pose cette question :</p>' +
        res.questions.slice(0, 2).map(function (q) {
          return '<div class="chat-q">' +
            '<div class="chat-q-q">' + UI.esc(q.q) + '</div>' +
            '<div class="chat-q-a">' + UI.esc(q.a.map(function (n) { return q.o[n]; }).join(' + ')) + '</div>' +
            '<div class="chat-q-e">' + UI.esc(q.e) + '</div>' +
          '</div>';
        }).join('');
    } else if (sur && res.questions.length) {
      var q0 = res.questions[0];
      out += '<div class="chat-q">' +
        '<div class="chat-q-q">' + UI.esc(q0.q) + '</div>' +
        '<div class="chat-q-a">' + UI.esc(q0.a.map(function (n) { return q0.o[n]; }).join(' + ')) + '</div>' +
      '</div>';
    }

    if (!sur) {
      out = '<p>Je ne trouve rien de sûr là-dessus, et je préfère le dire plutôt que d’inventer.</p>';
    }

    out += claude(txt, sur);
    return { html: out, sur: sur };
  }

  function claude(txt, sur) {
    return '<a class="chat-lien" target="_blank" rel="noopener" href="' +
      UI.esc(Cours.lienClaude(prompt(txt))) + '">' +
      Icons.svg('ouvrir', 14) + (sur ? 'Demander autrement à Claude' : 'Demander à Claude') + '</a>';
  }

  /* Réponse reformulée par le modèle. Le passage du cours qui l'a
     nourrie reste consultable juste en dessous : une explication
     qu'on ne peut pas recouper ne vaut rien pour un examen. */
  /* Le dessin accompagne la réponse du modèle, il ne se range pas
     dans « d'où ça vient » : une image repliée derrière un volet
     n'aide personne à comprendre. */
  function avecSource(texte, local, image) {
    return texte.split(/\n+/).filter(Boolean).map(function (p) {
      return '<p>' + UI.esc(p) + '</p>';
    }).join('') + (image || '') +
      '<details class="src"><summary>D’où ça vient</summary>' +
      '<div class="src-c">' + local + '</div></details>';
  }

  /* Un terme du lexique cité dans la question */
  function definition(norme) {
    var L = lexique();
    for (var i = 0; i < L.length; i++) {
      if (L[i].cle.length < 3) continue;
      if (new RegExp('\\b' + L[i].cle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(norme)) {
        return L[i];
      }
    }
    return null;
  }

  function lien(l, libelle) {
    return '<button class="chat-lien" data-lecon="' + l.k + '">' +
      Icons.svg('fiches', 14) + UI.esc(libelle) + '</button>';
  }

  /* Le contexte part avec la question : sans lui, Claude répond à
     côté quand on lui écrit juste « angle mort ». */
  function prompt(txt) {
    return 'Je révise le code de la route en France (examen 2026). ' +
      (contexte && contexte.titre ? 'Contexte : ' + contexte.titre + '. ' : '') +
      (contexte && contexte.question ? 'Question posée : ' + contexte.question + ' ' : '') +
      'Explique-moi simplement, avec un exemple concret : ' + txt;
  }

  /* ============================================================
     L'écran

     Deux habillages pour la même conversation : une page entière,
     depuis les cours, et une feuille posée par-dessus le quiz. La
     feuille est indispensable là-bas : quitter la page perdrait la
     session en cours.
     ============================================================ */

  var racine = null;                  // là où le fil est rendu

  function accueillir() {
    if (fil.length) return;
    fil.push({ de: 'bot', html:
      '<p>Salut Mina. Je cherche dans les ' + window.LESSONS.length + ' leçons et les ' +
      Store.all.length + ' questions, et je connais tout le vocabulaire du code.</p>' +
      '<p class="chat-note">' + (IA.configuree()
        ? 'Je ne réponds qu’avec ce qu’il y a dans le cours, jamais de mémoire. Tu peux toujours vérifier d’où vient ma réponse.'
        : 'Je ne suis pas une IA : si je ne trouve pas, je te passe Claude.') + '</p>' });
  }

  /* Le corps commun aux deux habillages. Les idées de question ne
     servent qu'au démarrage : une fois qu'on a posé la sienne, on
     sait quoi taper et elles ne font qu'occuper l'écran. */
  var aDemande = false;

  function corps() {
    return '<div class="chat" id="fil">' + fil.map(bulle).join('') + '</div>' +
      '<div class="chat-idees row wrap g8" id="idees"' + (aDemande ? ' hidden' : '') + '>' +
        IDEES.map(function (s) {
          return '<button class="pill" data-idee="' + UI.esc(s) + '">' + UI.esc(s) + '</button>';
        }).join('') +
      '</div>' +
      '<form class="chat-saisie" id="saisie">' +
        '<div class="chercher grow">' +
          '<input id="msg" type="text" autocomplete="off" enterkeyhint="send" ' +
            'placeholder="Écris ta question…" aria-label="Ta question">' +
        '</div>' +
        '<button class="chat-envoi" type="submit" aria-label="Envoyer">' +
          Icons.svg('envoyer', 18) + '</button>' +
      '</form>';
  }

  /* ---- page entière, depuis les cours ---- */
  function view(lecon, intention) {
    contexte = lecon ? { titre: lecon.n, lecon: lecon,
      amorce: 'Tu lisais « ' + lecon.n + ' ». Quel mot n’était pas clair ?' } : null;
    accueillir();
    if (!intention) amorcer();

    document.body.classList.add('no-tabbar');
    var bar = document.getElementById('tabbar');
    if (bar) bar.hidden = true;

    racine = UI.mount(
      '<header class="topbar">' +
        '<button class="back" data-retour aria-label="Retour aux cours">' +
          Icons.svg('retour', 18) + '</button>' +
        '<div class="grow"><div class="ttl">Assistant</div>' +
        '<div class="sub">Il cherche dans le cours, il n’invente pas</div></div>' +
      '</header>' +
      '<div class="chat-page">' + corps() + '</div>'
    );

    brancher();
    UI.on('[data-retour]', 'click', function () { App.go('lessons'); });
    if (intention) intention();
  }

  /* ---- résumer une leçon ---- */
  function resumer(lecon) {
    view(lecon, function () {
      lancer({
        mode: 'resume', lecon: lecon,
        demande: 'Résume-moi cette leçon, je révise vite.'
      }, 'Résume-moi « ' + lecon.n + ' »', resumeLocal(lecon));
    });
  }

  /* Sans modèle, le résumé se fabrique quand même : on ne garde que
     les blocs faits pour être retenus. */
  function resumeLocal(lecon) {
    var gardes = lecon.blocs.filter(function (b) {
      return b.t === 'retenir' || b.t === 'piege' || b.t === 'chiffres';
    });
    if (!gardes.length) gardes = lecon.blocs.slice(0, 2);
    return '<p>Voici ce qu’il faut retenir de « ' + UI.esc(lecon.n) + ' ».</p>' +
      '<div class="chat-bloc stack g10">' + gardes.map(Cours.bloc).join('') + '</div>' +
      lien(lecon, 'Relire la leçon en entier');
  }

  /* ---- décortiquer une erreur ---- */
  function expliquerErreur(q, choisi) {
    var bonne = q.a.map(function (i) { return q.o[i]; });
    lancer({
      mode: 'erreur', q: q, choisi: choisi,
      res: Recherche.chercher(q.q + ' ' + q.e),
      demande: 'Pourquoi ma réponse est fausse ?'
    }, 'Pourquoi « ' + choisi.join(' + ') +' » est faux ?', erreurLocale(q, choisi, bonne));
  }

  function erreurLocale(q, choisi, bonne) {
    var res = Recherche.chercher(q.q + ' ' + q.e);
    return '<p>Tu as coché <b>' + UI.esc(choisi.join(' + ')) + '</b>.</p>' +
      '<p>La bonne réponse était <b>' + UI.esc(bonne.join(' + ')) + '</b>.</p>' +
      '<p>' + UI.esc(q.e) + '</p>' +
      (q.tip ? '<p class="chat-note">Astuce : ' + UI.esc(q.tip) + '</p>' : '') +
      (res.blocs.length
        ? '<div class="chat-bloc">' + Cours.bloc(res.blocs[0].bloc) + '</div>' +
          lien(res.blocs[0].lecon, 'Lire « ' + res.blocs[0].lecon.n + ' »')
        : '');
  }

  /* ---- feuille posée sur le quiz ----
     Deux sorties, que l'appelant fournit : « reprendre » quand on
     referme la feuille, « quitter » quand on part lire une leçon,
     car il faut alors arrêter proprement la session en cours. */
  var sorties = {};

  function ouvrir(ctx, opts, intention) {
    if (document.getElementById('feuille')) return;
    contexte = ctx || null;
    sorties = opts || {};
    accueillir();
    if (!intention) amorcer();

    var f = document.createElement('div');
    f.id = 'feuille';
    f.className = 'feuille';
    f.innerHTML =
      '<div class="feuille-fond" data-fermer></div>' +
      '<section class="feuille-panneau" role="dialog" aria-label="Assistant">' +
        '<div class="feuille-tete row between">' +
          '<div><div class="ttl">Assistant</div>' +
          '<div class="sub">Il cherche dans le cours, il n’invente pas</div></div>' +
          '<button class="back" data-fermer aria-label="Fermer">' + Icons.svg('fermer', 18) + '</button>' +
        '</div>' + corps() +
      '</section>';
    document.body.appendChild(f);
    racine = f;

    brancher();
    UI.on('[data-fermer]', 'click', function () { fermer(); }, f);
    var zone = f.querySelector('#fil');
    zone.scrollTop = zone.scrollHeight;
    if (intention) intention();
  }

  /* La feuille se retire par le chemin inverse de son arrivée (voir
     .feuille.fermeture dans le CSS) au lieu de disparaître d'un coup :
     on attend la fin de cette animation avant de retirer le nœud. */
  function fermer(reprendre) {
    var f = document.getElementById('feuille');
    if (!f || f.classList.contains('fermeture')) return;
    f.classList.add('fermeture');
    racine = null;
    var fn = reprendre === false ? sorties.quitter : sorties.reprendre;
    sorties = {};
    setTimeout(function () {
      f.remove();
      if (fn) fn();
    }, 270);
  }

  /* La première bulle rappelle d'où l'on vient : sans cela, on ne
     sait plus de quelle question on parlait. */
  function amorcer() {
    if (!contexte) return;
    fil.push({ de: 'bot', html: '<p>' + UI.esc(contexte.amorce) + '</p>' +
      (contexte.question ? '<div class="chat-q"><div class="chat-q-q">' +
        UI.esc(contexte.question) + '</div></div>' : '') });
  }

  function bulle(m) {
    return '<div class="msg ' + m.de + '">' + m.html + '</div>';
  }

  function el(id) { return (racine || document).querySelector('#' + id); }

  function brancher() {
    var form = el('saisie');
    var champ = el('msg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      envoyer(champ.value);
      champ.value = '';
    });

    UI.on('[data-idee]', 'click', function () { envoyer(this.getAttribute('data-idee')); }, racine);

    /* Un seul écouteur sur le fil, posé une fois : les réponses
       arrivent au fil de l'eau et rebrancher à chaque message
       empilerait les gestionnaires sur les bulles déjà là.
       Ouvrir une leçon depuis la feuille quitte la session : on la
       referme proprement d'abord. */
    el('fil').addEventListener('click', function (e) {
      var b = e.target.closest('[data-lecon]');
      if (!b) return;
      var k = b.getAttribute('data-lecon');
      if (document.getElementById('feuille')) fermer(false);
      Cours.lire(k);
    });
  }

  function envoyer(txt) {
    txt = (txt || '').trim();
    if (!txt) return;

    ajouter({ de: 'moi', html: '<p>' + UI.esc(txt) + '</p>' });

    aDemande = true;
    var idees = el('idees');
    if (idees) idees.hidden = true;

    var trouve = chercherTout(txt);

    /* La politesse et l'absence de résultat n'ont rien à reformuler :
       appeler le modèle sans extrait reviendrait à lui demander
       d'improviser, ce qu'on cherche justement à empêcher. */
    if (trouve.politesse || !trouve.sur) {
      ajouter({ de: 'bot', html: repondre(txt, trouve).html });
      return;
    }

    var local = repondre(txt, trouve).html;
    var lecon = (trouve.def && trouve.def.lecon) ||
      (trouve.res.blocs[0] && trouve.res.blocs[0].lecon) || null;
    var image = visuel(txt, lecon);
    if (contexte && contexte.question) {
      txt += '\n(elle est sur cette question d’examen : ' + contexte.question + ')';
    }
    interroger({ mode: 'expliquer', demande: txt, res: trouve.res, def: trouve.def }, local, image);
  }

  /* Poser une demande qui ne vient pas du champ de saisie : le
     résumé d'une leçon, l'explication d'une erreur. On écrit la
     bulle de Mina pour elle, puis on suit le même chemin. */
  function lancer(d, libelle, local, image) {
    aDemande = true;
    var idees = el('idees');
    if (idees) idees.hidden = true;
    ajouter({ de: 'moi', html: '<p>' + UI.esc(libelle) + '</p>' });
    interroger(d, local, image);
  }

  /* Le modèle reformule, le cours reste la source. Sans relais, sans
     réseau, ou s'il ne répond pas, la réponse hors ligne est déjà
     prête : l'attente ne peut jamais laisser Mina sans rien. */
  function interroger(d, local, image) {
    if (!IA.disponible()) {
      ajouter({ de: 'bot', html: local });
      return;
    }
    var attente = ajouter({ de: 'bot', html: reflechit() });
    IA.demander(d)
      .then(function (texte) { remplacer(attente, avecSource(texte, local, image)); })
      .catch(function () { remplacer(attente, local); });
  }

  function reflechit() {
    return '<div class="pense" aria-label="L’assistant cherche"><i></i><i></i><i></i></div>';
  }

  /* Ajoute une bulle et rend son index, pour pouvoir la remplacer
     quand la réponse du modèle arrive. */
  function ajouter(msg) {
    fil.push(msg);
    var zone = el('fil');
    if (zone) {
      zone.insertAdjacentHTML('beforeend', bulle(msg));
      /* Dans la feuille c'est le fil qui défile, dans la page c'est
         la fenêtre : scrollIntoView couvre les deux. */
      zone.lastElementChild.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
    return fil.length - 1;
  }

  function remplacer(i, html) {
    fil[i] = { de: 'bot', html: html };
    var zone = el('fil');
    if (!zone) return;
    var noeud = zone.children[i];
    if (!noeud) return;
    noeud.outerHTML = bulle(fil[i]);
    zone.children[i].scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  return { view: view, ouvrir: ouvrir, fermer: fermer,
           resumer: resumer, expliquerErreur: expliquerErreur };
})();
