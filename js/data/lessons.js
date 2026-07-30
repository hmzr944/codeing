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
    'Les véhicules de secours en intervention, sirène et gyrophare allumés. Sirène éteinte, en trajet ordinaire, ils redeviennent des usagers comme les autres.',
    'Le bus qui quitte son arrêt, mais seulement en ville.',
    'Le piéton engagé, ou celui qui montre clairement qu’il veut traverser : depuis 2018, ne pas céder le passage coûte 4 points et 135 €.']},
  {t:'panneaux', titre:'Les panneaux qui décident', signes:[
    ['stop','Je m’arrête, même si la voie est libre'],
    ['cedez','Je laisse passer, sans forcément m’arrêter'],
    ['route-prioritaire','Je reste prioritaire aux prochains carrefours'],
    ['priorite-a-droite','Attention, quelqu’un peut arriver de ma droite'],
    ['cedez-giratoire','Ceux qui tournent déjà passent avant moi']]},
  {t:'texte', txt:'Dans un giratoire, le clignotant droit s’allume juste après la sortie qui précède la mienne, pas avant. Changer de voie à l’intérieur de l’anneau impose clignotant et contrôle de l’angle mort : mieux vaut se placer sur la bonne voie dès l’entrée, selon la sortie visée.'},

  {t:'cle', titre:'Ce que le feu vert ne veut pas dire', items:[
    'Le vert ne donne pas la priorité sur un usager déjà engagé dans le carrefour : un véhicule bloqué doit pouvoir en sortir.',
    'Il est interdit de s’engager dans une intersection si l’on risque d’y rester immobilisé et de bloquer la circulation transversale : j’attends avant la ligne tant que je ne peux pas dégager.',
    'Traverser une piste cyclable pour tourner impose de céder le passage au cycliste qui poursuit tout droit : contrôle de l’angle mort droit indispensable.']},
  {t:'cle', titre:'Face à un agent qui règle la circulation', items:[
    'Ses gestes priment sur les feux et les panneaux.',
    'Bras levé verticalement, ou agent vu de face ou de dos : arrêt pour tous.',
    'Bras tendu horizontalement : les usagers vers qui pointe le bras s’arrêtent.',
    'Agent vu de profil : passage autorisé.']},

  {t:'cle', titre:'Zones et voies particulières', items:[
    'Sur une voie verte, la circulation motorisée est interdite : piétons et cyclistes y sont prioritaires, sauf véhicules de service.',
    'Dans une aire piétonne, les piétons sont prioritaires sur toute la surface ; seules les voitures autorisées y entrent, à l’allure du pas (environ 6 km/h).',
    'Dans les zones 30 et les zones de rencontre, le double-sens cyclable est la règle par défaut : un cycliste peut donc arriver de face dans une rue à sens unique.',
    'Un panneau « cédez le passage cycliste au feu rouge » (petit triangle avec vélo et flèche) autorise le cycliste à franchir le feu rouge dans la direction indiquée, en cédant le passage aux autres.',
    'Sur une voie réservée aux bus, je ne circule que si la signalisation l’autorise pour ma catégorie de véhicule (taxis, vélos, véhicules d’urgence selon les cas).']},
  {t:'piege', txt:'La forme du carrefour ne crée aucune priorité : à une intersection en T, sans signalisation, la priorité à droite s’applique normalement, même pour qui circule sur la barre du T. Beaucoup d’accidents viennent de conducteurs persuadés d’être sur « la route principale ».'},
  {t:'texte', txt:'Le croisement en marche arrière ou dans un passage étroit se fait normalement par l’avant (chacun passe devant l’autre), sauf si le marquage ou la configuration impose l’inverse : l’essentiel est d’établir un contact visuel et de rester lisible. Un convoi exceptionnel ou un cortège officiel se traite comme un seul véhicule : on ne le coupe pas.'}
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
    'Alors seulement, je me rabats, sans rester inutilement à gauche.']},
  {t:'schema', d:'depassement-cycliste'},
  {t:'retenir', txt:'Écart latéral minimal pour dépasser un cycliste : 1,50 m hors agglomération, 1 m en agglomération. Sans cet espace, je patiente.'},
  {t:'cle', titre:'Quand dépasser est interdit', items:[
    'Quand je ne vois pas assez loin : virage, sommet de côte.',
    'Sur un passage à niveau ou un passage piéton.',
    'Dans un carrefour où je ne suis pas prioritaire.',
    'Quand la voiture devant moi est déjà en train de doubler (dépassement en cascade).']},
  {t:'piege', txt:'Accélérer pendant qu’on te double est une infraction, et une cause classique de choc frontal. Serre à droite et laisse faire.'},
  {t:'cle', titre:'Dépasser par la droite : les deux seules exceptions', items:[
    'Le véhicule devant signale son intention de tourner à gauche.',
    'En circulation à files continues et à vitesse réduite : une file peut avancer plus vite qu’une autre sans que ce soit un dépassement.',
    'En dehors de ces deux cas, dépasser par la droite est une infraction sanctionnée de 3 points et 135 €.']},
  {t:'texte', txt:'Le dépassement d’un poids lourd demande une distance de visibilité importante : doubler un ensemble de 16 mètres à 90 km/h prend plusieurs centaines de mètres, et le déport d’air au croisement surprend surtout les véhicules légers et les deux-roues.'},

  {t:'cle', titre:'Changer de voie ou s’insérer', items:[
    'Sur une route à plusieurs voies, je change une voie à la fois, avec un contrôle complet à chaque fois : l’angle mort peut cacher un véhicule rapide arrivant de la voie la plus à gauche.',
    'Je me place sur la voie de gauche suffisamment tôt : un placement anticipé rend ma trajectoire lisible, un changement au dernier moment surprend toujours.',
    'Depuis un stop, je m’insère dans une file dense sans bénéficier d’aucune priorité : j’attends un espace suffisant, sans forcer le passage.',
    'La règle du zip (fermeture éclair) : s’insérer alternativement, un véhicule sur deux, au dernier moment plutôt que de se rabattre trop tôt, fluidifie le trafic.']},
  {t:'piege', txt:'Franchir un terre-plein central ou un îlot, même pour faire demi-tour, est interdit et peut être sanctionné comme un franchissement de ligne continue : ces séparateurs existent pour éviter le choc frontal.'},

  {t:'texte', txt:'Marche arrière et demi-tour sont interdits sur autoroute et voie rapide, sur un passage à niveau, sur un pont et dans tout virage sans visibilité. Les deux exigent un contrôle visuel direct et constant, la caméra de recul ne montrant qu’un secteur.'},
  {t:'cle', titre:'Se garer et repartir', items:[
    'Stationner en marche arrière à l’arrivée permet de repartir en marche avant, avec une visibilité complète : c’est la manœuvre la plus sûre sur un parking fréquenté.',
    'Un créneau se prépare en signalant l’intention avant de s’arrêter, puis en contrôlant l’ensemble de l’environnement pendant toute la manœuvre.',
    'Le démarrage en côte peut s’aider du frein de stationnement ou d’une assistance au maintien, mais n’évite pas de vérifier l’absence de recul.']},
  {t:'retenir', txt:'Ouvre ta portière avec la main opposée. Ton corps pivote tout seul et tes yeux voient le cycliste qui arrive.'},

  {t:'cle', titre:'Autres réflexes de manœuvre', items:[
    'Croisement sur route étroite avec un obstacle de mon côté : c’est moi qui empiète sur la voie opposée, donc moi qui cède le passage.',
    'Pour tourner à droite dans une rue étroite, je serre à droite plutôt que de me déporter à gauche, ce qui inviterait un deux-roues à s’engager dans l’espace créé.',
    'Franchir une ligne continue pour dépasser un cycliste ou un piéton est toléré si la visibilité est suffisante et sans gêner un véhicule venant en face ; klaxonner peut le déséquilibrer.',
    'Face à un conducteur agressif qui colle ou provoque, la bonne réaction est d’augmenter ma propre marge et de le laisser passer, jamais de freiner pour lui donner une leçon.']}
 ]},

