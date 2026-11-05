/* Footillion v1.1 - game UI. Accounts, daily round, leaderboard and multiplayer all live in this browser (localStorage). */
(function () {
  'use strict';
  var F = window.Footillion, Store = window.Store;
  var BANK = F.bank, QN = F.QUESTIONS_PER_ROUND, SECS = F.SECONDS_PER_QUESTION;
  var byId = {};
  BANK.forEach(function (q) { byId[q.id] = q; });

  /* ---------- tiny helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function every(fn, ms) { var t = setInterval(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }

  /* dev switches: ?dev=1 shows a reset button, &day=3 previews another day */
  var DEV = /[?&]dev=1/.test(location.search);
  var dayShift = (location.search.match(/[?&]day=(-?\d+)/) || [0, 0])[1] | 0;
  function now() { return new Date(Date.now() + (DEV ? dayShift * 86400000 : 0)); }
  var EPOCH = F.dayNumber(new Date(2026, 10, 2));
  function roundNumber() { return Math.max(1, F.dayNumber(now()) - EPOCH + 1); }

  var stage = $('#stage');
  var session = null;

  /* ---------- accounts ---------- */
  function users() { return Store.get('users', {}); }
  function currentUser() {
    var s = Store.get('session', null);
    return s ? (users()[s.email] || null) : null;
  }
  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }
  function colourFor(str) {
    var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    var pal = ['#4cd964', '#ffd23f', '#9bf08b', '#ff9f1c', '#7bdff2', '#c77dff', '#ff8fab', '#b5e48c'];
    return pal[h % pal.length];
  }
  function avatarHTML(u, cls) {
    cls = cls || '';
    if (u && u.avatar) return '<img class="avatar ' + cls + '" src="' + esc(u.avatar) + '" alt="">';
    var n = (u && u.name) || '?';
    return '<span class="avatar ' + cls + '" style="background:' + colourFor(n) + '" aria-hidden="true">' + esc(n.charAt(0).toUpperCase()) + '</span>';
  }
  function fileToPixelAvatar(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = c.height = 32;
        var s = Math.min(img.width, img.height);
        c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 32, 32);
        cb(c.toDataURL('image/png'));
      };
      img.onerror = function () { cb(null); };
      img.src = fr.result;
    };
    fr.onerror = function () { cb(null); };
    fr.readAsDataURL(file);
  }

  /* ---------- daily records & leaderboard ---------- */
  function getRec(email, date) { var d = Store.get('daily', {}); return d[email] && d[email][date] || null; }
  function setRec(email, date, rec) {
    var d = Store.get('daily', {}); d[email] = d[email] || {}; d[email][date] = rec; Store.set('daily', d);
  }
  function recTotal(rec) { return rec.results.reduce(function (a, r) { return a + (r.points || 0); }, 0); }

  function addScore(user, date, score) {
    var list = Store.get('scores', []);
    if (list.some(function (s) { return s.email === user.email && s.date === date; })) return;
    list.push({ date: date, email: user.email, name: user.name, score: score, ts: Date.now() });
    Store.set('scores', list.filter(function (s) { return s.date >= F.dateKey(new Date(Date.now() - 40 * 86400000)); }));
  }
  /* a round left half-way counts as played: unanswered questions score 0 */
  function finalizeRec(user, date) {
    var rec = getRec(user.email, date);
    if (!rec || rec.done) return rec;
    while (rec.results.length < rec.qids.length) rec.results.push({ qid: rec.qids[rec.results.length], input: '', name: null, tier: null, points: 0, status: 'abandoned' });
    rec.done = true; rec.total = recTotal(rec);
    setRec(user.email, date, rec);
    addScore(user, date, rec.total);
    return rec;
  }

  function renderLeaderboard() {
    var date = F.dateKey(now()), me = currentUser(), all = users();
    var rows = Store.get('scores', []).filter(function (s) { return s.date === date; })
      .sort(function (a, b) { return b.score - a.score || a.ts - b.ts; }).slice(0, 10);
    $('#lbDate').textContent = now().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
    var html = '';
    for (var i = 0; i < 10; i++) {
      var r = rows[i];
      if (!r) { html += '<li class="empty"><span class="rank">' + (i + 1) + '.</span><span class="nm">---</span><span class="sc">---</span></li>'; continue; }
      var u = all[r.email] || { name: r.name };
      html += '<li class="' + (me && me.email === r.email ? 'me' : '') + '"><span class="rank">' + (i + 1) + '.</span>' + avatarHTML(u) +
        '<span class="nm">' + esc(u.name || r.name) + '</span><span class="sc">' + r.score + '</span></li>';
    }
    $('#lbList').innerHTML = html;
  }

  function renderMenuUser() {
    var u = currentUser();
    $('#menuUser').innerHTML = u ? avatarHTML(u) : '';
  }

  /* ---------- menu & info ---------- */
  var menuBtn = $('#menuBtn'), menu = $('#menuDropdown'), infoBtn = $('#infoBtn'), infoPanel = $('#infoPanel');
  function setOpen(btn, panel, open) { panel.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  menuBtn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(infoBtn, infoPanel, false); setOpen(menuBtn, menu, menu.hidden); });
  infoBtn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(menuBtn, menu, false); setOpen(infoBtn, infoPanel, infoPanel.hidden); });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target)) setOpen(menuBtn, menu, false);
    if (!infoPanel.contains(e.target)) setOpen(infoBtn, infoPanel, false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setOpen(menuBtn, menu, false); setOpen(infoBtn, infoPanel, false); closeModal(); }
  });
  menu.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-action]'); if (!b) return;
    setOpen(menuBtn, menu, false);
    var a = b.getAttribute('data-action');
    if (a === 'account') openAccountModal();
    else if (a === 'multiplayer') { if (confirmLeave()) renderMultiSetup(); }
    else if (a === 'home') { if (confirmLeave()) renderHome(); }
  });
  function confirmLeave() {
    if (session && session.active && session.mode === 'daily') {
      return window.confirm('Leave the daily round? Your attempt for today is already used and unanswered questions will score 0.');
    }
    return true;
  }

  /* ---------- modal ---------- */
  var modalRoot = $('#modalRoot');
  function closeModal() { modalRoot.innerHTML = ''; }
  function openModal(title, html) {
    modalRoot.innerHTML = '<div class="modal-back" id="mBack"><div class="modal px" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">' +
      '<button class="modal-x" id="mX" aria-label="Close">X</button><h2>' + esc(title) + '</h2>' + html + '</div></div>';
    $('#mX').addEventListener('click', closeModal);
    $('#mBack').addEventListener('mousedown', function (e) { if (e.target.id === 'mBack') closeModal(); });
    return $('.modal', modalRoot);
  }

  function openAccountModal(message) {
    var u = currentUser();
    var pending = { avatar: u ? u.avatar : null, tab: 'create' };

    function avatarControls() {
      return '<div class="avatar-pick"><span id="avPrev">' + avatarHTML({ name: ($('#fName') && $('#fName').value) || (u && u.name) || '?', avatar: pending.avatar }, 'xl') + '</span>' +
        '<label class="btn-px small">Upload picture<input id="fFile" type="file" accept="image/*" hidden></label>' +
        '<button type="button" class="btn-px small ghost" id="avClear">Remove</button></div>';
    }
    function wireAvatar(m) {
      var file = $('#fFile', m), clear = $('#avClear', m);
      file.addEventListener('change', function () {
        if (!file.files[0]) return;
        fileToPixelAvatar(file.files[0], function (data) {
          if (!data) { $('#accErr').textContent = 'That file could not be read as an image.'; return; }
          pending.avatar = data; $('#accErr').textContent = '';
          $('#avPrev').innerHTML = avatarHTML({ name: $('#fName') ? $('#fName').value : 'You', avatar: data }, 'xl');
        });
      });
      clear.addEventListener('click', function () {
        pending.avatar = null;
        $('#avPrev').innerHTML = avatarHTML({ name: $('#fName') ? $('#fName').value || '?' : '?', avatar: null }, 'xl');
      });
    }

    if (u) {                                           /* signed in: edit profile */
      var m = openModal('Account Settings',
        '<div class="field" style="display:flex;gap:12px;align-items:center">' + avatarHTML(u, 'xl') + '<div><div>' + esc(u.name) + '</div><div class="note">' + esc(u.email) + '</div></div></div>' +
        '<form id="accForm" novalidate><div class="field"><label>DISPLAY NAME<input id="fName" type="text" maxlength="14" value="' + esc(u.name) + '"></label></div>' +
        avatarControls() + '<p class="err" id="accErr"></p><p class="ok" id="accOk"></p>' +
        '<div class="btn-row"><button class="btn-px" type="submit">Save</button><button class="btn-px ghost" type="button" id="signOut">Sign out</button></div></form>' +
        '<p class="note" style="margin-top:14px">Accounts are stored in this browser only (no password in v1.1).</p>');
      wireAvatar(m);
      $('#accForm', m).addEventListener('submit', function (e) {
        e.preventDefault();
        var name = $('#fName', m).value.trim();
        if (name.length < 2) { $('#accErr').textContent = 'Display name needs at least 2 characters.'; return; }
        var all = users(); all[u.email].name = name; all[u.email].avatar = pending.avatar; Store.set('users', all);
        renderMenuUser(); renderLeaderboard(); $('#accOk').textContent = 'Saved!';
        if (!session || !session.active) renderHome();
      });
      $('#signOut', m).addEventListener('click', function () {
        Store.remove('session'); closeModal(); renderMenuUser(); renderLeaderboard(); renderHome();
      });
      return;
    }

    var mm = openModal('Account Settings',
      (message ? '<p class="note" style="color:#ffd23f">' + esc(message) + '</p>' : '') +
      '<div class="tabs"><button data-tab="create" class="on">CREATE ACCOUNT</button><button data-tab="signin">SIGN IN</button></div>' +
      '<form id="accForm" novalidate><div class="field"><label>EMAIL<input id="fEmail" type="email" autocomplete="email" placeholder="you@example.com"></label></div>' +
      '<div id="createOnly"><div class="field"><label>DISPLAY NAME<input id="fName" type="text" maxlength="14" placeholder="Your name"></label></div>' + avatarControls() + '</div>' +
      '<p class="err" id="accErr"></p><button class="btn-px" id="accSubmit" type="submit">Create account</button></form>' +
      '<p class="note" style="margin-top:14px">Profile picture is optional. Accounts are stored in this browser only (no password in v1.1).</p>');
    wireAvatar(mm);
    $$('.tabs button', mm).forEach(function (b) {
      b.addEventListener('click', function () {
        pending.tab = b.getAttribute('data-tab');
        $$('.tabs button', mm).forEach(function (x) { x.classList.toggle('on', x === b); });
        $('#createOnly', mm).hidden = pending.tab !== 'create';
        $('#accSubmit', mm).textContent = pending.tab === 'create' ? 'Create account' : 'Sign in';
        $('#accErr').textContent = '';
      });
    });
    $('#fName', mm).addEventListener('input', function () {
      if (!pending.avatar) $('#avPrev').innerHTML = avatarHTML({ name: this.value || '?', avatar: null }, 'xl');
    });
    $('#accForm', mm).addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('#fEmail', mm).value.trim().toLowerCase(), all = users(), err = $('#accErr');
      if (!validEmail(email)) { err.textContent = 'Please enter a valid email address.'; return; }
      if (pending.tab === 'signin') {
        if (!all[email]) { err.textContent = 'No account found for that email. Try Create Account.'; return; }
      } else {
        var name = $('#fName', mm).value.trim();
        if (all[email]) { err.textContent = 'That email already has an account. Use Sign In.'; return; }
        if (name.length < 2) { err.textContent = 'Display name needs at least 2 characters.'; return; }
        all[email] = { email: email, name: name, avatar: pending.avatar, created: Date.now() };
        Store.set('users', all);
      }
      Store.set('session', { email: email });
      closeModal(); renderMenuUser(); renderLeaderboard(); renderHome();
    });
  }

  /* ---------- screens: home ---------- */
  function difficultyLabel(d) { return d === 1 ? 'EASY' : d === 2 ? 'MEDIUM' : 'HARD'; }
  function nextMidnight() { var n = now(); return new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1).getTime() - n.getTime(); }
  function fmtCountdown(ms) {
    var s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }

  function renderHome() {
    clearTimers(); session = null;
    var user = currentUser(), date = F.dateKey(now());
    var rec = user ? getRec(user.email, date) : null;
    if (rec && !rec.done) rec = finalizeRec(user, date);
    renderLeaderboard();
    if (rec && rec.done) { renderResults(rec, user); return; }

    stage.innerHTML = '<div class="card px center"><h2>DAILY ROUND #' + roundNumber() + '</h2>' +
      '<p>' + QN + ' football prompts &middot; ' + SECS + ' seconds each &middot; one attempt per day</p>' +
      '<p class="muted">The rarer your answer, the more points you score. Max ' + F.MAX_SCORE + '.</p>' +
      (user ? '<p>Playing as <b style="color:#ffd23f">' + esc(user.name) + '</b></p>' : '<p class="muted">Create a free account to play and appear on the leaderboard.</p>') +
      '<div class="btn-row" style="justify-content:center"><button class="btn-px big" id="kickOff">' + (user ? 'Kick off!' : 'Create account to play') + '</button>' +
      '<button class="btn-px ghost" id="goMulti">Multiplayer</button></div>' +
      (DEV ? '<p class="note" style="margin-top:16px">DEV MODE: day offset ' + dayShift + ' (add &amp;day=N to the URL). <button class="btn-px small ghost" id="devReset">Reset my attempt</button></p>' : '') +
      '</div>';
    $('#kickOff').addEventListener('click', startDaily);
    $('#goMulti').addEventListener('click', renderMultiSetup);
    var dr = $('#devReset');
    if (dr) dr.addEventListener('click', function () {
      if (!user) return;
      var d = Store.get('daily', {}); if (d[user.email]) delete d[user.email][date]; Store.set('daily', d);
      Store.set('scores', Store.get('scores', []).filter(function (s) { return !(s.email === user.email && s.date === date); }));
      renderHome();
    });
  }

  function startDaily() {
    var user = currentUser();
    if (!user) { openAccountModal("Create an account to play today's round."); return; }
    var date = F.dateKey(now());
    if (getRec(user.email, date)) { renderHome(); return; }
    var qs = F.dailyRound(BANK, F.dayNumber(now()));
    setRec(user.email, date, { done: false, started: Date.now(), qids: qs.map(function (q) { return q.id; }), results: [] });
    session = { mode: 'daily', active: true, date: date, questions: qs, players: [{ name: user.name, email: user.email, results: [] }], p: 0, q: 0 };
    beginQuestion();
  }

  /* ---------- screens: question flow ---------- */
  function pipsHTML(player, qi) {
    var h = '<div class="pips">';
    for (var i = 0; i < QN; i++) {
      var r = player.results[i], cls = 'pip';
      if (r) cls += r.status === 'ok' ? ' t' + r.tier : ' miss'; else if (i === qi) cls += ' now';
      h += '<div class="' + cls + '"></div>';
    }
    return h + '</div>';
  }
  function playerTotal(p) { return p.results.reduce(function (a, r) { return a + r.points; }, 0); }
  function meterHTML(total) {
    var pct = Math.min(100, total / F.MAX_SCORE * 100);
    return '<div class="meter" title="Score progress"><div class="meter-goal"></div><div class="meter-ball" style="left:calc(' + pct.toFixed(1) + '% - ' + (pct * 0.18).toFixed(1) + 'px)"></div></div>';
  }
  function topLine(p, qi) {
    return '<div class="q-top"><span>' + esc(p.name) + '</span><span>QUESTION ' + (qi + 1) + '/' + QN + '</span><span>SCORE ' + playerTotal(p) + '</span></div>';
  }

  function beginQuestion() {
    clearTimers();
    var p = session.players[session.p], qi = session.q, q = session.questions[qi];
    var left = 3;
    stage.innerHTML = '<div class="card px">' + topLine(p, qi) + pipsHTML(p, qi) +
      '<span class="diff">' + difficultyLabel(q.d) + '</span><h2 class="prompt">' + esc(q.prompt) + '</h2>' +
      '<div class="get-ready">GET READY<b id="cd">' + left + '</b></div>' + meterHTML(playerTotal(p)) + '</div>';
    every(function () {
      left--;
      if (left <= 0) { clearTimers(); beginAnswer(); } else { $('#cd').textContent = left; }
    }, 1000);
  }

  function beginAnswer() {
    var p = session.players[session.p], qi = session.q, q = session.questions[qi];
    stage.innerHTML = '<div class="card px">' + topLine(p, qi) + pipsHTML(p, qi) +
      '<span class="diff">' + difficultyLabel(q.d) + '</span><h2 class="prompt">' + esc(q.prompt) + '</h2>' +
      '<form class="answer-form" id="aForm" autocomplete="off"><input class="answer-input" id="aIn" type="text" maxlength="60" placeholder="Type your answer..." autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer">' +
      '<button class="btn-px" type="submit">Submit</button></form>' +
      '<div class="timer" id="tBar"><div id="tFill"></div></div><div class="secs" id="tSecs">' + SECS + 's</div>' + meterHTML(playerTotal(p)) + '</div>';
    var input = $('#aIn'); input.focus();
    var done = false, start = performance.now();
    function finish(timeout) {
      if (done) return; done = true; clearTimers();
      submitAnswer(input.value, timeout);
    }
    $('#aForm').addEventListener('submit', function (e) { e.preventDefault(); finish(false); });
    every(function () {
      var left = SECS - (performance.now() - start) / 1000;
      if (left <= 0) { finish(true); return; }
      $('#tFill').style.width = (left / SECS * 100) + '%';
      $('#tSecs').textContent = Math.ceil(left) + 's';
      var bar = $('#tBar'); bar.classList.toggle('warn', left <= 10 && left > 5); bar.classList.toggle('danger', left <= 5);
    }, 100);
  }

  function submitAnswer(value, timeout) {
    var p = session.players[session.p], q = session.questions[session.q];
    var j = F.judge(q, value), res;
    if (j.status === 'ok') res = { qid: q.id, input: value.trim(), name: j.entry.name, tier: j.entry.tier, points: j.points, status: 'ok' };
    else res = { qid: q.id, input: value.trim(), name: null, tier: null, points: 0, status: timeout && !value.trim() ? 'timeout' : (j.status === 'empty' ? 'empty' : 'miss') };
    p.results.push(res);
    if (session.mode === 'daily') {
      var rec = getRec(p.email, session.date); rec.results.push(res); setRec(p.email, session.date, rec);
    }
    showFeedback(res);
  }

  function showFeedback(res) {
    var p = session.players[session.p], qi = session.q;
    var head, flavour;
    if (res.status === 'ok') { head = '<span class="chip t' + res.tier + '">' + F.TIER_NAMES[res.tier] + '</span>'; flavour = res.tier >= 3 ? 'WHAT A STRIKE!' : res.tier === 2 ? 'Nice finish.' : res.tier === 1 ? 'On target.' : 'A tap-in.'; }
    else if (res.status === 'timeout') { head = '<span class="chip miss">Full time!</span>'; flavour = 'You ran out of the clock.'; }
    else { head = '<span class="chip miss">Offside!</span>'; flavour = res.status === 'empty' ? 'No answer entered.' : 'That one is not on the team sheet.'; }
    var counted = res.status === 'ok' && res.name.toLowerCase() !== res.input.toLowerCase() ? '<div class="said muted">Counted as: ' + esc(res.name) + '</div>' : '';
    var last = qi === QN - 1;
    stage.innerHTML = '<div class="card px">' + topLine(p, qi) + pipsHTML(p, qi + 1) + '<div class="feedback">' + head +
      '<div class="pts sparkle' + (res.points ? '' : ' zero') + '">+' + res.points + '</div><div>' + flavour + '</div>' +
      (res.input ? '<div class="said">You said: ' + esc(res.input) + '</div>' : '') + counted + '</div>' + meterHTML(playerTotal(p)) +
      '<div class="btn-row" style="justify-content:center"><button class="btn-px" id="nextBtn">' + (last ? 'Full time' : 'Next question') + '</button></div></div>';
    var advanced = false;
    function next() { if (advanced) return; advanced = true; clearTimers(); advance(); }
    $('#nextBtn').addEventListener('click', next); $('#nextBtn').focus();
    later(next, 2600);
  }

  function advance() {
    if (session.q < QN - 1) { session.q++; beginQuestion(); return; }
    finishPlayer();
  }

  function finishPlayer() {
    var p = session.players[session.p];
    if (session.mode === 'daily') {
      var user = currentUser(), rec = finalizeRec(user, session.date);
      session.active = false; renderLeaderboard(); renderResults(rec, user); return;
    }
    p.total = playerTotal(p);
    if (session.p < session.players.length - 1) { session.p++; session.q = 0; showPass(); }
    else { session.active = false; renderMultiResults(); }
  }

  /* ---------- results (daily) ---------- */
  function rarestHint(q) {
    var c = F.compile(q), top = -1, i;
    c.entries.forEach(function (e) { if (e.tier > top) top = e.tier; });
    var pool = c.entries.filter(function (e) { return e.tier === top; });
    return pool.length ? { name: pool[q.id % pool.length].name, tier: top } : null;
  }
  function rowsHTML(results) {
    return '<div class="rows">' + results.map(function (r, i) {
      var q = byId[r.qid], hint = rarestHint(q);
      var chip = r.status === 'ok' ? '<span class="chip t' + r.tier + '">' + F.TIER_NAMES[r.tier] + '</span>' : '<span class="chip miss">' + (r.status === 'miss' ? 'No match' : r.status === 'abandoned' ? 'Left early' : 'Time up') + '</span>';
      return '<div class="row"><div class="rq">' + (i + 1) + '. ' + esc(q.prompt) + '</div>' +
        '<div class="ans">' + (r.input ? esc(r.input) : '<span class="muted">(no answer)</span>') + (r.status === 'ok' && r.name.toLowerCase() !== r.input.toLowerCase() ? ' <span class="muted">&rarr; ' + esc(r.name) + '</span>' : '') + '<br>' + chip + '</div>' +
        '<div class="rpts">' + r.points + '</div>' +
        (hint ? '<div class="rare">Rarest accepted answer: ' + esc(hint.name) + ' (' + F.TIER_POINTS[hint.tier] + ')</div>' : '') + '</div>';
    }).join('') + '</div>';
  }
  var SQUARES = ['\u2B1C', '\uD83D\uDFE9', '\uD83D\uDFE8', '\uD83D\uDFE7', '\uD83D\uDFEA'];
  function shareText(rec) {
    var sq = rec.results.map(function (r) { return r.status === 'ok' ? SQUARES[r.tier] : '\u2B1B'; }).join('');
    return 'Footillion #' + Math.max(1, F.dayNumber(new Date(rec.started || Date.now())) - EPOCH + 1) + ' \u26BD ' + rec.total + '/' + F.MAX_SCORE + '\n' + sq + '\n' + F.rankFor(rec.total);
  }

  function renderResults(rec, user) {
    clearTimers();
    stage.innerHTML = '<div class="card px"><h2 class="center">' + (session && session.mode === 'daily' ? 'FULL TIME!' : "TODAY'S RESULT") + '</h2>' +
      '<div class="big-score">' + rec.total + '<small> / ' + F.MAX_SCORE + '</small></div><div class="rank-title">' + esc(F.rankFor(rec.total)) + ' &middot; ' + esc(user.name) + '</div>' +
      rowsHTML(rec.results) +
      '<div class="locked-note">You have used today\'s attempt. A fresh round unlocks in<div class="countdown" id="cdown">' + fmtCountdown(nextMidnight()) + '</div></div>' +
      '<div class="btn-row" style="justify-content:center"><button class="btn-px" id="shareBtn">Copy result</button><button class="btn-px ghost" id="goMulti">Multiplayer</button></div><p class="ok center" id="shareMsg"></p></div>';
    $('#shareBtn').addEventListener('click', function () {
      var txt = shareText(rec), msg = $('#shareMsg');
      function ok() { msg.textContent = 'Copied to clipboard!'; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, function () { msg.textContent = txt; });
      else msg.textContent = txt;
    });
    $('#goMulti').addEventListener('click', renderMultiSetup);
    every(function () {
      var ms = nextMidnight(); $('#cdown').textContent = fmtCountdown(ms);
      if (ms <= 1000) renderHome();
    }, 1000);
  }

  /* ---------- multiplayer (1-8 players, one device, same questions) ---------- */
  var mpNames = [];
  function renderMultiSetup(keepCount) {
    clearTimers(); session = null;
    var user = currentUser(), count = typeof keepCount === 'number' ? keepCount : Math.min(8, Math.max(1, mpNames.length || 2));
    while (mpNames.length < 8) mpNames.push('');
    function draw() {
      var btns = '', inputs = '';
      for (var i = 1; i <= 8; i++) btns += '<button type="button" data-n="' + i + '" class="' + (i === count ? 'on' : '') + '">' + i + '</button>';
      for (var k = 0; k < count; k++) {
        var val = mpNames[k] || (k === 0 && user ? user.name : '');
        inputs += '<label>PLAYER ' + (k + 1) + '<input type="text" maxlength="14" data-k="' + k + '" value="' + esc(val) + '" placeholder="Player ' + (k + 1) + '"></label>';
      }
      stage.innerHTML = '<div class="card px"><h2>MULTIPLAYER</h2><p class="muted">1-8 players share this device. Everyone gets the same ' + QN + ' questions, one player at a time. Highest score wins. Multiplayer rounds are for fun and do not use up your daily attempt.</p>' +
        '<div class="muted">HOW MANY PLAYERS?</div><div class="count-pick" id="cPick">' + btns + '</div><div class="names" id="nBox">' + inputs + '</div>' +
        '<div class="btn-row"><button class="btn-px big" id="mpStart">Start match</button><button class="btn-px ghost" id="mpBack">Back</button></div></div>';
      $$('#cPick button').forEach(function (b) { b.addEventListener('click', function () { saveNames(); count = +b.getAttribute('data-n'); draw(); }); });
      $('#mpBack').addEventListener('click', renderHome);
      $('#mpStart').addEventListener('click', function () { saveNames(); startMulti(count); });
    }
    function saveNames() { $$('#nBox input').forEach(function (inp) { mpNames[+inp.getAttribute('data-k')] = inp.value; }); }
    draw();
  }

  function startMulti(count, sameQuestions) {
    var names = [];
    for (var i = 0; i < count; i++) names.push((mpNames[i] || '').trim() || (i === 0 && currentUser() ? currentUser().name : 'Player ' + (i + 1)));
    var avoid = (Store.get('mpLast', []) || []).concat(F.dailyRound(BANK, F.dayNumber(now())).map(function (q) { return q.id; }));
    var qs = sameQuestions || F.randomRound(BANK, avoid);
    Store.set('mpLast', qs.map(function (q) { return q.id; }));
    session = { mode: 'multi', active: true, questions: qs, players: names.map(function (n) { return { name: n, results: [] }; }), p: 0, q: 0 };
    if (count > 1) showPass(); else beginQuestion();
  }

  function showPass() {
    clearTimers();
    var p = session.players[session.p];
    stage.innerHTML = '<div class="card px center"><div class="muted">PLAYER ' + (session.p + 1) + ' OF ' + session.players.length + '</div>' +
      '<h2 style="margin-top:14px">PASS THE DEVICE TO</h2><div class="big-score" style="font-size:clamp(20px,5vw,36px)">' + esc(p.name) + '</div>' +
      '<p class="muted">Don\'t peek at the answers!</p><div class="btn-row" style="justify-content:center"><button class="btn-px big" id="ready">I\'m ready</button></div></div>';
    $('#ready').addEventListener('click', beginQuestion); $('#ready').focus();
  }

  function renderMultiResults() {
    clearTimers();
    var ps = session.players.slice().sort(function (a, b) { return b.total - a.total; });
    var rank = 0, prev = null, ranked = ps.map(function (p, i) { if (p.total !== prev) { rank = i + 1; prev = p.total; } return { p: p, rank: rank }; });
    var top = ranked[0].p.total, winners = ranked.filter(function (r) { return r.p.total === top; });
    var banner = session.players.length === 1 ? 'You scored ' + top : winners.length > 1 ? "IT'S A DRAW: " + winners.map(function (w) { return esc(w.p.name); }).join(' & ') : 'WINNER: ' + esc(winners[0].p.name) + '!';
    var ord = ['1ST', '2ND', '3RD'];
    var head = '<tr><th>Question</th>' + session.players.map(function (p) { return '<th>' + esc(p.name) + '</th>'; }).join('') + '</tr>';
    var body = session.questions.map(function (q, qi) {
      return '<tr><td>' + (qi + 1) + '. ' + esc(q.prompt.length > 34 ? q.prompt.slice(0, 32) + '..' : q.prompt) + '</td>' + session.players.map(function (p) {
        var r = p.results[qi]; return '<td>' + (r.status === 'ok' ? '<span class="chip t' + r.tier + '">' + r.points + '</span>' : '<span class="chip miss">0</span>') + '</td>';
      }).join('') + '</tr>';
    }).join('');
    stage.innerHTML = '<div class="card px"><h2 class="center">FULL TIME!</h2><div class="winner">' + banner + '</div>' +
      '<table class="board"><tr><th>Rank</th><th>Player</th><th>Score</th><th>Title</th></tr>' + ranked.map(function (r) {
        return '<tr class="' + (r.p.total === top ? 'win' : '') + '"><td>' + (ord[r.rank - 1] || r.rank + 'TH') + '</td><td>' + esc(r.p.name) + '</td><td>' + r.p.total + '</td><td>' + esc(F.rankFor(r.p.total)) + '</td></tr>';
      }).join('') + '</table>' +
      '<h2 style="margin-top:22px;font-size:12px">QUESTION BY QUESTION</h2><div class="scroll-x"><table class="board">' + head + body + '</table></div>' +
      '<div class="btn-row"><button class="btn-px" id="rematch">New questions</button><button class="btn-px green" id="same">Same questions</button><button class="btn-px ghost" id="mpHome">Home</button></div></div>';
    var n = session.players.length, qs = session.questions;
    $('#rematch').addEventListener('click', function () { startMulti(n); });
    $('#same').addEventListener('click', function () { startMulti(n, qs); });
    $('#mpHome').addEventListener('click', renderHome);
  }

  /* ---------- boot ---------- */
  window.addEventListener('storage', function () { renderLeaderboard(); renderMenuUser(); });
  renderMenuUser();
  renderHome();
  window.__footillion = { renderHome: renderHome };
})();
