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
| **459 questions** | 16 thèmes, chacune avec une explication et souvent une astuce mémo |
| **66 panneaux** | dessinés en SVG, forme et couleurs fidèles, pictogrammes simplifiés |
| **19 leçons** | le cours par thème, en blocs illustrés plutôt qu'en pavés : à retenir, pièges, chiffres, panneaux, schémas. Plus « les chiffres à connaître par cœur », un **lexique en mots simples** et **ce qui a changé récemment** |
| **11 schémas** | dessinés en SVG pour ce qui ne s'explique pas par des mots : distance d'arrêt, giratoire, angle mort, PLS, panne sur autoroute |
| **32 succès** | débloqués sans être annoncés à l'avance |

### Écrit pour être compris du premier coup

Une question qu'on doit relire deux fois n'apprend rien. La banque suit trois
règles, vérifiées automatiquement par `tools/lisibilite.mjs` :

- **aucun mot savant là où un mot courant existe.** « Baisse de vigilance »
  et non « hypovigilance », « après le repas » et non « post-prandial »,
  « à double sens » et non « bidirectionnelle » ;
- **tout sigle est expliqué en clair au moins une fois.** PTAC, BAU, PLS, ZFE,
  EDPM restent employés, parce qu'ils tombent à l'examen, mais jamais sans
  traduction. La fiche **Lexique** les reprend tous ;
- **aucune phrase de plus de 26 mots.** Au-delà, on relit.

L'audit part d'une liste de mots interdits, puis ratisse tous les mots de plus
de 13 lettres pour attraper ce que la liste n'avait pas prévu.

