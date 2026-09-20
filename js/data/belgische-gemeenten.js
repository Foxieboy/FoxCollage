/*
 * Namen van Belgische steden en gemeenten.
 *
 * Twee taken in het spel:
 *   1. suggesties tijdens het typen, zodat de speler de naam niet zelf hoeft
 *      te spellen (zie de datalist in js/app.js);
 *   2. valse treffers tegenhouden: wie een bestaande naam typt die geen
 *      antwoord is, heeft geen tikfout gemaakt maar een ander ding bedoeld.
 *
 * Deze lijst is met de hand samengesteld en niet gezaghebbend: er kunnen
 * gemeenten ontbreken en fusienamen kunnen verouderd zijn. Dat is niet erg -
 * beide taken falen zacht. Een ontbrekende naam wordt gewoon niet gesuggereerd,
 * en de spellingcontrole valt dan terug op de fonetische vergelijking. Aanvullen
 * mag altijd; de volgorde doet er niet toe.
 *
 * Waalse gemeenten staan er met hun Franse naam én, waar die gangbaar is, met
 * hun Nederlandse naam, zodat beide spellingen herkend worden.
 */
(function (root) {
  'use strict';

  var gemeenten = [
    // --- Antwerpen ---
    'Aartselaar', 'Antwerpen', 'Arendonk', 'Baarle-Hertog', 'Balen', 'Beerse', 'Berlaar',
    'Bonheiden', 'Boom', 'Bornem', 'Borsbeek', 'Brasschaat', 'Brecht', 'Dessel', 'Duffel',
    'Essen', 'Geel', 'Grobbendonk', 'Heist-op-den-Berg', 'Hemiksem', 'Herentals', 'Herenthout',
    'Herselt', 'Hoogstraten', 'Hove', 'Hulshout', 'Kalmthout', 'Kapellen', 'Kasterlee',
    'Kontich', 'Laakdal', 'Lier', 'Lille', 'Lint', 'Malle', 'Mechelen', 'Meerhout',
    'Merksplas', 'Mol', 'Mortsel', 'Niel', 'Nijlen', 'Olen', 'Oud-Turnhout', 'Putte',
    'Puurs-Sint-Amands', 'Ranst', 'Ravels', 'Retie', 'Rijkevorsel', 'Rumst', 'Schelle',
    'Schilde', 'Schoten', 'Sint-Katelijne-Waver', 'Stabroek', 'Turnhout', 'Vorselaar',
    'Vosselaar', 'Westerlo', 'Wijnegem', 'Willebroek', 'Wommelgem', 'Wuustwezel',
    'Zandhoven', 'Zoersel', 'Zwijndrecht',

    // --- Limburg ---
    'Alken', 'As', 'Beringen', 'Bilzen', 'Bocholt', 'Borgloon', 'Bree', 'Diepenbeek',
    'Dilsen-Stokkem', 'Genk', 'Gingelom', 'Halen', 'Ham', 'Hamont-Achel', 'Hasselt',
    'Hechtel-Eksel', 'Heers', 'Herk-de-Stad', 'Herstappe', 'Heusden-Zolder', 'Hoeselt',
    'Houthalen-Helchteren', 'Kinrooi', 'Kortessem', 'Lanaken', 'Leopoldsburg', 'Lommel',
    'Lummen', 'Maaseik', 'Maasmechelen', 'Nieuwerkerken', 'Oudsbergen', 'Peer', 'Pelt',
    'Riemst', 'Sint-Truiden', 'Tessenderlo', 'Tongeren', 'Voeren', 'Wellen', 'Zonhoven',
    'Zutendaal',

    // --- Oost-Vlaanderen ---
    'Aalst', 'Aalter', 'Assenede', 'Berlare', 'Beveren', 'Brakel', 'Buggenhout', 'De Pinte',
    'Deinze', 'Denderleeuw', 'Dendermonde', 'Destelbergen', 'Eeklo', 'Erpe-Mere', 'Evergem',
    'Gavere', 'Geraardsbergen', 'Gent', 'Haaltert', 'Hamme', 'Herzele', 'Horebeke',
    'Kaprijke', 'Kluisbergen', 'Kruibeke', 'Kruisem', 'Laarne', 'Lebbeke', 'Lede', 'Lierde',
    'Lievegem', 'Lochristi', 'Lokeren', 'Maarkedal', 'Maldegem', 'Melle', 'Merelbeke',
    'Moerbeke', 'Nazareth', 'Ninove', 'Oosterzele', 'Oudenaarde', 'Ronse', 'Sint-Gillis-Waas',
    'Sint-Laureins', 'Sint-Lievens-Houtem', 'Sint-Martens-Latem', 'Sint-Niklaas', 'Stekene',
    'Temse', 'Waasmunster', 'Wachtebeke', 'Wetteren', 'Wichelen', 'Wortegem-Petegem', 'Zele',
    'Zelzate', 'Zottegem', 'Zulte', 'Zwalm',

    // --- West-Vlaanderen ---
    'Alveringem', 'Anzegem', 'Ardooie', 'Avelgem', 'Beernem', 'Blankenberge', 'Bredene',
    'Brugge', 'Damme', 'De Haan', 'De Panne', 'Deerlijk', 'Dentergem', 'Diksmuide', 'Gistel',
    'Harelbeke', 'Heuvelland', 'Hooglede', 'Houthulst', 'Ichtegem', 'Ieper', 'Ingelmunster',
    'Izegem', 'Jabbeke', 'Knokke-Heist', 'Knokke', 'Koekelare', 'Koksijde', 'Kortemark', 'Kortrijk',
    'Kuurne', 'Langemark-Poelkapelle', 'Ledegem', 'Lendelede', 'Lichtervelde', 'Lo-Reninge',
    'Menen', 'Mesen', 'Meulebeke', 'Middelkerke', 'Moorslede', 'Nieuwpoort', 'Oostende',
    'Oostkamp', 'Oostrozebeke', 'Oudenburg', 'Pittem', 'Poperinge', 'Roeselare', 'Ruiselede',
    'Spiere-Helkijn', 'Staden', 'Tielt', 'Torhout', 'Veurne', 'Vleteren', 'Waregem', 'Wervik',
    'Wevelgem', 'Wielsbeke', 'Wingene', 'Zedelgem', 'Zonnebeke', 'Zuienkerke', 'Zwevegem',

    // --- Vlaams-Brabant ---
    'Aarschot', 'Affligem', 'Asse', 'Beersel', 'Begijnendijk', 'Bekkevoort', 'Bertem',
    'Bever', 'Bierbeek', 'Boortmeerbeek', 'Boutersem', 'Diest', 'Dilbeek', 'Drogenbos',
    'Galmaarden', 'Geetbets', 'Glabbeek', 'Gooik', 'Grimbergen', 'Haacht', 'Halle', 'Herent',
    'Herne', 'Hoegaarden', 'Hoeilaart', 'Holsbeek', 'Huldenberg', 'Kampenhout',
    'Kapelle-op-den-Bos', 'Keerbergen', 'Kortenaken', 'Kortenberg', 'Kraainem', 'Landen',
    'Lennik', 'Leuven', 'Liedekerke', 'Linkebeek', 'Linter', 'Londerzeel', 'Lubbeek',
    'Machelen', 'Meise', 'Merchtem', 'Opwijk', 'Oud-Heverlee', 'Overijse', 'Pepingen',
    'Roosdaal', 'Rotselaar', 'Scherpenheuvel-Zichem', 'Sint-Genesius-Rode',
    'Sint-Pieters-Leeuw', 'Steenokkerzeel', 'Ternat', 'Tervuren', 'Tielt-Winge', 'Tienen',
    'Tremelo', 'Vilvoorde', 'Wemmel', 'Wezembeek-Oppem', 'Zaventem', 'Zemst', 'Zoutleeuw',

    // --- Brussels Hoofdstedelijk Gewest ---
    'Anderlecht', 'Brussel', 'Elsene', 'Etterbeek', 'Evere', 'Ganshoren', 'Jette',
    'Koekelberg', 'Oudergem', 'Schaarbeek', 'Sint-Agatha-Berchem', 'Sint-Gillis',
    'Sint-Jans-Molenbeek', 'Sint-Joost-ten-Node', 'Sint-Lambrechts-Woluwe',
    'Sint-Pieters-Woluwe', 'Ukkel', 'Vorst', 'Watermaal-Bosvoorde',

    // --- Wallonië: Henegouwen ---
    'Aat', 'Ath', 'Antoing', 'Bergen', 'Mons', 'Bernissart', 'Binche', 'Boussu', 'Brugelette',
    'Celles', 'Charleroi', 'Chapelle-lez-Herlaimont', 'Chièvres', 'Chimay', 'Colfontaine',
    'Comines-Warneton', 'Komen-Waasten', 'Courcelles', 'Dour', 'Ecaussinnes', 'Edingen',
    'Enghien', 'Erquelinnes', 'Estinnes', 'Farciennes', 'Fleurus', 'Fontaine-l\'Évêque',
    'Frameries', 'Froidchapelle', 'Gerpinnes', 'Ham-sur-Heure-Nalinnes', 'Hensies', 'Honnelles',
    'Jurbise', 'La Louvière', 'Le Roeulx', 'Lens', 'Lessen', 'Lessines', 'Leuze-en-Hainaut',
    'Lobbes', 'Manage', 'Merbes-le-Château', 'Moeskroen', 'Mouscron', 'Momignies',
    'Mont-de-l\'Enclus', 'Morlanwelz', 'Pecq', 'Péruwelz', 'Pont-à-Celles', 'Quaregnon',
    'Quévy', 'Quiévrain', 'Rumes', 'Saint-Ghislain', 'Seneffe', 'Silly', 'Opzullik',
    'Sivry-Rance', 'Soignies', 'Zinnik', 'Thuin', 'Doornik', 'Tournai',

    // --- Wallonië: Luik ---
    'Amay', 'Ans', 'Anthisnes', 'Aubel', 'Awans', 'Aywaille', 'Baelen', 'Bassenge',
    'Beyne-Heusay', 'Blegny', 'Braives', 'Burdinne', 'Chaudfontaine', 'Clavier',
    'Comblain-au-Pont', 'Crisnée', 'Dalhem', 'Dison', 'Donceel', 'Engis', 'Esneux', 'Eupen',
    'Faimes', 'Ferrières', 'Fexhe-le-Haut-Clocher', 'Flémalle', 'Fléron', 'Geer',
    'Grâce-Hollogne', 'Hamoir', 'Hannuit', 'Hannut', 'Héron', 'Herstal', 'Herve', 'Hoei',
    'Huy', 'Jalhay', 'Juprelle', 'Kelmis', 'La Calamine', 'Lierneux', 'Limbourg', 'Lincent',
    'Luik', 'Liège', 'Lontzen', 'Malmedy', 'Marchin', 'Modave', 'Nandrin', 'Neupré', 'Olne',
    'Oreye', 'Oupeye', 'Pepinster', 'Plombières', 'Raeren', 'Remicourt', 'Saint-Nicolas',
    'Sankt Vith', 'Sint-Vith', 'Seraing', 'Soumagne', 'Spa', 'Sprimont', 'Stavelot',
    'Stoumont', 'Theux', 'Thimister-Clermont', 'Tinlot', 'Trois-Ponts', 'Trooz', 'Verlaine',
    'Verviers', 'Visé', 'Wezet', 'Waimes', 'Wanze', 'Waremme', 'Borgworm', 'Wasseiges',
    'Welkenraedt',

    // --- Wallonië: Namen ---
    'Andenne', 'Anhée', 'Assesse', 'Beauraing', 'Bièvre', 'Cerfontaine', 'Ciney', 'Couvin',
    'Dinant', 'Doische', 'Eghezée', 'Fernelmont', 'Floreffe', 'Florennes', 'Fosses-la-Ville',
    'Gedinne', 'Gembloers', 'Gembloux', 'Gesves', 'Hamois', 'Hastière', 'Havelange',
    'Houyet', 'Jemeppe-sur-Sambre', 'La Bruyère', 'Mettet', 'Namen', 'Namur', 'Ohey',
    'Onhaye', 'Philippeville', 'Profondeville', 'Rochefort', 'Sambreville', 'Sombreffe',
    'Somme-Leuze', 'Vresse-sur-Semois', 'Walcourt', 'Yvoir',

    // --- Wallonië: Luxemburg ---
    'Aarlen', 'Arlon', 'Attert', 'Aubange', 'Bastenaken', 'Bastogne', 'Bertogne', 'Bertrix',
    'Bouillon', 'Chiny', 'Daverdisse', 'Durbuy', 'Érezée', 'Étalle', 'Fauvillers',
    'Florenville', 'Gouvy', 'Habay', 'Herbeumont', 'Hotton', 'Houffalize', 'La Roche-en-Ardenne',
    'Léglise', 'Libin', 'Libramont-Chevigny', 'Manhay', 'Marche-en-Famenne', 'Martelange',
    'Messancy', 'Meix-devant-Virton', 'Musson', 'Nassogne', 'Neufchâteau', 'Paliseul',
    'Rendeux', 'Rouvroy', 'Saint-Hubert', 'Saint-Léger', 'Sainte-Ode', 'Tellin', 'Tenneville',
    'Tintigny', 'Vaux-sur-Sûre', 'Vielsalm', 'Virton', 'Wellin',

    // --- Wallonië: Waals-Brabant ---
    'Beauvechain', 'Braine-l\'Alleud', 'Eigenbrakel', 'Braine-le-Château', 'Chastre',
    'Chaumont-Gistoux', 'Court-Saint-Étienne', 'Genepiën', 'Genappe', 'Grez-Doiceau',
    'Hélécine', 'Incourt', 'Ittre', 'Geldenaken', 'Jodoigne', 'La Hulpe', 'Lasne',
    'Mont-Saint-Guibert', 'Nijvel', 'Nivelles', 'Orp-Jauche', 'Ottignies-Louvain-la-Neuve',
    'Perwez', 'Ramillies', 'Rebecq', 'Rixensart', 'Tubize', 'Tubeke', 'Villers-la-Ville',
    'Walhain', 'Waterloo', 'Waver', 'Wavre'
  ];

  root.FoxCollage = root.FoxCollage || {};
  root.FoxCollage.data = root.FoxCollage.data || {};
  root.FoxCollage.data.belgischeGemeenten = gemeenten;
})(window);
