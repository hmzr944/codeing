/* ============================================================
   Relais IA - Cloudflare Worker

   Pourquoi un relais : la clé du fournisseur ne peut pas vivre dans
   la page. Le dépôt est public et une clé publiée est une clé
   volée. Elle reste ici, dans un secret Worker, et la page ne parle
   jamais qu'à cette adresse.

   Le relais ne se contente pas de transmettre. Il écrit lui-même
   la consigne du modèle, pour que personne ne puisse détourner
   l'adresse en assistant généraliste gratuit : la page envoie une
   question et des extraits du cours, rien d'autre.

   Déploiement : voir worker/README.md
   ============================================================ */

/* Consigne imposée au modèle. Elle est ici et pas dans la page :
   côté navigateur, n'importe qui pourrait la réécrire.

   Les règles ne changent jamais ; seule la tâche varie selon ce que
   Mina demande. Aucune tâche ne relâche l'interdiction d'inventer. */
const REGLES = [
  'Tu aides Mina à réviser le code de la route français, examen 2026.',
  '',
  'Règles absolues, valables quoi qu’on te demande :',
  '- Tu n’utilises QUE les extraits du cours fournis. Tu n’ajoutes aucun chiffre,',
  '  aucune règle, aucune exception, aucune amende qui n’y figure pas.',
  '- Si les extraits ne suffisent pas, tu réponds exactement :',
  '  "Je n’ai pas trouvé ça dans le cours." et tu t’arrêtes là.',
  '- Tu ne réponds à rien qui ne concerne pas le code de la route.',
  '',
  'Style, valable quoi qu’on te demande :',
  '- Français simple, tutoiement, phrases de moins de vingt mots.',
  '- Pas de jargon. Si un mot technique est indispensable, tu l’expliques aussitôt.',
  '- Texte courant uniquement : ni titre, ni liste à puces, ni gras, ni Markdown.'
].join('\n');

const TACHES = {
  /* une notion, un mot, une question posée avec ses mots */
  expliquer: [
    'Mina te pose une question. Réponds-y directement.',
    'Quatre phrases maximum, puis une phrase d’exemple concret au volant.'
  ].join('\n'),

  /* le résumé d’une leçon entière */
  resume: [
    'Mina veut le résumé d’une leçon. Ne garde que ce qui tombe à l’examen.',
    'Commence par la seule chose à retenir si elle ne retient qu’une phrase.',
    'Puis les points essentiels, un par phrase, dans l’ordre où ils comptent.',
    'Les chiffres exacts des extraits doivent être repris tels quels.',
    'Huit phrases maximum. Termine par le piège le plus fréquent, s’il y en a un.'
  ].join('\n'),

  /* pourquoi la réponse choisie est fausse */
  erreur: [
    'Mina s’est trompée à une question d’examen. On te donne la question,',
    'la réponse qu’elle a choisie, la bonne réponse et l’explication du cours.',
    'Dis-lui d’abord, en une phrase, ce que sa réponse voudrait dire concrètement.',
    'Puis pourquoi c’est faux, en t’appuyant sur la règle des extraits.',
    'Puis la bonne réponse et la règle qui la justifie.',
    'Termine par un moyen simple de ne plus se tromper la prochaine fois.',
    'Six phrases maximum. Ne la culpabilise pas, ne la félicite pas.'
  ].join('\n')
};

const JETONS = { expliquer: 320, resume: 520, erreur: 420 };

const MAX_QUESTION = 400;      // au-delà, ce n'est plus une question
const MAX_EXTRAITS = 6000;     // les extraits viennent de nos leçons, ils sont bornés
const MAX_PAR_MINUTE = 20;     // par adresse, garde-fou contre les rafales

/* Compteur en mémoire de l'isolat. Ce n'est pas un quota exact et
   ça ne prétend pas l'être : ça coupe les rafales sans rien coûter,
   le vrai plafond restant celui du palier gratuit du fournisseur. */
const vus = new Map();