{k:'autoroute', n:'Autoroute & voies rapides', i:'autoroute', theme:'autoroute',
 resume:'Tout y va plus vite, y compris les erreurs. Trois moments comptent : entrer, circuler, sortir.',
 blocs:[
  {t:'cle', titre:'Entrer', items:[
    'La voie d’insertion sert à prendre de la vitesse, pas à hésiter.',
    'Je n’ai aucune priorité : j’ajuste ma vitesse pour m’intercaler dans un espace suffisant.',
    'S’arrêter en bout de voie d’insertion est très dangereux.',
    'Le véhicule déjà sur l’autoroute est prioritaire, mais il facilite l’insertion en se déportant s’il le peut : la coopération évite le freinage brutal.']},
  {t:'cle', titre:'Circuler', items:[
    'Voie de droite par défaut. Les voies de gauche servent au dépassement, puis on se rabat.',
    'Sur la voie la plus à gauche, par bonne visibilité et en palier, il faut pouvoir tenir au moins 80 km/h.',
    'Occuper durablement la voie du milieu ou de gauche quand la droite est libre est une infraction : ça pousse aux dépassements par la droite.',
    'Interdits : piétons, vélos, cyclomoteurs, tout véhicule ne pouvant pas dépasser 80 km/h en palier.',
    'Marche arrière et demi-tour : interdits, sans exception, sous peine de délit.']},
  {t:'texte', txt:'La bande d’arrêt d’urgence est réservée aux urgences et aux véhicules d’intervention : l’emprunter indûment coûte 3 points et 135 €. La voie d’entrecroisement, entre une entrée et une sortie proches, mérite une vigilance accrue : ceux qui entrent et ceux qui sortent s’y croisent sur une courte distance.'},
  {t:'cle', titre:'Sortir', items:[
    'Je me rabats à droite bien avant la sortie.',
    'Je ralentis sur la bretelle de décélération, pas sur l’autoroute.',
    'Sortie ratée ? La suivante. Jamais de marche arrière.']},

  {t:'schema', d:'panne-autoroute'},
  {t:'retenir', txt:'En panne : feux de détresse, gilet enfilé dans la voiture, sortie par la droite, et on passe derrière la glissière. Les bornes d’appel sont tous les 2 km et localisent automatiquement l’appel.'},
  {t:'piege', txt:'La bande d’arrêt d’urgence n’est pas un endroit sûr : elle concentre de nombreux accidents mortels. On ne reste jamais dans la voiture arrêtée dessus, on sort par la droite et on se met derrière la glissière.'},

  {t:'texte', txt:'La fatigue est la première cause d’accident mortel sur autoroute, et la monotonie du paysage, la régularité de la vitesse et un usage prolongé du régulateur aggravent la baisse de vigilance sans qu’on s’en aperçoive.'},
  {t:'schema', d:'pause-2h'},
  {t:'cle', titre:'Face à un imprévu', items:[
    'Embouteillage : le « corridor de sécurité » se forme en se serrant à gauche pour ceux sur la voie de gauche, à droite pour les autres, afin de laisser un passage central aux secours.',
    'Un véhicule à contresens roule le plus souvent sur ce qui est, pour lui, la voie de droite, donc sur votre voie de gauche : je serre à droite, je ralentis et j’allume mes feux de détresse.',
    'Un poids lourd qui en dépasse un autre très lentement : je patiente sans coller ni faire d’appels de phares, le dépassement par la droite restant interdit.',
    'Forte pluie et aquaplaning : si le véhicule se met à flotter, je lâche l’accélérateur, je ne freine pas brutalement et je tiens le volant droit. Le risque augmente avec la vitesse et l’usure des pneus.']},

  {t:'cle', titre:'Signalisation propre à l’autoroute', items:[
    'Fond bleu : direction ou information liée à l’autoroute (le vert vaut pour les grandes liaisons hors autoroute, le blanc pour les directions locales).',
    'Une voie réservée au covoiturage est signalée par un losange blanc peint au sol et sur panneau ; son usage indu est sanctionné.',
    'Un panneau à message variable a valeur réglementaire dès son affichage : une vitesse réduite qui y apparaît remplace la limitation habituelle et est contrôlée.',
    'Un portique de contrôle ou de gabarit impose de connaître la hauteur du véhicule chargé : un coffre de toit ou des vélos ajoutent facilement 40 centimètres.']},
  {t:'texte', txt:'Sur un péage sans arrêt (flux libre), la plaque est enregistrée et facturée après le passage : sans badge, il faut régler en ligne dans le délai indiqué, sous peine de majoration.'}
 ]},

{k:'stationnement', n:'Arrêt & stationnement', i:'stationnement', theme:'stationnement',
 resume:'Une seule question : est-ce que je gêne quelqu’un de plus fragile que moi ?',
 blocs:[
  {t:'retenir', txt:'Arrêt : je reste au volant, quelques instants, pour laisser monter ou descendre quelqu’un. Stationnement : je quitte la voiture, ou l’immobilisation se prolonge.'},
  {t:'panneaux', titre:'Les deux panneaux à ne pas confondre', signes:[
    ['stationnement-interdit','Une seule barre : je peux m’arrêter, pas stationner'],
    ['arret-stationnement-interdit','Une croix : je ne m’immobilise pas du tout']]},
  {t:'cle', titre:'Interdit dans tous les cas', items:[
    'Sur un passage piéton, un trottoir, une piste cyclable : une voiture qui mord dessus force le cycliste à se déporter dans le trafic.',
    'Sur les 5 mètres avant un passage piéton, pour que le piéton reste visible avant de s’engager.',
    'Devant une entrée de garage (entrée carrossable).',
    'Sur une place réservée aux personnes handicapées, un arrêt de bus, une voie de bus : 135 € et mise en fourrière fréquente, sans tolérance même pour deux minutes.',
    'Devant une bouche d’incendie ou un accès pompiers : mise en fourrière immédiate, car cela peut conditionner l’arrivée des secours.',
    'Sur un pont, dans un tunnel, sur la bande d’arrêt d’urgence.']},
  {t:'schema', d:'pente'},
  {t:'cle', titre:'Bon à savoir', items:[
    'Plus de 7 jours au même endroit : c’est abusif, la fourrière peut venir (délai parfois réduit par arrêté municipal).',
    'Stationnement gênant : 135 €. Ce n’est pas la même chose que le stationnement payant non réglé, qui donne lieu à un forfait de post-stationnement fixé par la commune, sans aucun retrait de point.',
    'Sans marquage au sol, on se gare le long du trottoir, à droite dans le sens de la circulation.',
    'À gauche, uniquement dans une rue à sens unique, qui autorise d’ailleurs le stationnement des deux côtés sauf signalisation contraire.',
    'Sur un emplacement matérialisé (longitudinal, épi, bataille), le mode de stationnement est imposé par le marquage : le véhicule doit rester dans les limites de la place.']},
  {t:'texte', txt:'En stationnement alterné semi-mensuel : côté des numéros impairs du 1er au 15, côté des numéros pairs du 16 à la fin du mois. Le changement de côté se fait le dernier jour de chaque période, entre 20 h 30 et 21 h.'},
  {t:'cle', titre:'Cas particuliers', items:[
    'Une place de recharge pour véhicule électrique est réservée aux véhicules en cours de recharge : un véhicule thermique garé dessus, ou un véhicule électrique qui y reste après la charge, peut être sanctionné.',
    'Une place de livraison a des horaires indiqués sur un panonceau : hors de ces créneaux, la place redevient parfois banale, parfois interdite. Il faut lire le panonceau.',
    'Ouvrir sa portière brusquement engage la responsabilité de celui qui l’ouvre : c’est une cause fréquente d’accident avec les cyclistes, d’où la technique d’ouverture avec la main opposée.',
    'Un arrêt pour déposer un passager se fait sans gêner la circulation ni la visibilité, du côté droit de la chaussée, jamais dans un virage ni sur un passage piéton.']},
  {t:'piege', txt:'Les feux de détresse ne rendent jamais légal un stationnement interdit, y compris en double file : ils préviennent d’un danger, c’est tout. Un piéton masqué par un véhicule en double file reste invisible pour les autres.'},
  {t:'texte', txt:'Avant de quitter le véhicule, même sur le plat : moteur coupé, frein de stationnement serré, un rapport engagé (ou P en boîte automatique), clés retirées et véhicule fermé. En pente, les roues se braquent en plus vers le trottoir.'}
 ]},

