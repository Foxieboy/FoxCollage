# Een categorie toevoegen

Een categorie is één bestand in `js/categories/` dat zichzelf aanmeldt bij het spel.
De engine hoeft niet aangepast te worden.

## 1. Kies tien uitbeeldbare items

Dit is het echte werk, en het bepaalt of het spel leuk is. Een item deugt als het woord
**een tweede betekenis heeft of uit tekenbare delen bestaat**. De voorbeelden hieronder zijn
verzonnen, zodat deze handleiding geen enkel bestaand spel verklapt:

* tweede betekenis: een naam die óók een dier, een vrucht, een voorwerp of een beroep is —
  je tekent dat ding, niet de plaats
* samenstelling: een naam die uiteenvalt in twee tekenbare delen (*Kattenberg* → een kat
  op een berg)
* andere taal mag: als de naam in het Frans of het Engels iets tekenbaars betekent, telt dat
  ook — zet die vorm dan bij `aliases`, zodat beide antwoorden goed gerekend worden

Valt af: alles wat je niet kunt tekenen zonder de naam op te schrijven. Vuistregel: als een
testlezer het voorwerp benoemt zonder de naam te kennen, en die benoeming klinkt als de naam,
dan deugt het item.

Kies er daarnaast tien tot twintig **afleiders**: gewone voorwerpen die nergens naar
verwijzen. Maak er minstens twee die sterk lijken op een verborgen item, maar het net niet
zijn — een ander instrument uit dezelfde familie, een andere vrucht uit dezelfde boom.
Die twijfel maakt het spel.

Hou ze ongeveer in evenwicht met het aantal items: met tien items en zestien afleiders kost
het leegruimen van de hele plaat 160 seconden straftijd, en dat hoort een slechte ruil te
zijn tegenover gewoon verder zoeken. Veel minder afleiders maakt die hint te goedkoop.

## 1b. Hou het spoilervrij

De speler is vaak de opdrachtgever zelf. Noem daarom **geen enkel antwoord** in de README, in
commitboodschappen, in de tekst op het startscherm of in de `intro` van de categorie. De
oplossing hoort in `docs/oplossingen/<categorie>.md`, achter een `<details>`-blok en een
waarschuwing.

## 2. Maak het bestand

```js
(function (root) {
  'use strict';

  function buildScene() {
    // Geeft de binnenkant van de <svg> terug als string.
    // Elk verborgen item krijgt een eigen groep:
    //   <g class="hidden-item" data-item="kattenberg" transform="translate(x,y)"> ... </g>
    // Afleiders krijgen class="decoy" - de hint "haal iets weg" zoekt op die
    //   class, dus een vergeten class maakt het voorwerp onwegneembaar.
    //   Zet die class alleen op losse voorwerpen, niet op decor (lucht, huizen,
    //   bomen, wegen): decor hoort altijd te blijven staan.
    // Eindig met <g id="fc-markers"></g>: daarin tekent het spel zijn markeringen.
    return '<rect width="1200" height="800" fill="#bfe3f5"/>' +
           /* ... */
           '<g id="fc-markers"></g>';
  }

  var category = {
    id: 'mijn-thema',              // uniek; wordt de sleutel van het record
    name: 'Mijn thema',
    tagline: 'Eén regel voor op de categoriekaart.',
    intro: 'Eén regel die tijdens het spel bovenaan staat.',
    viewBox: '0 0 1200 800',
    buildScene: buildScene,
    items: [{
      id: 'kattenberg',
      name: 'Kattenberg',          // het antwoord zoals het getoond wordt (verzonnen)
      aliases: ['katteberg'],      // wat ook goed gerekend wordt
      clue: 'Cryptische omschrijving voor de hint van +20 s.',
      explanation: 'Uitleg van de woordgrap, te zien na afloop.',
      focus: { x: 640, y: 650, r: 100 }   // middelpunt + straal van de markering
    }
    /* ... negen andere ... */]
  };

  root.FoxCollage = root.FoxCollage || {};
  root.FoxCollage.categories = root.FoxCollage.categories || [];
  root.FoxCollage.categories.push(category);
})(window);
```

Voeg het bestand toe in `index.html`, vóór `js/app.js`:

```html
<script src="js/categories/mijn-thema.js"></script>
```

De categoriekaart verschijnt dan vanzelf op het startscherm.

## 3. Let op bij het tekenen

* **Coördinaten**: alles in het `viewBox`-raster (1200 × 800 werkt goed). De tekening
  schaalt mee met het scherm; de speler kan zoomen en slepen.
* **Overlap**: teken items nooit boven elkaar. Een afleider die half over een verborgen
  item valt, maakt dat item onherkenbaar. Controleer met een screenshot, niet op het oog
  in de code.
* **Grondlijn**: geef elk voorwerp een schaduw-ellips en zet het op een geloofwaardige
  plek, anders lijkt het te zweven.
* **`focus`** hoort het item te omvatten maar niet de halve tekening: die cirkel is wat
  de speler bij een hint van +30 s te zien krijgt, en wat na afloop de oplossing markeert.
* **Formaat**: maak de items ongeveer even groot en even opvallend. Eén item dat veel
  kleiner is dan de rest, wordt altijd het laatste — en dat voelt onterecht.
