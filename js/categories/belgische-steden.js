/*
 * FoxCollage - categorie: Belgische steden & gemeenten.
 *
 * Elk verborgen item is een woordgrap op een Belgische stad of gemeente:
 * de tekening beeldt de *betekenis* van het woord uit, niet de stad zelf.
 * De tekening bevat daarnaast bewust afleiders (appel naast de peer,
 * gitaar naast de lier, ...) die nergens naar verwijzen.
 */
(function (root) {
  'use strict';

  /* ---------------------------------------------------------------------
   * Kleine tekenhulpjes
   * ------------------------------------------------------------------ */

  /** Staand figuurtje; de voeten staan op y = 0. */
  function person(opts) {
    var o = opts || {};
    var shirt = o.shirt || '#4a7fd4';
    var pants = o.pants || '#39445c';
    var skin = o.skin || '#f0c49a';
    var hair = o.hair || '#4a3527';
    var armLeft = o.armLeft || 'M -9,-32 q -10,8 -8,20';
    var armRight = o.armRight || 'M 9,-32 q 10,8 8,20';
    return [
      '<ellipse cx="0" cy="1" rx="14" ry="4" fill="rgba(35,45,30,.18)"/>',
      '<path d="M -7,-14 L -7,-1 q 0,3 -4,3 l 8,0 q 3,0 3,-4 l 0,-12 z" fill="' + pants + '"/>',
      '<path d="M 7,-14 L 7,-1 q 0,3 4,3 l -8,0 q -3,0 -3,-4 l 0,-12 z" fill="' + pants + '"/>',
      '<rect x="-10" y="-36" width="20" height="24" rx="8" fill="' + shirt + '"/>',
      '<path d="' + armLeft + '" stroke="' + shirt + '" stroke-width="6" stroke-linecap="round" fill="none"/>',
      '<path d="' + armRight + '" stroke="' + shirt + '" stroke-width="6" stroke-linecap="round" fill="none"/>',
      '<circle cx="0" cy="-45" r="9" fill="' + skin + '"/>',
      '<path d="M -9,-47 a 9,9 0 0 1 18,0 q -9,-5 -18,0 z" fill="' + hair + '"/>'
    ].join('');
  }

  function tree(x, y, scale) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + scale + ')">' +
      '<path d="M -10,0 L -6,-70 L 6,-70 L 10,0 z" fill="#8a5a3b"/>' +
      '<path d="M -6,-40 q -16,-8 -22,-22" stroke="#8a5a3b" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M 6,-52 q 18,-6 24,-20" stroke="#8a5a3b" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<circle cx="-26" cy="-80" r="34" fill="#4e9b52"/>' +
      '<circle cx="24" cy="-88" r="38" fill="#57a95b"/>' +
      '<circle cx="0" cy="-112" r="36" fill="#62b566"/>' +
      '<circle cx="-2" cy="-70" r="30" fill="#4b9550"/>' +
      '</g>';
  }

  function cloud(x, y, scale) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + scale + ')" fill="#ffffff" opacity=".85">' +
      '<circle cx="0" cy="0" r="22"/><circle cx="26" cy="6" r="17"/><circle cx="-24" cy="7" r="15"/>' +
      '<rect x="-24" y="0" width="52" height="14" rx="7"/></g>';
  }

  /* ---------------------------------------------------------------------
   * De tien verborgen items
   * ------------------------------------------------------------------ */

  /** 1. TURNHOUT - een turner op een houten balk. */
  function drawTurnhout() {
    var beam = '<g>' +
      '<ellipse cx="0" cy="96" rx="130" ry="10" fill="rgba(35,45,30,.15)"/>' +
      '<path d="M -104,18 L -86,88 L -66,88 L -80,18 z" fill="#9a6b42"/>' +
      '<path d="M 104,18 L 86,88 L 66,88 L 80,18 z" fill="#9a6b42"/>' +
      '<rect x="-120" y="0" width="240" height="20" rx="4" fill="#c58f56"/>' +
      '<rect x="-120" y="14" width="240" height="6" rx="3" fill="#a5723f"/>' +
      '<path d="M -96,7 h 60 M -14,11 h 70 M 62,6 h 40" stroke="#b07e49" stroke-width="2"/>' +
      '</g>';

    var gymnast = '<g transform="translate(6,0)">' +
      '<path d="M -3,-4 q -14,-10 -30,-34" stroke="#f0c49a" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '<path d="M 2,-6 L 2,-30" stroke="#f0c49a" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M -6,-2 l 12,0" stroke="#e8b587" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M -10,-56 q 6,14 10,26 q 4,-12 12,-24 z" fill="#e0483f"/>' +
      '<rect x="-11" y="-78" width="22" height="26" rx="10" fill="#e0483f"/>' +
      '<path d="M -8,-74 q 8,4 16,0" stroke="#ffffff" stroke-width="3" fill="none"/>' +
      '<path d="M -9,-74 q -16,-14 -20,-32" stroke="#f0c49a" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '<path d="M 9,-74 q 16,-14 20,-32" stroke="#f0c49a" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '<circle cx="0" cy="-90" r="11" fill="#f0c49a"/>' +
      '<path d="M -11,-92 a 11,11 0 0 1 22,0 q -11,-6 -22,0 z" fill="#5c3a22"/>' +
      '<circle cx="0" cy="-102" r="6" fill="#5c3a22"/>' +
      '</g>';

    return '<g class="hidden-item" data-item="turnhout" transform="translate(600,330)">' + beam + gymnast + '</g>';
  }

  /** 2. WACHTEBEKE - mensen die staan te wachten aan een beek. */
  function drawWachtebeke() {
    var sign = '<g transform="translate(-70,-30)">' +
      '<rect x="-3" y="-72" width="6" height="72" fill="#7d8894"/>' +
      '<circle cx="0" cy="-84" r="17" fill="#f4f1e8" stroke="#7d8894" stroke-width="4"/>' +
      '<path d="M 0,-92 L 0,-84 L 7,-80" stroke="#39445c" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '</g>';

    var wachters =
      '<g transform="translate(-40,4) scale(.95)">' + person({ shirt: '#d9762f', pants: '#3b4a63', armLeft: 'M -9,-32 q -12,10 -6,20', armRight: 'M 9,-32 q 8,10 2,18' }) + '</g>' +
      '<g transform="translate(4,0)">' + person({ shirt: '#4f8f5c', pants: '#2f3a4d', hair: '#20242c', armRight: 'M 9,-32 q 14,4 10,14' }) +
      '<circle cx="18" cy="-19" r="5" fill="#f4f1e8" stroke="#39445c" stroke-width="2"/></g>' +
      '<g transform="translate(40,6) scale(.9)">' + person({ shirt: '#8b5fb0', pants: '#40364f', hair: '#8a5a3b', armLeft: 'M -9,-32 q -6,12 -2,20' }) + '</g>';

    return '<g class="hidden-item" data-item="wachtebeke" transform="translate(292,600) scale(1.15)">' + wachters + sign + '</g>';
  }

  /** 3. LUIK - een houten valluik in de grond, op een kier. */
  function drawLuik() {
    return '<g class="hidden-item" data-item="luik" transform="translate(986,676)">' +
      '<path d="M -86,0 L -34,-34 L 86,-34 L 34,0 z" fill="#2b2118"/>' +
      '<path d="M -70,-6 L -26,-34 L 78,-34 L 34,-6 z" fill="#1a1410"/>' +
      '<g transform="translate(-26,-34) rotate(-24)">' +
      '<path d="M 0,0 L 104,0 L 104,-38 L 0,-38 z" fill="#b5803f"/>' +
      '<path d="M 0,-38 L 104,-38 L 104,-44 L 0,-44 z" fill="#8a5f2c"/>' +
      '<path d="M 6,0 L 6,-38 M 34,0 L 34,-38 M 62,0 L 62,-38 M 90,0 L 90,-38" stroke="#93662f" stroke-width="3"/>' +
      '<rect x="14" y="-26" width="76" height="7" rx="3" fill="#6e7883"/>' +
      '<circle cx="92" cy="-20" r="9" fill="none" stroke="#5d666f" stroke-width="5"/>' +
      '</g>' +
      '<rect x="-30" y="-38" width="14" height="8" rx="2" fill="#5d666f"/>' +
      '<path d="M -86,0 L -34,-34 L 86,-34 L 34,0 z" fill="none" stroke="#6b4a24" stroke-width="5"/>' +
      '</g>';
  }

  /** 4. HAM - een ham (hesp) met been op een schaal. */
  function drawHam() {
    return '<g class="hidden-item" data-item="ham" transform="translate(792,596)">' +
      '<ellipse cx="0" cy="26" rx="74" ry="16" fill="rgba(35,45,30,.18)"/>' +
      '<ellipse cx="0" cy="20" rx="70" ry="15" fill="#e7e2d6"/>' +
      '<ellipse cx="0" cy="16" rx="58" ry="11" fill="#f7f4ec"/>' +
      '<path d="M 40,-8 q 16,-4 20,-14 q 3,-8 12,-6 q 8,2 5,10 q -3,9 -13,10 q 10,4 6,12 q -4,8 -12,3 q -9,-6 -18,-5 z" fill="#f2efe4" stroke="#d8d2c2" stroke-width="2"/>' +
      '<path d="M -62,-2 q -6,-30 22,-40 q 30,-11 52,8 q 14,11 8,26 q -6,16 -30,20 q -32,6 -46,-4 q -6,-4 -6,-10 z" fill="#e88a90"/>' +
      '<path d="M -62,-2 q -6,-30 22,-40 q 14,-5 28,-3 q -22,10 -28,26 q -6,16 -4,24 q -14,0 -18,-7 z" fill="#f2a6ab"/>' +
      '<path d="M 20,-36 q 22,4 28,20 q 5,15 -12,23 q 8,-20 -3,-32 q -6,-8 -13,-11 z" fill="#c96a72"/>' +
      '<path d="M -34,-30 q 10,6 12,18 M -14,-38 q 12,8 12,22" stroke="#d97a82" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M -20,4 q 18,6 34,0" stroke="#c96a72" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '</g>';
  }

  /** 5. DAMME - een dambord met schijven. */
  function drawDamme() {
    var cells = '';
    var size = 17;
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          cells += '<rect x="' + (c * size) + '" y="' + (r * size) + '" width="' + size + '" height="' + size + '" fill="#43372c"/>';
        }
      }
    }
    var board = 8 * size;
    var pieces =
      '<ellipse cx="26" cy="112" rx="13" ry="7" fill="#2a2119"/><ellipse cx="26" cy="108" rx="13" ry="7" fill="#4b3f33"/>' +
      '<ellipse cx="77" cy="78" rx="13" ry="7" fill="#d8cdb8"/><ellipse cx="77" cy="74" rx="13" ry="7" fill="#f4eddc"/>' +
      '<ellipse cx="111" cy="112" rx="13" ry="7" fill="#d8cdb8"/><ellipse cx="111" cy="108" rx="13" ry="7" fill="#f4eddc"/>' +
      '<ellipse cx="60" cy="44" rx="13" ry="7" fill="#2a2119"/><ellipse cx="60" cy="40" rx="13" ry="7" fill="#4b3f33"/>';

    return '<g class="hidden-item" data-item="damme" transform="translate(360,616) rotate(-7)">' +
      '<rect x="-10" y="-10" width="' + (board + 20) + '" height="' + (board + 20) + '" rx="5" fill="#8a6a4a"/>' +
      '<rect x="0" y="0" width="' + board + '" height="' + board + '" fill="#e8dcc2"/>' +
      cells + pieces +
      '</g>';
  }

  /** 6. MOL - een mol die uit zijn molshoop piept. */
  function drawMol() {
    return '<g class="hidden-item" data-item="mol" transform="translate(646,672)">' +
      '<ellipse cx="4" cy="6" rx="64" ry="20" fill="#6d5033"/>' +
      '<ellipse cx="-6" cy="-2" rx="46" ry="18" fill="#7d5d3c"/>' +
      '<ellipse cx="-30" cy="2" rx="14" ry="7" fill="#8a6743"/>' +
      '<ellipse cx="26" cy="4" rx="16" ry="8" fill="#8a6743"/>' +
      '<ellipse cx="4" cy="-22" rx="26" ry="24" fill="#4d4a52"/>' +
      '<ellipse cx="4" cy="-14" rx="22" ry="16" fill="#5a5762"/>' +
      '<path d="M -20,-10 q -10,4 -10,12 q 8,4 14,-4 z" fill="#e79ba6"/>' +
      '<path d="M 28,-10 q 10,4 10,12 q -8,4 -14,-4 z" fill="#e79ba6"/>' +
      '<ellipse cx="4" cy="-30" rx="8" ry="6" fill="#e79ba6"/>' +
      '<circle cx="1" cy="-32" r="1.6" fill="#3a3038"/><circle cx="7" cy="-32" r="1.6" fill="#3a3038"/>' +
      '<circle cx="-7" cy="-26" r="2.4" fill="#2c2a30"/><circle cx="15" cy="-26" r="2.4" fill="#2c2a30"/>' +
      '<path d="M -12,-30 q -12,-2 -18,-6 M -12,-27 q -13,2 -19,1 M 20,-30 q 12,-2 18,-6 M 20,-27 q 13,2 19,1" stroke="#3a3038" stroke-width="1.4" fill="none"/>' +
      '</g>';
  }

  /** 7. LIER - het snaarinstrument. */
  function drawLier() {
    var strings = '';
    for (var i = 0; i < 6; i++) {
      var x = -27 + i * 11;
      strings += '<path d="M ' + x + ',-70 L ' + (x * 0.72) + ',-8" stroke="#f6f1e2" stroke-width="1.8" opacity=".9"/>';
    }
    return '<g class="hidden-item" data-item="lier" transform="translate(1092,486) rotate(8)">' +
      '<ellipse cx="0" cy="8" rx="44" ry="10" fill="rgba(35,45,30,.2)"/>' +
      '<path d="M -28,-2 q -26,-34 -14,-72" stroke="#d9a441" stroke-width="13" fill="none" stroke-linecap="round"/>' +
      '<path d="M 28,-2 q 26,-34 14,-72" stroke="#d9a441" stroke-width="13" fill="none" stroke-linecap="round"/>' +
      '<path d="M -42,-74 q 42,-16 84,0" stroke="#c08f33" stroke-width="9" fill="none" stroke-linecap="round"/>' +
      strings +
      '<path d="M -36,-6 q 36,-16 72,0 q -6,20 -36,20 q -30,0 -36,-20 z" fill="#a9702c"/>' +
      '<path d="M -26,-4 q 26,-10 52,0" stroke="#c9913f" stroke-width="3" fill="none"/>' +
      '<circle cx="-40" cy="-72" r="5.5" fill="#8c5f24"/><circle cx="40" cy="-72" r="5.5" fill="#8c5f24"/>' +
      '</g>';
  }

  /** 8. PEER - een peer die aan de tak hangt. */
  function drawPeer() {
    return '<g class="hidden-item" data-item="peer" transform="translate(150,268)">' +
      '<path d="M 0,-46 q 4,0 4,7 q 0,7 -3,12 q -1,3 3,5 q 15,8 15,25 q 0,17 -19,17 q -19,0 -19,-17 q 0,-17 15,-25 q 4,-2 3,-5 q -3,-5 -3,-12 q 0,-7 4,-7 z" fill="#c6d24a"/>' +
      '<path d="M -4,-22 q -9,8 -10,22 q -1,12 6,17 q -12,-2 -12,-16 q 0,-16 16,-23 z" fill="#dbe470"/>' +
      '<path d="M 0,-44 q 1,-9 -3,-14" stroke="#6b4a24" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M 1,-52 q 16,-10 22,2 q -14,8 -22,-2 z" fill="#4e9b52"/>' +
      '<circle cx="9" cy="6" r="3" fill="#a8b53a" opacity=".7"/><circle cx="-6" cy="14" r="2.4" fill="#a8b53a" opacity=".7"/>' +
      '</g>';
  }

  /** 9. DUFFEL - een duffeltas (duffel bag). */
  function drawDuffel() {
    return '<g class="hidden-item" data-item="duffel" transform="translate(396,504) rotate(-4)">' +
      '<ellipse cx="0" cy="30" rx="72" ry="12" fill="rgba(35,45,30,.18)"/>' +
      '<path d="M -58,-24 q 58,-12 116,0 q 8,26 0,50 q -58,12 -116,0 q -8,-24 0,-50 z" fill="#3f6f8f"/>' +
      '<ellipse cx="-58" cy="1" rx="12" ry="25" fill="#35617e"/>' +
      '<ellipse cx="58" cy="1" rx="12" ry="25" fill="#4b7f9f"/>' +
      '<path d="M -50,-18 q 52,-10 104,0" stroke="#d9d3c3" stroke-width="4" fill="none"/>' +
      '<path d="M -48,-20 q 52,-10 100,0" stroke="#8fa3ad" stroke-width="2" fill="none" stroke-dasharray="4 4"/>' +
      '<path d="M -26,-22 q 26,26 52,0" stroke="#2a4d66" stroke-width="7" fill="none"/>' +
      '<rect x="-8" y="-6" width="16" height="12" rx="3" fill="#2a4d66"/>' +
      '<path d="M -58,12 q 58,12 116,0" stroke="#2f5b76" stroke-width="3" fill="none"/>' +
      '<rect x="-64" y="-8" width="8" height="18" rx="4" fill="#d1a14b"/>' +
      '</g>';
  }

  /** 10. KNOKKE - twee knokende vuisten (knokkels). */
  function fist(sleeve, cuff) {
    return '<g>' +
      '<rect x="-58" y="-19" width="56" height="42" rx="13" fill="' + sleeve + '"/>' +
      '<path d="M -2,-26 q 30,0 34,20 q 5,20 -4,30 q -8,9 -30,9 z" fill="#f0c49a"/>' +
      '<circle cx="27" cy="-9" r="7.5" fill="#f8d6b2"/><circle cx="32" cy="7" r="7.5" fill="#f8d6b2"/>' +
      '<circle cx="29" cy="22" r="7" fill="#f8d6b2"/><circle cx="19" cy="31" r="6" fill="#f8d6b2"/>' +
      '<path d="M 2,8 q 20,-3 26,6 q 3,8 -6,10 q -13,2 -21,-5 z" fill="#f8d6b2"/>' +
      '<path d="M 0,-18 q 16,3 18,16" stroke="#dba97f" stroke-width="2.5" fill="none"/>' +
      '<path d="M -2,-26 q -4,26 0,59" stroke="#dba97f" stroke-width="2" fill="none" opacity=".6"/>' +
      '<rect x="-8" y="-19" width="13" height="42" rx="6" fill="' + cuff + '"/>' +
      '</g>';
  }

  function drawKnokke() {
    return '<g class="hidden-item" data-item="knokke" transform="translate(860,186)">' +
      '<g transform="translate(-40,0)">' + fist('#c8523f', '#a9422f') + '</g>' +
      '<g transform="translate(40,0) scale(-1,1)">' + fist('#2f5f8a', '#27506f') + '</g>' +
      '<path d="M 0,-42 l 0,-18 M -24,-36 l -12,-16 M 24,-36 l 12,-16 M -30,30 l -16,12 M 30,30 l 16,12" stroke="#f4c542" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="0" cy="4" r="11" fill="#f4c542" opacity=".5"/>' +
      '</g>';
  }

  /* ---------------------------------------------------------------------
   * Afleiders: voorwerpen die nergens naar verwijzen.
   * Sommige lijken bewust op een verborgen item (appel/peer, gitaar/lier).
   * ------------------------------------------------------------------ */

  function decoys() {
    var parts = [];

    // appel in dezelfde boom als de peer
    parts.push('<g class="decoy" transform="translate(222,292)">' +
      '<circle cx="0" cy="0" r="19" fill="#d6453c"/>' +
      '<path d="M -18,-4 q 4,-16 16,-14 q -10,6 -10,16 z" fill="#e8736a"/>' +
      '<path d="M 0,-18 q 1,-8 -3,-12" stroke="#6b4a24" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M 1,-26 q 14,-9 19,2 q -12,7 -19,-2 z" fill="#4e9b52"/></g>');

    // gitaar tegen de muur (lijkt op de lier)
    parts.push('<g class="decoy" transform="translate(792,468) rotate(12)">' +
      '<ellipse cx="0" cy="18" rx="30" ry="12" fill="rgba(35,45,30,.18)"/>' +
      '<path d="M 0,10 q -26,0 -26,-20 q 0,-14 12,-16 q -8,-6 -8,-16 q 0,-14 22,-14 q 22,0 22,14 q 0,10 -8,16 q 12,2 12,16 q 0,20 -26,20 z" fill="#c07a3c"/>' +
      '<circle cx="0" cy="-16" r="9" fill="#5b3a1c"/>' +
      '<rect x="-4" y="-86" width="8" height="46" fill="#7a4e24"/>' +
      '<rect x="-8" y="-98" width="16" height="14" rx="3" fill="#5b3a1c"/>' +
      '<path d="M -3,-40 L -3,4 M 0,-40 L 0,6 M 3,-40 L 3,4" stroke="#f0e6d2" stroke-width="1.4"/></g>');

    // fiets
    parts.push('<g class="decoy" transform="translate(556,556) scale(.9)">' +
      '<circle cx="-30" cy="0" r="24" fill="none" stroke="#2f3a4d" stroke-width="5"/>' +
      '<circle cx="34" cy="0" r="24" fill="none" stroke="#2f3a4d" stroke-width="5"/>' +
      '<path d="M -30,0 L -6,-26 L 20,-26 L 34,0 L -6,0 z" fill="none" stroke="#2f7fa8" stroke-width="5"/>' +
      '<path d="M -6,-26 L -12,-34 M 20,-26 L 30,-34 M 30,-34 l 12,2" stroke="#2f3a4d" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="-18" y="-38" width="20" height="6" rx="3" fill="#2f3a4d"/></g>');

    // paraplu
    parts.push('<g class="decoy" transform="translate(206,736) rotate(-12)">' +
      '<path d="M -46,0 q 6,-42 46,-42 q 40,0 46,42 q -16,-12 -23,0 q -8,-12 -23,0 q -12,-12 -23,0 q -12,-12 -23,0 z" fill="#d94f7a"/>' +
      '<path d="M 0,-42 L 0,20 q 0,12 -12,12 q -8,0 -8,-8" stroke="#5a4634" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M 0,-46 L 0,-42" stroke="#5a4634" stroke-width="5" stroke-linecap="round"/></g>');

    // kat
    parts.push('<g class="decoy" transform="translate(1146,600)">' +
      '<ellipse cx="0" cy="6" rx="26" ry="8" fill="rgba(35,45,30,.18)"/>' +
      '<path d="M -16,2 q -4,-30 10,-32 q 16,-2 14,32 z" fill="#8a8f98"/>' +
      '<circle cx="0" cy="-36" r="14" fill="#8a8f98"/>' +
      '<path d="M -12,-44 L -14,-58 L -2,-48 z M 12,-44 L 14,-58 L 2,-48 z" fill="#8a8f98"/>' +
      '<circle cx="-5" cy="-37" r="2.2" fill="#2c2a30"/><circle cx="5" cy="-37" r="2.2" fill="#2c2a30"/>' +
      '<path d="M 14,0 q 20,-4 16,-26" stroke="#8a8f98" stroke-width="7" fill="none" stroke-linecap="round"/></g>');

    // voetbal
    parts.push('<g class="decoy" transform="translate(548,762)">' +
      '<ellipse cx="0" cy="22" rx="24" ry="7" fill="rgba(35,45,30,.18)"/>' +
      '<circle cx="0" cy="0" r="22" fill="#f6f3ea" stroke="#cfc8b8" stroke-width="2"/>' +
      '<path d="M 0,-12 l 11,8 -4,13 -14,0 -4,-13 z" fill="#2f3a4d"/>' +
      '<path d="M 0,-22 L 0,-12 M 11,-4 L 21,-8 M 7,9 L 13,18 M -7,9 L -13,18 M -11,-4 L -21,-8" stroke="#2f3a4d" stroke-width="2.5"/></g>');

    // vlieger
    parts.push('<g class="decoy" transform="translate(432,168) rotate(-14)">' +
      '<path d="M 0,-40 L 28,0 L 0,44 L -28,0 z" fill="#f4a63c"/>' +
      '<path d="M 0,-40 L 0,44 M -28,0 L 28,0" stroke="#d1852a" stroke-width="2"/>' +
      '<path d="M 0,44 q 12,14 -2,26 q -14,12 -2,26" stroke="#d1852a" stroke-width="2.5" fill="none"/>' +
      '<path d="M -8,60 l 16,6 M -10,86 l 16,6" stroke="#d94f7a" stroke-width="4" stroke-linecap="round"/></g>');

    // ballon
    parts.push('<g class="decoy" transform="translate(690,196)">' +
      '<ellipse cx="0" cy="0" rx="20" ry="24" fill="#c8523f"/>' +
      '<ellipse cx="-6" cy="-8" rx="6" ry="9" fill="#e08a78" opacity=".7"/>' +
      '<path d="M 0,24 l -4,6 l 8,0 z" fill="#a9422f"/>' +
      '<path d="M 0,30 q 8,16 -2,30 q -10,14 0,28" stroke="#8a8f98" stroke-width="2" fill="none"/></g>');

    // koffiekop
    parts.push('<g class="decoy" transform="translate(846,516)">' +
      '<ellipse cx="0" cy="16" rx="24" ry="6" fill="rgba(35,45,30,.16)"/>' +
      '<path d="M -18,-14 L -14,12 q 14,6 28,0 l 4,-26 z" fill="#f6f3ea"/>' +
      '<ellipse cx="0" cy="-14" rx="18" ry="6" fill="#c9a074"/>' +
      '<path d="M 16,-8 q 12,0 10,10 q -2,8 -12,6" stroke="#f6f3ea" stroke-width="4" fill="none"/>' +
      '<path d="M -6,-24 q 4,-8 0,-14 M 6,-24 q 4,-8 0,-14" stroke="#ffffff" stroke-width="2.5" fill="none" opacity=".8"/></g>');

    // boek
    parts.push('<g class="decoy" transform="translate(878,636) rotate(6)">' +
      '<path d="M -34,-4 L 0,-14 L 34,-4 L 34,16 L 0,6 L -34,16 z" fill="#4a7fd4"/>' +
      '<path d="M -34,-4 L 0,-14 L 0,6 L -34,16 z" fill="#5c8fe0"/>' +
      '<path d="M 0,-14 L 0,6" stroke="#2f5fa8" stroke-width="2"/>' +
      '<path d="M -28,0 l 24,-7 M -28,6 l 24,-7 M 28,0 l -24,-7" stroke="#e8eef8" stroke-width="1.6"/></g>');

    // brievenbus
    parts.push('<g class="decoy" transform="translate(952,548)">' +
      '<rect x="-4" y="0" width="8" height="42" fill="#7d8894"/>' +
      '<path d="M -20,-6 q 0,-26 20,-26 q 20,0 20,26 z" fill="#c8523f"/>' +
      '<rect x="-20" y="-8" width="40" height="10" rx="3" fill="#a9422f"/>' +
      '<rect x="-9" y="-22" width="18" height="4" rx="2" fill="#f6f3ea"/></g>');

    // klok aan de gevel
    parts.push('<g class="decoy" transform="translate(1004,316)">' +
      '<circle cx="0" cy="0" r="22" fill="#f4f1e8" stroke="#5a4634" stroke-width="5"/>' +
      '<path d="M 0,-14 L 0,0 L 10,6" stroke="#39445c" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<circle cx="0" cy="0" r="2.5" fill="#39445c"/></g>');

    // emmer
    parts.push('<g class="decoy" transform="translate(768,730)">' +
      '<ellipse cx="0" cy="24" rx="24" ry="6" fill="rgba(35,45,30,.16)"/>' +
      '<path d="M -20,-14 L -14,20 q 14,5 28,0 l 6,-34 z" fill="#5fa3c4"/>' +
      '<ellipse cx="0" cy="-14" rx="20" ry="6" fill="#7ec0dd"/>' +
      '<path d="M -20,-16 q 20,-20 40,0" stroke="#8a8f98" stroke-width="3" fill="none"/></g>');

    // zonnebloem
    parts.push('<g class="decoy" transform="translate(48,556)">' +
      '<path d="M 0,60 L 0,0" stroke="#4e9b52" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M 0,26 q 18,-4 22,-18 q -20,-2 -22,18 z" fill="#4e9b52"/>' +
      '<g fill="#f4c542">' +
      '<ellipse cx="0" cy="-20" rx="7" ry="15"/><ellipse cx="0" cy="20" rx="7" ry="15"/>' +
      '<ellipse cx="-20" cy="0" rx="15" ry="7"/><ellipse cx="20" cy="0" rx="15" ry="7"/>' +
      '<ellipse cx="-14" cy="-14" rx="7" ry="14" transform="rotate(45,-14,-14)"/>' +
      '<ellipse cx="14" cy="14" rx="7" ry="14" transform="rotate(45,14,14)"/>' +
      '<ellipse cx="14" cy="-14" rx="7" ry="14" transform="rotate(-45,14,-14)"/>' +
      '<ellipse cx="-14" cy="14" rx="7" ry="14" transform="rotate(-45,-14,14)"/></g>' +
      '<circle cx="0" cy="0" r="12" fill="#8a5a3b"/></g>');

    // ladder tegen de gevel
    parts.push('<g class="decoy" transform="translate(902,400) rotate(8)">' +
      '<path d="M -14,-90 L -10,60 M 14,-90 L 18,60" stroke="#c58f56" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M -13,-64 L 15,-64 M -12,-34 L 16,-34 M -11,-4 L 17,-4 M -10,26 L 18,26" stroke="#a5723f" stroke-width="5"/></g>');

    // vlinder
    parts.push('<g class="decoy" transform="translate(508,430) rotate(-10)">' +
      '<path d="M 0,0 q -22,-20 -14,-28 q 8,-8 14,14 z" fill="#e07fb0"/>' +
      '<path d="M 0,0 q 22,-20 14,-28 q -8,-8 -14,14 z" fill="#e07fb0"/>' +
      '<path d="M 0,2 q -18,14 -10,20 q 8,6 10,-12 z" fill="#c95f96"/>' +
      '<path d="M 0,2 q 18,14 10,20 q -8,6 -10,-12 z" fill="#c95f96"/>' +
      '<rect x="-2" y="-12" width="4" height="30" rx="2" fill="#39445c"/></g>');

    return parts.join('');
  }

  /* ---------------------------------------------------------------------
   * De volledige collage
   * ------------------------------------------------------------------ */

  function buildScene() {
    var svg = [];

    svg.push('<defs>' +
      '<linearGradient id="fc-sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#bfe3f5"/><stop offset="100%" stop-color="#eaf5e4"/></linearGradient>' +
      '<linearGradient id="fc-water" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#6fb6d8"/><stop offset="100%" stop-color="#3f86ad"/></linearGradient>' +
      '<linearGradient id="fc-wall" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#e9ddc6"/><stop offset="100%" stop-color="#d9c9ac"/></linearGradient>' +
      '</defs>');

    // lucht, heuvels, gras
    svg.push('<rect x="0" y="0" width="1200" height="800" fill="url(#fc-sky)"/>');
    svg.push('<circle cx="1120" cy="104" r="44" fill="#ffd66b"/>');
    svg.push('<circle cx="1120" cy="104" r="62" fill="#ffd66b" opacity=".25"/>');
    svg.push(cloud(250, 90, 1.1) + cloud(600, 60, .8) + cloud(900, 120, .95) + cloud(70, 180, .7));
    svg.push('<path d="M 0,470 q 150,-70 320,-20 q 160,46 300,-10 q 180,-72 340,-14 q 130,44 240,4 L 1200,520 L 0,520 z" fill="#9ccf86"/>');
    svg.push('<rect x="0" y="480" width="1200" height="320" fill="#8ac473"/>');
    svg.push('<path d="M 0,520 q 300,40 600,10 q 300,-30 600,20 L 1200,560 L 0,560 z" fill="#7fbb69" opacity=".7"/>');

    // wandelpad
    svg.push('<path d="M 520,800 q 40,-140 180,-190 q 150,-54 300,-40 L 1200,576 L 1200,620 q -170,-22 -300,26 q -120,42 -150,174 z" fill="#e3d6b4" opacity=".85"/>');

    // beek (hoort bij Wachtebeke)
    svg.push('<path d="M -20,586 q 120,10 180,70 q 70,64 62,164 L 356,820 q 8,-120 -70,-192 q -96,-88 -306,-82 z" fill="url(#fc-water)"/>');
    svg.push('<path d="M -20,600 q 120,12 176,72 q 66,62 62,148" fill="none" stroke="#ffffff" stroke-width="4" opacity=".45"/>');
    svg.push('<path d="M 40,662 q 40,10 60,34 M 130,714 q 24,22 30,50 M 10,714 q 50,14 70,48" fill="none" stroke="#ffffff" stroke-width="3" opacity=".35"/>');

    // gevel rechts (met dak) waar de lier tegenaan staat
    svg.push('<g>' +
      '<rect x="884" y="266" width="316" height="262" fill="url(#fc-wall)"/>' +
      '<path d="M 860,272 L 1042,180 L 1224,272 z" fill="#b5533f"/>' +
      '<rect x="884" y="262" width="316" height="14" fill="#8c4132"/>' +
      '<rect x="1066" y="318" width="70" height="74" rx="4" fill="#8fc6dd" stroke="#a98e63" stroke-width="6"/>' +
      '<path d="M 1101,318 L 1101,392 M 1066,355 L 1136,355" stroke="#a98e63" stroke-width="5"/>' +
      '<rect x="912" y="424" width="74" height="104" rx="4" fill="#7a5533"/>' +
      '<circle cx="972" cy="478" r="5" fill="#e0c46a"/>' +
      '<path d="M 884,528 h 316" stroke="#b6a684" stroke-width="6"/>' +
      '</g>');

    // bomen en struiken
    svg.push(tree(146, 396, 1.25));   // boom met peer en appel
    svg.push(tree(1046, 560, .55));
    svg.push('<ellipse cx="640" cy="512" rx="54" ry="20" fill="#5fa85f"/>');
    svg.push('<ellipse cx="316" cy="560" rx="40" ry="16" fill="#5fa85f"/>');
    svg.push('<ellipse cx="820" cy="492" rx="46" ry="16" fill="#5fa85f"/>');

    // picknickdeken onder de ham
    svg.push('<g transform="translate(792,612) rotate(-3)">' +
      '<rect x="-120" y="-34" width="240" height="88" rx="10" fill="#e8615f" opacity=".9"/>' +
      '<path d="M -120,10 h 240 M -40,-34 v 88 M 40,-34 v 88" stroke="#f6f3ea" stroke-width="6" opacity=".8"/></g>');

    // verborgen items
    svg.push(drawDuffel());
    svg.push(drawDamme());
    svg.push(drawTurnhout());
    svg.push(drawWachtebeke());
    svg.push(drawHam());
    svg.push(drawMol());
    svg.push(drawLier());
    svg.push(drawPeer());
    svg.push(drawLuik());
    svg.push(drawKnokke());

    // afleiders
    svg.push(decoys());

    // laag waarin het spel markeringen tekent (hints en eindoverzicht)
    svg.push('<g id="fc-markers"></g>');

    return svg.join('');
  }

  /* ---------------------------------------------------------------------
   * Categorie-definitie
   * ------------------------------------------------------------------ */

  var category = {
    id: 'belgische-steden',
    name: 'Belgische steden',
    tagline: 'Tien Belgische steden en gemeenten zitten als woordgrap in de tekening.',
    intro: 'Elk item beeldt de betekenis van een stadsnaam uit, niet de stad zelf. ' +
      'Niet alles in de tekening telt mee - er staan ook gewone voorwerpen tussen.',
    viewBox: '0 0 1200 800',
    buildScene: buildScene,
    items: [
      {
        id: 'turnhout',
        name: 'Turnhout',
        aliases: ['turnhaut'],
        clue: 'Een sporter doet zijn oefening op een balk van hout.',
        explanation: 'Een turner op een houten balk: turn + hout.',
        focus: { x: 600, y: 280, r: 150 }
      },
      {
        id: 'wachtebeke',
        name: 'Wachtebeke',
        aliases: ['wachtebeeke'],
        clue: 'Drie mensen staan ongeduldig langs het stromende water.',
        explanation: 'Mensen die staan te wachten aan een beek: wachte + beke.',
        focus: { x: 276, y: 548, r: 135 }
      },
      {
        id: 'luik',
        name: 'Luik',
        aliases: ['liege', 'liège', 'valluik', 'trapluik'],
        clue: 'Een houten deur die niet in een muur zit, maar in de grond.',
        explanation: 'Een valluik in de grond: een luik. (In het Frans: Liège.)',
        focus: { x: 990, y: 652, r: 120 }
      },
      {
        id: 'ham',
        name: 'Ham',
        aliases: ['hesp', 'jambon'],
        clue: 'Het pronkstuk van de picknick, met het been er nog aan.',
        explanation: 'Een ham (hesp) op een schaal: Ham, een gemeente in Limburg.',
        focus: { x: 792, y: 584, r: 110 }
      },
      {
        id: 'damme',
        name: 'Damme',
        aliases: ['dam', 'dambord'],
        clue: 'Zwart-wit bordspel met schijven in plaats van stukken.',
        explanation: 'Een dambord met damschijven: Damme, bij Brugge.',
        focus: { x: 428, y: 690, r: 130 }
      },
      {
        id: 'mol',
        name: 'Mol',
        aliases: ['molshoop'],
        clue: 'Het graafdiertje piept uit zijn zelfgemaakte hoopje aarde.',
        explanation: 'Een mol in zijn molshoop: Mol, in de Antwerpse Kempen.',
        focus: { x: 646, y: 652, r: 100 }
      },
      {
        id: 'lier',
        name: 'Lier',
        aliases: ['lyra', 'harp'],
        clue: 'Een antiek snaarinstrument in de vorm van een U.',
        explanation: 'Een lier (het snaarinstrument): Lier, de stad van de Zimmertoren. ' +
          'Let op: de gitaar verderop telt niet mee.',
        focus: { x: 1092, y: 446, r: 110 }
      },
      {
        id: 'peer',
        name: 'Peer',
        aliases: ['peren'],
        clue: 'Boven in de boom hangt fruit dat onderaan dikker is dan bovenaan.',
        explanation: 'Een peer aan de tak: Peer, in Limburg. De appel ernaast is een afleider.',
        focus: { x: 150, y: 250, r: 100 }
      },
      {
        id: 'duffel',
        name: 'Duffel',
        aliases: ['duffeltas', 'duffelbag', 'duffelzak'],
        clue: 'Een lange sporttas met een rits en een schouderband.',
        explanation: 'Een duffel(tas): Duffel, tussen Mechelen en Lier.',
        focus: { x: 396, y: 498, r: 110 }
      },
      {
        id: 'knokke',
        name: 'Knokke',
        aliases: ['knokke heist', 'knokkeheist', 'knokken', 'vuist', 'vuisten'],
        clue: 'Twee vuisten die het met elkaar aan de stok hebben.',
        explanation: 'Twee knokende vuisten (knokkels): Knokke, aan de kust.',
        focus: { x: 860, y: 186, r: 110 }
      }
    ]
  };

  root.FoxCollage = root.FoxCollage || {};
  root.FoxCollage.categories = root.FoxCollage.categories || [];
  root.FoxCollage.categories.push(category);
})(window);
