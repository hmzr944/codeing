# 002 — Réutiliser le token --ease pour la sortie du toast

- **Status**: DONE
- **Commit**: 2690117
- **Severity**: LOW
- **Category**: Cohésion & tokens
- **Estimated scope**: 1 fichier JS, 1 ligne

## Problem

La sortie du toast est codée en inline avec une transition CSS écrite à la
main, sans réutiliser le token `--ease` employé partout ailleurs dans
l'application (entrée du toast comprise, via `@keyframes toastIn` qui, elle,
utilise bien `var(--ease)`).

```js
/* js/ui.js:50-53 — current */
setTimeout(function () {
  n.style.transition = 'opacity .3s, transform .3s';
  n.style.opacity = '0'; n.style.transform = 'translateY(-10px)';
  setTimeout(function () { n.remove(); }, 320);
}, 2600);
```

L'entrée (`toastIn`, `css/style.css:917-921`) utilise `.3s var(--ease)` ; la
sortie, elle, utilise l'accélération par défaut du navigateur (`ease`
implicite de `transition` sans fonction précisée), ce qui produit une
sensation légèrement différente entre l'apparition et la disparition du même
élément.

## Target

```js
/* js/ui.js:50-53 — target */
setTimeout(function () {
  n.style.transition = 'opacity .3s var(--ease), transform .3s var(--ease)';
  n.style.opacity = '0'; n.style.transform = 'translateY(-10px)';
  setTimeout(function () { n.remove(); }, 320);
}, 2600);
```

`var(--ease)` est une variable CSS custom property : elle est valide dans
une chaîne de `transition` posée en style inline exactement comme dans une
feuille de style, aucune lecture JS de sa valeur n'est nécessaire.

## Repo conventions to follow

- `--ease:cubic-bezier(.2,.8,.25,1)` est déclaré une seule fois dans
  `css/style.css:67` (`:root`) et réutilisé tel quel par toutes les autres
  règles du fichier (`.back`, `.btn`, `.ans`, etc.) — ne jamais écrire une
  valeur de easing en dur ailleurs que dans ce token.
- Exemplaire à imiter : `css/style.css:917` — `animation:toastIn .3s
  var(--ease)` pour l'entrée du même composant.

## Steps

1. **`js/ui.js:51`** — remplacer la ligne
   `n.style.transition = 'opacity .3s, transform .3s';`
   par
   `n.style.transition = 'opacity .3s var(--ease), transform .3s var(--ease)';`

## Boundaries

- Ne pas changer les durées (`.3s`), les valeurs (`opacity:0`,
  `translateY(-10px)`), ni le délai de suppression (`320`ms).
- Ne pas toucher à `@keyframes toastIn` ni à l'entrée du toast — seule la
  sortie est concernée.
- Ne pas introduire de nouveau token.

## Verification

- **Mécanique** : `node tools/check.mjs` reste à "Tout est cohérent."
- **Feel check** : déclencher un toast (par exemple terminer une série de
  révision courte pour voir le rappel de série), observer sa disparition
  après ~2,6s. Confirmer :
  - la sortie a la même sensation "élastique douce" que l'entrée, pas un
    ralenti linéaire différent.
  - dans DevTools, Animations panel, ralentir à 10% pendant la disparition
    du toast et confirmer que la courbe de vitesse n'est plus une simple
    accélération/décélération symétrique par défaut du navigateur.
- **Done when** : `js/ui.js` ne contient plus aucune valeur de transition
  sans `var(--ease)`, et `check.mjs` passe.
