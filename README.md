# Feu Vert — révision du code de la route 2026

Une application web de révision du code de la route, pensée pour une seule
chose : faire revenir quelqu'un tous les jours, cinq à dix minutes, jusqu'au
jour de l'examen.

Pas de compte, pas de serveur, pas de publicité. Tout tient dans le
navigateur et fonctionne hors ligne.

---

## Ce qu'il y a dedans

| | |
|---|---|
| **242 questions** | 13 thèmes, chacune avec une explication et souvent une astuce mémo |
| **66 panneaux** | dessinés en SVG, forme et couleurs fidèles, pictogrammes simplifiés |
| **14 fiches** | le cours en version courte, dont une fiche « chiffres à connaître par cœur » |
| **23 succès** | débloqués sans être annoncés à l'avance |

### Les cinq façons de réviser

- **Défi du jour** — la séance principale. Le paquet est composé à la volée :
  45 % de révisions dues, 25 % d'anciennes erreurs, le reste en découverte.
- **Par thème** — pour attaquer un point faible précis, en séries de 10 à 30.
- **Examen blanc** — 40 questions, 20 secondes chacune, aucun retour pendant
  l'épreuve, seuil à 35/40. Les conditions réelles.
- **Mes erreurs** — rattrapage ciblé sur ce qui bloque encore.
- **Sprint 60 secondes** — pour les jours où il n'y a vraiment pas le temps.

### La mécanique de mémorisation

Un système de boîtes de Leitner à 6 niveaux. Une bonne réponse fait monter la
question d'un cran et repousse sa réapparition ; une erreur la fait retomber de
deux crans.

| Boîte | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Revient dans | le jour même | 1 j | 3 j | 7 j | 16 j | 35 j |

Concrètement : ce qui est raté revient tout de suite, ce qui est su disparaît de
la circulation. C'est ce qui permet de couvrir 242 questions sans les revoir
toutes chaque jour.

### Le retour quotidien

- Une **série** de jours, validée dès que l'objectif quotidien est atteint.
- Deux **jokers** : sauter un jour ne casse pas la série. Un joker est regagné
  tous les dix jours tenus. L'objectif est d'éviter l'effet « série cassée,
  j'abandonne ».
- Un **rappel calendrier** (`.ics`) téléchargeable depuis les réglages. C'est la
  seule méthode qui fonctionne réellement téléphone verrouillé : un site web
  fermé ne peut envoyer aucune notification. Les notifications navigateur sont
  proposées en complément, mais elles ne se déclenchent que si l'app est ouverte.
- Un **compte à rebours** vers la date d'examen, avec un rythme conseillé
  recalculé chaque jour.

---

## Utilisation

### En ligne (GitHub Pages)

Dans les réglages du dépôt : **Settings → Pages → Source : la branche voulue,
dossier `/`**. L'URL obtenue s'ouvre directement sur mobile.

Sur iPhone : *Partager → Sur l'écran d'accueil*. Sur Android : *Menu →
Installer l'application*. L'app s'ouvre alors en plein écran et fonctionne sans
connexion.

### En local

```bash
python3 -m http.server 8099
# puis http://localhost:8099
```

Un service worker est nécessaire pour le mode hors ligne : ouvrir le fichier
directement avec `file://` fonctionne, mais sans mise en cache.

### Version en un seul fichier

```bash
node tools/build-single.mjs
```

Produit `dist/feu-vert.html` : un fichier unique, sans dépendance, qui peut être
envoyé par message et ouvert tel quel.

---

## Architecture

Aucune dépendance, aucune étape de build obligatoire. Des scripts classiques
chargés dans l'ordre, ce qui permet de tout concaténer en un seul fichier
autonome.

```
index.html             coquille et ordre de chargement
css/style.css          système de design complet (voir l'en-tête du fichier)
js/
  data/                thèmes, 6 banques de questions, fiches, succès
  signs.js             générateur SVG des panneaux
  srs.js               répétition espacée (boîtes de Leitner)
  store.js             état, statistiques, séries, sélection des questions
  ui.js                rendu, toasts, retours tactiles
  views/               une vue par écran
  app.js               routeur, thème, rappel local
sw.js                  service worker (hors ligne)
tools/check.mjs        contrôle d'intégrité de la banque de questions
tools/shots.mjs        captures d'écran de contrôle (Playwright)
tools/build-single.mjs génère la version en un seul fichier
```

### Notes de design

Le système est décrit en tête de `css/style.css`. Trois verrous s'appliquent
partout :

- **Un seul accent** (le jaune signalétique). Le vert et le rouge sont
  strictement sémantiques : ils ne veulent jamais dire autre chose que
  « bonne réponse » et « mauvaise réponse ». Les couleurs vives n'existent
  ailleurs que dans les panneaux, où elles sont le sujet.
- **Trois rayons de bordure**, pas un de plus.
- **Un seul thème par page** (nuit, jour ou automatique) : aucune section ne
  s'inverse en cours de route.

Les panneaux sont dessinés, pas photographiés : la géométrie et les couleurs
sont fidèles (c'est ce qui se retient), les pictogrammes internes sont
volontairement simplifiés.

### Contrôles

```bash
node tools/check.mjs    # syntaxe, ids uniques, index de réponses, quotas d'examen
node tools/shots.mjs    # parcours complet dans Chromium, détecte les erreurs JS
```

`check.mjs` refuse notamment une question dont toutes les propositions seraient
correctes : cela apprendrait le mauvais réflexe de tout cocher au moindre doute.

---

## Données

Tout est dans le `localStorage` du navigateur, sous une seule clé. Rien n'est
transmis nulle part. Les réglages permettent d'exporter la progression en JSON
et de tout réinitialiser. Vider les données du site efface la progression de
façon définitive.

---

## Avertissement

Le contenu s'appuie sur la réglementation en vigueur et sur le format officiel
de l'épreuve théorique (40 questions, 35 bonnes réponses exigées). Il a une
visée pédagogique et **ne remplace pas une formation en auto-école** ni les
séries officielles agréées. Certaines règles varient localement (vitesses
relevées à 90 km/h selon les départements, zones à faibles émissions, loi
Montagne) : la signalisation en place fait toujours foi.
