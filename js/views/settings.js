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
          '<div class="stack g8">' +
            '<div class="sec-t">Objectif d’examen</div>' +
            '<div class="tiny dim">' + (P.examDate
              ? 'Dans ' + UI.plural(SRS.daysBetween(SRS.today(), P.examDate), 'jour') +
                '. Un compte à rebours et un rythme conseillé s’adaptent sur l’accueil.'
              : 'Dans combien de temps veux-tu être prête ? Un compte à rebours et un rythme conseillé s’adaptent sur l’accueil.') +
            '</div>' +
            '<div class="stack g8">' +
              delaiBtn(14, '2 semaines') + delaiBtn(30, '1 mois') + delaiBtn(60, '2 mois') +
              delaiBtn(90, '3 mois') + delaiBtn(0, 'Aucun objectif') +
            '</div>' +
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
          '<button class="switch" data-son>' +
            '<span class="stack g4" style="text-align:left">' +
              '<span class="t">Effets sonores</span>' +
              '<span class="s">Un petit son quand le score dépasse la moyenne.</span>' +
            '</span>' +
            '<span class="knob' + (P.son !== false ? ' on' : '') + '"></span>' +
          '</button>' +
        '</section>' +

        sectionSession() +

        '<section class="card stack g10">' +
          '<div class="sec-t">Données</div>' +
          '<div class="tiny dim">Aucun compte, aucun serveur : ta progression vit dans ce navigateur. ' +
          'Vider les données du site l’efface définitivement : exporte un fichier de temps en temps, ' +
          'pour pouvoir la récupérer sur ce téléphone ou un autre.</div>' +
          '<button class="btn ghost block" data-export>Exporter ma progression</button>' +
          '<button class="btn ghost block" data-import>Importer une sauvegarde</button>' +
          '<input id="f-import" type="file" accept="application/json,.json" hidden>' +
          '<button class="btn ghost block" data-reset style="color:var(--ko)">Tout réinitialiser</button>' +
        '</section>' +

        '<p class="tiny dim center" style="padding:0 10px 20px;line-height:1.5">' +
          'Contenu pédagogique fondé sur la réglementation en vigueur. ' +
          'Il complète une formation en auto-école, il ne la remplace pas.</p>' +

      '</div>';

    UI.mount(html);
    bind();
  }

  /* ---------------- sessions ----------------
     Sur un téléphone partagé, chacun a la sienne. Le code à quatre
     chiffres est une porte, pas un coffre-fort : on l'écrit noir sur
     blanc plutôt que de laisser croire à un chiffrement. */
  function sectionSession() {
    if (!window.Sessions) return '';
    var s = Sessions.actif();
    var n = Sessions.liste().length;
    var verrou = !!(s && s.code);
    return '<section class="card stack g12">' +
      '<div class="sec-t">Ma session</div>' +
      '<div class="tiny dim">' +
        (n > 1
          ? UI.plural(n, 'session') + ' sur cet appareil. Chacune garde sa progression de son côté : ' +
            'personne ne voit celle des autres.'
          : 'Ta progression vit dans cette session. Tu peux en créer une autre pour quelqu’un ' +
            'qui révise sur le même téléphone.') +
      '</div>' +
      '<button class="switch" data-verrou>' +
        '<span class="stack g4" style="text-align:left">' +
          '<span class="t">Demander un code à l’ouverture</span>' +
          '<span class="s">Quatre chiffres, pour que personne n’ouvre ta session par curiosité. ' +
            'Ça n’empêche pas quelqu’un de très motivé de fouiller le navigateur.</span>' +
        '</span>' +
        '<span class="knob' + (verrou ? ' on' : '') + '"></span>' +
      '</button>' +
      '<button class="btn ghost block" data-changer>Changer de session</button>' +
    '</section>';
  }

  function bindSession() {
    if (!window.Sessions) return;

    UI.on('[data-verrou]', 'click', function () {
      var s = Sessions.actif();
      if (s && s.code) {
        Sessions.definirCode('');
        UI.toast('Code retiré.', 'cle');
        view();
        return;
      }
      var code = prompt('Choisis un code à quatre chiffres.');
      if (code === null) return;
      code = String(code).replace(/\D/g, '');
      if (code.length !== 4) { UI.toast('Il faut exactement quatre chiffres.', 'alerte'); return; }
      Sessions.definirCode(code);
      UI.toast('Code enregistré. Note-le quelque part.', 'cle');
      view();
    });

    UI.on('[data-changer]', 'click', function () {
      Store.saveNow();
      Sessions.quitter();
      location.reload();
    });
  }

  function bind() {
    bindSession();
    document.getElementById('f-name').addEventListener('input', function () {
      Store.s.profile.name = this.value.trim(); Store.save();
      if (window.Sessions) Sessions.nommer(Store.s.profile.name);
    });
    UI.on('[data-delai]', 'click', function () {
      var j = +this.getAttribute('data-delai');
      Store.s.profile.examDate = j > 0 ? SRS.addDays(SRS.today(), j) : '';
      Store.saveNow();
      UI.toast(j > 0 ? 'Objectif fixé à ' + UI.plural(j, 'jour') : 'Objectif retiré', 'calendrier');
      view();
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

    UI.on('[data-son]', 'click', function () {
      var actif = !Store.s.profile.son;
      Store.s.profile.son = actif;
      Store.saveNow();
      this.querySelector('.knob').classList.toggle('on', actif);
      if (actif) Son.succes();
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

    UI.on('[data-import]', 'click', function () {
      document.getElementById('f-import').click();
    });
    document.getElementById('f-import').addEventListener('change', function (e) {
      var fichier = e.target.files[0];
      this.value = '';
      if (!fichier) return;
      if (!confirm('Remplacer toute la progression actuelle par celle de ce fichier ?')) return;
      var lecteur = new FileReader();
      lecteur.onload = function () {
        if (Store.importer(String(lecteur.result))) {
          App.applyTheme(); App.go('home');
          UI.toast('Sauvegarde importée', 'valide');
        } else {
          UI.toast('Ce fichier ne ressemble pas à une sauvegarde valide', 'alerte');
        }
      };
      lecteur.onerror = function () {
        UI.toast('Impossible de lire ce fichier', 'alerte');
      };
      lecteur.readAsText(fichier);
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

  /* Pas de surbrillance ici : contrairement à l'onboarding, l'objectif
     déjà fixé est une cible mouvante (le nombre de jours restants
     change chaque jour), donc aucun de ces boutons ne « correspond »
     durablement à l'état actuel. */
  function delaiBtn(jours, texte) {
    return '<button class="card row between" data-delai="' + jours + '" style="width:100%;text-align:left">' +
      '<span style="font-weight:500;font-size:14.5px">' + texte + '</span></button>';
  }

  return { view: view };
})();
