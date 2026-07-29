/* ============================================================
   Fiches de révision - l'essentiel, en 2 minutes par thème
   ============================================================ */
window.LESSONS = [

{k:'memo', n:'Les chiffres à connaître par cœur', e:'🔢', star:true, html:
`<p>Si tu ne devais retenir qu’une fiche, c’est celle-là. Ces chiffres tombent dans presque tous les examens.</p>
<span class="key"><b>Alcool</b> : 0,5 g/L de sang (0,25 mg/L d’air expiré). Permis probatoire et transport en commun : <b>0,2 g/L</b>. Délit à partir de <b>0,8 g/L</b>.</span>
<h4>Vitesses (temps sec)</h4>
<ul>
<li>Agglomération : <b>50</b> (parfois 30)</li>
<li>Route bidirectionnelle sans séparateur : <b>80</b> (90 si le département l’a relevé)</li>
<li>Route à chaussées séparées : <b>110</b></li>
<li>Autoroute : <b>130</b></li>
</ul>
<h4>Sous la pluie</h4>
<ul>
<li>Autoroute 130 → <b>110</b></li>
<li>Chaussées séparées 110 → <b>100</b></li>
<li>Hors agglomération 90 → <b>80</b> et 80 → <b>70</b></li>
<li>Agglomération : le 50 ne change pas</li>
</ul>
<h4>Visibilité &lt; 50 m</h4>
<ul><li><b>50 km/h partout</b>, autoroute comprise.</li></ul>
<h4>Jeune permis (probatoire)</h4>
<ul><li>Autoroute <b>110</b> · chaussées séparées <b>100</b> · autres routes <b>80</b></li>
<li>Capital : <b>6 points</b>, disque A obligatoire</li></ul>
<h4>Distances</h4>
<ul>
<li>Distance de sécurité : <b>2 secondes</b></li>
<li>Distance d’arrêt sur sol sec ≈ <b>(chiffre des dizaines)²</b> → 50 km/h = 25 m, 90 km/h = 81 m, 130 km/h = 169 m</li>
<li>Sur sol mouillé, la distance de freinage <b>double</b></li>
<li>Temps de réaction : <b>1 seconde</b></li>
</ul>
<h4>Divers</h4>
<ul>
<li>Pneus : sculpture minimale <b>1,6 mm</b></li>
<li>Contrôle technique : <b>4 ans</b> puis tous les <b>2 ans</b> ; contre-visite sous <b>2 mois</b></li>
<li>Dépassement d’un cycliste : <b>1 m</b> en ville, <b>1,50 m</b> hors agglomération</li>
<li>Examen : <b>35 bonnes réponses sur 40</b></li>
</ul>`},

{k:'signalisation', n:'Signalisation', e:'🚸', html:
`<h4>Lire un panneau à sa forme</h4>
<ul>
<li><b>Triangle rouge pointe en haut</b> → danger (j’anticipe)</li>
<li><b>Triangle pointe en bas</b> → cédez le passage</li>
<li><b>Octogone rouge</b> → STOP, arrêt absolu</li>
<li><b>Disque à bord rouge</b> → interdiction</li>
<li><b>Disque bleu</b> → obligation</li>
<li><b>Carré / rectangle bleu</b> → indication</li>
<li><b>Losange jaune</b> → route prioritaire (barré = fin)</li>
<li><b>Disque gris barré</b> → fin de prescription</li>
</ul>
<span class="key">Astuce imparable : <b>rond = prescription</b> (ordre ou interdiction), <b>triangle = danger</b>, <b>carré = information</b>.</span>
<h4>Hiérarchie à connaître</h4>
<p>En cas de contradiction, l’ordre est toujours : <b>agent → feux → panneaux → marquage au sol → règles générales</b>.</p>
<h4>Marquage au sol</h4>
<ul>
<li><b>Ligne continue</b> : franchissement interdit (exception : dépasser un cycliste avec visibilité)</li>
<li><b>Ligne discontinue</b> : franchissement autorisé</li>
<li><b>Traits qui s’allongent</b> : ligne d’avertissement, une continue arrive</li>
<li><b>Zébras</b> : zone interdite à la circulation</li>
<li>C’est toujours la <b>ligne de mon côté</b> qui compte</li>
</ul>`},

{k:'priorites', n:'Priorités & intersections', e:'🔀', html:
`<h4>La règle de base</h4>
<p>Sans aucune signalisation : <b>priorité à droite</b>. La largeur ou l’importance apparente de la route ne change rien.</p>
<h4>Qui cède toujours le passage ?</h4>
<ul>
<li>Celui qui sort d’un <b>lieu privé</b> (parking, garage, station-service), y compris aux piétons</li>
<li>Celui qui <b>tourne à gauche</b>, face à un véhicule qui va tout droit</li>
<li>Celui qui a un <b>obstacle de son côté</b> sur une route étroite</li>
<li>Celui qui <b>descend</b> en montagne</li>
<li>Celui qui entre dans un <b>giratoire</b> signalé « Cédez le passage »</li>
</ul>
<span class="key">Attention au rond-point <b>sans panneau</b> à l’entrée : la priorité à droite s’applique, donc ce sont les <b>entrants</b> qui passent. Rare, mais ça tombe à l’examen.</span>
<h4>Toujours prioritaires</h4>
<ul>
<li>Le <b>tramway</b> (il ne peut pas s’écarter)</li>
<li>Les <b>véhicules d’intervention urgente</b> (sirène + gyrophare)</li>
<li>Le <b>bus qui quitte son arrêt</b>, en agglomération uniquement</li>
<li>Le <b>piéton</b> engagé ou manifestant l’intention de traverser</li>
</ul>
<h4>Giratoire : le clignotant</h4>
<p>Pas de clignotant à l’entrée si je sors à la première sortie. Sinon, <b>clignotant droit</b> juste après avoir dépassé la sortie précédant la mienne.</p>`},

{k:'vitesse', n:'Vitesses & distances', e:'⚡', html:
`<h4>La vitesse est un maximum, pas un objectif</h4>
<p>Le code impose de <b>réduire</b> dans une liste de situations : virages, sommets de côte, croisements étroits, passages piétons, écoles, chantiers, mauvais temps, trafic dense.</p>
<h4>Distance de sécurité</h4>
<p>La règle des <b>2 secondes</b> : je choisis un point fixe (panneau, arbre) ; quand le véhicule devant le dépasse, je dois pouvoir compter « mille-un, mille-deux » avant d’y arriver moi-même.</p>
<span class="key">Sur autoroute, deux traits de rappel visibles entre les véhicules = distance correcte.</span>
<h4>Distance d’arrêt</h4>
<p><b>Distance d’arrêt = distance de réaction + distance de freinage.</b></p>
<ul>
<li>Réaction ≈ 1 seconde → à 90 km/h, c’est déjà <b>25 m</b> parcourus les yeux ouverts mais le pied inactif</li>
<li>Sol sec : distance d’arrêt ≈ <b>dizaines²</b></li>
<li>Sol mouillé : le freinage <b>double</b></li>
</ul>
<h4>Physique du choc</h4>
<p>L’énergie varie avec le <b>carré</b> de la vitesse : rouler deux fois plus vite, c’est un choc <b>quatre fois</b> plus violent.</p>
<h4>Barème des excès</h4>
<ul>
<li>&lt; 20 km/h : 1 point</li><li>20 à 29 : 2 points</li><li>30 à 39 : 3 points</li>
<li>40 à 49 : 4 points</li><li>≥ 50 : <b>6 points</b>, 1 500 €, suspension possible</li>
</ul>`},

{k:'manoeuvres', n:'Dépassement & manœuvres', e:'↔️', html:
`<h4>La séquence du dépassement</h4>
<p><b>Rétroviseurs → angle mort → clignotant → déboîtement → dépassement → rétroviseur intérieur → rabattement.</b></p>
<p>Je me rabats quand je vois le véhicule dépassé <b>en entier</b> dans mon rétroviseur intérieur.</p>
<span class="key">Le clignotant <b>annonce</b> une intention. Il ne donne aucun droit et ne remplace jamais un contrôle.</span>
<h4>Le dépassement est interdit</h4>
<ul>
<li>Quand la visibilité est insuffisante (virage, sommet de côte)</li>
<li>Sur un passage à niveau, un passage piéton</li>
<li>Dans une intersection où je ne suis pas prioritaire</li>
<li>Quand le véhicule devant moi dépasse déjà</li>
</ul>
<h4>Écart avec un cycliste</h4>
<p><b>1 m</b> en agglomération, <b>1,50 m</b> hors agglomération. Si l’espace manque, j’attends. Franchir une ligne continue pour ce dépassement est toléré si la visibilité est bonne.</p>
<h4>Manœuvres interdites</h4>
<p><b>Marche arrière</b> et <b>demi-tour</b> : interdits sur autoroute et voie rapide, sur un passage à niveau, dans un virage sans visibilité.</p>
<h4>Ouvrir sa portière</h4>
<p>Technique « du Néerlandais » : ouvrir avec la <b>main opposée</b> à la portière. Le corps pivote automatiquement et le regard balaie l’arrière. C’est ce qui évite l’emportiérage d’un cycliste.</p>`},

{k:'autoroute', n:'Autoroute & voies rapides', e:'🛣️', html:
`<h4>S’insérer</h4>
<p>La voie d’insertion sert à <b>prendre de la vitesse</b>, pas à hésiter. Je n’ai aucune priorité : j’adapte ma vitesse au trafic et je m’insère dans un espace suffisant. S’arrêter en bout de voie est très dangereux.</p>
<h4>Circuler</h4>
<ul>
<li>Voie de droite par défaut, voie de gauche uniquement pour dépasser</li>
<li>Vitesse minimale sur la voie de gauche par temps clair : <b>80 km/h</b></li>
<li>Interdits : piétons, cyclos, tracteurs, tout véhicule ne dépassant pas 80 km/h</li>
<li>Marche arrière et demi-tour : <b>interdits</b></li>
</ul>
<h4>Sortir</h4>
<p>Je me rabats à droite <b>bien avant</b> la sortie, puis je décélère <b>sur la voie de décélération</b>, jamais sur l’autoroute. Sortie ratée = sortie suivante.</p>
<span class="key"><b>Panne sur autoroute</b> : warnings → gilet enfilé <b>dans</b> la voiture → sortie par la droite → derrière la glissière → borne d’appel d’urgence (tous les 2 km).</span>
<h4>Corridor de sécurité</h4>
<p>En cas de bouchon, ceux de la voie de gauche se serrent à gauche, les autres à droite : un couloir se forme au milieu pour les secours.</p>
<h4>Fatigue</h4>
<p>Pause de 15 à 20 minutes <b>toutes les 2 heures</b>. La somnolence est la première cause d’accident mortel sur autoroute.</p>`},

{k:'stationnement', n:'Arrêt & stationnement', e:'🅿️', html:
`<h4>Arrêt ou stationnement ?</h4>
<ul>
<li><b>Arrêt</b> : immobilisation brève, conducteur au volant (déposer quelqu’un, charger)</li>
<li><b>Stationnement</b> : le conducteur s’absente ou l’immobilisation se prolonge</li>
</ul>
<span class="key">Panneau à <b>une barre</b> = stationnement interdit (l’arrêt reste possible). Panneau <b>en croix</b> = arrêt <b>et</b> stationnement interdits.</span>
<h4>Interdit dans tous les cas</h4>
<ul>
<li>Sur un passage piéton, un trottoir, une piste cyclable</li>
<li>Sur les <b>5 mètres en amont</b> d’un passage piéton</li>
<li>Devant une entrée carrossable</li>
<li>Sur un emplacement réservé aux personnes handicapées, un arrêt de bus, une voie réservée</li>
<li>Sur un pont, dans un tunnel, sur la BAU</li>
</ul>
<h4>Bon à savoir</h4>
<ul>
<li>Stationnement <b>abusif</b> au-delà de <b>7 jours</b> au même endroit</li>
<li>Stationnement gênant : <b>135 €</b>, mise en fourrière possible</li>
<li>Alterné semi-mensuel : impairs du 1<sup>er</sup> au 15, pairs du 16 à la fin du mois</li>
<li>En pente : frein de stationnement, rapport engagé, <b>roues braquées</b> vers le trottoir</li>
</ul>`},

{k:'conducteur', n:'Le conducteur', e:'🧠', html:
`<h4>Alcool</h4>
<ul>
<li>0,5 g/L de sang = 0,25 mg/L d’air expiré (règle : <b>sang ÷ 2 = air</b>)</li>
<li>Permis probatoire / transport en commun : <b>0,2 g/L</b></li>
<li>Délit dès <b>0,8 g/L</b> : 4 500 €, 6 points, jusqu’à 2 ans de prison</li>
<li>Élimination : <b>0,10 à 0,15 g/L par heure</b>. Ni café, ni douche, ni sport n’accélèrent quoi que ce soit</li>
</ul>
<h4>Stupéfiants et médicaments</h4>
<p>Stupéfiants : <b>tolérance zéro</b>, c’est un délit dès la moindre trace. Médicaments : pictogramme jaune (prudence), orange (avis médical), <b>rouge (ne pas conduire)</b>.</p>
<h4>Fatigue</h4>
<p>Bâillements, paupières lourdes, trajectoire flottante : ce sont des <b>signaux d’alarme</b>. La seule réponse efficace est une sieste de 15 à 20 minutes.</p>
<h4>Distraction</h4>
<ul>
<li>Téléphone tenu en main : <b>3 points + 135 €</b>, même à l’arrêt au feu rouge</li>
<li>Écouteurs, casque, oreillette : <b>interdits</b> (3 points + 135 €)</li>
</ul>
<h4>Permis à points</h4>
<ul>
<li>Probatoire : <b>6 points</b> → 12 en 3 ans (ou 2 ans après conduite accompagnée)</li>
<li>Stage : <b>+4 points maximum, une fois par an</b></li>
<li>Récupération automatique : 6 mois (1 point isolé), 2 ans (infractions légères), 3 ans (graves)</li>
<li>0 point → permis invalidé, à repasser après 6 mois</li>
</ul>`},

{k:'usagers', n:'Les autres usagers', e:'🚴', html:
`<h4>Vulnérabilité</h4>
<p>Un piéton renversé à <b>30 km/h</b> a environ 10 % de risque de décès ; à <b>50 km/h</b>, près de 50 %. C’est toute la raison d’être des zones 30.</p>
<h4>Poids lourds</h4>
<span class="key">Si je ne vois pas les rétroviseurs du camion, <b>son conducteur ne me voit pas</b>. Un camion qui tourne à droite se déporte d’abord à gauche : ne jamais s’intercaler à sa droite.</span>
<h4>Cyclistes</h4>
<ul>
<li>Écart de dépassement : 1 m en ville, 1,50 m hors agglomération</li>
<li><b>Sas vélo</b> devant les feux : interdit aux voitures</li>
<li><b>Double-sens cyclable</b> : la règle en zone 30</li>
<li>Casque obligatoire jusqu’à <b>12 ans</b></li>
<li>Avant de tourner à droite : rétroviseur <b>et</b> coup d’œil par-dessus l’épaule</li>
</ul>
<h4>Trottinettes (EDPM)</h4>
<p>Une seule personne, <b>25 km/h</b> maximum, 14 ans minimum, interdiction du trottoir et des écouteurs.</p>
<h4>Piétons</h4>
<p>Je cède le passage au piéton engagé <b>ou</b> qui manifeste son intention de traverser (4 points + 135 € sinon). Hors passage protégé, le piéton peut traverser s’il n’y a pas de passage à moins de <b>50 m</b>.</p>`},

{k:'vehicule', n:'Véhicule & équipements', e:'🔧', html:
`<h4>Obligatoire à bord</h4>
<p><b>Gilet</b> (accessible depuis l’habitacle) et <b>triangle</b>. L’éthylotest n’est plus obligatoire depuis 2020, mais reste conseillé.</p>
<h4>Pneus</h4>
<ul>
<li>Sculpture minimale : <b>1,6 mm</b></li>
<li>Pression vérifiée <b>à froid</b>, une fois par mois, roue de secours comprise</li>
<li>Sous-gonflage → surconsommation, usure des bords, risque d’éclatement</li>
</ul>
<h4>Feux</h4>
<ul>
<li>Croisement : portée ≈ <b>30 m</b> · Route : ≈ <b>100 m</b></li>
<li>Brouillard <b>avant</b> : pluie, neige, brouillard</li>
<li>Brouillard <b>arrière</b> : brouillard ou neige uniquement, <b>jamais sous la pluie</b></li>
<li>Détresse : danger uniquement, jamais pour légaliser un stationnement</li>
</ul>
<h4>Témoins</h4>
<p><b>Rouge</b> = je m’arrête dès que possible · <b>Orange</b> = à faire vérifier · <b>Vert/bleu</b> = fonctionnement normal.</p>
<h4>Aides électroniques</h4>
<p>L’<b>ABS</b> empêche le blocage des roues : il permet de <b>diriger</b> en freinant fort, il ne raccourcit pas toujours la distance. L’<b>ESP</b> corrige un début de dérapage, mais aucune électronique ne recrée de l’adhérence.</p>`},

{k:'conditions', n:'Conditions difficiles', e:'🌧️', html:
`<h4>Pluie</h4>
<p>Vitesses réduites (130→110, 110→100, 90→80, 80→70), distances augmentées, feux de croisement allumés. Les <b>10 premières minutes</b> de pluie après une période sèche sont les plus glissantes.</p>
<h4>Aquaplaning</h4>
<span class="key">Je <b>lâche l’accélérateur</b>, je ne freine pas brutalement, je garde le <b>volant droit</b>. Toute action brusque provoque un tête-à-queue au retour de l’adhérence.</span>
<h4>Brouillard</h4>
<p>Feux de croisement + brouillard avant. <b>Jamais de feux de route</b> : ils créent un mur blanc. Visibilité &lt; 50 m → <b>50 km/h partout</b>.</p>
<h4>Neige et verglas</h4>
<p>Tout en douceur : accélération, freinage, direction. Le verglas se forme d’abord sur les <b>ponts</b> et dans les <b>zones ombragées</b>. Chaînes sur les roues motrices, 50 km/h maximum, à retirer dès que la route est dégagée.</p>
<h4>Nuit</h4>
<p>Je roule à la vitesse de mes phares : en code (30 m de portée), au-delà de 80 km/h je roule plus loin que ce que je vois. Ébloui ? Je regarde le <b>bord droit</b> de la chaussée et je ralentis.</p>
<h4>Tunnel</h4>
<p>Feux de croisement, lunettes de soleil retirées, distances respectées. En cas d’incendie : je coupe le moteur, <b>je laisse les clés</b> et je rejoins l’issue de secours <b>à pied</b>. La fumée tue avant les flammes.</p>`},

{k:'secours', n:'Premiers secours', e:'🚑', html:
`<h4>P.A.S.</h4>
<p><b>Protéger → Alerter → Secourir.</b> Dans cet ordre : se précipiter sans protéger crée souvent une victime supplémentaire.</p>
<h4>Protéger</h4>
<p>Feux de détresse, gilet enfilé <b>avant</b> de sortir, balisage au triangle (≈30 m, davantage avant un virage), moteurs coupés, interdiction de fumer.</p>
<h4>Alerter</h4>
<ul>
<li><b>112</b> (Europe) · <b>15</b> SAMU · <b>18</b> pompiers · <b>17</b> police · <b>114</b> par SMS</li>
<li>Donner : le <b>lieu précis</b> (route, sens, borne km), le nombre et l’état des victimes</li>
<li>Ne jamais raccrocher le premier</li>
</ul>
<h4>Secourir</h4>
<ul>
<li>On ne <b>déplace pas</b> une victime, sauf danger vital immédiat</li>
<li>Inconsciente et respire → <b>PLS</b></li>
<li>Ne respire pas → massage cardiaque, <b>100 à 120 par minute</b>, 5 à 6 cm</li>
<li>Casque de moto : on le retire <b>seulement</b> si c’est vital</li>
<li>Hémorragie → <b>compression directe</b></li>
<li>Jamais : boire, manger, retirer un objet planté</li>
</ul>
<span class="key">La non-assistance à personne en danger est un délit. Mais appeler le 112 est déjà porter secours : personne n’est obligé de prendre un risque vital.</span>`},

{k:'environnement', n:'Éco-conduite & environnement', e:'🌱', html:
`<h4>Conduire souple, c’est conduire sûr</h4>
<p>Anticiper permet de moins freiner, donc de moins accélérer : <b>10 à 15 % d’économie</b> de carburant, et une conduite plus sereine.</p>
<ul>
<li>Passer les rapports tôt : ≈ <b>2 000 tr/min</b> en diesel, <b>2 500</b> en essence</li>
<li>Ne pas faire chauffer le moteur à l’arrêt : inutile et polluant</li>
<li>Retirer galerie et coffre de toit inutilisés (jusqu’à 20 % de surconsommation)</li>
<li>Climatisation : gourmande en ville, plus économique que les vitres ouvertes au-delà de 70 km/h</li>
<li>130 → 110 km/h : environ 20 % de carburant économisé pour ~8 minutes sur 100 km</li>
</ul>
<h4>Crit’Air et ZFE</h4>
<p>Vignette de <b>0</b> (électrique) à <b>5</b> (diesel ancien), définitive. Les <b>zones à faibles émissions</b> peuvent en restreindre l’accès, en permanence ou lors des pics de pollution.</p>`},

{k:'admin', n:'Papiers & réglementation', e:'📄', html:
`<h4>À présenter en cas de contrôle</h4>
<p>Permis de conduire, certificat d’immatriculation, preuve d’assurance en cours.</p>
<span class="key">Depuis avril 2024, la <b>vignette verte d’assurance a disparu</b> : les forces de l’ordre consultent le Fichier des Véhicules Assurés. L’assurance reste évidemment obligatoire.</span>
<h4>Assurance</h4>
<p>Minimum légal : la <b>responsabilité civile</b> (« au tiers »). Rouler sans assurance est un <b>délit</b> : 500 € d’amende forfaitaire, jusqu’à 3 750 € au tribunal.</p>
<h4>Contrôle technique</h4>
<ul>
<li>Premier contrôle à <b>4 ans</b>, puis tous les <b>2 ans</b></li>
<li>Contre-visite dans les <b>2 mois</b></li>
<li>Vente d’un véhicule de plus de 4 ans : contrôle de moins de <b>6 mois</b></li>
</ul>
<h4>Délais à retenir</h4>
<ul>
<li>Changement d’adresse : <b>1 mois</b></li>
<li>Carte grise après achat : <b>1 mois</b></li>
<li>Déclaration de cession : <b>15 jours</b></li>
<li>Constat amiable envoyé à l’assureur : <b>5 jours ouvrés</b></li>
</ul>
<h4>Permis B</h4>
<p>Jusqu’à <b>3,5 t</b> de PTAC et <b>9 places</b> conducteur compris. Remorque : jusqu’à 750 kg librement ; ensemble jusqu’à 3,5 t en B ; jusqu’à 4,25 t avec la formation <b>B96</b> ; au-delà, permis <b>BE</b>.</p>
<h4>L’examen</h4>
<p>40 questions, <b>35 bonnes réponses minimum</b>. Résultat valable <b>5 ans</b> et pour 5 présentations à l’épreuve pratique.</p>`}

];
