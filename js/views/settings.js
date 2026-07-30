/* ============================================================
   Réglages - profil, objectif quotidien, rappel, thème
   ============================================================ */
window.Settings = (function () {

  function view() {
    var P = Store.s.profile;

    var html =
      UI.topbar('Réglages', 'Tout reste sur cet appareil') +
      '<div class="stack g20">' +

        '<section class="card stack g20">' +
          '<div class="field">' +
            '<label for="f-name">Prénom</label>' +
            '<input id="f-name" type="text" autocomplete="given-name" maxlength="20" ' +
              'placeholder="Ton prénom" value="' + UI.esc(P.name) + '">' +
            '<div class="help">Sert uniquement à personnaliser l’accueil.</div>' +
          '</div>' +
          '<div class="field">' +
            '<label for="f-date">Date de l’examen</label>' +
            '<input id="f-date" type="date" value="' + UI.esc(P.examDate) + '">' +
            '<div class="help">Affiche un compte à rebours et adapte le rythme conseillé.</div>' +
          '</div>' +
        '</section>' +

        '<section class="card stack g12">' +
          '<div class="stack g4">' +
            '<div class="sec-t">Objectif quotidien</div>' +
            '<div class="tiny dim">C’est ce nombre qui valide ta journée et fait grandir la série.</div>' +
          '</div>' +
          '<div class="seg" id="goal">' +
            [10, 20, 30, 40].map(function (n) {
              return '<button data-goal="' + n + '" class="' + (n === P.goal ? 'on' : '') + '">' + n + '</button>';
            }).join('') +
          '</div>' +
          '<div class="tiny dim">10 tient en 3 minutes. 20 est le bon compromis. 40 est un rythme d’avant-examen.</div>' +
        '</section>' +

        '<section class="card stack g12">' +
          '<div class="stack g4">' +
            '<div class="sec-t">Rappel quotidien</div>' +
            '<div class="tiny dim">Un site web ne peut pas envoyer de notification quand il est fermé. ' +
            'Le rappel dans le calendrier, lui, fonctionne même téléphone verrouillé.</div>' +
          '</div>' +
          '<div class="field">' +
            '<label for="f-time">Heure du rappel</label>' +
            '<input id="f-time" type="time" value="' + UI.esc(P.reminder || '19:30') + '">' +
          '</div>' +
          '<button class="btn block" data-ics>Ajouter le rappel à mon calendrier</button>' +
          '<button class="btn ghost block" data-notif>Autoriser les notifications dans l’app</button>' +
        '</section>' +

        '<section class="card stack g12">' +
          '<div class="sec-t">Apparence</div>' +
          '<div class="seg" id="theme">' +
            [['auto', 'Auto'], ['nuit', 'Nuit'], ['jour', 'Jour']].map(function (t) {
              return '<button data-theme="' + t[0] + '" class="' + (t[0] === P.theme ? 'on' : '') + '">' + t[1] + '</button>';
            }).join('') +
          '</div>' +
        '</section>' +

        '<section class="card stack g10">' +
          '<div class="sec-t">Données</div>' +
          '<div class="tiny dim">Aucun compte, aucun serveur : ta progression vit dans ce navigateur. ' +
          'Vider les données du site l’efface définitivement.</div>' +
          '<button class="btn ghost block" data-export>Exporter ma progression</button>' +
          '<button class="btn ghost block" data-reset style="color:var(--ko)">Tout réinitialiser</button>' +
        '</section>' +

        '<p class="tiny dim center" style="padding:0 10px 20px;line-height:1.5">' +
          'Contenu pédagogique fondé sur la réglementation en vigueur. ' +
          'Il complète une formation en auto-école, il ne la remplace pas.</p>' +

      '</div>';

    UI.mount(html);
    bind();
  }

  function bind() {
    document.getElementById('f-name').addEventListener('input', function () {
      Store.s.profile.name = this.value.trim(); Store.save();
    });
    document.getElementById('f-date').addEventListener('change', function () {
      Store.s.profile.examDate = this.value; Store.saveNow();
      UI.toast(this.value ? 'Compte à rebours activé' : 'Compte à rebours retiré', 'calendrier');
    });
    document.getElementById('f-time').addEventListener('change', function () {
      Store.s.profile.reminder = this.value; Store.save();
    });

    UI.on('[data-goal]', 'click', function () {
      Store.s.profile.goal = +this.getAttribute('data-goal'); Store.saveNow();
      var b = document.querySelectorAll('#goal button');
      for (var i = 0; i < b.length; i++) b[i].classList.toggle('on', b[i] === this);
    });

    UI.on('#theme [data-theme]', 'click', function () {
      var t = this.getAttribute('data-theme');
      Store.s.profile.theme = t; Store.saveNow();
      App.applyTheme();
      var b = document.querySelectorAll('#theme button');
      for (var i = 0; i < b.length; i++) b[i].classList.toggle('on', b[i] === this);
    });

    UI.on('[data-ics]', 'click', downloadIcs);

    UI.on('[data-notif]', 'click', function () {
      if (!('Notification' in window)) { UI.toast('Notifications non gérées par ce navigateur', '⚠️'); return; }
      Notification.requestPermission().then(function (p) {
        UI.toast(p === 'granted'
          ? 'Rappel actif quand l’app est ouverte'
          : 'Notifications refusées', p === 'granted' ? 'alerte' : 'fermer');
      });
    });

    UI.on('[data-export]', 'click', function () {
      var blob = new Blob([JSON.stringify(Store.s, null, 2)], { type: 'application/json' });
      dl(blob, 'feu-vert-progression.json');
      UI.toast('Sauvegarde téléchargée', 'telecharger');
    });

    UI.on('[data-reset]', 'click', function () {
      if (confirm('Effacer toute la progression : série, statistiques, succès ?')) {
        Store.reset(); App.applyTheme(); App.go('home');
        UI.toast('Progression remise à zéro', 'poubelle');
      }
    });
  }

  /* Rappel calendrier : c'est la seule méthode fiable hors ligne
     pour ramener quelqu'un chaque jour sans serveur de push. */
  function downloadIcs() {
    var t = (document.getElementById('f-time').value || '19:30').split(':');
    var hh = ('0' + t[0]).slice(-2), mm = ('0' + t[1]).slice(-2);
    var d = new Date(); d.setDate(d.getDate() + 1);
    var stamp = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);

    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Feu Vert//Code 2026//FR',
      'BEGIN:VEVENT',
      'UID:feuvert-' + Date.now() + '@local',
      'DTSTART:' + stamp + 'T' + hh + mm + '00',
      'DURATION:PT10M',
      'RRULE:FREQ=DAILY',
      'SUMMARY:Code de la route, 10 minutes',
      'DESCRIPTION:Défi du jour sur Feu Vert. Dix minutes suffisent pour garder la série.',
      'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY',
      'DESCRIPTION:Défi du jour', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');

    dl(new Blob([ics], { type: 'text/calendar' }), 'rappel-code-2026.ics');
    UI.toast('Rappel quotidien à ' + hh + ':' + mm, 'calendrier');
  }

  function dl(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  return { view: view };
})();