function trop(ip) {
  const min = Math.floor(Date.now() / 60000);
  const cle = ip + ':' + min;
  const n = (vus.get(cle) || 0) + 1;
  vus.set(cle, n);
  if (vus.size > 500) {
    for (const k of vus.keys()) if (!k.endsWith(':' + min)) vus.delete(k);
  }
  return n > MAX_PAR_MINUTE;
}

/* Seules les origines listées peuvent appeler le relais. Cela ne
   protège pas d'un appel hors navigateur, mais c'est le cas
   d'abus réaliste : une page tierce qui pointe vers l'adresse. */
function origines(env) {
  return (env.ORIGINES || '').split(',').map((s) => s.trim()).filter(Boolean);
}

function entetes(origine) {
  return {
    'Access-Control-Allow-Origin': origine,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

const erreur = (code, message, origine) => new Response(
  JSON.stringify({ erreur: message }),
  { status: code, headers: { 'Content-Type': 'application/json', ...entetes(origine || '*') } }
);

export default {
  async fetch(requete, env) {
    const origine = requete.headers.get('Origin') || '';
    const permises = origines(env);
    const okOrigine = permises.length === 0 || permises.includes(origine);

    if (requete.method === 'OPTIONS') {
      return new Response(null, { status: okOrigine ? 204 : 403, headers: entetes(origine) });
    }
    if (requete.method !== 'POST') return erreur(405, 'Méthode non autorisée', origine);
    if (!okOrigine) return erreur(403, 'Origine non autorisée', origine);
    if (!env.AI_KEY) return erreur(500, 'Relais non configuré', origine);

    const ip = requete.headers.get('CF-Connecting-IP') || 'inconnue';
    if (trop(ip)) return erreur(429, 'Trop de questions d’un coup, réessaie dans une minute', origine);

    let corps;
    try { corps = await requete.json(); }
    catch { return erreur(400, 'Requête illisible', origine); }

    const question = String(corps.question || '').slice(0, MAX_QUESTION).trim();
    const extraits = String(corps.extraits || '').slice(0, MAX_EXTRAITS).trim();
    /* La page choisit la tâche dans une liste fermée : elle ne peut
       pas en rédiger une, sinon la consigne serait contournable. */
    const mode = Object.prototype.hasOwnProperty.call(TACHES, corps.mode) ? corps.mode : 'expliquer';
    if (!question) return erreur(400, 'Question vide', origine);
    if (!extraits) return erreur(400, 'Aucun extrait de cours fourni', origine);

    const base = env.AI_BASE_URL || 'https://api.groq.com/openai/v1';
    const modele = env.AI_MODEL || 'llama-3.3-70b-versatile';

    /* Douze secondes : au-delà, mieux vaut rendre la main à
       l'assistant hors ligne que laisser Mina devant un point qui
       clignote. */
    const minuteur = AbortSignal.timeout(12000);

    let rep;
    try {
      rep = await fetch(base.replace(/\/$/, '') + '/chat/completions', {
        method: 'POST',
        signal: minuteur,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + env.AI_KEY
        },
        body: JSON.stringify({
          model: modele,
          temperature: 0.2,
          max_tokens: JETONS[mode],
          messages: [
            { role: 'system', content: REGLES + '\n\n' + TACHES[mode] },
            { role: 'user', content: 'Extraits du cours :\n' + extraits + '\n\nDemande de Mina : ' + question }
          ]
        })
      });
    } catch (e) {
      return erreur(504, 'Le modèle n’a pas répondu à temps', origine);
    }

    if (!rep.ok) {
      const detail = (await rep.text()).slice(0, 200);
      return erreur(502, 'Le fournisseur a refusé : ' + detail, origine);
    }

    const data = await rep.json();
    const texte = (data.choices && data.choices[0] && data.choices[0].message &&
      data.choices[0].message.content || '').trim();
    if (!texte) return erreur(502, 'Réponse vide du modèle', origine);

    return new Response(JSON.stringify({ reponse: texte }), {
      headers: { 'Content-Type': 'application/json', ...entetes(origine) }
    });
  }
};
