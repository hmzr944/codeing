/* ============================================================
   Banque de questions - PREMIERS SECOURS
   ============================================================ */
window.Q_SECOURS = [

{id:'SE01', t:'secours', d:1,
 q:'Face à un accident, l’ordre des actions est :',
 o:['Protéger, Alerter, Secourir','Secourir, Protéger, Alerter','Alerter, Secourir, Protéger'],
 a:[0],
 e:'PAS : je protège d’abord la zone pour éviter un sur-accident, j’alerte les secours, puis je porte assistance. Se précipiter sans protéger fait souvent une victime de plus.',
 tip:'P.A.S. : dans cet ordre, jamais un autre.'},

{id:'SE02', t:'secours', d:1,
 q:'Le numéro d’appel d’urgence européen est :',
 o:['Le 112','Le 15','Le 18'],
 a:[0],
 e:'Le 112 fonctionne dans toute l’Union européenne, depuis un portable même sans crédit ni carte SIM. En France : 15 (SAMU), 18 (pompiers), 17 (police), 114 (sourds et malentendants, par SMS).',
 tip:'112 partout en Europe, 114 par SMS.'},

{id:'SE03', t:'secours', d:2, scene:'triangle-secours',
 q:'Pour protéger une zone d’accident, je dois :',
 o:['Allumer mes feux de détresse','Enfiler mon gilet avant de sortir','Baliser avec le triangle si les conditions le permettent','Déplacer les véhicules accidentés pour dégager la voie'],
 a:[0,1,2],
 e:'Le triangle se place à environ 30 mètres, et bien plus loin en cas de virage ou de sommet de côte. Sur autoroute, se mettre à l’abri derrière la glissière passe avant le balisage.',
 tip:'Sur autoroute : gilet, glissière, puis appel. Le triangle si c’est sûr.'},

{id:'SE04', t:'secours', d:2,
 q:'Lors de l’alerte aux secours, je dois indiquer :',
 o:['Le lieu précis (route, sens de circulation, borne kilométrique)','Le nombre et l’état des victimes','Ne jamais raccrocher avant qu’on me le dise','Le nom de votre compagnie d’assurance'],
 a:[0,1,2],
 e:'Sur autoroute, la borne d’appel d’urgence localise automatiquement l’appel. Le sens de circulation est une information capitale pour l’arrivée des secours.',
 tip:'Le lieu d’abord : sans lieu, pas de secours.'},

{id:'SE05', t:'secours', d:2,
 q:'Une victime consciente qui respire mais est coincée dans son véhicule :',
 o:['Ne doit pas être déplacée, sauf danger immédiat','Doit être rassurée et couverte','Doit être sortie du véhicule le plus vite possible'],
 a:[0,1],
 e:'Déplacer une victime peut aggraver une lésion vertébrale. On ne dégage qu’en cas de danger vital immédiat (incendie, immersion, explosion).',
 tip:'On ne bouge pas une victime, sauf si rester la tue.'},

{id:'SE06', t:'secours', d:2, scene:'pls',
 q:'Une victime inconsciente qui respire doit être placée :',
 o:['En position latérale de sécurité','Sur le dos, tête surélevée','Assise contre un mur'],
 a:[0],
 e:'La PLS libère les voies aériennes et évite l’étouffement en cas de vomissement. On surveille ensuite la respiration en continu jusqu’à l’arrivée des secours.',
 tip:'Inconsciente + respire = PLS. Point.'},

{id:'SE07', t:'secours', d:2,
 q:'Le casque d’un motard accidenté :',
 o:['Ne doit être retiré que si c’est indispensable (arrêt respiratoire, vomissements)','Doit être retiré systématiquement','Doit être retiré par une seule personne rapidement'],
 a:[0],
 e:'Le retrait du casque se pratique idéalement à deux, en gardant la tête dans l’axe du corps. Sans nécessité vitale, on ne touche pas au casque.',
 tip:'Casque : on le laisse, sauf si la victime ne respire pas.'},

{id:'SE08', t:'secours', d:3,
 q:'Face à un arrêt cardiaque, le massage cardiaque s’effectue :',
 o:['Au rythme de 100 à 120 compressions par minute','Au centre du thorax, avec une profondeur de 5 à 6 cm','Uniquement par un professionnel de santé'],
 a:[0,1],
 e:'Toute personne peut et doit intervenir : chaque minute sans massage réduit les chances de survie d’environ 10 %. Le défibrillateur automatisé externe (DAE) guide vocalement l’utilisateur.',
 tip:'Le rythme de « Stayin’ Alive » : c’est exactement 100-120/min.'},

{id:'SE09', t:'secours', d:2,
 q:'À une victime accidentée, il ne faut jamais :',
 o:['Donner à boire ou à manger','Retirer un objet planté dans une plaie','La rassurer en lui parlant'],
 a:[0,1],
 e:'Boire peut provoquer une fausse route ou compliquer une anesthésie. Retirer un corps étranger peut provoquer une hémorragie majeure : on stabilise sans extraire.',
 tip:'Ni boire, ni manger, ni retirer. Mais parler, oui.'},

{id:'SE10', t:'secours', d:2,
 q:'En cas d’hémorragie externe importante :',
 o:['J’exerce une compression directe sur la plaie','Je m’allonge la victime si possible','J’attends les secours sans rien faire'],
 a:[0,1],
 e:'La compression directe, si possible avec un tissu propre et des mains protégées, stoppe la plupart des hémorragies. Le garrot est réservé aux cas où la compression est impossible.',
 tip:'Appuyer fort et sans relâcher : c’est ça qui sauve.'},

{id:'SE11', t:'secours', d:2,
 q:'Le défibrillateur automatisé externe (DAE) :',
 o:['Peut être utilisé par toute personne','Analyse le rythme cardiaque avant de délivrer un choc','Est réservé au personnel médical'],
 a:[0,1],
 e:'Le DAE ne délivre un choc que si c’est nécessaire : il ne peut pas nuire. On alterne massage cardiaque et suivi des consignes vocales.',
 tip:'Le DAE parle : il suffit d’obéir.'},

{id:'SE12', t:'secours', d:3,
 q:'La non-assistance à personne en danger :',
 o:['Est un délit puni de prison et d’amende','Ne concerne que les professionnels de santé','N’existe pas si l’on a peur'],
 a:[0],
 e:'Le refus de porter secours est puni de 5 ans d’emprisonnement et 75 000 € d’amende. Alerter les secours constitue déjà une assistance : personne n’est tenu de prendre un risque vital.',
 tip:'Appeler le 112, c’est déjà porter secours.'},

{id:'SE13', t:'secours', d:2,
 q:'Face à une victime brûlée :',
 o:['J’arrose la brûlure à l’eau tempérée','Je ne retire pas les vêtements collés à la peau','J’applique de la pommade immédiatement'],
 a:[0,1],
 e:'Le refroidissement à l’eau tempérée pendant plusieurs minutes limite l’extension de la brûlure. Aucune crème, aucun corps gras avant avis médical.',
 tip:'Eau tempérée, longtemps. Rien d’autre.'},

{id:'SE14', t:'secours', d:3,
 q:'Sur les lieux d’un accident, couper le contact des véhicules impliqués :',
 o:['Limite le risque d’incendie','Fait partie de la phase « Protéger »','Est inutile si personne ne fume'],
 a:[0,1],
 e:'On coupe le contact, on serre le frein de stationnement et on interdit de fumer aux alentours. Sur un véhicule électrique, on garde ses distances si des étincelles ou des fumées apparaissent.'},

{id:'SE15', t:'secours', d:2,
 q:'Un blessé qui se plaint du dos ou du cou après un choc :',
 o:['Ne doit pas être mobilisé','Doit être maintenu au calme','Doit être aidé à se relever pour vérifier s’il peut marcher'],
 a:[0,1],
 e:'Une lésion de la colonne peut n’apparaître qu’au mouvement. On maintient la victime immobile, on la rassure et on attend les secours.',
 tip:'Douleur cervicale = immobilité absolue.'}

];