{k:'conducteur', n:'Le conducteur', i:'conducteur', theme:'conducteur',
 resume:'La voiture est rarement en cause. C’est l’état de celle qui conduit qui décide de tout.',
 blocs:[
  {t:'chiffres', titre:'Alcool', lignes:[
    ['Permis classique','0,5 g/L','soit 0,25 mg/L d’air expiré'],
    ['Permis probatoire','0,2 g/L','un seul verre fait dépasser'],
    ['Délit à partir de','0,8 g/L','4 500 €, 6 points, prison possible'],
    ['Élimination','0,10 à 0,15 g/L','par heure, et rien ne l’accélère']]},
  {t:'retenir', txt:'Le café réveille, il ne fait pas baisser l’alcool. Seul le temps compte : ni douche froide, ni sport, ni café ne l’accélèrent.'},
  {t:'schema', d:'alcool-temps'},
  {t:'cle', titre:'Ce que l’alcool fait vraiment', items:[
    'Il allonge le temps de réaction.',
    'Il rétrécit le champ de vision (vision en tunnel, sensibilité accrue à l’éblouissement).',
    'Il augmente la prise de risque, tout en donnant l’impression de bien conduire.',
    'Il est impliqué dans environ 30 % des accidents mortels.']},
  {t:'piege', txt:'Refuser un dépistage d’alcoolémie est un délit puni aussi lourdement que la conduite en état d’ivresse : 4 500 €, 6 points, 2 ans de prison et suspension du permis. Refuser n’est jamais une stratégie.'},

  {t:'cle', titre:'Stupéfiants et médicaments', items:[
    'Aucun seuil de tolérance : la moindre trace de stupéfiant au volant est un délit (4 500 €, 6 points, jusqu’à 2 ans de prison), et les peines s’aggravent si l’alcool s’y ajoute.',
    'Le cannabis reste détectable plusieurs jours après la prise, bien après la disparition des effets ressentis.',
    'Les médicaments portent un pictogramme de niveau 1 à 3 : niveau 1 (jaune) prudence, niveau 2 (orange) avis d’un professionnel de santé nécessaire, niveau 3 (rouge) ne pas conduire.']},

  {t:'cle', titre:'Les signes qu’il faut s’arrêter', items:[
    'Les bâillements qui reviennent.',
    'Les paupières lourdes, le regard fixe.',
    'La voiture qui flotte dans la voie ou des difficultés à maintenir sa trajectoire.']},
  {t:'retenir', txt:'Face à ces signes, une seule réponse marche : une sieste de quinze à vingt minutes. La musique et la fenêtre ouverte ne servent à rien.'},
  {t:'cle', titre:'Ce qui use la vigilance sans qu’on s’en rende compte', items:[
    'Dormir moins de cinq heures produit des altérations comparables à une alcoolémie de 0,5 g/L : dix-sept heures de veille suffisent à en approcher les effets.',
    'Après un repas copieux ou en début d’après-midi, la vigilance baisse naturellement : une pause de quinze minutes vaut mieux que n’importe quel excitant.',
    'Le stress, la colère ou une dispute récente réduisent la capacité d’analyse et augmentent la prise de risque : quelques minutes d’arrêt avant de démarrer valent mieux qu’un trajet sous tension.',
    'La fatigue est la première cause d’accident mortel sur autoroute.']},
  {t:'schema', d:'champ-visuel'},
  {t:'texte', txt:'Comme dans un tunnel : une raison de plus de ralentir en ville, là où les surprises viennent des côtés.'},

  {t:'chiffres', titre:'Le permis à points', lignes:[
    ['Permis probatoire','6 points','12 après 3 ans sans infraction, +2 par an'],
    ['Après conduite accompagnée','2 ans','+3 points par an au lieu de 2'],
    ['Stage de récupération','4 points','une fois par an au maximum'],
    ['Récupération sans nouvelle infraction','6 mois à 3 ans','6 mois pour un point isolé, 3 ans pour les infractions graves'],
    ['Téléphone en main','3 points','135 €, même à l’arrêt au feu rouge'],
    ['Ceinture non bouclée','3 points','135 €, pour le conducteur et chaque passager majeur']]},
  {t:'piege', txt:'À zéro point, le permis est invalidé : il faut attendre 6 mois (1 an en cas de récidive), repasser une visite médicale, des tests d’aptitude, puis les épreuves du permis.'},
  {t:'texte', txt:'Un éthylotest anti-démarrage (EAD) peut être imposé par le préfet ou le juge après une infraction grave liée à l’alcool, en alternative à la suspension : le véhicule ne démarre qu’après un souffle conforme.'},

  {t:'cle', titre:'Permis probatoire : les obligations qui vont avec', items:[
    'Le disque « A » reste apposé à l’arrière du véhicule pendant toute la période (3 ans, ou 2 ans après conduite accompagnée) ; son absence coûte 35 €.',
    'Les vitesses maximales sont réduites (voir la leçon Vitesses & distances).',
    'Un conducteur novice sous-estime souvent le temps nécessaire pour s’arrêter et la difficulté d’anticiper le comportement des autres : l’expérience se construit en kilomètres, pas en confiance.']},

  {t:'cle', titre:'Ceinture et enfants', items:[
    'La ceinture est obligatoire à l’avant comme à l’arrière, pour le conducteur et tous les passagers.',
    'Un enfant voyage dans un dispositif de retenue homologué jusqu’à 10 ans ou jusqu’à une taille suffisante (environ 1,35 m).',
    'Un siège dos à la route ne doit jamais être installé devant un airbag passager actif.',
    'Transporter des passagers augmente la charge mentale du conducteur, et le rend responsable du port de la ceinture des mineurs à bord.']},
  {t:'piege', txt:'Les écouteurs et les oreillettes sont interdits au volant, casque audio compris. Seul le kit mains libres intégré à la voiture est autorisé.'},
  {t:'texte', txt:'Une vue déficiente non corrigée peut rendre la conduite non conforme aux mentions du permis, s’il impose le port de lunettes ou de lentilles : mieux vaut garder une paire de secours à bord. De même, une hypoglycémie ou un malaise impose de s’arrêter en sécurité dès les premiers signes, et parfois un avis médical avant de reprendre la route.'}
 ]},

