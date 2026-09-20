/*
 * Test van de spellingtolerantie.
 *
 * Draait het spel in een echte browser en controleert twee dingen:
 *   1. verschrijvingen van een antwoord worden goed gerekend;
 *   2. andere bestaande namen uit het thema worden dat nooit.
 *
 * De testgevallen worden afgeleid uit de categoriegegevens zelf, dus dit
 * bestand bevat geen antwoorden en verklapt niets.
 *
 * Gebruik:  node test/spelling.js
 */
const path = require('path');
const assert = require('assert');

const PLAYWRIGHT = process.env.PLAYWRIGHT_PATH || 'playwright';
const { chromium } = require(PLAYWRIGHT);

/** Maakt geloofwaardige verschrijvingen van een naam. */
function misspellings(naam) {
  const w = naam.toLowerCase();
  const out = new Set();

  for (let i = 0; i < w.length; i++) {
    out.add(w.slice(0, i) + w[i] + w.slice(i));          // letter verdubbeld
    out.add(w.slice(0, i) + w.slice(i + 1));             // letter vergeten
    if (i < w.length - 1) {                              // letters omgewisseld
      out.add(w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2));
    }
  }

  out.add(w.replace(/k/g, 'c'));                         // k als c geschreven
  out.add(w.replace(/c/g, 'k'));
  out.add(w.replace(/ij/g, 'ei')).add(w.replace(/ei/g, 'ij'));
  out.add(w.replace(/t$/, 'd')).add(w.replace(/d$/, 't')); // eind-t als d
  out.add(w.replace(/(.)\1/g, '$1'));                    // dubbele letter vergeten
  out.add(w.toUpperCase());
  out.add(' ' + w + ' ');

  out.delete(w);
  return [...out].filter(v => v.trim().length > 1);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.waitForFunction(() => window.FoxCollage && window.FoxCollage.categories.length);

  const categories = await page.evaluate(() => window.FoxCollage.categories.map(c => c.id));
  let mislukt = 0;

  for (const id of categories) {
    const gegevens = await page.evaluate(cid => {
      const cat = window.FoxCollage.categories.find(c => c.id === cid);
      return {
        naam: cat.name,
        namen: cat.items.map(i => i.name),
        vocabulaire: cat.vocabulary || []
      };
    }, id);

    console.log(`\n=== ${gegevens.naam} ===`);

    // --- 1. verschrijvingen moeten aanvaard worden ---
    let getest = 0, overgeslagen = 0;
    const problemen = [];
    const dubbelzinnig = [];

    for (let index = 0; index < gegevens.namen.length; index++) {
      for (const fout of misspellings(gegevens.namen[index])) {
        const uitslag = await page.evaluate(([cid, idx, invoer]) => {
          const cat = window.FoxCollage.categories.find(c => c.id === cid);
          const spel = new window.FoxCollage.Game(cat);
          const norm = window.FoxCollage.Utils.normalize(invoer);
          // Valt de verschrijving samen met een ándere bestaande naam, dan hoort
          // ze afgewezen te worden: dat is geen tikfout maar een andere plaats.
          const botst = (cat.vocabulary || []).some(n =>
            window.FoxCollage.Utils.normalize(n) === norm &&
            window.FoxCollage.Utils.normalize(cat.items[idx].name) !== norm);
          const r = spel.resolveGuess(invoer);
          return { botst, status: r.status, raak: r.item ? r.item.id : null, doel: cat.items[idx].id };
        }, [id, index, fout]);

        if (uitslag.botst) { overgeslagen++; continue; }
        getest++;

        // 'ambiguous' is geen fout maar een ontworpen uitkomst: de invoer ligt
        // even dicht bij meer dan één antwoord. De speler krijgt dan de vraag
        // om preciezer te typen en dat telt niet als misgok.
        if (uitslag.status === 'ambiguous') { dubbelzinnig.push(fout); continue; }

        if (uitslag.status !== 'match' || uitslag.raak !== uitslag.doel) {
          problemen.push(`${fout} -> ${uitslag.status}`);
        }
      }
    }

    const geslaagd = getest - problemen.length - dubbelzinnig.length;
    console.log(`verschrijvingen aanvaard: ${geslaagd}/${getest}` +
      ` (${(geslaagd / getest * 100).toFixed(1)}%), ${overgeslagen} overgeslagen (bestaande andere naam)`);
    if (dubbelzinnig.length) {
      console.log(`  om precisering gevraagd (${dubbelzinnig.length}, telt niet als misgok):`,
        dubbelzinnig.slice(0, 12).join(' | '));
    }
    if (problemen.length) {
      console.log('  NIET HERKEND:', problemen.slice(0, 12).join(' | '));
      mislukt += problemen.length;
    }

    // Te veel dubbelzinnigheid zou betekenen dat de marge te ruim staat.
    assert.ok(dubbelzinnig.length / getest < 0.05,
      'hooguit een enkele verschrijving mag dubbelzinnig uitvallen');

    // --- 2. elk antwoord hoort gewoon tussen de suggesties te staan ---
    if (gegevens.vocabulaire.length) {
      const ontbrekend = await page.evaluate(cid => {
        const cat = window.FoxCollage.categories.find(c => c.id === cid);
        const U = window.FoxCollage.Utils;
        const lijst = (cat.vocabulary || []).map(U.normalize);
        return cat.items.map(i => i.name).filter(n => lijst.indexOf(U.normalize(n)) === -1);
      }, id);
      console.log(`antwoorden die in de suggestielijst staan: ` +
        `${gegevens.namen.length - ontbrekend.length}/${gegevens.namen.length}`);
      if (ontbrekend.length) {
        // Niet afdrukken wélke: dat zou de oplossing verklappen in de testuitvoer.
        console.log(`  ${ontbrekend.length} antwoord(en) ontbreken in de woordenlijst`);
        mislukt += ontbrekend.length;
      }
      assert.strictEqual(ontbrekend.length, 0,
        'een antwoord dat niet in de woordenlijst staat, ontbreekt ook in de suggesties');
    }

    // --- 3. andere bestaande namen mogen nooit als treffer gelden ---
    const valsePositieven = await page.evaluate(cid => {
      const cat = window.FoxCollage.categories.find(c => c.id === cid);
      const U = window.FoxCollage.Utils;
      const antwoorden = new Set();
      cat.items.forEach(i => [i.name].concat(i.aliases || []).forEach(a => antwoorden.add(U.normalize(a))));

      const spel = new window.FoxCollage.Game(cat);
      return (cat.vocabulary || [])
        .filter(n => !antwoorden.has(U.normalize(n)))
        .filter(n => spel.resolveGuess(n).status === 'match')
        .slice(0, 20);
    }, id);

    const anderen = gegevens.vocabulaire.length;
    console.log(`andere namen uit het thema afgewezen: ${anderen - valsePositieven.length}/${anderen}`);
    if (valsePositieven.length) {
      console.log('  TEN ONRECHTE AANVAARD:', valsePositieven.join(', '));
      mislukt += valsePositieven.length;
    }
    assert.strictEqual(valsePositieven.length, 0, 'geen enkele andere naam mag als antwoord gelden');
  }

  await browser.close();
  console.log(mislukt ? `\n${mislukt} probleem/problemen` : '\nspellingcontrole in orde');
  process.exit(mislukt ? 1 : 0);
})();
