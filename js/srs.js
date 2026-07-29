/* ============================================================
   SRS - répétition espacée (système de boîtes de Leitner)
   Une question réussie monte d'une boîte, une erreur la renvoie
   presque au début. Plus la boîte est haute, plus l'intervalle
   avant la prochaine révision est long.
   ============================================================ */
window.SRS = (function () {

  // Intervalle en jours avant la prochaine révision, par boîte
  var INTERVALS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16, 6: 35 };
  var MAX_BOX = 6;

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function addDays(iso, days) {
    var p = iso.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function daysBetween(a, b) {
    var pa = a.split('-'), pb = b.split('-');
    var da = new Date(+pa[0], +pa[1] - 1, +pa[2]);
    var db = new Date(+pb[0], +pb[1] - 1, +pb[2]);
    return Math.round((db - da) / 86400000);
  }

  /* Nouvelle fiche */
  function fresh() {
    return { b: 1, due: today(), seen: 0, ok: 0, ko: 0, last: '' };
  }

  /* Met à jour une fiche après une réponse */
  function grade(card, correct) {
    card = card || fresh();
    card.seen = (card.seen || 0) + 1;
    card.last = today();
    if (correct) {
      card.ok = (card.ok || 0) + 1;
      card.b = Math.min(MAX_BOX, (card.b || 1) + 1);
    } else {
      card.ko = (card.ko || 0) + 1;
      // Une erreur fait retomber de deux boîtes minimum (jamais sous 1)
      card.b = Math.max(1, (card.b || 1) - 2);
    }
    card.due = addDays(today(), INTERVALS[card.b]);
    return card;
  }

  function isDue(card) {
    if (!card) return true;                    // jamais vue → à découvrir
    return daysBetween(card.due, today()) >= 0; // échéance atteinte ou dépassée
  }

  /* Une question est « ancrée » à partir de la boîte 5 */
  function isMastered(card) { return card && card.b >= 5; }

  return {
    today: today, addDays: addDays, daysBetween: daysBetween,
    fresh: fresh, grade: grade, isDue: isDue, isMastered: isMastered,
    MAX_BOX: MAX_BOX, INTERVALS: INTERVALS
  };
})();
