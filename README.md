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
| **Invullen** | Tien invulboxen. Typ een antwoord, druk op `Enter`. Volgorde maakt niet uit. Kleine tikfouten worden bij langere namen vergeven; korte namen moeten exact, anders gok je er per ongeluk eentje goed. |
| **Tijd** | Loopt vanaf het verschijnen van de tekening tot het tiende item gevonden is. |
| **Hints** | *Aanwijzing* (+20 s) geeft een cryptische omschrijving, *Toon plek* (+30 s) markeert en zoomt naar de plek, *Geef antwoord* (+60 s) vult het item in. De drie hints gaan over hetzelfde item tot dat opgelost is, zodat ze op elkaar voortbouwen. |
| **Afleiders** | De tekening bevat voorwerpen die nergens naar verwijzen, en bewuste bijna-treffers: twee voorwerpen die sterk op een verborgen item lijken maar niet meetellen. |
| **Einde** | Alle tien plekken worden gemarkeerd, met per item de uitleg van de woordgrap. Je snelste tijd per categorie staat in `localStorage`. |

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
