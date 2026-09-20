/* FoxCollage - kleine hulpfuncties (geen dependencies, werkt ook vanaf file://) */
(function (root) {
  'use strict';

  var Utils = {};

  /** Maakt een antwoord vergelijkbaar: kleine letters, geen accenten, geen leestekens/spaties. */
  Utils.normalize = function (text) {
    return String(text == null ? '' : text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '');
  };

  /**
   * Bewerkingsafstand tussen twee woorden, waarbij het omwisselen van twee
   * letters naast elkaar ("kta" voor "kat") als één fout telt en niet als twee.
   * Dat is precies wat vingers doen, dus zonder die regel vallen net de
   * typischste tikfouten op korte namen buiten de marge.
   */
  Utils.editDistance = function (a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    var rows = [];
    var i, j;
    for (i = 0; i <= a.length; i++) rows[i] = [i];
    for (j = 0; j <= b.length; j++) rows[0][j] = j;

    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        rows[i][j] = Math.min(rows[i][j - 1] + 1, rows[i - 1][j] + 1, rows[i - 1][j - 1] + cost);

        // twee letters omgewisseld telt als één fout
        if (i > 1 && j > 1 &&
            a.charAt(i - 1) === b.charAt(j - 2) &&
            a.charAt(i - 2) === b.charAt(j - 1)) {
          rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + cost);
        }
      }
    }
    return rows[a.length][b.length];
  };

  /**
   * Fonetische sleutel: schakelt Nederlandse schrijfvarianten gelijk, zodat
   * "Kattenbergh", "Katenberch" en "Cattenberg" dezelfde sleutel krijgen als
   * "Kattenberg". Geen echte Soundex - die is op het Engels gebouwd - maar een
   * lijstje vervangingen voor de fouten die in het Nederlands écht gemaakt
   * worden: c/k, ck, ch/g, ei/ij/y, ou/au, oe/u, v/f, z/s, eind-d/t en
   * verdubbelde letters.
   */
  Utils.phoneticKey = function (text) {
    var s = Utils.normalize(text);
    if (!s) return '';

    s = s.replace(/sch/g, 'sg').replace(/ch/g, 'g');
    s = s.replace(/ck/g, 'k').replace(/qu/g, 'kw').replace(/q/g, 'k').replace(/x/g, 'ks');
    s = s.replace(/ph/g, 'f').replace(/th/g, 't');
    s = s.replace(/c([eiy])/g, 's$1').replace(/c/g, 'k');
    s = s.replace(/ij/g, 'i').replace(/ei/g, 'i').replace(/y/g, 'i');
    s = s.replace(/ou/g, 'au').replace(/oe/g, 'u').replace(/eu/g, 'u');
    s = s.replace(/v/g, 'f').replace(/z/g, 's');
    s = s.replace(/dt$/, 't').replace(/d$/, 't');
    s = s.replace(/(.)\1+/g, '$1');   // dubbele letters wegwerken: katten -> katen

    return s;
  };

  /**
   * Hoeveel tikfouten we toestaan, op de langste van de twee woorden.
   * Ruimer dan vroeger: de woordenlijst van de categorie vangt de valse
   * treffers op (zie Game.resolveGuess), dus we mogen hier mild zijn.
   */
  Utils.typoBudget = function (length) {
    if (length <= 4) return 1;
    if (length <= 9) return 2;
    return 3;
  };

  /**
   * Extra eis bij korte woorden, waar één bewerking al een heel ander woord
   * oplevert. We kijken naar de letters zelf: bij een tikfout blijven ze
   * nagenoeg dezelfde (omgewisseld, eentje vergeten, eentje dubbel), bij een
   * ander bedoeld woord wordt er een letter vervángen. Zo is "kta" wél een
   * tikfout voor "kat", maar "bal" geen treffer voor een antwoord als "bol".
   */
  Utils.plausibleTypo = function (a, b) {
    if (Math.max(a.length, b.length) > 5) return true;

    var telling = {};
    var i, ch;
    for (i = 0; i < a.length; i++) {
      ch = a.charAt(i);
      telling[ch] = (telling[ch] || 0) + 1;
    }
    for (i = 0; i < b.length; i++) {
      ch = b.charAt(i);
      telling[ch] = (telling[ch] || 0) - 1;
    }

    var teveel = 0, tekort = 0;
    Object.keys(telling).forEach(function (letter) {
      if (telling[letter] > 0) tekort += telling[letter];
      if (telling[letter] < 0) teveel -= telling[letter];
    });

    return teveel + tekort <= 1;
  };

  /** ms -> "mm:ss,d" */
  Utils.formatTime = function (ms) {
    var total = Math.max(0, Math.floor(ms / 100));
    var tenths = total % 10;
    var seconds = Math.floor(total / 10) % 60;
    var minutes = Math.floor(total / 600);
    return pad(minutes) + ':' + pad(seconds) + ',' + tenths;
  };

  /** ms -> "1 min 12 s" (voor lijstjes en records) */
  Utils.formatTimeShort = function (ms) {
    var seconds = Math.round(ms / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if (!minutes) return seconds + ' s';
    return minutes + ' min ' + pad(seconds) + ' s';
  };

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  Utils.shuffle = function (list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  };

  Utils.escapeHtml = function (text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };

  /** localStorage kan geblokkeerd zijn (privémodus); dan spelen we gewoon zonder records. */
  Utils.storage = {
    read: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (err) {
        return fallback;
      }
    },
    write: function (key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        return false;
      }
    }
  };

  root.FoxCollage = root.FoxCollage || {};
  root.FoxCollage.Utils = Utils;
})(window);
