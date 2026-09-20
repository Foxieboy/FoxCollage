/*
 * Spoilercontrole.
 *
 * De speler is hier ook de opdrachtgever: wie de repo opent om iets na te
 * kijken, mag de oplossing niet tegenkomen. Deze test leest de antwoorden uit
 * de categorieën en zoekt ze in de bestanden die een speler onder ogen krijgt.
 *
 * Vergelijkt op de fonetische sleutel van het spel, niet op de letters: zo
 * worden ook verhaspelingen gevonden - "Cattenbergh" verklapt "Kattenberg"
 * even goed als de juiste spelling.
 *
 * Bewust niet meegenomen: js/categories/ (dat is de tekening zelf) en
 * docs/oplossingen/ (dat is de oplossing, achter een waarschuwing).
 *
 * Gebruik:  node test/spoilers.js
 */
const fs = require('fs');
const path = require('path');

const WORTEL = path.resolve(__dirname, '..');
const TE_CONTROLEREN = ['README.md', 'index.html', 'docs/NIEUWE-CATEGORIE.md',
  'test/spelling.js', 'test/spoilers.js', 'css/style.css', 'js/app.js', 'js/engine.js', 'js/utils.js'];

global.window = {};
require(path.join(WORTEL, 'js/utils.js'));
const Utils = global.window.FoxCollage.Utils;

// Categorieën laden zonder browser.
global.window.FoxCollage.categories = [];
for (const bestand of fs.readdirSync(path.join(WORTEL, 'js/data'))) {
  require(path.join(WORTEL, 'js/data', bestand));
}
for (const bestand of fs.readdirSync(path.join(WORTEL, 'js/categories'))) {
  require(path.join(WORTEL, 'js/categories', bestand));
}

// Gewone Nederlandse woorden die toevallig dezelfde fonetische sleutel hebben
// als een kort antwoord. Alleen woorden die géén antwoordspelling zijn, anders
// zou de lijst de controle zelf uithollen.
const GEWONE_WOORDEN = new Set(['per'].map(w => Utils.normalize(w)));

const antwoorden = new Map();
global.window.FoxCollage.categories.forEach(cat => {
  cat.items.forEach(item => {
    const sleutel = Utils.phoneticKey(item.name);
    if (sleutel.length >= 3) antwoorden.set(sleutel, cat.id);
  });
});

let gevonden = 0;
for (const relatief of TE_CONTROLEREN) {
  const volledig = path.join(WORTEL, relatief);
  if (!fs.existsSync(volledig)) continue;

  const tekst = fs.readFileSync(volledig, 'utf8');
  tekst.split(/\n/).forEach((regel, nr) => {
    (regel.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]{2,}/g) || []).forEach(woord => {
      if (GEWONE_WOORDEN.has(Utils.normalize(woord))) return;
      if (antwoorden.has(Utils.phoneticKey(woord))) {
        // Het verklappende woord zelf niet afdrukken.
        console.log(`  ${relatief}:${nr + 1} bevat een antwoord (of een verhaspeling ervan)`);
        gevonden++;
      }
    });
  });
}

if (gevonden) {
  console.log(`\n${gevonden} spoiler(s) gevonden in bestanden die een speler onder ogen krijgt`);
  process.exit(1);
}
console.log(`geen spoilers in ${TE_CONTROLEREN.length} gecontroleerde bestanden`);
