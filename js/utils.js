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

  /** Levenshtein-afstand, gebruikt om tikfouten ("Turnhoud") alsnog goed te rekenen. */
  Utils.levenshtein = function (a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    var prev = new Array(b.length + 1);
    var i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;

    for (i = 1; i <= a.length; i++) {
      var cur = [i];
      for (j = 1; j <= b.length; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      }
      prev = cur;
    }
    return prev[b.length];
  };

  /**
   * Hoeveel tikfouten we toestaan. Korte namen (Ham, Mol) moeten exact,
   * anders raadt de speler per ongeluk goed met een willekeurig woord.
   */
  Utils.allowedTypos = function (word) {
    if (word.length <= 4) return 0;
    if (word.length <= 7) return 1;
    return 2;
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
