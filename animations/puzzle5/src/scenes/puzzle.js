// puzzle.js: Pathira Puzzle #5 "Ammooma's market" (full-screen 1080x1920, simple). Answer 22 (edits/puzzle5/check.py):
// coconut 10, banana 2 (bunch of 4 = 8), unniyappam 2; 10 + 3x2 x 2 = 22. Never show the answer or the item values.
(() => {
  const P = {
    bg: '#141B36', bg2: '#1F2A55', card: '#FFF8EA', ink: PAL.ink, gold: '#E8B23A', red: '#D8423A', green: '#3FAF5A', orange: '#F08A2E',
    blue: '#3FA7E0', white: '#F3EFE6', steel: '#B9BEC8', kaapi: '#4A2A18', chaya: '#C99A68', glass: '#DDE8F0',
    coco: '#6B4226', cocoDk: '#3E2414', husk: '#8E6A3A', banana: '#F2D23C', bananaDk: '#9A7A1A', stem: '#5C7A2E', appam: '#B5651D', appamDk: '#7A3E12'
  };
  const S = PT.starts, E = PT.ends, END = PT.total;
  const ZERO = S[7] - .1;                  // the 10 s timer reaches 0 as the "comment" line starts
  const on = (t, t0) => t >= t0;
  const pop = (t, t0) => (t - t0) * 4;
  function card(x, y, w, h, col, key) { boilSeed('cd' + key); paint(rrPts(x - w / 2, y - h / 2, w, h, 24), { wash: col, ink: P.ink, sw: 1.4 }); }

  function cup(x, y, kind, s = 1) {
    boilSeed('cup' + kind + x + y); const w = 56 * s, h = 70 * s;
    paint(rrPts(x - w / 2, y - h / 2, w, h, 8 * s), { wash: kind === 'kaapi' ? P.steel : P.glass, ink: P.ink, sw: 1.2 });
    paint(rrPts(x - w / 2 + 6 * s, y - h / 2 + 16 * s, w - 12 * s, h - 22 * s, 6 * s), { wash: P[kind], ink: null });
    if (kind === 'chaya') paint(rrPts(x - w / 2 + 6 * s, y - h / 2 + 12 * s, w - 12 * s, 10 * s, 4 * s), { wash: '#F4E3C4', ink: null });
  }
  function coconut(x, y, s = 1) {
    boilSeed('coco' + x + y);
    paint(ellPts(x, y, 92 * s, 84 * s, 22, 3), { wash: P.coco, ink: P.ink, sw: 1.2 });
    for (let i = 0; i < 3; i++) paint(ellPts(x - 16 * s + i * 16 * s, y - 18 * s + (i % 2) * 8 * s, 10 * s, 12 * s, 10), { wash: P.cocoDk, ink: null });
    for (let i = 0; i < 6; i++) inkLine([[x - 70 * s + i * 26 * s, y + 30 * s], [x - 60 * s + i * 26 * s, y + 50 * s]], 3 * s, P.husk, 'ink', .4);
  }
  function bunch(x, y, n, s = 1) {            // a bunch of n bananas hanging from a stem
    boilSeed('bn' + n + x + y);
    inkLine([[x, y - 70 * s], [x, y - 40 * s]], 10 * s, P.stem, 'ink', .3);
    for (let i = 0; i < n; i++) {
      const a = (i - (n - 1) / 2) * .38, bx = x + Math.sin(a) * 70 * s, by = y + Math.cos(a) * 10 * s;
      boilSeed('ba' + n + i + x + y);
      paint([[x + Math.sin(a) * 10 * s, y - 40 * s], [bx - 14 * s, by], [bx - 10 * s, by + 50 * s], [bx, by + 62 * s], [bx + 12 * s, by + 46 * s], [bx + 12 * s, by], [x + Math.sin(a) * 18 * s, y - 38 * s]],
            { wash: P.banana, ink: P.ink, sw: 1 });
      paint(ellPts(bx, by + 62 * s, 6 * s, 6 * s, 8), { wash: P.bananaDk, ink: null });
    }
  }
  function appam(x, y, s = 1) {               // unniyappam: round, golden-brown, dimpled
    boilSeed('ap' + x + y);
    paint(ellPts(x, y, 76 * s, 70 * s, 22, 3), { wash: P.appam, ink: P.ink, sw: 1.2 });
    paint(ellPts(x - 12 * s, y - 14 * s, 20 * s, 12 * s, 10), { wash: '#D98A3C', ink: null });
    for (let i = 0; i < 4; i++) paint(ellPts(x - 20 * s + i * 14 * s, y + 10 * s + (i % 2) * 8 * s, 5 * s, 5 * s, 8), { wash: P.appamDk, ink: null });
  }
  const item = (k, x, y, s) => k === 'T' ? coconut(x, y, s) : k === 'B' ? bunch(x, y, 4, s * 1.7) : k === 'b' ? bunch(x, y, 3, s * 1.7) : appam(x, y, s);

  // an equation row: tokens are 'P', 'V', 'C', or operator / number strings
  function row(tokens, y, t0, t, col = P.white) {
    const wd = tokens.map(tk => 'TBbU'.includes(tk) ? 175 : tk.length > 1 ? 150 : 85), tot = wd.reduce((a, b) => a + b, 0);
    let cx = 540 - tot / 2;
    tokens.forEach((tk, i) => {
      const x = cx + wd[i] / 2, k = pop(t, t0 + i * .12); cx += wd[i]; if (k <= 0) return;
      if ('TBbU'.includes(tk)) item(tk, x, y, (Math.min(1, k) * .95 + .05) * .68);
      else letter(tk, x, y + 4, tk.length > 1 ? 84 : 80, tk === '?' ? P.gold : col, { pop: k, stroke: tk.length > 1 || tk === '?' ? '#7A1E18' : undefined });
    });
  }

  function scene(t) {
    boilSeed('bg'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: P.bg, ink: null });
    paint(ellPts(W / 2, H * .35, W * .9, H * .35, 30, 6), { wash: P.bg2, washOp: 200, ink: null });
    for (let i = 0; i < 40; i++) { boilSeed('st' + i); const tw = .6 + .4 * Math.sin(t * 2 + i); paint(starPts(hash(i) * W, hash(i + 50) * H * .55, 3 + 3 * hash(i + 3), .35, 4), { wash: P.white, washOp: 120 * tw, ink: null }); }

    // top bar: series tag + 10 s timer
    card(260, 170, 420, 90, P.red, 'tag'); letter('PATHIRA PUZZLE #5', 260, 172, 42, '#FFFFFF');
    const secs = t < ZERO - 10 ? 10 : Math.max(0, Math.ceil(ZERO - t)), urgent = secs <= 3 && t > ZERO - 3;
    card(870, 170, 280, 100, urgent ? P.red : P.card, 'timer'); letter('00:' + String(secs).padStart(2, '0'), 870, 173, 64, urgent ? '#FFFFFF' : P.ink);

    // line 1: last puzzle's answer
    if (on(t, 2.6) && !on(t, S[1] - .1)) {
      const k = pop(t, 2.6);
      card(540, 600, 720, 110, P.gold, 'last'); letter('LAST ANSWER', 540, 602, 64, P.ink, { pop: k });
      card(540, 830, 360, 220, P.green, 'ans'); letter('53', 540, 836, 150, '#FFFFFF', { pop: k - .3 });
      if (on(t, 3.6)) { card(540, 1060, 760, 100, P.card, 'rule'); letter('×  FIRST,  THEN  +', 540, 1062, 58, P.ink, { pop: pop(t, 3.6) }); }
    }
    // line 2: simple... but most get it wrong
    if (on(t, S[1] - .1) && !on(t, S[2] - .1)) {
      card(540, 640, 640, 120, P.green, 'simple'); letter('SIMPLE?', 540, 642, 80, '#FFFFFF', { pop: pop(t, S[1]) });
      if (on(t, S[1] + 1.8)) { card(540, 840, 700, 120, P.red, 'wrong'); letter('ONE SMALL TRICK', 540, 842, 66, '#FFFFFF', { pop: pop(t, S[1] + 1.8) }); }
    }

    // the three clue rows + the question (lines 3-6)
    if (on(t, S[2] - .1) && !on(t, S[7])) {
      const rows = [[['T', '+', 'T', '+', 'T', '=', '30'], 420], [['T', '+', 'B', '=', '18'], 620], [['B', '+', 'U', '+', 'U', '=', '12'], 820]];
      rows.forEach(([tk, y], i) => { if (!on(t, S[2 + i])) return; const now = t < E[2 + i] + .3;
        if (now) { boilSeed('hl' + i); paint(rrPts(50, y - 85, 980, 170, 30), { wash: P.bg2, ink: P.gold, sw: 1.2 }); }
        row(tk, y, S[2 + i], t); });
      if (on(t, S[5])) {
        card(540, 1110, 1000, 250, P.card, 'qcard');
        row(['T', '+', 'b', '×', 'U', '=', '?'], 1110, S[5] + .3, t, P.ink);
      }
    }
    if (on(t, S[6]) && !on(t, S[7])) { const pulse = 1 + .05 * Math.sin(t * 8); card(540, 1330, 720 * pulse, 100, P.red, 'think'); letter('COUNT THE BANANAS!', 540, 1332, 56, '#FFFFFF'); }

    // comment, follow
    if (on(t, S[7]) && !on(t, S[8])) {
      card(540, 520, 860, 140, P.gold, 'cm'); letter('COMMENT YOUR ANSWER!', 540, 522, 62, P.ink, { pop: pop(t, S[7]) });
      card(540, 780, 900, 220, P.card, 'q2'); row(['T', '+', 'b', '×', 'U', '=', '?'], 780, S[7] - 1, t, P.ink);
      boilSeed('tagic'); paint(ellPts(330, 1040, 90, 90, 20), { wash: P.blue, ink: P.ink, sw: 1.2 }); letter('@', 330, 1042, 80, '#FFFFFF');
      letter('TAG A FRIEND', 640, 1042, 46, P.white, { pop: pop(t, S[7] + 2.0) });
    }
    if (on(t, S[8])) {
      const press = t > END - 1.6;
      letter('ANSWER IN THE NEXT PUZZLE', 540, 400, 50, P.gold, { pop: pop(t, S[8]) });
      boilSeed('pfp'); paint(ellPts(540, 620, 120, 120, 28), { wash: '#2F3C7A', ink: P.white, sw: 2 });
      person(522, 720, 10, { key: 'hero', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short', eyes: 'wide', mouth: 'grin', armF: .3, armB: .2 });
      card(540, 850, 380, 90, press ? '#3A3F6A' : P.blue, press ? 'f2' : 'f1'); letter(press ? 'Following' : 'Follow', 540, 852, 52, '#FFFFFF', { pop: press ? (t - (END - 1.6)) * 5 : 1 });
    }

    // HOOK banner, first ~2.5 s
    if (t < 2.6) {
      const k = t < 2.2 ? 1 : 1 - (t - 2.2) / .4;
      boilSeed('hook'); paint(rrPts(60, 640, 960, 400, 40), { wash: P.red, washOp: 255 * k, ink: k > .9 ? P.ink : null, sw: 2 });
      letter('SPOT THE', 540, 770, 120, '#FFFFFF', { pop: t * 4, alpha: k, stroke: '#7A1E18' });
      letter('TRICK', 540, 910, 130, P.gold, { pop: (t - .2) * 4, alpha: k, stroke: '#7A1E18' });
    }
    if (t < .4) flash(1 - easeOut(t / .4), '#FFFFFF');
    if (t > END - .6) flash(seg(t, END - .6, END - .05), '#0B0D18');
  }

  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  shots([[0, (t) => { base(P.bg); scene(t); }]]);
})();
