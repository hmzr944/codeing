# Relais IA — mise en service

Cinq minutes, deux comptes gratuits, aucune carte bancaire.

L'application marche déjà sans ce relais : l'assistant hors ligne
répond à partir des leçons. Le relais ajoute la reformulation en
mots simples, avec un exemple. Sans lui, ou sans réseau,
l'application retombe toute seule sur l'assistant hors ligne.

## 1. Une clé chez un fournisseur

Le plus simple est **Groq** : palier gratuit large, réponses
quasi instantanées, Llama 3.3 70B.

1. Créer un compte sur <https://console.groq.com>
2. *API Keys* → *Create API Key*
3. Copier la clé (`gsk_...`), elle ne sera plus affichée

Mistral, Gemini et OpenRouter fonctionnent aussi : ils parlent le
même protocole. Il suffit de changer `AI_BASE_URL` et `AI_MODEL`
dans `wrangler.toml` (les adresses sont notées en commentaire).

## 2. Le relais

Deux voies. La première ne demande aucun terminal.

### a. Depuis le tableau de bord, dépôt connecté

C'est le montage en place. Le Worker est relié au dépôt GitHub et se
redéploie à chaque poussée sur `main`. Trois réglages, une seule fois,
dans **Workers & Pages → le Worker → Settings** :

| Où | Réglage |
|---|---|
| Build | **Root directory** = `worker` |
| Variables and Secrets | `AI_KEY` = la clé de l'étape 1, en **Secret** |
| Domains & Routes | activer l'adresse `workers.dev` |

Le dossier racine est le réglage décisif : sans lui, Cloudflare lit la
racine du dépôt, n'y trouve aucune configuration de Worker et publie
l'application comme un site statique au lieu du relais.

Les trois autres variables (`ORIGINES`, `AI_BASE_URL`, `AI_MODEL`)
viennent de `wrangler.toml` à chaque déploiement : inutile de les
saisir à la main, et une valeur saisie à la main serait écrasée. Le
secret, lui, est préservé.

### b. Depuis un terminal

```bash
cd worker
npx wrangler login          # ouvre le navigateur, compte Cloudflare gratuit
npx wrangler secret put AI_KEY   # coller la clé de l'étape 1
npx wrangler deploy
```

À lancer depuis ta machine, pas depuis un conteneur : `login` ouvre une
page dans ton navigateur. La clé de l'étape 1 ne doit transiter par
rien d'autre que `secret put`.

Le code, lui, a déjà été éprouvé : il tourne tel quel dans
**workerd**, le runtime réel de Cloudflare, et l'application
complète a été branchée dessus. Pour refaire l'essai en local, sans
compte ni clé réelle :

```bash
cd worker
echo 'AI_KEY=clé-bidon' > .dev.vars        # ignoré par git
npx wrangler dev --var AI_BASE_URL:http://localhost:8096/v1 \
                 --var ORIGINES:http://localhost:8099
```

La dernière commande affiche l'adresse du relais, de la forme :

```
https://feu-vert-ia.<ton-sous-domaine>.workers.dev
```

## 3. Brancher l'application

Ouvrir `js/config.js` à la racine du dépôt et coller l'adresse :

```js
window.IA_URL = 'https://feu-vert-ia.xxx.workers.dev';
```

Puis pousser. C'est tout : l'assistant utilise le modèle dès qu'il
y a du réseau, et l'assistant hors ligne le reste du temps.

## Ce qui est verrouillé

- La clé ne quitte jamais Cloudflare.
- La consigne du modèle est écrite dans le Worker, pas dans la
  page : personne ne peut détourner l'adresse pour s'en servir
  comme d'un assistant généraliste.
- Le modèle n'a le droit de reformuler que les extraits de cours
  qu'on lui envoie. Il lui est interdit d'ajouter un chiffre ou
  une règle, et il doit répondre « Je n'ai pas trouvé ça dans le
  cours » plutôt que d'inventer.
- Seule l'origine listée dans `ORIGINES` peut appeler le relais,
  et une même adresse est plafonnée à vingt questions par minute.

Si l'adresse fuite et se fait abuser, il suffit de révoquer la clé
chez le fournisseur et d'en poser une nouvelle avec
`npx wrangler secret put AI_KEY`.

## Coût

Zéro. Cloudflare Workers offre 100 000 requêtes par jour, Groq un
palier gratuit très au-dessus de ce qu'une personne qui révise
peut consommer.
