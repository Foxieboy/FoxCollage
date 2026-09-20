# FoxCollage

Een zoekplaatspel. In één collagetekening zitten **tien items uit één categorie** verstopt —
telkens als woordgrap. De speler herkent ze en typt ze zo snel mogelijk in de invulboxen.
De klok loopt; hints helpen maar kosten straftijd.

De tekening beeldt de *betekenis* van een naam uit, niet de plaats of het ding zelf.
(Verzonnen voorbeeld, dat niet in het spel zit: een kat op een berg zou *Kattenberg* zijn.)

> **Spoilervrij.** Deze README noemt geen enkel antwoord. De oplossingen staan in
> `docs/oplossingen/`, en de tekeningen zelf staan als code in `js/categories/` —
> open die bestanden niet voor je gespeeld hebt.

## Spelen

**Online:** https://foxieboy.github.io/FoxCollage/ — werkt zodra GitHub Pages aanstaat
(Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`).

**Lokaal:** geen build, geen server, geen dependencies — open `index.html` in een browser.
(Of serveer de map, bv. `npx http-server .`)

Het spel draait volledig in de browser. `.nojekyll` staat in de repo zodat Pages de
bestanden ongewijzigd serveert.

## Hoe het spel werkt

| | |
|---|---|
| **Invullen** | Tien invulboxen. Typ een antwoord, druk op `Enter`. Volgorde maakt niet uit. |
| **Spelling** | Mag fout. Tijdens het typen krijg je namen uit het thema voorgesteld, en wie toch zelf tikt, wordt ruim vergeven — zie hieronder. |
| **Tijd** | Loopt vanaf het verschijnen van de tekening tot het tiende item gevonden is. |
| **Hints** | Vier soorten, geprijsd naar hoeveel ze weggeven. *Haal iets weg* (+10 s) laat één voorwerp verdwijnen dat nergens naar verwijst; *Aanwijzing* (+20 s) geeft een cryptische omschrijving; *Toon plek* (+30 s) markeert en zoomt naar de plek; *Geef antwoord* (+60 s) vult het item in. De laatste drie gaan over hetzelfde item tot dat opgelost is, zodat ze op elkaar voortbouwen. |
| **Afleiders** | De tekening bevat voorwerpen die nergens naar verwijzen, en bewuste bijna-treffers: twee voorwerpen die sterk op een verborgen item lijken maar niet meetellen. Ze zijn één voor één weg te kopen met de goedkoopste hint; het decor (lucht, huizen, bomen) blijft altijd staan. |
| **Einde** | Alle tien plekken worden gemarkeerd, met per item de uitleg van de woordgrap. Je snelste tijd per categorie staat in `localStorage`. |

## Spelfouten worden opgevangen

Een tijdspel verliezen op een typfout is geen spel meer. Daarom vier lagen, van
voorkomen naar vergeven:

1. **Suggesties tijdens het typen.** De invulboxen hangen aan een lijst met álle
   namen uit het thema, niet alleen de antwoorden. Wie een suggestie aanklikt,
   spelt per definitie juist — en omdat de lijst honderden namen telt, verraadt
   ze niets.
2. **Klinkt het hetzelfde?** Elk antwoord krijgt een fonetische sleutel die
   Nederlandse schrijfvarianten gelijkschakelt: `c`/`k`, `ck`, `ch`/`g`,
   `ei`/`ij`/`y`, `ou`/`au`, `oe`/`u`, `v`/`f`, `z`/`s`, eind-`d`/`t` en dubbele
   letters. Het verzonnen *Kattenbergh* komt zo op dezelfde sleutel uit als
   *Kattenberg*.
3. **Tikfoutmarge.** Daarnaast een bewerkingsafstand waarin het omwisselen van
   twee letters naast elkaar als één fout telt — precies wat vingers doen. Bij
   korte namen geldt een extra eis: de letters moeten nagenoeg dezelfde blijven.
   Een weggevallen of verdubbelde letter is een tikfout, een vervángen letter is
   een ander woord.
4. **Twee vangnetten tegen cadeaus.** Wie een andere bestaande naam uit het thema
   typt, heeft geen tikfout gemaakt maar iets anders bedoeld: dat wordt nooit als
   treffer geteld. En lijkt de invoer even sterk op twee antwoorden, dan vraagt
   het spel om preciezer te typen in plaats van er één te kiezen — dat kost geen
   misgok.

Wordt je spelling gecorrigeerd, dan zegt het spel het ("we lezen dit als …") en
komt de juiste schrijfwijze in de box te staan.

## Testen

```
node test/spelling.js          # vereist playwright
node test/spoilers.js          # draait zonder browser
```

**spelling.js** genereert verschrijvingen uit de categoriegegevens zelf en
controleert dat ze aanvaard worden, dat elk antwoord tussen de suggesties staat,
en dat geen enkele andere naam uit het thema als antwoord geldt.

**spoilers.js** leest de antwoorden uit de categorieën en zoekt ze in alles wat
een speler onder ogen krijgt — README, startscherm, handleiding, code en tests.
Het vergelijkt op fonetische sleutel, zodat ook een verhaspeling wordt gevonden;
een antwoord verkeerd spellen is geen manier om eronderuit te komen. De tekening
zelf (`js/categories/`) en `docs/oplossingen/` blijven buiten beschouwing.

Geen van beide testbestanden bevat antwoorden.

## Categorieën

| Categorie | Items | Status |
|---|---|---|
| Belgische steden | 10 | speelbaar |

## Structuur

```
index.html                      spelscherm, startscherm, eindscherm
css/style.css                   vormgeving
js/utils.js                     normaliseren, tikfoutafstand, tijdnotatie, opslag
js/engine.js                    spellogica: tijd, antwoordcontrole, hints, records
js/app.js                       schermen, invulboxen, zoomen/slepen, markeringen
js/categories/<naam>.js         één categorie: de items én de tekening   (spoiler)
docs/NIEUWE-CATEGORIE.md        hoe je er een categorie bij maakt
docs/oplossingen/<naam>.md      de oplossing van één categorie           (spoiler)
```

De engine weet niets van een specifiek thema: een categorie levert zijn eigen items én
zijn eigen SVG-tekening aan. Een thema toevoegen is één bestand plus één `<script>`-regel.
Zie `docs/NIEUWE-CATEGORIE.md`.