{k:'usagers', n:'Les autres usagers', i:'usagers', theme:'usagers',
 resume:'Plus l’autre est fragile, plus ta marge doit être grande. C’est toute la règle.',
 blocs:[
  {t:'chiffres', titre:'Un piéton renversé', lignes:[
    ['À 30 km/h','1 sur 10','risque de décès'],
    ['À 50 km/h','1 sur 2',''],
    ['À 60 km/h','plus de 8 sur 10','']]},
  {t:'retenir', txt:'Vingt kilomètres-heure de moins, c’est une vie sauvée sur deux. C’est toute la raison d’être des zones 30. Piétons, cyclistes, trottinettes et deux-roues motorisés n’ont aucune carrosserie : à vitesse égale, les conséquences d’un choc n’ont rien de comparable.'},
  {t:'schema', d:'angle-mort'},
  {t:'cle', titre:'Angle mort d’un poids lourd', items:[
    'Un poids lourd a plusieurs angles morts, dont un très important à droite et juste devant la cabine.',
    'Règle simple : si je ne vois pas les rétroviseurs du camion, son conducteur ne me voit pas.',
    'Depuis 2021, les véhicules de plus de 3,5 tonnes portent une signalisation « angle mort » sur les côtés et l’arrière : elle rappelle la zone dangereuse, elle ne la supprime pas.']},
  {t:'piege', txt:'Un camion qui tourne à droite se déporte d’abord à gauche (le porte-à-faux l’oblige à élargir sa trajectoire). Ne jamais s’intercaler à sa droite à ce moment-là : c’est une cause fréquente d’accidents mortels de cyclistes.'},

  {t:'cle', titre:'Ce qu’un cycliste a le droit de faire', items:[
    'Rouler à deux de front, sauf la nuit ou si le trafic l’exige.',
    'Remonter une rue à sens unique, si c’est un double-sens cyclable.',
    'Tourner à droite au feu rouge, quand un petit panneau triangulaire le prévoit.',
    'Se placer au milieu de la voie pour éviter les portières et se rendre visible, en particulier à l’approche d’une intersection.',
    'Se placer dans le sas vélo, devant la ligne d’arrêt aux feux : une voiture ne doit jamais s’y arrêter.']},
  {t:'schema', d:'depassement-cycliste'},
  {t:'cle', titre:'Un groupe de cyclistes ou de coureurs', items:[
    'Se dépasse comme un seul véhicule, en une seule fois, jamais en coupant le groupe en deux.',
    'Écart latéral d’au moins 1,50 m hors agglomération, comme pour un cycliste seul.',
    'Devant un rassemblement, une manifestation ou une course cycliste : je ralentis, voire je m’arrête, et je suis les indications des organisateurs ou des forces de l’ordre.']},
  {t:'piege', txt:'Le casque à vélo est obligatoire jusqu’à 12 ans, conducteur comme passager. Le gilet réfléchissant est obligatoire hors agglomération de nuit ou par visibilité réduite.'},

  {t:'cle', titre:'Trottinettes électriques et engins de déplacement personnel', items:[
    'Une seule personne par engin, 14 ans minimum, écouteurs interdits comme en voiture.',
    '25 km/h maximum sur les pistes cyclables ou, à défaut, sur la chaussée limitée à 50 km/h.',
    'Le trottoir leur est interdit, sauf autorisation locale, et l’engin doit alors être tenu à la main.',
    'Interdits sur les autoroutes et voies rapides.']},

  {t:'cle', titre:'Deux-roues motorisés', items:[
    'Un deux-roues qui remonte une file de véhicules peut arriver très vite dans mon angle mort : contrôle renforcé avant tout changement de voie.',
    'Un motard qui se lève sur ses repose-pieds ou tend une jambe signale souvent un danger sur la chaussée (gravillon, nid-de-poule) : attention particulière.']},

  {t:'cle', titre:'Piétons : les situations à anticiper', items:[
    'Hors passage protégé, un piéton peut traverser légalement s’il n’existe pas de passage à moins de 50 mètres, perpendiculairement à la chaussée.',
    'Une personne aveugle ou malvoyante se reconnaît à une canne blanche, un chien guide ou un brassard jaune : je m’arrête sans klaxonner et j’attends la fin complète de la traversée.',
    'Une personne âgée qui traverse lentement doit pouvoir terminer sans être pressée : klaxonner ou avancer pour la presser provoque des chutes.',
    'Une personne en fauteuil roulant est assimilée à un piéton : large écart et vitesse très réduite.',
    'Un piéton avec des écouteurs ou le regard sur son téléphone peut ne pas percevoir un véhicule approcher : le conducteur reste tenu de céder le passage malgré tout.',
    'Un enfant ne perçoit pas correctement les distances et les vitesses avant une dizaine d’années, et croit qu’être vu suffit à être protégé : c’est à toi d’anticiper.']},
  {t:'piege', txt:'À l’approche d’un arrêt de car scolaire (parfois signalé par des feux orange clignotants), je ralentis fortement et je reste prête à m’arrêter : un enfant caché derrière le car peut traverser sans regarder.'},
  {t:'texte', txt:'Devant une sortie d’école, je m’attends à des traversées désordonnées et je ne me gare jamais sur le passage piéton ni en double file : le stationnement sauvage qui masque les enfants est le premier facteur d’accident aux abords des établissements.'},

  {t:'cle', titre:'Autres usagers à connaître', items:[
    'Un tramway ne peut ni s’écarter ni freiner rapidement : il est prioritaire dans la quasi-totalité des situations, et franchir sa plateforme demande une vérification systématique.',
    'Un véhicule de transport en commun à l’arrêt peut masquer des piétons traversant devant ou derrière lui : à dépasser avec une grande prudence.',
    'Les cavaliers et animaux de trait se dépassent très lentement et sans klaxonner ; un cheval effrayé devient imprévisible.',
    'Les engins agricoles peuvent dépasser la largeur de la voie et masquer totalement la visibilité : le dépassement exige une très longue portion dégagée.',
    'Les livreurs à vélo ou en scooter circulent souvent sous contrainte de temps et peuvent avoir des trajectoires imprévisibles : la marge de sécurité doit être augmentée, pas la sanction morale.']}
 ]},

