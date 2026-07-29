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

```bash
cd worker
npx wrangler login          # ouvre le navigateur, compte Cloudflare gratuit
npx wrangler secret put AI_KEY   # coller la clé de l'étape 1
npx wrangler deploy
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
