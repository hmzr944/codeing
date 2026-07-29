/* ============================================================
   ASSISTANT - poser une question avec ses mots.

   Il ne devine rien : il cherche dans les 19 leçons et les 459
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

  function repondre(txt) {
    var norme = Recherche.normaliser(txt);

    for (var i = 0; i < POLITESSE.length; i++) {
      if (POLITESSE[i][0].test(norme) && norme.split(' ').length < 6) {
        return { html: '<p>' + UI.esc(POLITESSE[i][1]) + '</p>', sur: true };
      }
    }

    var def = definition(norme);
    var res = Recherche.chercher(txt);
    var out = '';
    var sur = false;

    if (def) {
      sur = true;
      out += '<p><b>' + UI.esc(def.terme) + '</b> — ' + UI.esc(def.def) + '</p>' +
        lien(def.lecon, 'Lire « ' + def.lecon.n + ' »');
    }

    if (!def && res.blocs.length) {
      sur = true;
      var b = res.blocs[0];
      out += '<div class="chat-bloc">' + Cours.bloc(b.bloc) + '</div>' +
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

    out += '<a class="chat-lien" target="_blank" rel="noopener" href="' +
      UI.esc(Cours.lienClaude(prompt(txt))) + '">' +
      Icons.svg('ouvrir', 14) + (sur ? 'Demander autrement à Claude' : 'Demander à Claude') + '</a>';

    return { html: out, sur: sur };
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
      '<p class="chat-note">Je ne suis pas une IA : si je ne trouve pas, je te passe Claude.</p>' });
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
  function view(lecon) {
    contexte = lecon ? { titre: lecon.n, amorce: 'Tu lisais « ' + lecon.n + ' ». Quel mot n’était pas clair ?' } : null;
    accueillir();
    amorcer();

    document.body.classList.add('no-tabbar');
    var bar = document.getElementById('tabbar');
    if (bar) bar.hidden = true;

    racine = UI.mount(
      '<header class="topbar">' +
        '<button class="back" data-retour aria-label="Retour aux cours">' +
          Icons.svg('retour', 18) + '</button>' +
        '<div class="grow"><div class="ttl">Assistant</div>' +
        '<div class="sub">Il cherche dans le cours, il n’invente pas</div></div>' +
      '</header>' + corps()
    );

    brancher();
    UI.on('[data-retour]', 'click', function () { App.go('lessons'); });
  }

  /* ---- feuille posée sur le quiz ----
     Deux sorties, que l'appelant fournit : « reprendre » quand on
     referme la feuille, « quitter » quand on part lire une leçon,
     car il faut alors arrêter proprement la session en cours. */
  var sorties = {};

  function ouvrir(ctx, opts) {
    if (document.getElementById('feuille')) return;
    contexte = ctx || null;
    sorties = opts || {};
    accueillir();
    amorcer();

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
  }

  function fermer(reprendre) {
    var f = document.getElementById('feuille');
    if (f) f.remove();
    racine = null;
    var fn = reprendre === false ? sorties.quitter : sorties.reprendre;
    sorties = {};
    if (fn) fn();
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

    fil.push({ de: 'moi', html: '<p>' + UI.esc(txt) + '</p>' });
    var r = repondre(txt);
    fil.push({ de: 'bot', html: r.html });

    var zone = el('fil');
    zone.insertAdjacentHTML('beforeend', bulle(fil[fil.length - 2]) + bulle(fil[fil.length - 1]));

    aDemande = true;
    var idees = el('idees');
    if (idees) idees.hidden = true;

    /* Dans la feuille c'est le fil qui défile, dans la page c'est la
       fenêtre : scrollIntoView couvre les deux. */
    zone.lastElementChild.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  return { view: view, ouvrir: ouvrir, fermer: fermer };
})();