{k:'vehicule', n:'Véhicule & équipements', i:'vehicule', theme:'vehicule',
 resume:'Cinq minutes de vérification évitent trois heures d’attente sur une bande d’arrêt d’urgence.',
 blocs:[
  {t:'retenir', txt:'Obligatoires à bord : le gilet, rangé dans l’habitacle, et le triangle. L’éthylotest ne l’est plus depuis 2020.'},

  {t:'cle', titre:'Les pneus', items:[
    'Profondeur minimale des rainures : 1,6 mm. En dessous, le pneu est lisse au sens de la loi : 135 € par pneu et immobilisation possible.',
    'Pression vérifiée à froid, une fois par mois, roue de secours comprise. Un sous-gonflage de seulement 0,5 bar dégrade déjà la tenue de route.',
    'Un pneu sous-gonflé consomme plus, s’use sur les bords et risque davantage l’éclatement.',
    'La gomme vieillit même sans rouler : un contrôle s’impose au-delà de 5 à 6 ans (date de fabrication en code à 4 chiffres sur le flanc).',
    'Monter des pneus différents sur un même essieu (dimension, structure, type) est interdit : ça déséquilibre le freinage et la tenue de route.']},
  {t:'schema', d:'usure-pneu'},
  {t:'piege', txt:'Dans certaines communes de montagne signalées, des pneus hiver ou 4 saisons (ou des équipements amovibles comme des chaînes) sont obligatoires du 1er novembre au 31 mars.'},

  {t:'chiffres', titre:'Les feux', lignes:[
    ['Feux de croisement','30 m','de portée'],
    ['Feux de route','100 m','à éteindre dès qu’on croise quelqu’un'],
    ['Brouillard avant','pluie, neige, brouillard',''],
    ['Brouillard arrière','brouillard ou neige','jamais sous la pluie']]},
  {t:'schema', d:'portee-feux'},
  {t:'piege', txt:'Les feux de brouillard arrière sous la pluie éblouissent et masquent les feux stop. C’est interdit. Un seul feu de croisement grillé fait aussi ressembler la voiture à un deux-roues, ce qui fausse l’estimation de distance des autres : il se remplace sans délai.'},
  {t:'texte', txt:'Les feux de détresse signalent un danger (immobilisation, ralentissement brutal sur autoroute) : ils ne légalisent jamais un stationnement interdit. Un véhicule électrique ou hybride, très silencieux à basse vitesse, doit émettre un son artificiel (AVAS) s’il est récent : restez attentif près des piétons malgré tout.'},

  {t:'cle', titre:'Les témoins du tableau de bord', items:[
    'Rouge : anomalie grave, je m’arrête dès que possible. Une perte de pression d’huile, par exemple, détruit le moteur en quelques dizaines de secondes.',
    'Orange : à faire vérifier rapidement.',
    'Vert ou bleu : tout va bien, c’est une information.']},
  {t:'cle', titre:'Freinage et aides électroniques', items:[
    'L’ABS empêche les roues de se bloquer : je continue à diriger en freinant à fond, sans relâcher la pédale. Sur gravillons ou neige, il peut allonger la distance.',
    'L’ESP corrige un début de dérapage en agissant sur les freins et le moteur, mais reste soumis aux lois physiques : sur le verglas ou à vitesse excessive, il ne peut plus rien.',
    'Un bruit métallique au freinage, une pédale plus longue ou spongieuse : plaquettes usées ou air dans le circuit hydraulique.',
    'Le liquide de frein absorbe l’humidité avec le temps ; chargé d’eau, il peut bouillir en descente prolongée et faire perdre le freinage.',
    'Des amortisseurs usés allongent aussi la distance de freinage et rendent le véhicule instable en virage, souvent sans qu’on le remarque.']},

  {t:'cle', titre:'Poids et chargement', items:[
    'Le PTAC (poids total autorisé en charge) figure sur la carte grise : le dépasser dégrade fortement le freinage et la tenue de route.',
    'Un chargement dépassant de plus d’un mètre à l’arrière doit porter un dispositif réfléchissant, et ne doit jamais masquer les feux ni la plaque.',
    'Une voiture chargée freine moins bien, se déporte davantage en virage et « cabre », ce qui éblouit les autres : le correcteur d’assiette des phares doit être ajusté en conséquence.']},

  {t:'cle', titre:'Confort et position de conduite', items:[
    'Poignets posés en haut du volant, bras légèrement fléchis ; jambes légèrement fléchies pédale enfoncée.',
    'L’appuie-tête se règle avec son sommet au niveau du sommet du crâne, au plus près de la tête : mal réglé, il n’évite pas le « coup du lapin » lors d’un choc arrière.',
    'Essuie-glaces à changer dès qu’ils laissent des traces ou sautent, environ une fois par an : un voile aveuglant sous la pluie de nuit se forme vite.']},

  {t:'texte', txt:'Un pare-brise fissuré dans le champ de vision doit être réparé ou remplacé : il tient la structure du véhicule et sert d’appui à l’airbag passager. Un échappement percé peut laisser entrer du monoxyde de carbone, inodore, dans l’habitacle : toute odeur d’échappement ressentie impose une aération immédiate.'},

  {t:'retenir', txt:'La ceinture tient sur l’os : l’épaule et les hanches, jamais sur le ventre, sans vrille et sans vêtement épais qui en réduit l’efficacité.'},
  {t:'piege', txt:'L’airbag complète la ceinture, il ne la remplace jamais : sans ceinture, ou trop près du volant, il peut lui-même blesser en se déployant à plus de 200 km/h.'}
 ]},

