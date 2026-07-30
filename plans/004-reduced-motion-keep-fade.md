# 004 — Garder un fondu d'opacité sous prefers-reduced-motion, pas un arrêt sec

- **Status**: DONE
- **Commit**: 2690117
- **Severity**: LOW
- **Category**: Accessibilité
- **Estimated scope**: 1 fichier CSS, 1 bloc `@media`

> **Note post-exécution** : ce plan ne mentionnait que deux blocs
> `@media (prefers-reduced-motion:reduce)` dans le fichier (celui de la
> feuille, ligne 750, et le bloc global, ligne 967 après application des
> plans 001/003). Un troisième existait déjà avant même ce plan, à la ligne
> 699 : `.pense i{animation:none;opacity:.6}` — sans rapport avec ce plan
> (l'indicateur "l'assistant réfléchit"), à laisser strictement intact.
> L'agent exécuteur a correctement respecté la clause d'arrêt du plan
> ("si un troisième bloc existe, STOP") ; ce troisième bloc étant confirmé
> hors périmètre, le plan a ensuite été appliqué tel quel sur le bloc visé
> (ligne 750), sans toucher aux deux autres.

## Problem

Le bloc `prefers-reduced-motion` global écrase la durée de **toutes** les
animations et transitions à .01ms via `!important` sur un sélecteur
universel — y compris celles qui sont déjà en fondu d'opacité pur (`.enter`,
qui utilise `fade`, sans aucun `transform`). Résultat : même une transition
d'écran sans mouvement devient un arrêt sec au lieu d'un fondu doux.

```css
/* css/style.css:957-963 — current (bloc global, laissé tel quel par ce plan) */
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.01ms !important;animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
  }
  .confetti{display:none}
}
```

Le cas le plus visible est la feuille de l'assistant, qui a son propre bloc
dédié, plus radical encore : l'animation est entièrement supprimée
(`animation:none`), donc aucun fondu ne peut jamais s'y appliquer, quelle que
soit la valeur de durée :

```css
/* css/style.css:747-749 — current */
@media (prefers-reduced-motion:reduce){
  .feuille-fond,.feuille-panneau{animation:none}
}
```

La feuille apparaît donc d'un coup, sans aucun repère visuel pour situer son
arrivée — alors que `.rise` (utilisé pour les mêmes types de panneaux
ailleurs) contient un mouvement (`translateY(8px)`) qu'il est légitime de
retirer, mais dont le fondu d'opacité qui l'accompagne mériterait d'être
gardé.

Une importante nuance CSS : les déclarations `!important` du bloc global
gagnent sur la spécificité de classe (`.enter`, `.rise`) car l'importance
prime sur la spécificité dans la cascade — un simple ajout d'une règle plus
spécifique sans `!important` ne suffirait donc pas à la contourner.

## Target

```css
/* css/style.css:747-749 — target, remplace le bloc existant à cet endroit */
@media (prefers-reduced-motion:reduce){
  /* Le mouvement disparaît, mais un fondu court reste : sans lui, la
     feuille et les transitions d'écran surviennent d'un coup sec, sans
     aucun repère visuel pour situer l'apparition. */
  .feuille-fond,.feuille-panneau{animation:fade .2s var(--ease) !important}
  .enter{animation-duration:.2s !important}
  .rise{animation-name:fade;animation-duration:.2s !important}
}
```

Le bloc global de `css/style.css:957-963` n'est pas modifié : il continue de
réduire à néant tout le reste (rebonds, secousses, confettis, etc.), ce qui
reste correct pour ces animations-là — seules `.enter`, `.rise` et la feuille
de l'assistant sont désormais exemptées via une règle plus spécifique et
elle-même `!important`, ce qui lui permet de gagner face au sélecteur
universel du bloc global malgré son ordre antérieur dans le fichier.

## Repo conventions to follow

- Réutiliser le keyframe `fade` déjà existant (`css/style.css:948`,
  `@keyframes fade{from{opacity:0}}`) — c'est déjà l'unique animation
  d'opacité pure du projet, exactement ce que recommande la catégorie
  Accessibilité de l'audit ("garder l'opacité, retirer le mouvement").
- Ne pas créer de nouveau token de durée : `.2s` est repris tel quel de
  l'exemple donné dans `AUDIT.md` (section 6, Accessibilité).

## Steps

1. **`css/style.css:747-749`** — remplacer le bloc existant
   `@media (prefers-reduced-motion:reduce){ .feuille-fond,.feuille-panneau{animation:none} }`
   par le bloc `target` complet ci-dessus (qui ajoute les deux règles
   `.enter`/`.rise` au passage, au même endroit).

## Boundaries

- Ne pas toucher au bloc global de `css/style.css:957-963` — il reste la
  valeur par défaut correcte pour tout ce qui n'est pas explicitement
  exempté.
- Ne pas retirer `display:none` sur `.confetti` dans le bloc global — les
  confettis restent complètement coupés sous ce mode, c'est intentionnel et
  hors du périmètre de ce plan.
- Ne pas changer la durée `.2s` ni introduire un `cubic-bezier` différent de
  `var(--ease)`.
- Si un troisième bloc `@media (prefers-reduced-motion:reduce)` existe
  ailleurs dans le fichier au moment de l'exécution (dérive depuis le commit
  de référence), STOP et signaler plutôt que d'en ajouter un quatrième.

## Verification

- **Mécanique** : `node tools/check.mjs` reste à "Tout est cohérent."
- **Feel check** : dans DevTools, onglet Rendering, activer "Emulate CSS
  media feature prefers-reduced-motion: reduce". Puis :
  - ouvrir n'importe quel écran (accueil → cours, par exemple) : la
    transition doit rester quasi instantanée mais montrer un très bref
    fondu (.2s) plutôt qu'un changement d'un coup.
  - depuis l'onglet Cours, taper sur "Un mot que tu ne comprends pas ?"
    pour ouvrir la feuille de l'assistant : elle doit apparaître avec un
    fondu doux de .2s, sans glissement vers le haut, plutôt que de
    surgir instantanément sans transition.
  - déclencher une mauvaise réponse en quiz (le `shake`) : la secousse doit
    rester totalement supprimée (comportement inchangé, couvert par le bloc
    global).
  - désactiver l'émulation et confirmer que rien n'a changé en mode normal
    (les durées `.22s`/`.28s` d'origine restent actives).
- **Done when** : sous `prefers-reduced-motion: reduce`, tout ce qui
  comportait un mouvement de translation n'en montre plus, mais les
  transitions d'écran et l'apparition de la feuille de l'assistant gardent
  un fondu d'opacité perceptible de .2s.
