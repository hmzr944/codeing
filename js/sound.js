/* ============================================================
   Son - un petit effet de réussite, sans aucun fichier audio.
   Généré au vol avec l'API Web Audio : rien à télécharger, rien
   à héberger, et donc aucune question de droits sur un son tiers.
   ============================================================ */
window.Son = (function () {

  var ctx = null;
  function contexte() {
    if (ctx) return ctx;
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch (e) { ctx = null; }
    return ctx;
  }

  function actif() {
    return !!(Store.s.profile.son !== false);
  }

  /* iOS n'autorise l'audio qu'après un vrai geste de l'utilisateur :
     ce premier contact, déclenché au tout premier appui sur l'appli,
     suffit à garder le contexte prêt pour les sons joués plus tard,
     même depuis un code qui s'exécute après un délai. */
  function armer() {
    var c = contexte();
    if (c && c.state === 'suspended') c.resume();
  }

  /* Une note brève, enveloppe douce pour éviter le clic à l'attaque
     et à la coupure. */
  function note(c, freq, debut, duree, volume) {
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(c.destination);
    var t = c.currentTime + debut;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duree);
    osc.start(t);
    osc.stop(t + duree + 0.02);
  }

  /* Un petit arpège montant (do-mi-sol-do) : le genre de son qui
     accompagne une bonne nouvelle sans devenir criard. Se joue
     quand le score dépasse la moyenne, seulement si les effets
     sonores sont activés dans les réglages. */
  function succes() {
    if (!actif()) return;
    var c = contexte();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
      note(c, f, i * 0.09, 0.35, 0.16);
    });
  }

  return { succes: succes, armer: armer };
})();
