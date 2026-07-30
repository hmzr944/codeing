# 001 — Animer les barres de progression via transform plutôt que width

- **Status**: DONE
- **Commit**: 2690117
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 fichier CSS, 1 fonction JS (`UI` helper), ~5 lignes

## Problem

`.gauge > i` anime `width`, une propriété de mise en page : chaque changement
déclenche layout + paint + composite au lieu d'un simple recompositing GPU.
C'est l'élément le plus répété de l'application — la classe `.gauge` est
utilisée dans 5 fichiers de vue (home, cours, quiz, progrès, parcours).

```css
/* css/style.css:227-232 — current */
.gauge{height:8px;border-radius:var(--r-pill);background:var(--surface-3);overflow:hidden}
.gauge > i{display:block;height:100%;border-radius:var(--r-pill);background:var(--accent);
  transition:width .5s var(--ease)}
.gauge.thin{height:5px}
.gauge.ok > i{background:var(--ok)}
.gauge.ko > i{background:var(--ko)}
```

Le remplissage est actuellement piloté en JS par `style.width` en pourcentage,
partout où une jauge est rendue, par exemple :

```js
/* js/views/home.js — exemple représentatif */
'<div class="gauge thin"><i style="width:' + pct + '%"></i></div>'
```

## Target

`width` reste la propriété visuellement utile (elle définit toujours combien
la barre est "remplie" au premier rendu, avant toute transition), mais la
**transition** anime `transform:scaleX()` sur un élément dont la largeur est
déjà fixée à 100% de son conteneur logique. Le point le plus simple et le
moins risqué : garder le balisage HTML identique (`<i style="width:X%">`),
mais transformer la transition CSS pour cibler `transform` au lieu de
`width`, en encapsulant la valeur JS existante dans une variable CSS plutôt
que dans `style.width` directement.

```css
/* css/style.css:227-232 — target */
.gauge{height:8px;border-radius:var(--r-pill);background:var(--surface-3);overflow:hidden}
.gauge > i{
  display:block;height:100%;width:100%;border-radius:var(--r-pill);background:var(--accent);
  transform-origin:left;transform:scaleX(var(--pct,0));
  transition:transform .5s var(--ease);
}
.gauge.thin{height:5px}
.gauge.ok > i{background:var(--ok)}
.gauge.ko > i{background:var(--ko)}
```

Et côté JS, remplacer chaque `style="width:X%"` par `style="--pct:X"` (une
fraction entre 0 et 1, pas un pourcentage — `scaleX` attend un facteur, pas
un pourcentage).

## Repo conventions to follow

- Les valeurs numériques passées en style inline existent déjà ailleurs sous
  cette forme (`style="width:' + Math.round(...) + '%"`) : garder la même
  méthode de construction de chaîne, seulement changer l'unité et le nom de
  la propriété CSS ciblée.
- `--ease` est le seul token de easing du projet (`css/style.css:67`) — ne
  pas en introduire un nouveau.

## Steps

1. **`css/style.css:227-232`** — remplacer le bloc `.gauge`/`.gauge > i` par
   la version `target` ci-dessus.
2. **Rechercher tous les usages** de `class="gauge` dans `js/views/*.js` et
   `js/ui.js` (au moins home.js, lessons.js, quiz.js, stats.js, train.js —
   confirmé par grep, mais vérifier qu'aucun autre fichier n'en génère). Pour
   chaque usage de la forme `'<i style="width:' + X + '%"></i>'` (où `X` est
   déjà une expression 0–100), remplacer par
   `'<i style="--pct:' + (X / 100) + '"></i>'` — diviser la même expression
   par 100 au lieu de lui accoler `%`. Ne pas changer `X` lui-même (le calcul
   du pourcentage reste identique, seule l'unité de sortie change).
3. Si un usage anime dynamiquement la jauge après le montage (ex. un
   `element.style.width = pct + '%'` déclenché par un événement plutôt qu'au
   rendu initial), le remplacer par
   `element.style.setProperty('--pct', pct / 100)`.

## Boundaries

- Ne pas toucher aux classes `.gauge.ok`/`.gauge.ko`/`.gauge.thin` au-delà de
  ce qui est montré dans le bloc `target`.
- Ne pas changer le balisage HTML autour des jauges (titres, libellés,
  structure des cartes) — uniquement la jauge elle-même.
- Ne pas introduire de nouvelle dépendance ni de nouveau token d'easing.
- Si un usage de `.gauge` ne suit pas le motif `style="width:X%"` (par
  exemple une jauge sans remplissage dynamique), STOP et signaler plutôt que
  d'improviser.

## Verification

- **Mécanique** : `node tools/check.mjs` doit rester à "Tout est cohérent."
  (aucune régression de contenu). `node tools/responsive.mjs` doit rester à
  "0 problème(s) relevé(s)." (les jauges ne doivent pas déborder ni changer
  de dimension visible).
- **Feel check** : ouvrir l'accueil, l'onglet Cours et l'onglet Progrès.
  Confirmer :
  - la barre se remplit visuellement de façon identique à avant (même
    proportion, même durée .5s).
  - dans DevTools, onglet Animations, ralentir à 10% : le remplissage doit
    glisser sans à-coup, comme avant.
  - dans l'onglet Rendering, activer `prefers-reduced-motion: reduce` :
    la barre doit atteindre sa valeur finale quasi instantanément (comme
    aujourd'hui), sans revenir à un fondu ou un saut visuel différent.
  - dans l'onglet Performance, enregistrer un remplissage de jauge : la
    trace ne doit plus montrer de "Layout" ni de "Paint" liés à `.gauge > i`,
    seulement du "Composite Layers".
- **Done when** : toutes les jauges de l'application se remplissent
  visuellement à l'identique, `check.mjs` et `responsive.mjs` passent, et le
  profil Performance ne montre plus de recalcul de mise en page pour
  `.gauge > i`.