{k:'technologie', n:'Aides à la conduite', i:'technologie', theme:'technologie',
 resume:'Depuis 2024, toutes les voitures neuves en sont équipées. Elles aident, elles ne conduisent pas.',
 blocs:[
  {t:'retenir', txt:'Quel que soit l’équipement, c’est toi qui restes responsable de la conduite et des infractions. Une aide peut se tromper, être aveuglée ou se désactiver sans prévenir.'},
  {t:'cle', titre:'Ce que toute voiture neuve embarque depuis juillet 2024', items:[
    'L’adaptation intelligente de la vitesse (ISA) : lit les panneaux et alerte, voire freine légèrement l’accélération, en cas de dépassement.',
    'Le freinage d’urgence automatique (AEB).',
    'L’aide au maintien dans la voie.',
    'Une alerte de somnolence et de vigilance.',
    'L’aide au recul et une boîte noire qui enregistre les secondes du choc.',
    'Le système eCall : il appelle automatiquement le 112 en cas d’accident grave et transmet la position, même si personne ne peut parler.']},
  {t:'schema', d:'aides-conduite'},
  {t:'piege', txt:'Ces systèmes peuvent être coupés, mais ils se remettent en marche à chaque démarrage. Ils gardent le conducteur pleinement responsable : une aide qui se trompe (panneau masqué, sortie d’autoroute) ne change rien à l’infraction ou à l’accident.'},

  {t:'cle', titre:'Ce qui les aveugle ou les rend inefficaces', items:[
    'Un pare-brise sale, un capteur couvert de boue ou de givre.',
    'Le brouillard, la neige, un contre-jour.',
    'Un marquage au sol effacé ou une zone de travaux : plus de lignes, plus de maintien de voie.',
    'L’aide au stationnement (radars, caméra de recul) a des zones aveugles près du pare-chocs et au ras du sol : elle peut manquer un objet bas ou un enfant accroupi.']},
  {t:'piege', txt:'L’alerte d’angle mort ne voit pas toujours un deux-roues qui remonte vite : il peut entrer et sortir de la zone de détection sans déclencher l’alerte. Le coup d’œil par-dessus l’épaule reste la seule vérification fiable.'},
  {t:'texte', txt:'Le régulateur adaptatif suit la voiture de devant sur voie rapide, mais ne comprend ni les feux, ni les piétons, ni un véhicule arrêté en travers. Si un système d’aide se désactive brutalement en roulant, la reprise en main doit être immédiate : c’est pour cela que les mains restent sur le volant.'},
  {t:'cle', titre:'Conduite déléguée et autres systèmes', items:[
    'En France, un système de niveau 3 n’est autorisé que dans des conditions très restreintes (voies à chaussées séparées, basse vitesse, sans piétons ni cyclistes) ; le conducteur doit rester capable de reprendre la main immédiatement.',
    'Les feux adaptatifs (matriciels) ajustent le faisceau pour ne pas éblouir, mais si un cycliste ou un véhicule mal éclairé n’est pas détecté, rien ne s’occulte : au conducteur de corriger.',
    'La boîte noire enregistre vitesse, freinage, accélération et port de ceinture sur les quelques secondes avant un choc, exploitable en enquête ; elle n’enregistre ni le son ni la position en continu.']},

  {t:'cle', titre:'La voiture électrique', items:[
    'Plus lourde qu’un thermique équivalent, donc plus longue à arrêter malgré le freinage régénératif : les distances de sécurité doivent être augmentées.',
    'Très silencieuse en ville : elle surprend les piétons, d’où le son artificiel (AVAS) obligatoire jusqu’à environ 20 km/h sur les véhicules récents.',
    'En conduite « une pédale », elle ralentit fortement au lever de pied, parfois sans allumer les feux stop : les véhicules suivants peuvent être surpris.',
    'Après un choc, la batterie peut prendre feu avec retard, parfois plusieurs heures plus tard : on signale aux secours qu’il s’agit d’un véhicule électrique et on garde ses distances au moindre signe de fumée.',
    'La recharge est plus rapide sur borne rapide en courant continu, mais ralentit nettement au-delà d’environ 80 % : sur long trajet, deux arrêts courts à 80 % battent souvent un seul arrêt à 100 %.',
    'Avec un permis B, certains utilitaires électriques ou à hydrogène jusqu’à 4,25 t peuvent être conduits, sous conditions et après formation complémentaire.']},

  {t:'cle', titre:'Réflexes qui restent valables avec ou sans technologie', items:[
    'Programmer un GPS ou un écran tactile se fait à l’arrêt, en sécurité : deux secondes de regard détourné à 90 km/h, c’est 50 mètres parcourus à l’aveugle.',
    'Téléphoner via le système intégré du véhicule reste autorisé si rien n’est tenu en main ni porté à l’oreille, mais la conversation reste une charge mentale qui augmente le temps de réaction.',
    'Un pneu runflat se roule typiquement jusqu’à 80 km/h sur une distance limitée ; un kit anti-crevaison n’est qu’une solution provisoire, à faire contrôler rapidement.',
    'Le témoin de pression des pneus (TPMS) s’allume souvent quand la perte est déjà importante : il ne dispense pas d’un contrôle manuel mensuel à froid.',
    'Le permis dématérialisé dans l’application France Identité a la même valeur qu’un permis physique lors d’un contrôle en France ; à l’étranger, seul le document physique fait foi.']}
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
    'Sur neige tassée, l’adhérence peut être divisée par cinq à dix : pneus hiver ou chaînes deviennent indispensables.',
    'Chaînes sur les roues motrices, 50 km/h maximum, retirées dès que la route est dégagée.']},
  {t:'schema', d:'adherence-neige'},
  {t:'piege', txt:'Si l’avant du véhicule part vers l’extérieur en virage (sous-virage), je lève le pied sans freiner brutalement et je regarde là où je veux aller : braquer davantage aggrave le décrochage des roues avant.'},

  {t:'cle', titre:'Vent, chaleur et visibilité réduite', items:[
    'Dépasser un poids lourd par vent violent expose à une rafale brutale à la sortie de son abri, surtout avec une remorque : je tiens fermement le volant.',
    'Un pare-brise embué se traite par la ventilation et la climatisation, qui assèchent l’air bien plus vite ; frotter avec la main laisse un film gras qui éblouit la nuit.',
    'Par forte chaleur, la vigilance baisse et la déshydratation accélère la fatigue : on boit régulièrement, et on ne laisse jamais un enfant ou un animal dans un véhicule à l’arrêt.',
    'Des gravillons signalés réduisent l’adhérence, surtout en virage, et peuvent projeter des cailloux : on réduit nettement la vitesse.']},
  {t:'piege', txt:'Une route ou une flaque inondée ne se traverse jamais : trente centimètres d’eau suffisent à noyer le moteur ou à emporter un véhicule léger, et la profondeur réelle est impossible à évaluer depuis le volant.'},

  {t:'texte', txt:'Dans un tunnel : feux de croisement, lunettes de soleil enlevées. Un feu rouge clignotant à l’entrée interdit l’accès et signale un incident à l’intérieur ; une croix rouge au-dessus d’une voie interdit d’y circuler. En cas d’incendie, on coupe le moteur, on laisse les clés et on rejoint la sortie à pied : la fumée tue avant les flammes.'},
  {t:'piege', txt:'À la sortie d’un tunnel par temps ensoleillé, l’éblouissement est brutal et l’œil met plusieurs secondes à s’adapter : la vitesse s’adapte avant de sortir, d’autant qu’un vent latéral peut s’y ajouter.'}
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
    'On ne déplace pas une victime, sauf danger vital immédiat (incendie, immersion, explosion) : un déplacement peut aggraver une lésion vertébrale.',
    'Consciente qui parle : elle respire, mais un état peut se dégrader en quelques minutes. On reste auprès d’elle, on la couvre, on la rassure sans relâche.',
    'Inconsciente mais elle respire : position latérale de sécurité, respiration surveillée en continu jusqu’aux secours.',
    'Pour vérifier la respiration : je bascule doucement la tête en arrière pour libérer les voies aériennes (la langue peut les obstruer), puis j’observe, j’écoute et je sens pendant environ dix secondes.',
    'Elle ne respire pas : massage cardiaque sans attendre, 100 à 120 compressions par minute, au centre du thorax, 5 à 6 cm de profondeur. Un massage imparfait vaut infiniment mieux que pas de massage : chaque minute perdue réduit les chances de survie d’environ 10 %.',
    'Le défibrillateur automatisé externe (DAE) peut être utilisé par toute personne : il analyse le rythme cardiaque et ne délivre un choc que si c’est nécessaire, il ne peut pas nuire.',
    'Le casque d’un motard reste en place, sauf si elle ne respire pas (retrait alors indispensable, idéalement à deux, tête maintenue dans l’axe du corps).',
    'Une hémorragie s’arrête en appuyant fort, sans relâcher, si possible avec un tissu propre.']},
  {t:'piege', txt:'Jamais boire, jamais manger, jamais retirer un objet planté dans une plaie (on stabilise sans extraire, un retrait pouvant provoquer une hémorragie majeure). Mais parler et rassurer, oui.'},
  {t:'cle', titre:'Cas particuliers', items:[
    'Victime qui se plaint du dos ou du cou : ne surtout pas la mobiliser, la maintenir immobile et au calme.',
    'Brûlure : arroser à l’eau tempérée plusieurs minutes, sans retirer les vêtements collés à la peau, sans crème ni corps gras.',
    'Enfant : mêmes principes de prise en charge, en le maintenant au chaud (il perd sa chaleur plus vite) et sans jamais retarder l’alerte pour attendre un proche.',
    'Véhicule en feu : on s’éloigne et on éloigne les curieux, un extincteur de voiture ne suffisant que sur un départ de feu minime ; sur un véhicule électrique, distance de sécurité au moindre signe de fumée.',
    'Matières dangereuses (plaques oranges sur le véhicule) : rester à distance, se placer face au vent, et signaler les codes des plaques aux secours.']},
  {t:'texte', txt:'Appeler le 112 est déjà porter secours. Personne n’est obligé de prendre un risque vital, mais la non-assistance à personne en danger est un délit puni de 5 ans de prison et 75 000 € d’amende.'}
 ]},

