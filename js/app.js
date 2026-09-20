/* FoxCollage - schermen, invulboxen, tekening en interactie. */
(function (root, doc) {
  'use strict';

  var Utils = root.FoxCollage.Utils;
  var Game = root.FoxCollage.Game;

  var state = {
    game: null,
    category: null,
    view: null,     // huidige viewBox {x,y,w,h}
    base: null,     // oorspronkelijke viewBox
    ticker: null,
    drag: null
  };

  var el = {};

  function $(id) {
    return doc.getElementById(id);
  }

  function init() {
    el.screens = {
      home: $('screen-home'),
      game: $('screen-game'),
      result: $('screen-result')
    };
    el.categoryList = $('category-list');
    el.stage = $('stage');
    el.slots = $('slots');
    el.timer = $('timer');
    el.progress = $('progress');
    el.penalty = $('penalty');
    el.categoryName = $('game-category');
    el.message = $('message');
    el.hintLog = $('hint-log');
    el.resultBody = $('result-body');

    renderCategories();
    bindControls();
    showScreen('home');
  }

  /* ------------------------------------------------------------------ */
  /* Startscherm                                                         */
  /* ------------------------------------------------------------------ */

  function renderCategories() {
    var categories = root.FoxCollage.categories || [];
    el.categoryList.innerHTML = '';

    categories.forEach(function (category) {
      var record = Game.getRecord(category.id);
      var card = doc.createElement('button');
      card.className = 'category-card';
      card.type = 'button';
      card.innerHTML =
        '<span class="category-card__name">' + Utils.escapeHtml(category.name) + '</span>' +
        '<span class="category-card__tagline">' + Utils.escapeHtml(category.tagline) + '</span>' +
        '<span class="category-card__meta">' +
        '<span class="pill">' + category.items.length + ' verborgen items</span>' +
        (record ? '<span class="pill pill--record">record ' + Utils.formatTimeShort(record.timeMs) + '</span>' : '') +
        '</span>';
      card.addEventListener('click', function () {
        startGame(category);
      });
      el.categoryList.appendChild(card);
    });

    if (!categories.length) {
      el.categoryList.innerHTML = '<p class="empty">Nog geen categorieën geladen.</p>';
    }
  }

  /* ------------------------------------------------------------------ */
  /* Spel starten                                                        */
  /* ------------------------------------------------------------------ */

  function startGame(category) {
    state.category = category;
    state.game = new Game(category);
    state.game.on(onGameEvent);

    el.categoryName.textContent = category.name;
    $('game-intro').textContent = category.intro;

    renderScene(category);
    state.game.setDecoyCount(el.svg.querySelectorAll('.decoy').length);
    renderSuggestions(category.vocabulary);
    renderSlots(category.items.length);
    el.hintLog.innerHTML = '';
    setMessage('');
    updateHud();

    showScreen('game');
    state.game.start();
    startTicker();

    var first = el.slots.querySelector('input');
    if (first) first.focus();
  }

  function renderScene(category) {
    var viewBox = category.viewBox || '0 0 1200 800';
    var parts = viewBox.split(/\s+/).map(Number);
    state.base = { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
    state.view = { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };

    el.stage.innerHTML =
      '<svg id="collage" xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" ' +
      'preserveAspectRatio="xMidYMid meet" role="img" ' +
      'aria-label="Zoekplaat met tien verborgen items">' + category.buildScene() + '</svg>';

    el.svg = $('collage');
    el.markers = el.svg.querySelector('#fc-markers');
    bindPanZoom();
  }

  /**
   * Vult de suggestielijst waar de invulboxen aan hangen. Bevat alle namen van
   * het thema, niet enkel de antwoorden - anders zou de lijst het spel verraden.
   */
  function renderSuggestions(vocabulary) {
    var lijst = $('fc-woordenlijst');
    lijst.innerHTML = '';
    if (!vocabulary || !vocabulary.length) {
      state.hasSuggestions = false;
      return;
    }

    var fragment = doc.createDocumentFragment();
    vocabulary.forEach(function (naam) {
      var optie = doc.createElement('option');
      optie.value = naam;
      fragment.appendChild(optie);
    });
    lijst.appendChild(fragment);
    state.hasSuggestions = true;
  }

  function renderSlots(count) {
    el.slots.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var slot = doc.createElement('li');
      slot.className = 'slot';
      slot.innerHTML =
        '<span class="slot__number">' + (i + 1) + '</span>' +
        '<input class="slot__input" type="text" autocomplete="off" autocapitalize="off" ' +
        'spellcheck="false" placeholder="typ hier je antwoord" aria-label="Antwoord ' + (i + 1) + '"' +
        (state.hasSuggestions ? ' list="fc-woordenlijst"' : '') + '>' +
        '<span class="slot__note"></span>';
      el.slots.appendChild(slot);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Antwoorden                                                          */
  /* ------------------------------------------------------------------ */

  function onSlotKeydown(event) {
    if (event.key !== 'Enter') return;
    var input = event.target;
    if (!input.classList || !input.classList.contains('slot__input')) return;
    event.preventDefault();
    submit(input);
  }

  function submit(input) {
    if (!state.game || !state.game.isRunning()) return;

    var result = state.game.guess(input.value);
    var slot = input.closest('.slot');

    if (result.status === 'empty') return;

    if (result.status === 'correct') {
      lockSlot(slot, result.item);
      setMessage(result.corrected
        ? 'Juist! We lezen dit als ' + result.item.name + '.'
        : 'Juist! ' + result.item.name + ' gevonden.', 'good');
      focusNextEmptySlot();
      return;
    }

    if (result.status === 'ambiguous') {
      // Telt niet als fout: de speler zit dicht bij meer dan één antwoord, en
      // welke dat zijn verklappen we niet.
      flash(slot, 'warn');
      setMessage('Dit lijkt op meer dan één antwoord. Typ het iets preciezer.', 'warn');
      input.select();
      return;
    }

    if (result.status === 'duplicate') {
      flash(slot, 'warn');
      setMessage(result.item.name + ' had je al ingevuld.', 'warn');
      input.select();
      return;
    }

    flash(slot, 'bad');
    setMessage('"' + input.value.trim() + '" zit niet in de tekening.', 'bad');
    input.select();
  }

  function lockSlot(slot, item) {
    var input = slot.querySelector('.slot__input');
    input.value = item.name;
    input.readOnly = true;
    input.tabIndex = -1;
    slot.classList.remove('is-wrong');
    slot.classList.add('is-found');
    if (item.foundWithHint) slot.classList.add('is-hinted');
    slot.querySelector('.slot__note').textContent = item.explanation;
  }

  function firstEmptySlot() {
    var inputs = el.slots.querySelectorAll('.slot__input');
    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i].readOnly) return inputs[i];
    }
    return null;
  }

  function focusNextEmptySlot() {
    var next = firstEmptySlot();
    if (next) next.focus();
  }

  function flash(slot, kind) {
    slot.classList.remove('is-wrong', 'is-warn');
    // reflow forceren zodat de animatie opnieuw start bij snel achter elkaar typen
    void slot.offsetWidth;
    slot.classList.add(kind === 'warn' ? 'is-warn' : 'is-wrong');
    setTimeout(function () {
      slot.classList.remove('is-wrong', 'is-warn');
    }, 600);
  }

  function setMessage(text, kind) {
    el.message.textContent = text;
    el.message.className = 'message' + (kind ? ' message--' + kind : '');
  }

  /* ------------------------------------------------------------------ */
  /* Hints                                                               */
  /* ------------------------------------------------------------------ */

  function requestHint(type) {
    if (!state.game || !state.game.isRunning()) return;

    var hint = state.game.useHint(type);
    if (!hint) {
      setMessage(type === 'declutter'
        ? 'Alle ongerelateerde voorwerpen zijn al weg.'
        : 'Er is niets meer om een hint over te geven.', 'warn');
      return;
    }

    var seconds = Math.round(hint.penalty / 1000);
    var label = { declutter: 'Voorwerp weg', clue: 'Aanwijzing', locate: 'Plek', solve: 'Antwoord' }[type];
    var entry = doc.createElement('li');
    entry.className = 'hint-log__item';
    entry.innerHTML = '<strong>' + label + ' (+' + seconds + ' s):</strong> ' + Utils.escapeHtml(hint.text);
    el.hintLog.appendChild(entry);
    el.hintLog.scrollTop = el.hintLog.scrollHeight;

    if (type === 'declutter') removeRandomDecoy();

    if (type === 'locate') {
      markItem(hint.item, { pulse: true });
      focusOn(hint.item.focus);
    }

    if (type === 'solve') {
      var slot = firstEmptySlot();
      if (slot) lockSlot(slot.closest('.slot'), hint.item);
      markItem(hint.item, {});
      focusNextEmptySlot();
    }

    setMessage(label + ' gebruikt: +' + seconds + ' seconden.', 'warn');
    updateHud();
  }

  /**
   * Laat één afleider verdwijnen. Kiest bij voorkeur een voorwerp dat de speler
   * op dat moment in beeld heeft, anders ziet hij zijn straftijd niet gebeuren.
   */
  function removeRandomDecoy() {
    var pool = Array.prototype.slice.call(el.svg.querySelectorAll('.decoy:not(.is-removing)'));
    if (!pool.length) return;

    var inBeeld = pool.filter(isInViewport);
    var keuze = inBeeld.length ? inBeeld : pool;
    var target = keuze[Math.floor(Math.random() * keuze.length)];

    target.classList.add('is-removing');
    setTimeout(function () {
      if (target.parentNode) target.parentNode.removeChild(target);
    }, 700);
  }

  function isInViewport(node) {
    var box = node.getBoundingClientRect();
    var stage = el.svg.getBoundingClientRect();
    return box.width > 0 && box.right > stage.left && box.left < stage.right &&
      box.bottom > stage.top && box.top < stage.bottom;
  }

  /* ------------------------------------------------------------------ */
  /* Markeringen in de tekening                                          */
  /* ------------------------------------------------------------------ */

  function markItem(item, opts) {
    if (!el.markers || !item.focus) return;
    var options = opts || {};
    var existing = el.markers.querySelector('[data-marker="' + item.id + '"]');
    if (existing) existing.parentNode.removeChild(existing);

    var group = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('data-marker', item.id);
    group.setAttribute('class', 'fc-marker' + (options.pulse ? ' fc-marker--pulse' : ''));

    var circle = doc.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', item.focus.x);
    circle.setAttribute('cy', item.focus.y);
    circle.setAttribute('r', item.focus.r);
    group.appendChild(circle);

    if (options.label) {
      var label = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', item.focus.x);
      label.setAttribute('y', item.focus.y - item.focus.r - 12);
      label.setAttribute('class', 'fc-marker__label');
      label.setAttribute('text-anchor', 'middle');
      label.textContent = options.label;
      group.appendChild(label);
    }

    el.markers.appendChild(group);
  }

  function revealAll() {
    if (!state.game) return;
    resetView();
    state.game.items.forEach(function (item) {
      markItem(item, { label: item.name });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Zoomen en verschuiven                                               */
  /* ------------------------------------------------------------------ */

  function applyView() {
    if (!el.svg || !state.view) return;
    el.svg.setAttribute('viewBox', state.view.x + ' ' + state.view.y + ' ' + state.view.w + ' ' + state.view.h);
  }

  function clampView() {
    var base = state.base;
    var view = state.view;
    var minW = base.w * 0.2;
    view.w = Math.min(base.w, Math.max(minW, view.w));
    view.h = view.w * (base.h / base.w);
    view.x = Math.min(base.x + base.w - view.w, Math.max(base.x, view.x));
    view.y = Math.min(base.y + base.h - view.h, Math.max(base.y, view.y));
  }

  function zoomBy(factor, centerX, centerY) {
    var view = state.view;
    var cx = centerX == null ? view.x + view.w / 2 : centerX;
    var cy = centerY == null ? view.y + view.h / 2 : centerY;
    var ratioX = (cx - view.x) / view.w;
    var ratioY = (cy - view.y) / view.h;

    view.w = view.w / factor;
    view.h = view.w * (state.base.h / state.base.w);
    view.x = cx - ratioX * view.w;
    view.y = cy - ratioY * view.h;

    clampView();
    applyView();
  }

  function resetView() {
    state.view = { x: state.base.x, y: state.base.y, w: state.base.w, h: state.base.h };
    applyView();
  }

  /** Zoomt naar een item toe zonder het weg te geven met een animatie. */
  function focusOn(focus) {
    if (!focus) return;
    var zoom = Math.max(focus.r * 5, state.base.w * 0.34);
    state.view.w = Math.min(state.base.w, zoom);
    state.view.h = state.view.w * (state.base.h / state.base.w);
    state.view.x = focus.x - state.view.w / 2;
    state.view.y = focus.y - state.view.h / 2;
    clampView();
    applyView();
  }

  /** Muis-/vingerpositie omrekenen naar coördinaten in de tekening. */
  function toSceneCoords(event) {
    var rect = el.svg.getBoundingClientRect();
    var scale = Math.min(rect.width / state.view.w, rect.height / state.view.h);
    var drawnW = state.view.w * scale;
    var drawnH = state.view.h * scale;
    var offsetX = rect.left + (rect.width - drawnW) / 2;
    var offsetY = rect.top + (rect.height - drawnH) / 2;
    return {
      x: state.view.x + (event.clientX - offsetX) / scale,
      y: state.view.y + (event.clientY - offsetY) / scale,
      scale: scale
    };
  }

  function bindPanZoom() {
    el.svg.addEventListener('wheel', function (event) {
      event.preventDefault();
      var point = toSceneCoords(event);
      zoomBy(event.deltaY < 0 ? 1.18 : 1 / 1.18, point.x, point.y);
    }, { passive: false });

    el.svg.addEventListener('pointerdown', function (event) {
      var point = toSceneCoords(event);
      state.drag = { x: point.x, y: point.y, scale: point.scale, id: event.pointerId };
      el.svg.setPointerCapture(event.pointerId);
      el.svg.classList.add('is-dragging');
    });

    el.svg.addEventListener('pointermove', function (event) {
      if (!state.drag || state.drag.id !== event.pointerId) return;
      var rect = el.svg.getBoundingClientRect();
      var scale = Math.min(rect.width / state.view.w, rect.height / state.view.h);
      state.view.x -= event.movementX / scale;
      state.view.y -= event.movementY / scale;
      clampView();
      applyView();
    });

    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (name) {
      el.svg.addEventListener(name, function () {
        state.drag = null;
        el.svg.classList.remove('is-dragging');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* HUD en tijd                                                         */
  /* ------------------------------------------------------------------ */

  function startTicker() {
    stopTicker();
    state.ticker = setInterval(function () {
      if (state.game && state.game.isRunning()) el.timer.textContent = Utils.formatTime(state.game.elapsedMs());
    }, 100);
  }

  function stopTicker() {
    if (state.ticker) clearInterval(state.ticker);
    state.ticker = null;
  }

  function updateHud() {
    if (!state.game) return;
    el.timer.textContent = Utils.formatTime(state.game.elapsedMs());
    el.progress.textContent = state.game.foundCount() + ' / ' + state.game.items.length;
    el.penalty.textContent = state.game.penaltyMs ? '+' + Math.round(state.game.penaltyMs / 1000) + ' s straftijd' : '';

    var declutter = $('hint-declutter');
    var left = state.game.decoysLeft();
    declutter.disabled = left <= 0;
    declutter.title = left + ' ongerelateerde voorwerpen over';
  }

  function onGameEvent(event, game) {
    if (event.type === 'found' || event.type === 'hint') updateHud();
    if (event.type === 'finish') onFinish(event.result, game);
  }

  /* ------------------------------------------------------------------ */
  /* Einde                                                               */
  /* ------------------------------------------------------------------ */

  function onFinish(result, game) {
    stopTicker();
    updateHud();
    revealAll();

    var rows = game.items.map(function (item, index) {
      var status = item.found && !item.foundWithHint ? 'zelf gevonden'
        : item.found ? 'via hint'
        : 'niet gevonden';
      var cls = item.found && !item.foundWithHint ? 'ok' : item.found ? 'hint' : 'miss';
      return '<li class="result-item result-item--' + cls + '">' +
        '<span class="result-item__index">' + (index + 1) + '</span>' +
        '<span class="result-item__body"><strong>' + Utils.escapeHtml(item.name) + '</strong>' +
        '<span class="result-item__explanation">' + Utils.escapeHtml(item.explanation) + '</span></span>' +
        '<span class="result-item__status">' + status + '</span></li>';
    }).join('');

    var headline = result.reason === 'completed'
      ? (result.solvedUnaided === result.total ? 'Alles gevonden, zonder hints!' : 'Alles gevonden!')
      : 'Opgegeven na ' + result.found + ' van de ' + result.total + '.';

    var recordLine = '';
    if (result.record) {
      recordLine = result.record.isNew
        ? '<p class="result-record">Nieuw persoonlijk record.</p>'
        : '<p class="result-record">Je record blijft ' + Utils.formatTimeShort(result.record.best) + '.</p>';
    }

    el.resultBody.innerHTML =
      '<h2>' + headline + '</h2>' +
      '<p class="result-time">' + Utils.formatTime(result.timeMs) + '</p>' +
      '<p class="result-breakdown">' +
      'waarvan ' + Math.round(result.penaltyMs / 1000) + ' s straftijd &middot; ' +
      result.hintsUsed + ' hint(s) &middot; ' +
      result.wrongGuesses + ' foute gok(ken)</p>' +
      recordLine +
      '<ol class="result-list">' + rows + '</ol>';

    showScreen('result');
  }

  /* ------------------------------------------------------------------ */
  /* Navigatie                                                           */
  /* ------------------------------------------------------------------ */

  function showScreen(name) {
    Object.keys(el.screens).forEach(function (key) {
      el.screens[key].hidden = key !== name;
    });
    // Het resultaat ligt als overlay boven het spelscherm.
    if (name === 'result') el.screens.game.hidden = false;
  }

  function bindControls() {
    // Eén luisteraar op de lijst; de invulboxen zelf worden per spel vervangen.
    el.slots.addEventListener('keydown', onSlotKeydown);
    $('hint-declutter').addEventListener('click', function () { requestHint('declutter'); });
    $('hint-clue').addEventListener('click', function () { requestHint('clue'); });
    $('hint-locate').addEventListener('click', function () { requestHint('locate'); });
    $('hint-solve').addEventListener('click', function () { requestHint('solve'); });

    $('zoom-in').addEventListener('click', function () { zoomBy(1.3); });
    $('zoom-out').addEventListener('click', function () { zoomBy(1 / 1.3); });
    $('zoom-reset').addEventListener('click', resetView);

    $('give-up').addEventListener('click', function () {
      if (!state.game || !state.game.isRunning()) return;
      if (root.confirm('Wil je stoppen en de oplossing zien?')) state.game.finish('gaveup');
    });

    $('back-home').addEventListener('click', function () {
      if (state.game && state.game.isRunning() && !root.confirm('Het lopende spel gaat verloren. Terug naar het menu?')) return;
      stopTicker();
      if (state.game) state.game.finishedAt = Date.now();
      renderCategories();
      showScreen('home');
    });

    $('result-again').addEventListener('click', function () {
      startGame(state.category);
    });
    $('result-home').addEventListener('click', function () {
      stopTicker();
      renderCategories();
      showScreen('home');
    });
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
