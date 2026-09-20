/* FoxCollage - spellogica: tijd, antwoordcontrole, hints, records. */
(function (root) {
  'use strict';

  var Utils = root.FoxCollage.Utils;

  var HINT_COSTS = {
    declutter: 10000, // haal één ongerelateerd voorwerp uit de tekening
    clue: 20000,      // cryptische omschrijving van een nog niet gevonden item
    locate: 30000,    // markeer de plek in de tekening
    solve: 60000      // geef het antwoord meteen
  };

  var RECORD_KEY = 'foxcollage.records.v1';

  /**
   * @param {object} category - categorie-definitie (zie js/categories/)
   */
  function Game(category) {
    this.category = category;
    this.items = category.items.map(function (item) {
      return {
        id: item.id,
        name: item.name,
        answers: [item.name].concat(item.aliases || []).map(Utils.normalize),
        keys: [item.name].concat(item.aliases || []).map(Utils.phoneticKey),
        clue: item.clue,
        explanation: item.explanation,
        focus: item.focus,
        found: false,
        foundWithHint: false,
        clueShown: false,
        located: false
      };
    });

    // Woordenlijst van de categorie: alle namen die in dit thema bestaan, niet
    // enkel de tien antwoorden. Wie een andere bestaande naam typt, heeft geen
    // tikfout gemaakt maar een ander ding bedoeld - dat mag nooit als treffer
    // gelden. Ontbreekt de lijst, dan valt de controle terug op de spelling.
    this.vocabulary = {};
    (category.vocabulary || []).forEach(function (naam) {
      this.vocabulary[Utils.normalize(naam)] = true;
    }, this);

    this.startedAt = null;
    this.finishedAt = null;
    this.penaltyMs = 0;
    this.decoyTotal = 0;    // aantal afleiders in de tekening, geteld door de ui
    this.decoysRemoved = 0;
    this.hintsUsed = 0;
    this.wrongGuesses = 0;
    this.focusItemId = null; // item waar de hints momenteel over gaan
    this.listeners = [];
  }

  Game.prototype.on = function (callback) {
    this.listeners.push(callback);
  };

  Game.prototype.emit = function (event) {
    var self = this;
    this.listeners.forEach(function (cb) {
      cb(event, self);
    });
  };

  /** De ui telt de afleiders in de tekening, zodat kunst en logica niet uiteen kunnen lopen. */
  Game.prototype.setDecoyCount = function (count) {
    this.decoyTotal = count;
  };

  Game.prototype.decoysLeft = function () {
    return Math.max(0, this.decoyTotal - this.decoysRemoved);
  };

  Game.prototype.start = function () {
    this.startedAt = Date.now();
    this.finishedAt = null;
    this.emit({ type: 'start' });
  };

  Game.prototype.isRunning = function () {
    return this.startedAt !== null && this.finishedAt === null;
  };

  /** Verstreken tijd inclusief de tijdstraffen van gebruikte hints. */
  Game.prototype.elapsedMs = function () {
    if (this.startedAt === null) return 0;
    var end = this.finishedAt === null ? Date.now() : this.finishedAt;
    return end - this.startedAt + this.penaltyMs;
  };

  Game.prototype.foundCount = function () {
    return this.items.filter(function (item) {
      return item.found;
    }).length;
  };

  Game.prototype.remaining = function () {
    return this.items.filter(function (item) {
      return !item.found;
    });
  };

  Game.prototype.getItem = function (id) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) return this.items[i];
    }
    return null;
  };

  /**
   * Controleert een ingetypt antwoord.
   * @returns {{status:string, item:?object, corrected:boolean}}
   *          status: correct | duplicate | ambiguous | wrong | empty
   */
  Game.prototype.guess = function (text) {
    if (!this.isRunning()) return { status: 'wrong', item: null };

    var resolved = this.resolveGuess(text);

    if (resolved.status === 'empty') return { status: 'empty', item: null };

    if (resolved.status === 'ambiguous') {
      // Geen fout: de speler zat er dicht bij, maar bij meer dan één antwoord.
      this.emit({ type: 'ambiguous', guess: text });
      return { status: 'ambiguous', item: null };
    }

    if (resolved.status === 'miss') {
      this.wrongGuesses++;
      this.emit({ type: 'wrong', guess: text });
      return { status: 'wrong', item: null };
    }

    var match = resolved.item;
    if (match.found) {
      this.emit({ type: 'duplicate', item: match });
      return { status: 'duplicate', item: match };
    }

    match.found = true;
    if (this.focusItemId === match.id) this.focusItemId = null;
    this.emit({ type: 'found', item: match });
    this.checkCompletion();
    return { status: 'correct', item: match, corrected: resolved.corrected === true };
  };

  /**
   * Zoekt het bedoelde item in vier lagen, van streng naar mild. De volgorde is
   * het hele punt: pas als een strengere laag niets oplevert, mag de volgende
   * milder zijn.
   *
   *   1. exact wat er staat (naam of alias)
   *   2. staat het in de woordenlijst? dan bedoelde de speler iets anders
   *   3. klinkt het hetzelfde (fonetische sleutel)
   *   4. ligt het binnen de tikfoutmarge
   *
   * Past laag 3 of 4 op meer dan één item, dan geven we niets weg: de speler
   * krijgt de vraag om preciezer te typen.
   */
  Game.prototype.resolveGuess = function (text) {
    var guess = Utils.normalize(text);
    if (!guess) return { status: 'empty' };

    var key = Utils.phoneticKey(text);
    var self = this;

    var exact = this.items.filter(function (item) {
      return item.answers.indexOf(guess) !== -1;
    });
    if (exact.length) return { status: 'match', item: exact[0], corrected: false };

    // Een bestaande naam uit dit thema die geen antwoord is: bewust getypt,
    // dus geen tikfout. Zonder deze stap zou een buurgemeente als treffer gelden.
    if (this.vocabulary[guess]) return { status: 'miss' };

    var sameSound = this.items.filter(function (item) {
      return key && item.keys.indexOf(key) !== -1;
    });
    if (sameSound.length === 1) return { status: 'match', item: sameSound[0], corrected: true };
    if (sameSound.length > 1) return { status: 'ambiguous' };

    var near = this.items.filter(function (item) {
      return self.isNearMiss(item, guess, key);
    });
    if (near.length === 1) return { status: 'match', item: near[0], corrected: true };
    if (near.length > 1) return { status: 'ambiguous' };

    return { status: 'miss' };
  };

  /** Ligt de gok binnen de tikfoutmarge van dit item, geschreven of klinkend? */
  Game.prototype.isNearMiss = function (item, guess, key) {
    var forms = [[item.answers, guess], [item.keys, key]];

    for (var f = 0; f < forms.length; f++) {
      var lijst = forms[f][0];
      var invoer = forms[f][1];
      if (!invoer) continue;

      for (var i = 0; i < lijst.length; i++) {
        var vorm = lijst[i];
        if (!vorm) continue;
        var budget = Utils.typoBudget(Math.max(vorm.length, invoer.length));
        if (Utils.editDistance(vorm, invoer) <= budget && Utils.plausibleTypo(vorm, invoer)) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Vraagt een hint. De drie hinttypes werken samen: ze gaan over hetzelfde
   * item tot dat item gevonden (of prijsgegeven) is.
   * @param {string} type - clue | locate | solve
   */
  Game.prototype.useHint = function (type) {
    if (!this.isRunning()) return null;
    if (!HINT_COSTS.hasOwnProperty(type)) return null;
    if (type === 'declutter') return this.removeDecoy();

    var target = this.focusItemId ? this.getItem(this.focusItemId) : null;
    if (!target || target.found) target = this.pickHintTarget();
    if (!target) return null;

    // Niet twee keer betalen voor dezelfde aanwijzing.
    if (type === 'clue' && target.clueShown) {
      var alternative = this.pickHintTarget(target.id, 'clue');
      if (alternative) target = alternative;
    } else if (type === 'locate' && target.located) {
      var other = this.pickHintTarget(target.id, 'locate');
      if (other) target = other;
    }

    this.penaltyMs += HINT_COSTS[type];
    this.hintsUsed++;
    this.focusItemId = target.id;

    var result = { type: type, item: target, penalty: HINT_COSTS[type], text: '' };

    if (type === 'clue') {
      target.clueShown = true;
      result.text = target.clue;
    } else if (type === 'locate') {
      target.located = true;
      result.text = 'Er zit er één op de gemarkeerde plek in de tekening.';
    } else {
      target.found = true;
      target.foundWithHint = true;
      this.focusItemId = null;
      result.text = target.name;
    }

    this.emit({ type: 'hint', hint: result });
    if (type === 'solve') this.checkCompletion();
    return result;
  };

  /**
   * Haalt één ongerelateerd voorwerp uit de tekening. Helpt het zwakst van alle
   * hints - het versmalt enkel de zoekruimte - en kost daarom het minst.
   */
  Game.prototype.removeDecoy = function () {
    if (this.decoysLeft() <= 0) return null;

    this.penaltyMs += HINT_COSTS.declutter;
    this.hintsUsed++;
    this.decoysRemoved++;

    var left = this.decoysLeft();
    var result = {
      type: 'declutter',
      item: null,
      penalty: HINT_COSTS.declutter,
      remaining: left,
      text: left
        ? 'Eén voorwerp dat nergens naar verwijst is verdwenen. Er staan er nog ' + left + '.'
        : 'Het laatste ongerelateerde voorwerp is verdwenen: alles wat overblijft telt mee.'
    };

    this.emit({ type: 'hint', hint: result });
    return result;
  };

  /** Kiest een nog niet gevonden item, bij voorkeur eentje zonder eerdere hint. */
  Game.prototype.pickHintTarget = function (excludeId, avoidFlag) {
    var open = this.remaining().filter(function (item) {
      return item.id !== excludeId;
    });
    if (!open.length) return null;

    var fresh = open.filter(function (item) {
      if (avoidFlag === 'clue') return !item.clueShown;
      if (avoidFlag === 'locate') return !item.located;
      return !item.clueShown && !item.located;
    });
    var pool = fresh.length ? fresh : open;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  Game.prototype.checkCompletion = function () {
    if (this.remaining().length === 0) this.finish('completed');
  };

  Game.prototype.finish = function (reason) {
    if (this.finishedAt !== null) return null;
    this.finishedAt = Date.now();

    var result = {
      reason: reason || 'completed',
      timeMs: this.elapsedMs(),
      penaltyMs: this.penaltyMs,
      hintsUsed: this.hintsUsed,
      wrongGuesses: this.wrongGuesses,
      found: this.foundCount(),
      total: this.items.length,
      solvedUnaided: this.items.filter(function (item) {
        return item.found && !item.foundWithHint;
      }).length,
      record: null
    };

    if (result.reason === 'completed') {
      result.record = Game.saveRecord(this.category.id, result.timeMs, this.hintsUsed);
    }

    this.emit({ type: 'finish', result: result });
    return result;
  };

  /** @returns {{best:number, isNew:boolean}} */
  Game.saveRecord = function (categoryId, timeMs, hintsUsed) {
    var records = Utils.storage.read(RECORD_KEY, {});
    var previous = records[categoryId];
    var isNew = !previous || timeMs < previous.timeMs;

    if (isNew) {
      records[categoryId] = { timeMs: timeMs, hintsUsed: hintsUsed, date: new Date().toISOString() };
      Utils.storage.write(RECORD_KEY, records);
    }
    return { best: isNew ? timeMs : previous.timeMs, isNew: isNew };
  };

  Game.getRecord = function (categoryId) {
    var records = Utils.storage.read(RECORD_KEY, {});
    return records[categoryId] || null;
  };

  Game.HINT_COSTS = HINT_COSTS;

  root.FoxCollage.Game = Game;
})(window);