{k:'sanctions', n:'Infractions & sanctions', i:'sanctions', theme:'sanctions',
 resume:'Les barèmes se retiennent par blocs. Une fois classés, ils ne bougent plus.',
 blocs:[
  {t:'retenir', txt:'Contravention (1re à 5e classe) : une amende, jamais de prison. Délit : un tribunal correctionnel, et la prison devient possible.'},
  {t:'cle', titre:'Ce qui coûte 4 points', items:[
    'Franchir un feu rouge.',
    'Ne pas respecter un stop.',
    'Refuser une priorité.',
    'Rouler en sens interdit.']},
  {t:'cle', titre:'Ce qui coûte 3 points', items:[
    'Téléphone tenu en main.',
    'Ceinture non bouclée (pour le conducteur ; chaque passager majeur non ceinturé est verbalisé personnellement).',
    'Franchir une ligne continue.',
    'Porter des écouteurs.']},
  {t:'texte', txt:'Les premières ont un point commun : elles créent un risque de collision directe avec quelqu’un. Les secondes sont des fautes d’attention. Le barème des excès de vitesse suit la même logique par tranche de 10 km/h : 1 point de 5 à 19 km/h, 2 de 20 à 29, 3 de 30 à 39, 4 de 40 à 49, 6 à partir de 50. Depuis 2024, moins de 5 km/h ne retire plus de point, l’amende restant due.'},

  {t:'cle', titre:'Les délits routiers', items:[
    'Alcool à 0,8 g/L ou plus.',
    'Conduite après usage de stupéfiants, ou refus de s’y soumettre.',
    'Défaut d’assurance.',
    'Délit de fuite, même pour un simple rétroviseur cassé ou un accrochage sur un véhicule en stationnement : il faut laisser ses coordonnées.',
    'Conduite sans permis (800 € d’amende forfaitaire), ou malgré une suspension ou une annulation, plus sévèrement punie encore.',
    'Grand excès de vitesse de 50 km/h ou plus en cas de récidive dans les 3 ans, avec confiscation possible du véhicule.',
    'Conduite en état d’ivresse ayant causé des blessures : peines aggravées selon la gravité, davantage encore en cas d’homicide involontaire.']},

  {t:'chiffres', titre:'Ce qui peut arriver au permis', lignes:[
    ['Rétention','72 h (120 h si alcool/stupéfiants suspectés)','mesure provisoire, avant décision du préfet'],
    ['Suspension','durée fixée','le permis est rendu ensuite'],
    ['Annulation','définitif','il faut repasser le permis'],
    ['Solde à zéro','6 mois minimum','visite médicale et épreuves à repasser (lettre 48SI)']]},
  {t:'schema', d:'parcours-sanction'},
  {t:'piege', txt:'Payer une amende revient à reconnaître l’infraction : les points partent avec. Si tu contestes, il faut le faire avant de payer, ce qui fait perdre le bénéfice de l’amende minorée.'},
  {t:'texte', txt:'Un stage de sensibilisation rend jusqu’à 4 points, une fois par an, sans jamais dépasser le plafond. Pour un permis probatoire, perdre 3 points ou plus en une fois rend le stage obligatoire dans les quatre mois.'},

  {t:'cle', titre:'Les types de radars', items:[
    'Radar fixe : peut contrôler les deux sens ; en tourelle, il surveille plusieurs voies et plusieurs sens à la fois.',
    'Radar de chantier : vitesse abaissée signalée, pour protéger le personnel qui travaille à quelques mètres des voitures.',
    'Radar tronçon (vitesse moyenne) : calcule le temps mis entre deux points, donc sanctionne tout le parcours. Freiner juste avant la borne d’arrivée ne sert à rien.',
    'Radars mobiles embarqués et voitures-radar : non signalés, avec une marge technique doublée par rapport aux radars fixes.']},

  {t:'cle', titre:'Après l’infraction', items:[
    'L’amende forfaitaire minorée si l’on paie vite, forfaitaire dans le délai normal, majorée en cas de retard : le montant peut plus que doubler.',
    'Le propriétaire d’un véhicule flashé reçoit l’avis à son nom, mais peut désigner le conducteur réel : sans désignation, il paie l’amende sans perdre de point s’il n’était pas au volant (une société non-désignante est elle-même sanctionnée).',
    'Une infraction commise à l’étranger dans l’Union européenne peut être poursuivie en France (l’amende est recouvrée), mais ne retire aucun point : le retrait ne s’applique qu’aux infractions commises sur le territoire national.',
    'La mise en fourrière peut être décidée pour un stationnement très gênant ou dangereux, un défaut d’assurance ou de contrôle technique : les frais sont à la charge du propriétaire, en plus de l’amende.']},
  {t:'piege', txt:'Les sanctions sont aggravées quand l’infraction est commise en état d’alcoolémie ou sous stupéfiants, ou en récidive : le cumul alcool et stupéfiants double les peines encourues.'}
 ]},

{k:'environnement', n:'Éco-conduite', i:'environnement', theme:'environnement',
 resume:'Conduire souple, c’est conduire sûr. Les deux vont ensemble, ce n’est pas un hasard.',
 blocs:[
  {t:'retenir', txt:'Regarder loin permet de moins freiner, donc de moins accélérer. C’est 10 à 15 % de carburant en moins, et une conduite plus sûre : elle est aussi plus anticipée.'},
  {t:'cle', titre:'Les gestes qui comptent', items:[
    'Passer les vitesses tôt : vers 2 000 tr/min en diesel, 2 500 en essence, pour rester dans la plage de rendement optimal du moteur.',
    'Ne pas faire chauffer le moteur à l’arrêt : c’est inutile, polluant, et interdit dans certaines communes. Le moteur chauffe plus vite en roulant doucement.',
    'Le dispositif « Stop & Start » coupe le moteur à l’arrêt, particulièrement utile en ville où le temps passé immobile pèse dans la pollution locale.',
    'Retirer la galerie ou le coffre de toit quand on ne s’en sert pas.',
    'Vérifier la pression des pneus : le geste le plus écologique est aussi le plus gratuit, et le plus sûr.']},
  {t:'chiffres', titre:'Ce que ça change', lignes:[
    ['130 au lieu de 110 km/h','+20 % de carburant','pour 8 minutes gagnées sur 100 km'],
    ['Coffre de toit','+10 à 20 %',''],
    ['Climatisation en ville','+10 à 20 %','mais utile au-delà de 70 km/h'],
    ['Conduite agressive en ville','plus de carburant','sans gagner de temps réel']]},
  {t:'schema', d:'conso-carburant'},
  {t:'texte', txt:'La résistance de l’air augmente avec le carré de la vitesse : rouler à 110 km/h au lieu de 130 économise beaucoup de carburant pour quelques minutes seulement sur un trajet courant.'},

  {t:'texte', txt:'Les vignettes Crit’Air vont de 0, pour l’électrique, à 5 pour les diesels anciens. Elles décident de l’accès aux zones à faibles émissions (ZFE), dont les règles et horaires varient d’une commune à l’autre : on se renseigne avant d’y circuler.'},
  {t:'cle', titre:'En cas de pic de pollution', items:[
    'La circulation différenciée peut interdire les véhicules les plus polluants selon leur vignette Crit’Air.',
    'Les vitesses maximales peuvent être abaissées, souvent de 20 km/h.',
    'Les transports en commun sont parfois rendus gratuits pour favoriser les alternatives à la voiture.']},
  {t:'piege', txt:'Même une voiture électrique émet des particules : celles des freins et des pneus. Un moteur diesel utilisé uniquement pour de courts trajets urbains régénère mal son filtre à particules, qui peut se colmater et déclencher un témoin d’alerte.'},

  {t:'cle', titre:'Le civisme, aussi une question d’environnement', items:[
    'Jeter un mégot ou un déchet par la fenêtre est puni d’une amende pouvant atteindre 135 € et peut provoquer un incendie, surtout en été.',
    'Le bruit d’un véhicule est une nuisance sanctionnable ; un échappement modifié non homologué entraîne une contre-visite au contrôle technique et une amende.',
    'Le covoiturage réduit le nombre de véhicules en circulation et peut donner accès à des voies réservées, signalées par un losange blanc peint au sol et sur panneau.']}
 ]},

