# Plans de mouvement — Feu Vert

Issus de l'audit `improve-animations` du commit `2690117`. Aucun plan ne
dépend d'un autre — ils touchent des fichiers/règles disjoints et peuvent
s'exécuter dans n'importe quel ordre. L'ordre ci-dessous suit simplement le
levier (impact ÷ effort) décroissant.

| # | Titre | Sévérité | Fichiers | Statut |
|---|---|---|---|---|
| [001](001-gauge-width-to-transform.md) | Jauges : `width` → `transform` | HIGH | `css/style.css`, `js/views/*.js` | DONE |
| [002](002-toast-exit-shared-ease.md) | Sortie du toast : réutiliser `--ease` | LOW | `js/ui.js` | DONE |
| [003](003-grid-entrance-stagger.md) | Décalage à l'entrée des grilles | LOW | `css/style.css` | DONE |
| [004](004-reduced-motion-keep-fade.md) | `prefers-reduced-motion` : garder un fondu | LOW | `css/style.css` | DONE |

## Dépendances

Aucune. Les quatre plans peuvent être exécutés dans un ordre quelconque, y
compris en parallèle sur des copies de travail séparées, sans conflit de
fusion attendu (zones de fichiers disjointes, sauf 003 et 004 qui touchent
toutes deux `css/style.css` mais des blocs différents et non adjacents).

## Vérification globale après exécution des quatre

```bash
node tools/check.mjs        # cohérence du contenu
node tools/responsive.mjs   # 320–430px, 0 problème attendu
node tools/contraste.mjs    # aucune régression de contraste attendue (aucun plan ne touche aux couleurs)
node tools/verifier.mjs     # parcours de bout en bout, 58 contrôles attendus
```
