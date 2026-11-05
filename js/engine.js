/* Footillion engine: question bank helpers, answer matching, daily round selection.
   Pure logic only (no DOM). */
(function (root) {
  'use strict';

  var TIER_POINTS = [10, 15, 30, 60, 85, 100];
  var TIER_NAMES = ['Sunday League', 'Offside', 'Squad Player', 'First Teamer', 'World Class', 'One in a Footillion'];
  var QUESTIONS_PER_ROUND = 7;
  var SECONDS_PER_QUESTION = 25;
  var MAX_SCORE = 100 * QUESTIONS_PER_ROUND;

  var STOP_WORDS = { fc: 1, afc: 1, cf: 1, the: 1 };

  /* ---------- bank registration ---------- */
  var BANK = root.FOOTILLION_BANK = root.FOOTILLION_BANK || [];

  /* addQ(difficulty 1-3, prompt, [tier0, tier1, tier2, tier3, tier4], kind)
     Each tier is a string: "Canonical|alias|alias; Next Answer|alias".
     kind 'p' = people prompt -> unique surnames are accepted automatically. */
  /* Banks may be written with 5 tiers (10/30/60/85/100). The 15-point "Offside" tier is carved out
     automatically: when the 10-point list has 4+ answers, its second half (the next most obvious
     picks) becomes the Offside tier. Banks written with 6 tiers are used as they are. */
  function toSixTiers(tiers) {
    if (tiers.length >= 6) return tiers.slice();
    var items = String(tiers[0]).split(';').map(function (s) { return s.trim(); }).filter(Boolean);
    var keep = items.length >= 4 ? Math.ceil(items.length / 2) : items.length;
    return [items.slice(0, keep).join('; '), items.slice(keep).join('; ')].concat(tiers.slice(1));
  }
  function addQ(difficulty, prompt, tiers, kind) {
    BANK.push({ id: BANK.length + 1, d: difficulty, prompt: prompt, tiers: toSixTiers(tiers), kind: kind || '' });
  }
  /* extendQ(promptStart, oldTierIndex 0-4, "More|alias; Answers"): add answers to an existing question
     (oldTierIndex uses the original 5-tier numbering). */
  function extendQ(promptStart, oldTier, text) {
    var q = BANK.filter(function (x) { return x.prompt.indexOf(promptStart) === 0; })[0];
    if (!q) { if (root.console) console.warn('extendQ: no question starting "' + promptStart + '"'); return; }
    var idx = oldTier === 0 ? 0 : oldTier + 1;
    q.tiers[idx] = (q.tiers[idx] ? q.tiers[idx] + '; ' : '') + text;
    q._c = null;
  }

  /* ---------- text helpers ---------- */
  function words(s) {
    s = String(s == null ? '' : s).toLowerCase();
    s = s.normalize ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s;
    s = s.replace(/&/g, ' and ').replace(/\u00f8/g, 'o').replace(/\u0142/g, 'l').replace(/\u0111/g, 'd')
         .replace(/\u00df/g, 'ss').replace(/\u00e6/g, 'ae').replace(/\u0131/g, 'i');
    return s.split(/[^a-z0-9]+/).filter(function (w) { return w && !STOP_WORDS[w]; });
  }
  function norm(s) { return words(s).join(''); }

  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur[0] = i;
      var rowMin = cur[0];
      for (j = 1; j <= b.length; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      var t = prev; prev = cur; cur = t;
    }
    return prev[b.length];
  }

  /* ---------- compiling a question for fast lookups ---------- */
  function compile(q) {
    if (q._c) return q._c;
    var map = {}, entries = [], lastCount = {};
    q.tiers.forEach(function (str, ti) {
      String(str).split(';').forEach(function (item) {
        item = item.trim();
        if (!item) return;
        var names = item.split('|').map(function (n) { return n.trim(); });
        var e = { name: names[0], tier: ti, points: TIER_POINTS[ti], aliases: names };
        entries.push(e);
        names.forEach(function (n) {
          var k = norm(n);
          if (k && !map[k]) map[k] = e;
        });
      });
    });
    if (q.kind === 'p') {
      entries.forEach(function (e) {
        var w = words(e.name);
        if (w.length > 1) {
          var last = w[w.length - 1];
          if (last.length >= 4) lastCount[last] = (lastCount[last] || 0) + 1;
        }
      });
      entries.forEach(function (e) {
        var w = words(e.name);
        if (w.length > 1) {
          var last = w[w.length - 1];
          if (last.length >= 4 && lastCount[last] === 1 && !map[last]) map[last] = e;
        }
      });
    }
    if (q.kind !== 'p') {
      /* club/place style answers: also accept the name without a common prefix or suffix
         ("Oldham" for Oldham Athletic, "Dortmund" for Borussia Dortmund) when that is unambiguous */
      var PRE = { real: 1, ac: 1, as: 1, sc: 1, cd: 1, ud: 1, rc: 1, sv: 1, vfl: 1, vfb: 1, tsg: 1, borussia: 1, olympique: 1, stade: 1, club: 1, estadio: 1, stadio: 1, stadion: 1 };
      var SUF = { united: 1, city: 1, town: 1, rovers: 1, wanderers: 1, athletic: 1, albion: 1, county: 1, hotspur: 1, argyle: 1, orient: 1, alexandra: 1, stadium: 1, arena: 1, academical: 1, thistle: 1, hove: 1 };
      var cand = {}, owner = {};
      entries.forEach(function (e) {
        var w = words(e.name), alts = [], a;
        a = w.slice(); while (a.length > 1 && PRE[a[0]]) { a.shift(); alts.push(a.join('')); }
        a = w.slice(); while (a.length > 1 && SUF[a[a.length - 1]]) { a.pop(); alts.push(a.join('')); }
        a = w.slice(); while (a.length > 1 && PRE[a[0]]) a.shift(); while (a.length > 1 && SUF[a[a.length - 1]]) a.pop(); alts.push(a.join(''));
        alts.forEach(function (k) {
          if (k.length < 4 || map[k]) return;
          if (owner[k] && owner[k] !== e) { cand[k] = -1; return; }
          owner[k] = e; if (cand[k] !== -1) cand[k] = 1;
        });
      });
      Object.keys(cand).forEach(function (k) { if (cand[k] === 1 && !map[k]) map[k] = owner[k]; });
    }
    q._c = { map: map, keys: Object.keys(map), entries: entries };
    return q._c;
  }

  /* judge(question, rawInput) -> { status: 'empty'|'miss'|'ok', entry, points, fuzzy } */
  function judge(q, input) {
    var k = norm(input);
    if (!k) return { status: 'empty', points: 0 };
    var c = compile(q);
    if (c.map[k]) return { status: 'ok', entry: c.map[k], points: c.map[k].points, fuzzy: false };
    if (k.length >= 6) {
      var allow = k.length >= 11 ? 2 : 1, best = null, bestD = allow + 1;
      for (var i = 0; i < c.keys.length; i++) {
        var key = c.keys[i];
        if (key.length < 6) continue;
        var d = lev(k, key, allow);
        if (d < bestD) { bestD = d; best = key; if (d <= 1) break; }
      }
      if (best) return { status: 'ok', entry: c.map[best], points: c.map[best].points, fuzzy: true };
    }
    return { status: 'miss', points: 0 };
  }

  /* ---------- seeded randomness ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffled(arr, rnd) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- daily round selection ---------- */
  var MIX = { 1: 2, 2: 3, 3: 2 }; // 2 easy, 3 medium, 2 hard = 7

  function bucketsOf(bank) {
    var b = { 1: [], 2: [], 3: [] };
    bank.forEach(function (q) { (b[q.d] || b[2]).push(q); });
    return b;
  }

  /* number of consecutive days that share no question at all */
  function uniqueDays(bank) {
    var b = bucketsOf(bank), r = Infinity;
    [1, 2, 3].forEach(function (d) { r = Math.min(r, Math.floor(b[d].length / MIX[d])); });
    return Math.max(1, r);
  }

  function dayNumber(date) {
    date = date || new Date();
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }
  function dateKey(date) {
    date = date || new Date();
    var m = date.getMonth() + 1, d = date.getDate();
    return date.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
  }

  function assemble(picks) {
    return picks.sort(function (a, b) { return a.d - b.d || a.id - b.id; });
  }

  /* Same 7 questions for everyone on a given day; consecutive days never share a question
     (until the whole bank has been cycled through). */
  function dailyRound(bank, dayNum) {
    var b = bucketsOf(bank), rounds = uniqueDays(bank);
    var cycle = Math.floor(dayNum / rounds), pos = dayNum % rounds, picks = [];
    /* first day of a new cycle must not repeat yesterday's questions either */
    var prevIds = (pos === 0 && cycle > 0) ? dailyRound(bank, dayNum - 1).map(function (q) { return q.id; }) : [];
    [1, 2, 3].forEach(function (d) {
      var order = shuffled(b[d], mulberry32(90210 + cycle * 7919 + d * 131));
      if (prevIds.length) {
        order = order.filter(function (q) { return prevIds.indexOf(q.id) < 0; }).concat(order.filter(function (q) { return prevIds.indexOf(q.id) >= 0; }));
      }
      picks = picks.concat(order.slice(pos * MIX[d], pos * MIX[d] + MIX[d]));
    });
    return assemble(picks);
  }

  /* Random round for multiplayer; avoids the given question ids where possible. */
  function randomRound(bank, avoidIds) {
    avoidIds = avoidIds || [];
    var b = bucketsOf(bank), picks = [];
    [1, 2, 3].forEach(function (d) {
      var pool = b[d].filter(function (q) { return avoidIds.indexOf(q.id) < 0; });
      if (pool.length < MIX[d]) pool = b[d];
      picks = picks.concat(shuffled(pool, Math.random).slice(0, MIX[d]));
    });
    return assemble(picks);
  }

  /* ---------- rank titles ---------- */
  var RANKS = [
    [0, 'Ball Boy'], [100, 'Sunday Leaguer'], [200, 'Bench Warmer'], [300, 'Squad Player'],
    [400, 'First Teamer'], [500, 'Club Captain'], [600, 'World Class'], [680, "Ballon d'Or Winner"]
  ];
  function rankFor(score) {
    var r = RANKS[0][1];
    RANKS.forEach(function (x) { if (score >= x[0]) r = x[1]; });
    return r;
  }

  root.Footillion = {
    TIER_POINTS: TIER_POINTS, TIER_NAMES: TIER_NAMES, QUESTIONS_PER_ROUND: QUESTIONS_PER_ROUND,
    SECONDS_PER_QUESTION: SECONDS_PER_QUESTION, MAX_SCORE: MAX_SCORE,
    addQ: addQ, extendQ: extendQ, bank: BANK, norm: norm, compile: compile, judge: judge,
    dailyRound: dailyRound, randomRound: randomRound, uniqueDays: uniqueDays,
    dayNumber: dayNumber, dateKey: dateKey, rankFor: rankFor, bucketsOf: bucketsOf
  };
  root.addQ = addQ; root.extendQ = extendQ; /* shorthands used by the bank files */
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