Les seize thèmes suivent le découpage officiel de l'ETG, y compris des sujets
récents que beaucoup de banques anciennes ignorent : **aides à la conduite et
véhicules électriques** (obligatoires sur tout véhicule neuf vendu dans l'UE
depuis juillet 2024), **infractions et sanctions** avec les barèmes à jour, et
**préparation de trajet** (chargement, remorque, conduite à l'étranger).

Aucun thème ne descend sous 20 questions : un examen blanc comme un défi de
thème peuvent toujours être tirés sans répétition.

### Les sept façons de réviser

- **Défi du jour** — la séance principale. Le paquet est composé à la volée :
  45 % de révisions dues, 25 % d'anciennes erreurs, le reste en découverte.
- **Parcours** — les seize thèmes, en séries de 10 à 30 questions.
- **Défi du thème** — 10 questions, 9 bonnes réponses exigées, sans correction
  pendant l'épreuve. Le remporter pose une étoile sur le thème.
- **Examen blanc** — 40 questions, 20 secondes chacune, aucun retour pendant
  l'épreuve, seuil à 35/40. Les conditions réelles.
- **Survie** — trois vies, 15 secondes par question, aucune limite de longueur.
- **Mes erreurs** — rattrapage ciblé sur ce qui bloque encore.
- **Sprint 60 secondes** — pour les jours où il n'y a vraiment pas le temps.

### Les cours

L'onglet **Cours** contient une leçon par thème. Chacune est une suite de
**blocs typés** — la phrase à retenir, le piège classique, les points clés, un
tableau de chiffres, les panneaux dessinés, un schéma — et non du HTML libre.
Le lecteur ne sait dessiner que ces sept formes : une leçon ne peut donc pas
redevenir un mur de texte, c'est structurellement impossible.

Chaque leçon se lit en plein écran, sans barre d'onglets, et se termine par
« Réviser ce thème » : on lit, on enchaîne sur les questions.

### L'assistant

Un assistant répond aux questions posées avec des mots de tous les jours. Il
est accessible depuis les cours, depuis **chaque question hors examen** (une
feuille se pose par-dessus, le chrono s'arrête, la série n'est pas perdue) et
depuis le récapitulatif d'erreurs.

Il sait faire trois choses :

- **expliquer un terme ou une notion.** Le lexique n'est pas recopié : il est
  lu directement dans les leçons, toute ligne de la forme « Terme : explication »
  en faisant partie ;
- **résumer une leçon**, depuis le bouton « Me résumer cette leçon » ;
- **dire pourquoi la réponse cochée est fausse.** Après une erreur, le bouton
  de la correction change de libellé et transmet ce qui a réellement été coché :
  la vraie question n'est pas « c'est quoi ce mot » mais « pourquoi mon choix
  est faux ».

La recherche fonctionne **hors ligne**, bloc par bloc, sur les 19 leçons et les
459 questions. Un petit dictionnaire traduit le langage courant vers le
vocabulaire du code, parce que personne ne tape « alcoolémie en période
probatoire » mais plutôt « je peux boire combien ». Les expressions sont
traitées avant les mots isolés, sans quoi « rond point » serait compris comme
« les points du permis ».

#### Le modèle reformule, il n'invente pas

Un vrai modèle peut être branché, en option (voir `worker/README.md`). Il ne
répond jamais de mémoire : la recherche hors ligne trouve d'abord les passages
du cours qui répondent, et le modèle n'a le droit que de les redire simplement,
avec un exemple. Il lui est interdit d'ajouter un chiffre ou une règle, et il
doit répondre « Je n'ai pas trouvé ça dans le cours » plutôt que d'improviser.
C'est ce qui empêche « 90 km/h » de sortir là où le cours dit 80.

Le passage source reste dépliable sous chaque réponse : une explication qu'on
ne peut pas recouper ne vaut rien pour un examen.

La clé du fournisseur ne peut pas vivre dans la page — le dépôt est public. Elle
reste dans un secret Cloudflare, et la consigne du modèle est écrite dans le
relais, hors de portée du navigateur : la page ne choisit sa tâche que dans une
liste fermée.

**Sans relais, sans réseau, ou si le modèle ne répond pas**, chaque demande a sa
réponse hors ligne, servie telle quelle et sans message d'erreur. Un bouton
ouvre Claude avec la question déjà rédigée quand rien ne suffit.

### Le parcours

Six étapes, affichées une à la fois sur l'accueil, parce que la vraie question
d'un débutant est « je fais quoi maintenant ? » :

faire connaissance (100 questions) → comprendre les bases (5 fiches) →
ancrer les thèmes (4 médailles) → se tester (1 examen blanc) →
viser les 35/40 (3 examens validés) → prête pour le jour J.

### La couche jeu

Elle n'est pas décorative : chaque mécanique pousse vers un comportement utile.

| Mécanique | Ce qu'elle provoque |
|---|---|
| **Médailles de thème** (bronze 40 %, argent 70 %, or 90 % de questions ancrées) | Pousse à couvrir les seize thèmes plutôt que ses préférés |
| **Défi du thème** (9/10) | Vérifie la maîtrise réelle, sans filet |
| **Combo** (×2 à partir de 3 bonnes réponses, ×3 à partir de 6) | Récompense la régularité, pas la chance |
| **Survie** (3 vies) | Donne une raison de relancer une partie |
| **Coffre du jour** | Fait terminer la série au lieu de s'arrêter à la moitié |
| **Série de jours + 2 jokers** | Installe l'habitude sans punir un jour manqué |

Une question compte comme « ancrée » à partir de la boîte 4, c'est-à-dire après
plusieurs bonnes réponses espacées de plusieurs jours. Une médaille d'or ne
s'obtient donc pas en une soirée : c'est volontaire.

### La mécanique de mémorisation

Un système de boîtes de Leitner à 6 niveaux. Une bonne réponse fait monter la
question d'un cran et repousse sa réapparition ; une erreur la fait retomber de
deux crans.

| Boîte | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Revient dans | le jour même | 1 j | 3 j | 7 j | 16 j | 35 j |

Concrètement : ce qui est raté revient tout de suite, ce qui est su disparaît de
la circulation. C'est ce qui permet de couvrir 459 questions sans les revoir
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

### Sur le téléphone

L'application est publiée comme page privée sur claude.ai. Il suffit d'ouvrir
le lien sur le téléphone, puis :

- **iPhone** : *Partager → Sur l'écran d'accueil*
- **Android** : *Menu → Ajouter à l'écran d'accueil*

Elle s'ouvre alors en plein écran, comme une application installée.

Un point à connaître : **la progression est enregistrée par adresse**. Série,
médailles et statistiques vivent dans le navigateur, à l'URL utilisée. Ouvrir
tantôt le lien publié, tantôt GitHub Pages revient à tenir deux carnets
séparés : mieux vaut en choisir un et s'y tenir. Si le navigateur refuse
l'enregistrement (navigation privée notamment), l'application le signale au
démarrage au lieu de perdre la progression sans rien dire.

```bash
node tools/build-artifact.mjs   # génère dist/artifact.html pour la publication
```

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
  config.js            adresse du relais IA (vide = assistant hors ligne seul)
  data/                thèmes et quotas d'examen, 11 banques de questions,
                       leçons, succès
  signs.js             générateur SVG des panneaux
  diagrams.js          générateur SVG des schémas explicatifs
  search.js            recherche hors ligne, bloc par bloc
  ia.js                assemblage des extraits et appel du relais
  srs.js               répétition espacée (boîtes de Leitner)
  store.js             état, statistiques, séries, sélection des questions
  ui.js                rendu, toasts, retours tactiles
  views/               une vue par écran
  app.js               routeur, thème, rappel local
sw.js                  service worker (hors ligne)
tools/check.mjs        contrôle d'intégrité de la banque de questions
tools/lisibilite.mjs   audit du vocabulaire et de la longueur des phrases
tools/shots.mjs        captures d'écran de contrôle (Playwright)
tools/responsive.mjs   débordements et cibles tactiles de 320 à 430 px
tools/build-icons.mjs  extrait les icônes Phosphor dans js/icons.js
tools/build-single.mjs génère la version en un seul fichier
tools/build-artifact.mjs génère la version pour page publiée
tools/build-font.mjs   intègre Montserrat en base64 dans css/font.css
tools/verifier.mjs     parcours complet de bout en bout (58 contrôles)
tools/test-worker.mjs  garde-fous du relais IA, sans le déployer
tools/test-ia.mjs      assistant branché sur un faux relais
worker/                relais Cloudflare pour le modèle (facultatif)
```

### Icônes

Les icônes viennent de **Phosphor Icons** (MIT), en graisse *light* pour un
trait fin et régulier. Elles ne sont pas dessinées à la main : `tools/build-icons.mjs`
extrait les 64 icônes utilisées du paquet `@phosphor-icons/core` et les intègre
dans `js/icons.js`. L'application reste donc utilisable hors ligne, sans requête
réseau ni police d'icônes.

Les tracés utilisent `currentColor` : une icône prend la couleur du texte qui
l'entoure, sans réglage supplémentaire.

```bash
npm install --no-save @phosphor-icons/core
node tools/build-icons.mjs
```

La graisse *fill* est réservée à ce qui doit se lire d'un coup d'œil à petite
taille : les vies du mode survie, la flamme de la série, les étoiles de palier.

Les emoji ont disparu de l'interface. Les médailles 🥉🥈🥇 ont laissé place à un
système de **une à trois étoiles** (Découvert, Solide, Maîtrisé) : plus lisible,
et compatible avec la règle d'un seul accent de couleur.

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
node tools/check.mjs       # syntaxe, ids uniques, index de réponses, quotas d'examen
node tools/lisibilite.mjs  # jargon, sigles non expliqués, phrases trop longues
node tools/responsive.mjs  # débordements, champs étirés, cibles tactiles trop petites
node tools/shots.mjs       # parcours complet dans Chromium, détecte les erreurs JS
node tools/verifier.mjs    # 58 contrôles de bout en bout, à lancer sur le site publié
node tools/test-worker.mjs # garde-fous du relais IA, sans réseau ni déploiement
node tools/test-ia.mjs     # assistant branché sur un faux relais : reformulation,
                           # résumé, analyse d'erreur, et repli quand le relais tombe
```

`check.mjs` applique des règles de fond, pas seulement de forme :

- une question dont **toutes** les propositions seraient correctes est refusée :
  cela apprendrait le mauvais réflexe de tout cocher au moindre doute ;
- les quotas d'examen doivent totaliser exactement 40 et couvrir tous les thèmes ;
- chaque thème doit contenir au moins 10 questions, sinon son défi ne pourrait
  pas être tiré sans répétition ;
- chaque thème doit avoir sa leçon, et chaque bloc de leçon doit être d'un type
  connu, avec un schéma et des panneaux qui existent : réviser sans cours, c'est
  deviner.

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
