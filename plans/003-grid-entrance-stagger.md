# 003 — Décalage (stagger) à l'entrée des grilles de médailles, succès et panneaux

- **Status**: DONE
- **Commit**: 2690117
- **Severity**: LOW
- **Category**: Occasion manquée / Cohésion
- **Estimated scope**: 1 fichier CSS, aucune modification JS

## Problem

`.medal-row` (4 éléments), `.pan-g` (6 à 8 panneaux par leçon) et `.badges`
(jusqu'à 32 succès) apparaissent tous d'un bloc, sans aucun décalage entre
leurs éléments, alors qu'ils se montrent à la navigation entre écrans — le
moment naturel pour un stagger de 30 à 80ms.

```css
/* css/style.css:438,627,819 — current */
.medal-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
.pan-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(94px,1fr));gap:10px}
.badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:8px}
```

Les enfants directs de ces grilles n'ont aujourd'hui aucune animation
d'entrée propre — seule la page entière (`#app`) reçoit un fondu global via
la classe `.enter` posée par `UI.mount()` (`js/ui.js:17-25`).

## Target

Réutiliser le keyframe `rise` déjà existant (`css/style.css:950`,
`@keyframes rise{from{opacity:0;transform:translateY(8px)}}`, utilisé par la
classe `.rise` à `css/style.css:949`), appliqué directement aux enfants de
ces trois grilles avec un délai croissant par position, plafonné aux six
premiers éléments :

```css
/* css/style.css — ajouter juste après les 3 règles de grille (après la ligne 819) */
.medal-row > *,.pan-g > *,.badges > *{animation:rise .28s var(--ease) both}
.medal-row > :nth-child(1),.pan-g > :nth-child(1),.badges > :nth-child(1){animation-delay:0ms}
.medal-row > :nth-child(2),.pan-g > :nth-child(2),.badges > :nth-child(2){animation-delay:40ms}
.medal-row > :nth-child(3),.pan-g > :nth-child(3),.badges > :nth-child(3){animation-delay:80ms}
.medal-row > :nth-child(4),.pan-g > :nth-child(4),.badges > :nth-child(4){animation-delay:120ms}
.medal-row > :nth-child(5),.pan-g > :nth-child(5),.badges > :nth-child(5){animation-delay:160ms}
.medal-row > :nth-child(n+6),.pan-g > :nth-child(n+6),.badges > :nth-child(n+6){animation-delay:200ms}
```

Aucun changement JS n'est nécessaire : ces éléments sont recréés à chaque
rendu via `innerHTML` (jamais réutilisés d'un rendu à l'autre), donc
`animation` se relance automatiquement à l'insertion, sans avoir besoin du
mécanisme de relance forcée (`void el.offsetWidth`) utilisé ailleurs pour des
éléments persistants.

## Repo conventions to follow

- Ne pas créer de nouveau keyframe : `rise` existe déjà et sert exactement à
  ce type d'entrée (fondu + léger glissement vers le haut). L'exemplaire à
  imiter est `css/style.css:949` (`.rise{animation:rise .28s var(--ease)
  both}`), qui utilise déjà `both` comme fill-mode — le reproduire ici est
  indispensable pour éviter un flash à pleine opacité pendant le délai.
- `--ease` reste le seul token de easing du projet.

## Steps

1. **`css/style.css`**, juste après la règle `.badges{...}` (ligne 819),
   insérer le bloc de 6 règles `target` ci-dessus tel quel.

## Boundaries

- Ne pas toucher au balisage JS des trois vues (`train.js`, `stats.js`,
  `lessons.js`) — le fix est purement CSS.
- Ne pas dépasser un délai maximal de 200ms (au-delà, l'attente perçue avant
  de voir le dernier élément devient gênante plutôt que "considérée").
- Ne pas appliquer ce stagger à d'autres grilles de l'application non citées
  ici (par exemple les réponses de quiz `.answers`, qui sont des éléments
  interactifs à haute fréquence — catégorie 1 de l'audit : pas
  d'animation sur ce qui est vu des dizaines de fois par jour).

## Verification

- **Mécanique** : `node tools/check.mjs` et `node tools/responsive.mjs`
  restent respectivement à "Tout est cohérent." et "0 problème(s) relevé(s)."
- **Feel check** : ouvrir l'onglet Parcours (collection de médailles),
  l'onglet Progrès (succès) et une leçon contenant un bloc panneaux (par
  exemple "Signalisation"). Confirmer :
  - les éléments de chaque grille apparaissent en cascade légère, pas tous
    d'un coup, mais sans latence perceptible pour voir l'ensemble (max
    200ms d'écart entre le premier et le dernier groupe).
  - dans DevTools, Animations panel, ralentir à 10% et confirmer l'ordre du
    décalage suit bien l'ordre visuel (gauche à droite, haut en bas).
  - toggle `prefers-reduced-motion: reduce` : la cascade doit disparaître
    (déjà couvert par le bloc global `*,*::before,*::after{animation-
    duration:.01ms !important}` existant, ligne 958) — tous les éléments
    doivent apparaître quasi simultanément.
- **Done when** : les trois grilles montrent une cascade visible en vitesse
  normale, aucune régression de contenu ni de mise en page.