{k:'admin', n:'Papiers & réglementation', i:'admin', theme:'admin',
 resume:'Trois documents, quelques délais. Rien de compliqué une fois posé à plat.',
 blocs:[
  {t:'cle', titre:'À présenter en cas de contrôle', items:[
    'Le permis de conduire.',
    'Le certificat d’immatriculation, autrement dit la carte grise.',
    'Une preuve d’assurance en cours.']},
  {t:'retenir', txt:'Depuis avril 2024, la vignette verte collée au pare-brise n’existe plus. Les forces de l’ordre consultent le fichier des véhicules assurés. L’assurance reste obligatoire, même pour un véhicule qui ne roule pas mais stationne sur la voie publique.'},
  {t:'cle', titre:'L’assurance', items:[
    'La responsabilité civile (« au tiers ») est le minimum obligatoire : elle couvre les dommages causés aux autres.',
    'Conduire sans assurance est un délit : amende forfaitaire de 500 € (jusqu’à 3 750 € devant le tribunal), confiscation du véhicule et suspension du permis possibles.',
    'Prêter son véhicule engage la responsabilité du propriétaire : à lui de s’assurer que le conducteur a le permis correspondant et est couvert par le contrat.']},

  {t:'chiffres', titre:'Les délais à retenir', lignes:[
    ['Changement d’adresse','1 mois','gratuit pour les 3 premiers changements'],
    ['Carte grise après achat','1 mois','circulation possible avec le certificat de cession entre-temps'],
    ['Déclaration de vente','15 jours','sinon le vendeur reçoit encore les amendes'],
    ['Constat à l’assureur','5 jours ouvrés',''],
    ['Contre-visite','2 mois','après un contrôle technique refusé'],
    ['Véhicule importé','1 mois','pour l’immatriculer en France']]},
  {t:'cle', titre:'Vendre ou acheter un véhicule d’occasion', items:[
    'Le vendeur remet un certificat de cession, le déclare en ligne, et fournit un certificat de situation administrative (non-gage).',
    'Pour un véhicule de plus de 4 ans, le contrôle technique fourni doit dater de moins de 6 mois (sauf vente à un professionnel).',
    'Un véhicule importé de l’étranger doit être immatriculé en France dans le mois, avec un quitus fiscal et parfois une homologation.']},

  {t:'cle', titre:'Le contrôle technique', items:[
    'Premier passage à 4 ans, puis tous les 2 ans.',
    'Pour vendre une voiture de plus de 4 ans : contrôle de moins de 6 mois.',
    'Obligatoire aussi pour les motos de plus de 125 cm³ depuis 2024.',
    'Rouler sans contrôle technique valide expose à 135 € d’amende, une immobilisation possible et un retrait de carte grise.']},
  {t:'cle', titre:'Le bonus-malus', items:[
    'Coefficient à 1 au départ, qui baisse de 5 % par année sans accident responsable, jusqu’à un plancher de 0,50.',
    'Un accident entièrement responsable l’augmente de 25 %, un accident partagé de 12,5 %.',
    'Il suit le conducteur et se transmet à un nouveau contrat, pas à un nouveau véhicule.']},
  {t:'schema', d:'bonus-malus'},

  {t:'texte', txt:'Le permis B couvre les véhicules jusqu’à 3,5 tonnes de PTAC et 9 places, conducteur compris. Une remorque : jusqu’à 3,5 t d’ensemble avec le seul permis B, une formation B96 (7 heures) jusqu’à 4,25 t, le permis BE au-delà.'},
  {t:'cle', titre:'Permis : cas particuliers', items:[
    'La conduite accompagnée (AAC) est accessible dès 15 ans après l’obtention du code : 3 000 km minimum sur un an, période probatoire réduite à 2 ans, meilleur taux de réussite.',
    'L’examen du code (ETG) se réussit avec au moins 35 bonnes réponses sur 40 ; le résultat reste valable 5 ans et pour 5 présentations à l’épreuve pratique.',
    'En cas de perte ou de vol du permis, une déclaration permet d’obtenir un récépissé (validité limitée) le temps du duplicata, demandé en ligne.',
    'Il n’existe pas en France de visite médicale périodique obligatoire pour le permis B ; elle s’impose après une invalidation, une annulation, ou pour certaines pathologies et permis professionnels.']},
  {t:'texte', txt:'La plaque d’immatriculation suit le véhicule à vie depuis 2009 (système SIV) : elle doit rester lisible et non masquée, sous peine de 3 750 € d’amende et 6 points.'},
  {t:'piege', txt:'Un constat signé ne peut plus être modifié : en cas de désaccord, chacun remplit sa partie et note ses observations plutôt que de signer sous la contrainte.'}
 ]},

{k:'trajet', n:'Préparer son trajet', i:'trajet', theme:'trajet',
 resume:'Un trajet mal préparé pousse à rouler vite et à sauter les pauses. C’est là que ça se joue.',
 blocs:[
  {t:'cle', titre:'Avant de partir', items:[
    'Pression des pneus, à froid.',
    'Niveaux, éclairage, essuie-glaces.',
    'Itinéraire réglé à l’arrêt, jamais en roulant : manipuler un GPS au feu rouge reste une manipulation en conduite.',
    'Vignette Crit’Air vérifiée si le trajet traverse une grande ville, y compris de passage.',
    'Avec un véhicule inconnu (location, prêt) : régler siège, rétroviseurs et volant, repérer les commandes d’éclairage et d’essuie-glaces avant de démarrer.']},
  {t:'retenir', txt:'Une pause de quinze à vingt minutes toutes les deux heures. À prendre même sans se sentir fatiguée : la vigilance baisse avant qu’on ne le sente. Le calcul du temps de trajet doit intégrer ces pauses, les pleins ou recharges, et une marge : un horaire trop serré pousse à rouler vite et à sauter les pauses.'},
  {t:'schema', d:'pause-2h'},
  {t:'piege', txt:'Sur un trajet de nuit, la vigilance baisse fortement entre 2 h et 5 h du matin : on peut s’endormir deux secondes, assez pour quitter la route. Une sieste avant le départ vaut mieux qu’un départ anticipé.'},

  {t:'cle', titre:'Le chargement', items:[
    'Les objets lourds en bas et vers l’avant.',
    'Rien ne doit masquer les feux ni la plaque.',
    'Tout est arrimé, même pour un trajet court.',
    'Au-delà d’un mètre qui dépasse à l’arrière : dispositif réfléchissant obligatoire.',
    'Une galerie ou un coffre de toit a une charge admissible limitée, souvent 50 à 75 kg, et remonte le centre de gravité : virages et freinages en deviennent moins stables.']},
  {t:'schema', d:'objet-projectile'},
  {t:'cle', titre:'Voiture chargée', items:[
    'Corriger la hauteur des phares, sinon on éblouit.',
    'Augmenter les distances : le freinage est plus long.',
    'Regonfler les pneus selon la notice, souvent 0,2 à 0,4 bar de plus en charge.']},

  {t:'cle', titre:'Avec une remorque ou une caravane', items:[
    'Le PTRA (poids total roulant autorisé), sur la carte grise, est le poids maximal de l’ensemble véhicule et remorque chargés : le dépasser dégrade fortement le freinage.',
    'Un ensemble de plus de 3,5 t est limité à 90 km/h sur autoroute et 80 km/h hors agglomération.',
    'Le louvoiement d’une caravane se corrige en levant le pied, sans freiner brutalement ; il s’aggrave avec la vitesse, le vent latéral ou le dépassement d’un poids lourd. On charge lourd au-dessus de l’essieu, jamais à l’arrière.',
    'Un porte-vélos ne doit masquer ni les feux ni la plaque : une plaque et des feux répétiteurs s’ajoutent si nécessaire.']},

  {t:'cle', titre:'À l’étranger', items:[
    'Le permis physique, le certificat d’immatriculation et une preuve d’assurance couvrant le pays visité sont nécessaires.',
    'Les règles peuvent différer (vitesses, taux d’alcool à zéro, feux allumés de jour, équipements obligatoires) : elles s’imposent dès la frontière franchie.',
    'Dans un pays où l’on roule à gauche, priorités et giratoires s’inversent : vigilance maximale aux intersections et sorties de parking, le réflexe de regarder du mauvais côté étant le principal danger.']},
  {t:'piege', txt:'À l’étranger, le permis numérique n’est pas reconnu. Seuls les documents papier font foi.'},

  {t:'cle', titre:'Sur la route', items:[
    'Aux gares de péage : vitesse réduite à l’approche, file choisie tôt (les changements et freinages de dernière minute causent la plupart des accrochages), télépéage souvent limité à 30 km/h.',
    'Sur une aire de repos : vitesse fortement réduite, piétons, enfants et animaux y circulent entre les véhicules.',
    'Un animal voyage en caisse de transport ou attaché par un harnais : libre, il devient un projectile en cas de choc, et sur les genoux il constitue une entrave sanctionnée.',
    'Un départ un jour de grand trafic se décale ou s’anticipe si possible : les fins de bouchon concentrent les collisions par l’arrière.']},
  {t:'texte', txt:'Un véhicule immobilisé pour la nuit se ferme, sans objet de valeur visible, moteur coupé : le laisser tourner à l’arrêt est polluant, sanctionnable, et dangereux en espace confiné à cause du monoxyde de carbone.'}
 ]}

];
