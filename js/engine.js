/* FoxCollage - spellogica: tijd, antwoordcontrole, hints, records. */
(function (root) {
  'use strict';

  var Utils = root.FoxCollage.Utils;

  var HINT_COSTS = {
    clue: 20000,   // cryptische omschrijving van een nog niet gevonden item
    locate: 30000, // markeer de plek in de tekening
    solve: 60000   // geef het antwoord meteen
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
        clue: item.clue,
        explanation: item.explanation,
        focus: item.focus,
        found: false,
        foundWithHint: false,
        clueShown: false,
        located: false
      };
    });

    this.startedAt = null;
    this.finishedAt = null;
    this.penaltyMs = 0;
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
   * @returns {{status:string, item:?object}} status: correct | duplicate | wrong | empty
   */
  Game.prototype.guess = function (text) {
    if (!this.isRunning()) return { status: 'wrong', item: null };

    var guess = Utils.normalize(text);
    if (!guess) return { status: 'empty', item: null };

    var match = this.matchItem(guess);
    if (!match) {
      this.wrongGuesses++;
      this.emit({ type: 'wrong', guess: text });
      return { status: 'wrong', item: null };
    }
    if (match.found) {
      this.emit({ type: 'duplicate', item: match });
      return { status: 'duplicate', item: match };
    }

    match.found = true;
    if (this.focusItemId === match.id) this.focusItemId = null;
    this.emit({ type: 'found', item: match });
    this.checkCompletion();
    return { status: 'correct', item: match };
  };

  Game.prototype.matchItem = function (normalizedGuess) {
    var i, j;
    // Eerst een exacte treffer, zodat een tikfout nooit een ander item kaapt.
    for (i = 0; i < this.items.length; i++) {
      for (j = 0; j < this.items[i].answers.length; j++) {
        if (this.items[i].answers[j] === normalizedGuess) return this.items[i];
      }
    }
    for (i = 0; i < this.items.length; i++) {
      for (j = 0; j < this.items[i].answers.length; j++) {
        var answer = this.items[i].answers[j];
        var budget = Math.min(Utils.allowedTypos(answer), Utils.allowedTypos(normalizedGuess));
        if (budget > 0 && Utils.levenshtein(answer, normalizedGuess) <= budget) {
          return this.items[i];
        }
      }
    }
    return null;
  };

  /**
   * Vraagt een hint. De drie hinttypes werken samen: ze gaan over hetzelfde
   * item tot dat item gevonden (of prijsgegeven) is.
   * @param {string} type - clue | locate | solve
   */
  Game.prototype.useHint = function (type) {
    if (!this.isRunning()) return null;
    if (!HINT_COSTS.hasOwnProperty(type)) return null;

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
