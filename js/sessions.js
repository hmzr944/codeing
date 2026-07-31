/* ============================================================
   Sessions - plusieurs personnes peuvent réviser sur le même
   appareil sans se marcher dessus, et surtout sans se voir.

   Chaque session a son propre coffre dans le stockage local du
   navigateur : sa progression, ses erreurs, ses leçons lues, ses
   discussions avec l'assistant. Rien n'est partagé entre deux
   sessions, et rien ne quitte l'appareil — il n'y a pas de serveur.

   Deux appareils différents, c'est déjà deux mondes séparés : le
   lien GitHub ne transporte que l'application, jamais les données.
   Ce fichier règle le cas de l'appareil partagé.

   Le code à quatre chiffres est une porte, pas un coffre-fort : il
   empêche d'ouvrir la session de quelqu'un d'autre par mégarde ou
   par curiosité. Quelqu'un qui sait ouvrir les outils de
   développement du navigateur peut lire le stockage local. On le dit
   à l'écran plutôt que de laisser croire à un chiffrement.

   Ce fichier est chargé AVANT store.js : le magasin doit savoir dans
   quel coffre lire dès sa première ligne.
   ============================================================ */
window.Sessions = (function () {

  var REGISTRE = 'feuvert.sessions';
  /* La clé historique. La toute première session garde exactement
     celle-ci : sans quoi une progression déjà commencée se
     retrouverait orpheline au premier lancement de cette version. */
  var CLE_BASE = 'feuvert.v1';

  function lireBrut(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function ecrireBrut(k, v) {
    try { localStorage.setItem(k, v); return true; } catch (e) { return false; }
  }

  function charger() {
    try {
      var r = JSON.parse(lireBrut(REGISTRE));
      if (r && r.liste && r.liste.length) return r;
    } catch (e) {}
    return null;
  }

  function enregistrer() { ecrireBrut(REGISTRE, JSON.stringify(reg)); }

  function nouvelId() {
    return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  var reg = charger();

  if (!reg) {
    reg = { v: 1, liste: [], actif: '' };
    /* Migration : une progression existante devient la session n° 1,
       en gardant sa clé. Son prénom sert de nom de session. */
    var ancien = lireBrut(CLE_BASE);
    var nom = '';
    if (ancien) {
      try { nom = ((JSON.parse(ancien) || {}).profile || {}).name || ''; } catch (e2) {}
    }
    var premiere = {
      id: nouvelId(), nom: nom, cle: CLE_BASE,
      cree: Date.now(), vu: Date.now(), code: ''
    };
    reg.liste.push(premiere);
    reg.actif = premiere.id;
    enregistrer();
  }

  function parId(id) {
    for (var i = 0; i < reg.liste.length; i++) if (reg.liste[i].id === id) return reg.liste[i];
    return null;
  }

  function actif() {
    return parId(reg.actif) || reg.liste[0] || null;
  }

  /* La clé de stockage du magasin. Appelée par store.js à son
     chargement, donc avant toute autre chose. */
  function cle() {
    var s = actif();
    return s ? s.cle : CLE_BASE;
  }

  function liste() {
    /* La plus récemment ouverte en tête : c'est presque toujours
       celle qu'on veut rouvrir. */
    return reg.liste.slice().sort(function (a, b) { return (b.vu || 0) - (a.vu || 0); });
  }

  function creer(nom) {
    var id = nouvelId();
    var s = {
      id: id, nom: (nom || '').trim(), cle: CLE_BASE + '.' + id,
      cree: Date.now(), vu: Date.now(), code: ''
    };
    reg.liste.push(s);
    reg.actif = id;
    enregistrer();
    return s;
  }

  function ouvrir(id) {
    var s = parId(id);
    if (!s) return false;
    s.vu = Date.now();
    reg.actif = id;
    enregistrer();
    return true;
  }

  /* Le nom de session suit le prénom du profil : on ne demande pas
     deux fois la même chose à la même personne. */
  function nommer(nom) {
    var s = actif();
    if (!s) return;
    s.nom = (nom || '').trim();
    enregistrer();
  }

  function marquerVue() {
    var s = actif();
    if (!s) return;
    s.vu = Date.now();
    enregistrer();
  }

  /* --- verrou --- */

  function verrouillee(id) {
    var s = parId(id);
    return !!(s && s.code);
  }

  function definirCode(code) {
    var s = actif();
    if (!s) return false;
    code = String(code || '').replace(/\D/g, '');
    if (code && code.length !== 4) return false;
    s.code = code;
    enregistrer();
    return true;
  }

  function verifierCode(id, code) {
    var s = parId(id);
    if (!s || !s.code) return true;
    return s.code === String(code || '').replace(/\D/g, '');
  }

  /* --- sortie et suppression --- */

  /* Quitter ne supprime rien : la progression reste dans son coffre,
     l'appli redemande simplement qui ouvre au prochain lancement. */
  function quitter() {
    reg.actif = '';
    enregistrer();
    try { sessionStorage.removeItem('feuvert-session-ouverte'); } catch (e) {}
  }

  function aucuneOuverte() { return !parId(reg.actif); }

  function supprimer(id) {
    var s = parId(id);
    if (!s) return false;
    try {
      localStorage.removeItem(s.cle);
      localStorage.removeItem(s.cle + '.secours');
    } catch (e) {}
    reg.liste = reg.liste.filter(function (x) { return x.id !== id; });
    if (reg.actif === id) reg.actif = '';
    if (!reg.liste.length) {
      var neuve = { id: nouvelId(), nom: '', cle: CLE_BASE, cree: Date.now(), vu: Date.now(), code: '' };
      reg.liste.push(neuve);
      reg.actif = neuve.id;
    }
    enregistrer();
    return true;
  }

  /* Recharger la page est la seule façon sûre de changer de coffre :
     le magasin lit sa clé une fois, au chargement du script. */
  function basculer(id) {
    if (!ouvrir(id)) return;
    try { sessionStorage.setItem('feuvert-session-ouverte', '1'); } catch (e) {}
    location.reload();
  }

  return {
    cle: cle, actif: actif, liste: liste, creer: creer, ouvrir: ouvrir,
    basculer: basculer, nommer: nommer, marquerVue: marquerVue,
    verrouillee: verrouillee, definirCode: definirCode, verifierCode: verifierCode,
    quitter: quitter, aucuneOuverte: aucuneOuverte, supprimer: supprimer
  };
})();
