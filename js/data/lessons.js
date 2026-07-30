/* ============================================================
   COURS - une leçon par thème.

   Chaque leçon est une suite de blocs, pas un pavé de texte. Le
   rendu choisit la forme la plus lisible pour chaque type :

     cle       les points à retenir, un par ligne
     chiffres  un tableau de valeurs, alignées
     panneaux  les panneaux du thème, dessinés
     schema    un dessin, quand la notion ne s'explique pas par des mots
     retenir   la seule phrase à garder si on ne retient qu'une chose
     piege     l'erreur classique, celle qui coûte des points
     texte     un paragraphe court, jamais plus de trois phrases

   Le champ theme relie la leçon à sa banque de questions : on peut
   réviser juste après avoir lu.
   ============================================================ */
window.LESSONS = [

/* ============ TRANSVERSE ============ */

{k:'memo', n:'Les chiffres à connaître par cœur', i:'chiffres', theme:'', star:true,
 resume:'Si tu ne lis qu’une leçon, c’est celle-ci. Ces nombres tombent presque à chaque examen.',
 blocs:[
  {t:'chiffres', titre:'Alcool au volant', lignes:[
    ['Permis classique','0,5 g/L','soit 0,25 mg/L d’air expiré'],
    ['Permis probatoire','0,2 g/L','autant dire aucun verre'],
    ['À partir de','0,8 g/L','ce n’est plus une amende, c’est un délit']]},
  {t:'schema', d:'vitesses'},
  {t:'chiffres', titre:'Sous la pluie', lignes:[
    ['Autoroute','110 km/h','au lieu de 130'],
    ['Chaussées séparées','100 km/h','au lieu de 110'],
    ['Hors agglomération','70 km/h','au lieu de 80'],
    ['En ville','50 km/h','inchangé']]},
  {t:'retenir', txt:'Visibilité sous 50 mètres : 50 km/h partout, autoroute comprise.'},
  {t:'schema', d:'distance-arret'},
  {t:'cle', titre:'Le calcul de la distance d’arrêt', items:[
    'Sur route sèche, prends le chiffre des dizaines et multiplie-le par lui-même.',
    'À 50 km/h : 5 × 5 = 25 mètres.',
    'À 90 km/h : 9 × 9 = 81 mètres.',
    'À 130 km/h : 13 × 13 = 169 mètres.',
    'Sur route mouillée, le freinage est deux fois plus long.']},
  {t:'chiffres', titre:'Le reste', lignes:[
    ['Distance de sécurité','2 secondes','le double sur route mouillée'],
    ['Pneus','1,6 mm','profondeur minimale des rainures'],
    ['Contrôle technique','4 ans','puis tous les 2 ans'],
    ['Dépasser un vélo','1 m / 1,50 m','en ville / hors agglomération'],
    ['Réussir l’examen','35 sur 40','5 erreurs autorisées']]}
 ]},

{k:'lexique', n:'Le lexique, en mots simples', i:'lexique', theme:'',
 resume:'Le code emploie des mots qu’on n’utilise jamais dans la vie courante. Les voici traduits.',
 blocs:[
  {t:'cle', titre:'Les mots de la route', items:[
    'Chaussée : la partie où roulent les voitures. Le trottoir n’en fait pas partie.',
    'Accotement : le bord de la route, juste après la chaussée.',
    'BAU : la bande d’arrêt d’urgence, à droite sur l’autoroute.',
    'Agglomération : tout ce qui est entre le panneau au nom de la ville et le même panneau barré.',
    'Usager : n’importe qui sur la route, à pied, à vélo ou en voiture.',
    'Giratoire : le mot officiel pour rond-point.',
    'Panonceau : la petite plaque sous un panneau, qui le précise.']},
  {t:'cle', titre:'Les mots des priorités', items:[
    'Céder le passage : laisser passer l’autre. Pas forcément s’arrêter.',
    'Marquer l’arrêt : s’arrêter complètement, roues immobiles. C’est le STOP.',
    'S’engager : entrer dans un carrefour ou sur une voie.',
    'Se rabattre : revenir à droite après avoir doublé.',
    'Déboîter : quitter sa voie pour aller doubler.']},
  {t:'cle', titre:'Les mots du véhicule', items:[
    'Carte grise : son vrai nom est certificat d’immatriculation. C’est la même chose.',
    'PTAC : le poids maximum de la voiture chargée. Il est écrit sur la carte grise.',
    'PTRA : le même poids maximum, mais voiture et remorque ensemble.',
    'Contre-visite : le second passage au contrôle technique quand quelque chose n’allait pas.',
    'Frein moteur : ralentir en rétrogradant, sans toucher la pédale de frein.',
    'Angle mort : la zone que les rétroviseurs ne montrent pas.',
    'Aquaplaning : le moment où le pneu flotte sur l’eau et ne touche plus la route.']},
  {t:'cle', titre:'Les sigles qu’on croise', items:[
    'ABS : empêche les roues de se bloquer, pour pouvoir tourner le volant en freinant fort.',
    'ESP : rattrape un début de dérapage tout seul.',
    'ADAS : le nom général des aides à la conduite.',
    'PLS : la position latérale de sécurité, sur le côté.',
    'DAE : le défibrillateur, cet appareil qui parle et guide pas à pas.',
    'EDPM : le nom officiel des trottinettes électriques.',
    'ZFE : une zone de ville interdite aux véhicules les plus polluants.']},
  {t:'retenir', txt:'Contravention : une amende. Délit : on passe devant un tribunal, et la prison devient possible.'},
  {t:'cle', titre:'Les mots des sanctions', items:[
    'Rétention : les policiers gardent le permis 72 heures, le temps qu’une décision soit prise.',
    'Suspension : interdiction de conduire pendant une durée fixée. Le permis est rendu ensuite.',
    'Annulation et invalidation : le permis n’existe plus, il faut le repasser.',
    'Permis probatoire : les premières années après l’obtention, avec 6 points seulement.']}
 ]},

{k:'nouveautes', n:'Ce qui a changé récemment', i:'nouveautes', theme:'',
 resume:'Ces changements sont récents. Ils tombent souvent, et un cours ancien peut enseigner le contraire.',
 blocs:[
  {t:'cle', titre:'En 2024', items:[
    'On peut conduire seul dès 17 ans après avoir obtenu le permis B.',
    'La vignette verte d’assurance collée au pare-brise n’existe plus. L’assurance, elle, reste obligatoire.',
    'Le contrôle technique devient obligatoire pour les motos de plus de 125 cm³.',
    'Un excès de vitesse de moins de 5 km/h ne coûte plus de point. L’amende reste due.',
    'Toute voiture neuve lit les panneaux de vitesse, freine seule en urgence et aide à rester dans la voie.']},
  {t:'cle', titre:'Un peu avant', items:[
    '2022 : les 5 mètres avant un passage piéton restent libres, pour qu’on voie arriver les piétons.',
    '2022 : la conduite déléguée à la voiture est autorisée, mais sur voies séparées et à faible vitesse.',
    '2021 : les véhicules de plus de 3,5 t portent des autocollants « angle mort ».',
    '2020 : l’éthylotest n’est plus obligatoire à bord. Le gilet et le triangle, si.',
    '2020 : téléphone en main plus une autre infraction, et le permis peut être retenu sur place.']},
  {t:'retenir', txt:'Les zones à faibles émissions se développent dans les grandes villes. Les règles changent d’une ville à l’autre : on se renseigne avant d’y aller.'}
 ]},

/* ============ PAR THÈME ============ */

{k:'signalisation', n:'Signalisation', i:'signalisation', theme:'signalisation',
 resume:'La forme et la couleur d’un panneau disent déjà tout. Le dessin ne fait que préciser.',
 blocs:[
  {t:'retenir', txt:'Triangle = danger. Rond à bord rouge = interdiction. Rond bleu = obligation. Carré ou rectangle bleu = information.'},

  {t:'cle', titre:'Qui commande, quand tout se contredit', items:[
    'Un agent qui règle la circulation passe avant tout le reste, y compris un feu rouge.',
    'Ensuite les feux tricolores.',
    'Ensuite les panneaux.',
    'Ensuite les lignes peintes au sol.',
    'Et en dernier seulement, les règles générales comme la priorité à droite.']},

  {t:'panneaux', titre:'Le danger : triangle rouge', signes:[
    ['danger-enfants','Enfants : abords d’école'],
    ['danger-pietons','Passage piétons proche'],
    ['danger-cyclistes','Débouché de cyclistes'],
    ['danger-animaux','Animaux sauvages'],
    ['danger-travaux','Travaux'],
    ['danger-glissant','Chaussée glissante'],
    ['danger-retrecissement','Chaussée rétrécie'],
    ['danger-descente','Descente dangereuse'],
    ['danger-vent','Vent latéral'],
    ['danger-train','Passage à niveau'],
    ['danger-feux','Feux tricolores annoncés'],
    ['danger-bouchon','Risque de bouchon']]},
  {t:'texte', txt:'Un triangle rouge n’interdit ni n’oblige rien : il prévient. La bonne réaction est toujours la même, lever le pied et anticiper, quel que soit le danger dessiné dedans.'},

  {t:'panneaux', titre:'La priorité : qui décide au carrefour', signes:[
    ['stop','Arrêt obligatoire, roues immobiles'],
    ['cedez','Céder le passage, sans forcément m’arrêter'],
    ['route-prioritaire','Route prioritaire jusqu’au panneau de fin'],
    ['fin-route-prioritaire','Fin de route prioritaire'],
    ['priorite-a-droite','Annonce d’un carrefour où je cède à droite'],
    ['cedez-giratoire','Céder le passage à l’entrée du giratoire'],
    ['sens-giratoire','Sens de circulation dans le giratoire']]},
  {t:'piege', txt:'Un rond-point sans aucun panneau à l’entrée inverse la règle : ce sont ceux qui entrent qui passent, pas ceux déjà dans l’anneau. C’est rare, et ça tombe à l’examen.'},

  {t:'panneaux', titre:'L’interdiction : rond à bord rouge', signes:[
    ['sens-interdit','Sens interdit dans ce sens'],
    ['circulation-interdite','Interdit dans les deux sens'],
    ['interdit-depasser','Dépassement interdit'],
    ['interdit-demi-tour','Demi-tour interdit'],
    ['interdit-klaxon','Avertisseur sonore interdit'],
    ['stationnement-interdit','Stationnement interdit (l’arrêt reste permis)'],
    ['arret-stationnement-interdit','Arrêt et stationnement interdits'],
    ['limite-50','Vitesse maximale : 50 km/h'],
    ['fin-limite-70','Fin de la limitation à 70'],
    ['fin-interdictions','Fin de toutes les interdictions en cours']]},
  {t:'cle', titre:'Deux confusions classiques', items:[
    'Sens interdit (barre blanche sur rond rouge) ne concerne qu’un seul sens ; circulation interdite (rond rouge entièrement vide) barre les deux sens.',
    'Stationnement interdit (une barre) laisse l’arrêt possible pour monter ou descendre quelqu’un ; arrêt et stationnement interdits (croix) ne tolère aucune immobilisation.']},

  {t:'panneaux', titre:'L’obligation : rond bleu', signes:[
    ['obl-tout-droit','Direction obligatoire : tout droit'],
    ['obl-droite','Obligation de tourner à droite'],
    ['contournement-droite','Contournement obligatoire par la droite'],
    ['obl-velo','Piste ou bande cyclable obligatoire'],
    ['vitesse-mini-30','Vitesse minimale : 30 km/h']]},
  {t:'texte', txt:'Le bleu ordonne, il n’interdit jamais. Un rond bleu à vélo oblige les cyclistes à emprunter l’aménagement ; la même icône sur fond carré bleu ne fait que le conseiller.'},

  {t:'panneaux', titre:'Les feux tricolores', signes:[
    ['feu-rouge','Rouge fixe : arrêt'],
    ['feu-orange','Orange fixe : je m’arrête si je peux le faire sans danger'],
    ['feu-jaune-clignotant','Orange clignotant : le feu ne régule plus le carrefour']]},
  {t:'cle', titre:'Ce que chaque feu impose', items:[
    'Rouge : arrêt avant la ligne d’effet (la large bande blanche) ou, à défaut, avant le feu, sans empiéter sur le passage piéton.',
    'Orange fixe : je m’arrête, sauf si je ne peux plus le faire sans risquer une collision par l’arrière.',
    'Orange clignotant : le carrefour n’est plus régulé, j’avance prudemment et j’applique les panneaux ou la priorité à droite.',
    'Un agent qui règle la circulation prime toujours sur les feux, même au rouge.']},

  {t:'panneaux', titre:'L’indication : carré ou rectangle bleu', signes:[
    ['agglomeration','Entrée d’agglomération'],
    ['fin-agglomeration','Sortie d’agglomération'],
    ['zone-30','Zone 30'],
    ['zone-rencontre','Zone de rencontre'],
    ['autoroute','Autoroute'],
    ['voie-rapide','Route à accès réglementé (voie rapide)'],
    ['impasse','Voie sans issue'],
    ['passage-pietons','Passage piétons'],
    ['parking','Parking'],
    ['hopital','Établissement de santé']]},

  {t:'chiffres', titre:'Les vitesses par défaut, sans panneau', lignes:[
    ['Agglomération','50 km/h','sauf 30 signalé'],
    ['Sortie d’agglomération','80 km/h','90 dans certains départements signalés'],
    ['Autoroute','130 km/h','110 par temps de pluie'],
    ['Route à accès réglementé','110 km/h','100 par temps de pluie'],
    ['Zone 30','30 km/h',''],
    ['Zone de rencontre','20 km/h','']]},
  {t:'piege', txt:'Le nom de la ville EST un panneau de limitation : entrer en agglomération impose 50 km/h même sans panneau de vitesse.'},

  {t:'cle', titre:'Le marquage au sol', items:[
    'Ligne continue : je ne la franchis pas. Seule exception, dépasser un cycliste ou un piéton si je vois loin et sans les gêner.',
    'Ligne discontinue : je peux la franchir.',
    'Traits qui s’allongent, espaces qui raccourcissent : une ligne continue arrive, je termine ou j’annule mon dépassement.',
    'Zébras bordés de lignes continues : zone interdite, je n’y roule ni ne la traverse.',
    'Flèche de rabattement peinte au sol : ma voie va disparaître, je me range en douceur.']},
  {t:'piege', txt:'Entre deux lignes différentes, c’est toujours celle de mon côté qui compte, jamais celle du côté d’en face.'},

  {t:'cle', titre:'Autres réflexes utiles', items:[
    'Un panonceau sous un panneau le précise ou le restreint (distance, catégorie de véhicule, horaires) : il se lit toujours avec le panneau qu’il complète.',
    'Une hauteur limitée se compte chargement compris : coffre de toit, vélo ou remorque surélevée peuvent faire dépasser la limite.',
    'Le vent latéral surprend surtout à la sortie d’un tunnel, d’un pont, ou juste après avoir doublé un poids lourd.',
    'L’avertisseur sonore n’est légal qu’en cas de danger immédiat, jamais pour saluer ou s’agacer.']},

  {t:'texte', txt:'Sur un chantier, la signalisation temporaire à fond jaune remplace les panneaux habituels et l’emporte aussi sur le marquage au sol déjà en place. Le jaune temporaire gagne toujours sur le blanc permanent.'}
 ]},

{k:'priorites', n:'Priorités & intersections', i:'priorites', theme:'priorites',
 resume:'Une seule question à chaque carrefour : est-ce qu’un panneau décide à ma place ?',
 blocs:[
  {t:'schema', d:'priorite-droite'},
  {t:'retenir', txt:'Sans aucun panneau, celui qui arrive à ma droite passe avant moi. La largeur de la route n’y change rien.'},
  {t:'cle', titre:'Qui doit toujours céder le passage', items:[
    'Celui qui sort d’un parking, d’un garage ou d’une station-service. Y compris aux piétons.',
    'Celui qui tourne à gauche, face à une voiture qui va tout droit.',
    'Celui qui a un obstacle de son côté sur une route étroite.',
    'Celui qui descend, en montagne.',
    'Celui qui entre dans un giratoire signalé « Cédez le passage ».']},
  {t:'schema', d:'giratoire'},
  {t:'piege', txt:'Un rond-point sans panneau à l’entrée inverse la règle : là, ce sont ceux qui entrent qui passent. C’est rare, et ça tombe à l’examen.'},
  {t:'cle', titre:'Toujours prioritaires', items:[
    'Le tramway : il ne peut ni s’écarter, ni freiner vite.',
    'Les véhicules de secours en intervention, sirène et gyrophare allumés.',
    'Le bus qui quitte son arrêt, mais seulement en ville.',
    'Le piéton engagé, ou celui qui montre clairement qu’il veut traverser.']},
  {t:'panneaux', titre:'Les panneaux qui décident', signes:[
    ['stop','Je m’arrête, même si la voie est libre'],
    ['cedez','Je laisse passer, sans forcément m’arrêter'],
    ['route-prioritaire','Je reste prioritaire aux prochains carrefours'],
    ['priorite-a-droite','Attention, quelqu’un peut arriver de ma droite'],
    ['cedez-giratoire','Ceux qui tournent déjà passent avant moi']]},
  {t:'texte', txt:'Dans un giratoire, le clignotant droit s’allume juste après la sortie qui précède la mienne. Pas avant.'}
 ]},

{k:'vitesse', n:'Vitesses & distances', i:'vitesse', theme:'vitesse',
 resume:'La vitesse affichée est un maximum, jamais un objectif. Et une voiture ne s’arrête pas où on croit.',
 blocs:[
  {t:'schema', d:'vitesses'},
  {t:'chiffres', titre:'Les limites par défaut, temps sec', lignes:[
    ['Agglomération','50 km/h','sauf 30 signalé'],
    ['Route à double sens sans séparateur','80 km/h','90 dans certains départements signalés'],
    ['Route à chaussées séparées','110 km/h',''],
    ['Autoroute','130 km/h','']]},
  {t:'chiffres', titre:'Ce qui change par temps de pluie', lignes:[
    ['Autoroute','110 km/h','au lieu de 130'],
    ['Route à chaussées séparées','100 km/h','au lieu de 110'],
    ['Route à double sens sans séparateur','70 km/h','au lieu de 80 (ou 90)'],
    ['Agglomération','50 km/h','inchangé, mais à adapter']]},
  {t:'piege', txt:'Les vitesses « pluie » s’appliquent sans qu’aucun panneau ne le rappelle, même quand le panneau affiche encore la limite par temps sec. C’est au conducteur de les connaître.'},
  {t:'piege', txt:'Visibilité inférieure à 50 mètres (brouillard, forte pluie, neige) : 50 km/h partout, autoroute comprise.'},
  {t:'cle', titre:'Période probatoire (permis récent)', items:[
    '110 km/h sur autoroute, 100 sur route à chaussées séparées, 80 sur les autres routes hors agglomération.',
    'Ce sont les mêmes valeurs que par temps de pluie, mais elles s’appliquent tout le temps, même par beau temps.',
    'Elle dure 3 ans, ou 2 ans après une conduite accompagnée. Le disque « A » reste collé à l’arrière du véhicule.']},
  {t:'texte', txt:'Un ensemble routier de plus de 3,5 t (voiture avec une remorque lourde, par exemple) reste limité à 90 km/h sur autoroute au lieu de 130 : la masse allonge fortement la distance d’arrêt.'},

  {t:'cle', titre:'Où ralentir, même sans panneau', items:[
    'Dans un virage, ou au sommet d’une côte.',
    'À l’approche d’un passage piéton ou d’une école, même sans panneau : la présence d’enfants suffit.',
    'Quand on croise quelqu’un sur une route étroite.',
    'Sur un chantier, ou par mauvais temps, ou dans un trafic dense.']},
  {t:'piege', txt:'Rouler nettement en dessous de la vitesse autorisée, sans motif, peut aussi être sanctionné : cela crée des ralentissements et pousse les autres à des dépassements risqués.'},

  {t:'schema', d:'distance-arret'},
  {t:'cle', titre:'La distance d’arrêt, en chiffres', items:[
    'Elle se compose de la distance de réaction (≈ 1 seconde, le temps de percevoir et de réagir) et de la distance de freinage.',
    'Astuce sur sol sec : distance d’arrêt ≈ le chiffre des dizaines au carré. À 50 km/h : 5×5 = 25 m. À 90 km/h : 9×9 = 81 m. À 130 km/h : 13×13 = 169 m.',
    'Sur chaussée mouillée, la distance de freinage double environ.',
    'Le temps de réaction double avec la fatigue, l’alcool ou l’usage du téléphone : la distance parcourue avant même de freiner double aussi.']},
  {t:'schema', d:'deux-secondes'},
  {t:'retenir', txt:'Deux secondes d’écart minimum avec le véhicule qui précède. Trois sur route mouillée. C’est une durée, donc elle s’adapte toute seule à la vitesse.'},
  {t:'cle', titre:'Quand augmenter la distance de sécurité', items:[
    'Par temps de pluie ou de brouillard.',
    'Derrière un deux-roues, qui peut freiner ou chuter très vite.',
    'Derrière un véhicule qui masque la visibilité (poids lourd, utilitaire) : la distance permet aussi de voir plus loin devant.',
    'Sur autoroute, l’écart se contrôle avec les traits ou chevrons peints au sol : il faut voir au moins deux traits entre soi et le véhicule qui précède.']},

  {t:'texte', txt:'Rouler deux fois plus vite ne double pas le choc : l’énergie à dissiper au freinage est multipliée par quatre, tout comme la force centrifuge dans un virage. C’est pour cela que 20 km/h de moins change tout.'},
  {t:'piege', txt:'Un choc frontal entre deux véhicules roulant chacun à 90 km/h équivaut à un impact à 180 km/h contre un obstacle fixe : les vitesses se cumulent. C’est ce qui rend un dépassement sans visibilité si dangereux.'},

  {t:'cle', titre:'Régulateur et limiteur : deux outils différents', items:[
    'Le régulateur maintient seul la vitesse choisie : il est déconseillé sur chaussée glissante ou dans un trafic dense, car il ne tient compte ni de l’adhérence ni des autres véhicules.',
    'Le limiteur empêche seulement de dépasser une vitesse fixée, mais laisse le contrôle de l’accélérateur : plus adapté en ville ou sur une route à vitesse changeante.']},
  {t:'texte', txt:'Sur une descente prolongée, la vitesse augmente naturellement si l’on ne rétrograde pas : le frein moteur maîtrise la vitesse sans faire chauffer les freins jusqu’à leur perte d’efficacité.'},

  {t:'chiffres', titre:'Ce que coûte un excès', lignes:[
    ['Moins de 5 km/h','0 point','l’amende reste due'],
    ['5 à 19 km/h','1 point',''],
    ['20 à 29 km/h','2 points',''],
    ['30 à 39 km/h','3 points',''],
    ['40 à 49 km/h','4 points',''],
    ['50 km/h et plus','6 points','1 500 € et suspension possible']]},
  {t:'piege', txt:'Un radar embarqué mobile applique une marge technique deux fois plus large qu’un radar fixe (5 km/h jusqu’à 100 km/h, puis 5 % au-delà) : l’infraction reste valable même sans interception immédiate.'}
 ]},

{k:'manoeuvres', n:'Dépassement & manœuvres', i:'manoeuvres', theme:'manoeuvres',
 resume:'Toute manœuvre suit le même ordre : je regarde, j’annonce, puis seulement j’agis.',
 blocs:[
  {t:'retenir', txt:'Contrôler, signaler, agir. Dans cet ordre, toujours. Le clignotant annonce une intention, il ne donne aucun droit.'},
  {t:'cle', titre:'Un dépassement, étape par étape', items:[
    'Je regarde dans les rétroviseurs.',
    'Je jette un coup d’œil par-dessus l’épaule, pour l’angle mort.',
    'Je mets le clignotant.',
    'Je déboîte et je dépasse.',
    'Je vois la voiture dépassée entière dans mon rétroviseur intérieur.',
    'Alors seulement, je me rabats.']},
  {t:'schema', d:'depassement-cycliste'},
  {t:'cle', titre:'Quand dépasser est interdit', items:[
    'Quand je ne vois pas assez loin : virage, sommet de côte.',
    'Sur un passage à niveau ou un passage piéton.',
    'Dans un carrefour où je ne suis pas prioritaire.',
    'Quand la voiture devant moi est déjà en train de doubler.']},
  {t:'piege', txt:'Accélérer pendant qu’on te double est une infraction, et une cause classique de choc frontal. Serre à droite et laisse faire.'},
  {t:'texte', txt:'Marche arrière et demi-tour sont interdits sur autoroute et voie rapide, sur un passage à niveau, et dans tout virage sans visibilité.'},
  {t:'retenir', txt:'Ouvre ta portière avec la main opposée. Ton corps pivote tout seul et tes yeux voient le cycliste qui arrive.'}
 ]},

{k:'autoroute', n:'Autoroute & voies rapides', i:'autoroute', theme:'autoroute',
 resume:'Tout y va plus vite, y compris les erreurs. Trois moments comptent : entrer, circuler, sortir.',
 blocs:[
  {t:'cle', titre:'Entrer', items:[
    'La voie d’insertion sert à prendre de la vitesse, pas à hésiter.',
    'Je n’ai aucune priorité : je m’insère dans un espace libre.',
    'S’arrêter en bout de voie d’insertion est très dangereux.']},
  {t:'cle', titre:'Circuler', items:[
    'Voie de droite par défaut. La gauche sert à dépasser, puis on se rabat.',
    'Sur la voie de gauche, il faut pouvoir tenir au moins 80 km/h.',
    'Interdits : piétons, vélos, cyclomoteurs, tout véhicule trop lent.',
    'Marche arrière et demi-tour : interdits, sans exception.']},
  {t:'cle', titre:'Sortir', items:[
    'Je me rabats à droite bien avant la sortie.',
    'Je ralentis sur la bretelle, pas sur l’autoroute.',
    'Sortie ratée ? La suivante. Jamais de marche arrière.']},
  {t:'schema', d:'panne-autoroute'},
  {t:'retenir', txt:'En panne : feux de détresse, gilet enfilé dans la voiture, sortie par la droite, et on passe derrière la glissière. Les bornes d’appel sont tous les 2 km.'},
  {t:'piege', txt:'La bande d’arrêt d’urgence n’est pas un endroit sûr. On ne reste jamais dans la voiture arrêtée dessus.'},
  {t:'texte', txt:'La fatigue est la première cause d’accident mortel sur autoroute. Une pause de quinze minutes toutes les deux heures, même sans se sentir fatiguée.'}
 ]},

{k:'stationnement', n:'Arrêt & stationnement', i:'stationnement', theme:'stationnement',
 resume:'Une seule question : est-ce que je gêne quelqu’un de plus fragile que moi ?',
 blocs:[
  {t:'retenir', txt:'Arrêt : je reste au volant, quelques instants. Stationnement : je quitte la voiture, ou je reste longtemps.'},
  {t:'panneaux', titre:'Les deux panneaux à ne pas confondre', signes:[
    ['stationnement-interdit','Une seule barre : je peux m’arrêter, pas stationner'],
    ['arret-stationnement-interdit','Une croix : je ne m’immobilise pas du tout']]},
  {t:'cle', titre:'Interdit dans tous les cas', items:[
    'Sur un passage piéton, un trottoir, une piste cyclable.',
    'Sur les 5 mètres avant un passage piéton.',
    'Devant une entrée de garage.',
    'Sur une place réservée aux personnes handicapées, un arrêt de bus, une voie de bus.',
    'Sur un pont, dans un tunnel, sur la bande d’arrêt d’urgence.']},
  {t:'schema', d:'pente'},
  {t:'cle', titre:'Bon à savoir', items:[
    'Plus de 7 jours au même endroit : c’est abusif, la fourrière peut venir.',
    'Stationnement gênant : 135 €.',
    'Sans marquage au sol, on se gare le long du trottoir, à droite.',
    'À gauche, uniquement dans une rue à sens unique.']},
  {t:'piege', txt:'Les feux de détresse ne rendent jamais légal un stationnement interdit. Ils préviennent d’un danger, c’est tout.'}
 ]},

{k:'conducteur', n:'Le conducteur', i:'conducteur', theme:'conducteur',
 resume:'La voiture est rarement en cause. C’est l’état de celle qui conduit qui décide de tout.',
 blocs:[
  {t:'chiffres', titre:'Alcool', lignes:[
    ['Permis classique','0,5 g/L','soit 0,25 mg/L d’air expiré'],
    ['Permis probatoire','0,2 g/L','un seul verre fait dépasser'],
    ['Délit à partir de','0,8 g/L','4 500 €, 6 points, prison possible'],
    ['Élimination','0,10 à 0,15 g/L','par heure, et rien ne l’accélère']]},
  {t:'retenir', txt:'Le café réveille, il ne fait pas baisser l’alcool. Seul le temps compte.'},
  {t:'cle', titre:'Ce que l’alcool fait vraiment', items:[
    'Il allonge le temps de réaction.',
    'Il rétrécit le champ de vision.',
    'Il augmente la prise de risque, tout en donnant l’impression de bien conduire.']},
  {t:'texte', txt:'Pour les stupéfiants, il n’existe aucun seuil. La moindre trace est un délit, et le test salivaire détecte bien après la disparition des effets.'},
  {t:'cle', titre:'Les signes qu’il faut s’arrêter', items:[
    'Les bâillements qui reviennent.',
    'Les paupières lourdes, le regard fixe.',
    'La voiture qui flotte dans la voie.']},
  {t:'retenir', txt:'Face à ces signes, une seule réponse marche : une sieste de quinze à vingt minutes. La musique et la fenêtre ouverte ne servent à rien.'},
  {t:'chiffres', titre:'Le permis à points', lignes:[
    ['Permis probatoire','6 points','12 après 3 ans sans infraction'],
    ['Après conduite accompagnée','2 ans','au lieu de 3'],
    ['Stage de récupération','4 points','une fois par an au maximum'],
    ['Téléphone en main','3 points','135 €, même à l’arrêt au feu rouge'],
    ['Ceinture non bouclée','3 points','135 €']]},
  {t:'piege', txt:'Les écouteurs et les oreillettes sont interdits au volant. Seul le kit intégré à la voiture est autorisé.'}
 ]},

{k:'usagers', n:'Les autres usagers', i:'usagers', theme:'usagers',
 resume:'Plus l’autre est fragile, plus ta marge doit être grande. C’est toute la règle.',
 blocs:[
  {t:'chiffres', titre:'Un piéton renversé', lignes:[
    ['À 30 km/h','1 sur 10','risque de décès'],
    ['À 50 km/h','1 sur 2',''],
    ['À 60 km/h','plus de 8 sur 10','']]},
  {t:'retenir', txt:'Vingt kilomètres-heure de moins, c’est une vie sauvée sur deux. C’est toute la raison d’être des zones 30.'},
  {t:'schema', d:'angle-mort'},
  {t:'piege', txt:'Un camion qui tourne à droite se déporte d’abord à gauche. Ne jamais s’intercaler à sa droite à ce moment-là.'},
  {t:'cle', titre:'Ce qu’un cycliste a le droit de faire', items:[
    'Rouler à deux de front, sauf la nuit ou si le trafic l’exige.',
    'Remonter une rue à sens unique, si c’est un double-sens cyclable.',
    'Tourner à droite au feu rouge, quand un petit panneau triangulaire le prévoit.',
    'Se placer au milieu de la voie pour éviter les portières et se rendre visible.']},
  {t:'schema', d:'depassement-cycliste'},
  {t:'cle', titre:'Les trottinettes électriques', items:[
    'Une seule personne par engin.',
    '25 km/h maximum, 14 ans minimum.',
    'Sur les pistes cyclables ou la chaussée, jamais sur le trottoir.',
    'Écouteurs interdits, comme en voiture.']},
  {t:'texte', txt:'Un enfant ne perçoit pas correctement les distances avant une dizaine d’années, et croit qu’être vu suffit à être protégé. C’est à toi d’anticiper.'}
 ]},

{k:'vehicule', n:'Véhicule & équipements', i:'vehicule', theme:'vehicule',
 resume:'Cinq minutes de vérification évitent trois heures d’attente sur une bande d’arrêt d’urgence.',
 blocs:[
  {t:'retenir', txt:'Obligatoires à bord : le gilet, rangé dans l’habitacle, et le triangle. L’éthylotest ne l’est plus depuis 2020.'},
  {t:'cle', titre:'Les pneus', items:[
    'Profondeur minimale des rainures : 1,6 mm.',
    'Pression vérifiée à froid, une fois par mois, roue de secours comprise.',
    'Un pneu sous-gonflé consomme plus, s’use sur les bords et peut éclater.']},
  {t:'chiffres', titre:'Les feux', lignes:[
    ['Feux de croisement','30 m','de portée'],
    ['Feux de route','100 m','à éteindre dès qu’on croise quelqu’un'],
    ['Brouillard avant','pluie, neige, brouillard',''],
    ['Brouillard arrière','brouillard ou neige','jamais sous la pluie']]},
  {t:'piege', txt:'Les feux de brouillard arrière sous la pluie éblouissent et masquent les feux stop. C’est interdit.'},
  {t:'cle', titre:'Les témoins du tableau de bord', items:[
    'Rouge : je m’arrête dès que possible.',
    'Orange : à faire vérifier rapidement.',
    'Vert ou bleu : tout va bien, c’est une information.']},
  {t:'texte', txt:'L’ABS empêche les roues de se bloquer : il permet de continuer à tourner le volant en freinant à fond. Il ne raccourcit pas toujours la distance.'},
  {t:'retenir', txt:'La ceinture tient sur l’os : l’épaule et les hanches, jamais sur le ventre.'}
 ]},

{k:'technologie', n:'Aides à la conduite', i:'technologie', theme:'technologie',
 resume:'Depuis 2024, toutes les voitures neuves en sont équipées. Elles aident, elles ne conduisent pas.',
 blocs:[
  {t:'retenir', txt:'Quel que soit l’équipement, c’est toi qui restes responsable de la conduite et des infractions.'},
  {t:'cle', titre:'Ce que toute voiture neuve embarque depuis juillet 2024', items:[
    'La lecture des panneaux de vitesse, qui alerte en cas de dépassement.',
    'Le freinage d’urgence automatique.',
    'L’aide au maintien dans la voie.',
    'Une alerte de somnolence.',
    'L’aide au recul et une boîte noire qui enregistre les secondes du choc.']},
  {t:'cle', titre:'Ce qui les aveugle', items:[
    'Un pare-brise sale, un capteur couvert de boue ou de givre.',
    'Le brouillard, la neige, un contre-jour.',
    'Un marquage au sol effacé : plus de lignes, plus de maintien de voie.']},
  {t:'piege', txt:'L’alerte d’angle mort ne voit pas toujours un deux-roues qui remonte vite. Le coup d’œil par-dessus l’épaule reste la seule vérification fiable.'},
  {t:'cle', titre:'La voiture électrique', items:[
    'Plus lourde, donc plus longue à arrêter.',
    'Très silencieuse en ville : elle surprend les piétons, d’où le son artificiel obligatoire.',
    'Elle ralentit fortement au lever de pied, parfois sans allumer les feux stop.',
    'Après un choc, sa batterie peut prendre feu plusieurs heures plus tard.']},
  {t:'texte', txt:'Le régulateur adaptatif suit la voiture de devant. Il ne comprend ni les feux, ni les piétons, ni un véhicule arrêté en travers.'}
 ]},

{k:'conditions', n:'Conditions difficiles', i:'conditions', theme:'conditions',
 resume:'La pluie, la nuit et le brouillard ne changent pas les règles. Ils changent les distances.',
 blocs:[
  {t:'cle', titre:'Sous la pluie', items:[
    'Vitesses réduites : 110, 100, 80, 70 selon la route.',
    'Distances augmentées : trois secondes au lieu de deux.',
    'Feux de croisement allumés.']},
  {t:'retenir', txt:'Les dix premières minutes de pluie sont les plus glissantes : l’eau fait remonter le gras déposé sur la route.'},
  {t:'cle', titre:'Si la voiture se met à flotter sur l’eau', items:[
    'Je lâche l’accélérateur.',
    'Je ne freine pas brutalement.',
    'Je garde le volant droit et j’attends que les pneus retrouvent la route.']},
  {t:'piege', txt:'Dans le brouillard, jamais de pleins phares : la lumière rebondit sur les gouttelettes et forme un mur blanc.'},
  {t:'cle', titre:'La nuit', items:[
    'En feux de croisement, je vois à 30 mètres. Au-delà de 80 km/h, je roule plus loin que ce que je vois.',
    'Éblouie, je regarde le bord droit de la chaussée et je ralentis.',
    'Un piéton habillé de sombre n’est visible qu’à une trentaine de mètres.']},
  {t:'cle', titre:'Neige et verglas', items:[
    'Tout en douceur : accélérer, freiner, tourner.',
    'Le verglas se forme d’abord sur les ponts et dans les zones à l’ombre.',
    'Chaînes sur les roues motrices, 50 km/h maximum, retirées dès que la route est dégagée.']},
  {t:'texte', txt:'Dans un tunnel : feux de croisement, lunettes de soleil enlevées. En cas d’incendie, on coupe le moteur, on laisse les clés et on rejoint la sortie à pied. La fumée tue avant les flammes.'}
 ]},

{k:'secours', n:'Premiers secours', i:'secours', theme:'secours',
 resume:'Trois gestes dans le bon ordre. Se précipiter fait souvent une victime de plus.',
 blocs:[
  {t:'retenir', txt:'Protéger, Alerter, Secourir. Dans cet ordre, jamais un autre.'},
  {t:'cle', titre:'Protéger', items:[
    'Feux de détresse allumés.',
    'Gilet enfilé avant de sortir de la voiture.',
    'Triangle posé à environ 30 mètres, bien plus loin avant un virage.',
    'Moteurs coupés, personne ne fume.']},
  {t:'chiffres', titre:'Alerter', lignes:[
    ['112','partout en Europe','même sans carte SIM'],
    ['15','SAMU',''],
    ['18','pompiers',''],
    ['17','police',''],
    ['114','par SMS','pour les sourds et malentendants']]},
  {t:'cle', titre:'Ce qu’il faut dire', items:[
    'Le lieu précis : la route, le sens de circulation, la borne kilométrique.',
    'Le nombre de victimes et leur état.',
    'Et surtout : ne jamais raccrocher le premier.']},
  {t:'schema', d:'pls'},
  {t:'cle', titre:'Secourir', items:[
    'On ne déplace pas une victime, sauf danger vital immédiat.',
    'Inconsciente mais elle respire : position latérale de sécurité.',
    'Elle ne respire pas : massage cardiaque, 100 à 120 par minute.',
    'Le casque d’un motard reste en place, sauf si elle ne respire pas.',
    'Une hémorragie s’arrête en appuyant fort, sans relâcher.']},
  {t:'piege', txt:'Jamais boire, jamais manger, jamais retirer un objet planté dans une plaie. Mais parler et rassurer, oui.'},
  {t:'texte', txt:'Appeler le 112 est déjà porter secours. Personne n’est obligé de prendre un risque vital.'}
 ]},

{k:'sanctions', n:'Infractions & sanctions', i:'sanctions', theme:'sanctions',
 resume:'Les barèmes se retiennent par blocs. Une fois classés, ils ne bougent plus.',
 blocs:[
  {t:'retenir', txt:'Contravention : une amende. Délit : un tribunal, et la prison devient possible.'},
  {t:'cle', titre:'Ce qui coûte 4 points', items:[
    'Franchir un feu rouge.',
    'Ne pas respecter un stop.',
    'Refuser une priorité.',
    'Rouler en sens interdit.']},
  {t:'cle', titre:'Ce qui coûte 3 points', items:[
    'Téléphone tenu en main.',
    'Ceinture non bouclée.',
    'Franchir une ligne continue.',
    'Porter des écouteurs.']},
  {t:'texte', txt:'Les premières ont un point commun : elles créent un risque de collision directe avec quelqu’un. Les secondes sont des fautes d’attention.'},
  {t:'cle', titre:'Les délits routiers', items:[
    'Alcool à 0,8 g/L ou plus.',
    'Conduite après usage de stupéfiants.',
    'Défaut d’assurance.',
    'Délit de fuite, même pour un simple rétroviseur cassé.',
    'Conduite sans permis, ou malgré une suspension.']},
  {t:'chiffres', titre:'Ce qui peut arriver au permis', lignes:[
    ['Rétention','72 heures','le temps qu’une décision soit prise'],
    ['Suspension','durée fixée','le permis est rendu ensuite'],
    ['Annulation','définitif','il faut le repasser'],
    ['Solde à zéro','6 mois minimum','avant de pouvoir le repasser']]},
  {t:'piege', txt:'Payer une amende revient à reconnaître l’infraction : les points partent avec. Si tu contestes, il faut le faire avant de payer.'}
 ]},

{k:'environnement', n:'Éco-conduite', i:'environnement', theme:'environnement',
 resume:'Conduire souple, c’est conduire sûr. Les deux vont ensemble, ce n’est pas un hasard.',
 blocs:[
  {t:'retenir', txt:'Regarder loin permet de moins freiner, donc de moins accélérer. C’est 10 à 15 % de carburant en moins, et une conduite plus sûre.'},
  {t:'cle', titre:'Les gestes qui comptent', items:[
    'Passer les vitesses tôt : vers 2 000 tr/min en diesel, 2 500 en essence.',
    'Ne pas faire chauffer le moteur à l’arrêt : c’est inutile et polluant.',
    'Retirer la galerie ou le coffre de toit quand on ne s’en sert pas.',
    'Vérifier la pression des pneus : le geste le plus écologique est aussi le plus gratuit.']},
  {t:'chiffres', titre:'Ce que ça change', lignes:[
    ['130 au lieu de 110','+20 % de carburant','pour 8 minutes gagnées sur 100 km'],
    ['Coffre de toit','+10 à 20 %',''],
    ['Climatisation en ville','+10 à 20 %','mais utile au-delà de 70 km/h']]},
  {t:'texte', txt:'Les vignettes Crit’Air vont de 0, pour l’électrique, à 5 pour les diesels anciens. Elles décident de l’accès aux zones à faibles émissions.'},
  {t:'piege', txt:'Même une voiture électrique émet des particules : celles des freins et des pneus.'}
 ]},

{k:'admin', n:'Papiers & réglementation', i:'admin', theme:'admin',
 resume:'Trois documents, quelques délais. Rien de compliqué une fois posé à plat.',
 blocs:[
  {t:'cle', titre:'À présenter en cas de contrôle', items:[
    'Le permis de conduire.',
    'Le certificat d’immatriculation, autrement dit la carte grise.',
    'Une preuve d’assurance en cours.']},
  {t:'retenir', txt:'Depuis avril 2024, la vignette verte collée au pare-brise n’existe plus. Les forces de l’ordre consultent un fichier. L’assurance reste obligatoire.'},
  {t:'chiffres', titre:'Les délais à retenir', lignes:[
    ['Changement d’adresse','1 mois',''],
    ['Carte grise après achat','1 mois',''],
    ['Déclaration de vente','15 jours',''],
    ['Constat à l’assureur','5 jours ouvrés',''],
    ['Contre-visite','2 mois','après un contrôle technique refusé']]},
  {t:'cle', titre:'Le contrôle technique', items:[
    'Premier passage à 4 ans, puis tous les 2 ans.',
    'Pour vendre une voiture de plus de 4 ans : contrôle de moins de 6 mois.',
    'Obligatoire aussi pour les motos de plus de 125 cm³ depuis 2024.']},
  {t:'cle', titre:'Le bonus-malus', items:[
    'Coefficient à 1 au départ, qui baisse de 5 % par année sans accident responsable, jusqu’à un plancher de 0,50.',
    'Un accident entièrement responsable l’augmente de 25 %, un accident partagé de 12,5 %.',
    'Il suit le conducteur et se transmet à un nouveau contrat, pas à un nouveau véhicule.']},
  {t:'texte', txt:'Le permis B couvre les véhicules jusqu’à 3,5 tonnes et 9 places, conducteur compris. Au-delà, il faut une autre catégorie.'},
  {t:'piege', txt:'Un constat signé ne peut plus être modifié. En cas de désaccord, chacun remplit sa partie et note ses observations.'}
 ]},

{k:'trajet', n:'Préparer son trajet', i:'trajet', theme:'trajet',
 resume:'Un trajet mal préparé pousse à rouler vite et à sauter les pauses. C’est là que ça se joue.',
 blocs:[
  {t:'cle', titre:'Avant de partir', items:[
    'Pression des pneus, à froid.',
    'Niveaux, éclairage, essuie-glaces.',
    'Itinéraire réglé à l’arrêt, jamais en roulant.',
    'Vignette Crit’Air vérifiée si le trajet traverse une grande ville.']},
  {t:'retenir', txt:'Une pause de quinze à vingt minutes toutes les deux heures. À prendre même sans se sentir fatiguée : la vigilance baisse avant qu’on ne le sente.'},
  {t:'cle', titre:'Le chargement', items:[
    'Les objets lourds en bas et vers l’avant.',
    'Rien ne doit masquer les feux ni la plaque.',
    'Tout est arrimé, même pour un trajet court.',
    'Au-delà d’un mètre qui dépasse à l’arrière : dispositif réfléchissant obligatoire.']},
  {t:'texte', txt:'À 50 km/h, un objet de 5 kg non attaché frappe avec l’équivalent de plus de 100 kg. Tout ce qui est libre dans l’habitacle devient un projectile.'},
  {t:'cle', titre:'Voiture chargée', items:[
    'Corriger la hauteur des phares, sinon on éblouit.',
    'Augmenter les distances : le freinage est plus long.',
    'Regonfler les pneus selon la notice.']},
  {t:'piege', txt:'À l’étranger, le permis numérique n’est pas reconnu. Seuls les documents papier font foi, et les règles changent dès la frontière.'}
 ]}

];
