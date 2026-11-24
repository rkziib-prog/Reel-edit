// puzzle.js: Pathira Puzzle #3 "Chayakkada bench" (full-screen 1080x1920). One continuous scene; elements appear on
// the narration lines (PT.starts/ends, video time). Answer: Dinu drinks kaapi (unique; edits/puzzle3/check.py).
// Never show the answer or the seating solution in this reel.
(() => {
  const P = {
    bg: '#141B36', bg2: '#1F2A55', card: '#FFF8EA', ink: PAL.ink, gold: '#E8B23A', red: '#D8423A', green: '#3FAF5A', orange: '#F08A2E',
    wood: '#8A5A34', woodDk: '#5E3C22', blue: '#3FA7E0', white: '#F3EFE6', shadow: '#2B3566', steel: '#B9BEC8',
    chaya: '#C99A68', kaapi: '#4A2A18', sulai: '#C9661E', boost: '#6B3A1E', glass: '#DDE8F0'
  };
  const S = PT.starts, E = PT.ends, END = PT.total;
  const ZERO = S[12] - .1;                 // the timer reaches 0 just as the "comment" line starts
  const off = S[2] - 10.19, off4 = S[3] - 15.61;   // recording -> video time for lines 3 and 4
  const on = (t, t0) => t >= t0;
  const pop = (t, t0) => (t - t0) * 4;
  const SEATS = [240, 440, 640, 840];
  const NAMES = [['ANU', P.red], ['BINU', P.blue], ['CHINNU', P.green], ['DINU', P.orange]];
  const NAME_T = [12.68, 13.46, 14.06, 14.84].map(v => v + off);
  const DRINKS = [['CHAYA', 'chaya'], ['KAAPI', 'kaapi'], ['SULAIMANI', 'sulai'], ['BOOST', 'boost']];
  const DRINK_T = [21.46, 21.92, 22.68, 23.28].map(v => v + off4);
  function card(x, y, w, h, col, key) { boilSeed('cd' + key); paint(rrPts(x - w / 2, y - h / 2, w, h, 24), { wash: col, ink: P.ink, sw: 1.4 }); }

  function cup(x, y, kind, s = 1) {           // drink icon, centred on (x, y)
    boilSeed('cup' + kind + x);
    const w = 56 * s, h = 70 * s;
    if (kind === 'boost') {
      inkLine([[x + w / 2 - 4, y - h * .25], [x + w / 2 + 16 * s, y - h * .2], [x + w / 2 + 16 * s, y + h * .15], [x + w / 2 - 4, y + h * .2]], 6 * s, P.ink, 'ink', .3);
      paint(rrPts(x - w / 2, y - h / 2, w, h, 10 * s), { wash: P.boost, ink: P.ink, sw: 1.2 });
      paint(ellPts(x, y - h / 2 + 6 * s, w * .8, 10 * s, 12), { wash: '#A0673A', ink: null });
      return;
    }
    const shell = kind === 'kaapi' ? P.steel : P.glass;
    paint(rrPts(x - w / 2, y - h / 2, w, h, 8 * s), { wash: shell, ink: P.ink, sw: 1.2 });
    paint(rrPts(x - w / 2 + 6 * s, y - h / 2 + 16 * s, w - 12 * s, h - 22 * s, 6 * s), { wash: P[kind], ink: null });
    if (kind === 'chaya') paint(rrPts(x - w / 2 + 6 * s, y - h / 2 + 12 * s, w - 12 * s, 10 * s, 4 * s), { wash: '#F4E3C4', ink: null });
    if (kind === 'sulai') { boilSeed('lem' + x); paint(ellPts(x + w / 2 - 4 * s, y - h / 2 + 4 * s, 26 * s, 26 * s, 14), { wash: '#E6D84A', ink: P.ink, sw: .8 }); }
  }

  function scene(t, lt, dur) {
    // background: night sky, stars, a soft glow (the account's 2 AM look)
    boilSeed('bg'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: P.bg, ink: null });
    paint(ellPts(W / 2, H * .35, W * .9, H * .35, 30, 6), { wash: P.bg2, washOp: 200, ink: null });
    for (let i = 0; i < 40; i++) { boilSeed('st' + i); const tw = .6 + .4 * Math.sin(t * 2 + i); paint(starPts(hash(i) * W, hash(i + 50) * H * .55, 3 + 3 * hash(i + 3), .35, 4), { wash: P.white, washOp: 120 * tw, ink: null }); }

    // top bar: series tag + countdown timer
    card(260, 170, 420, 90, P.red, 'tag'); letter('PATHIRA PUZZLE #3', 260, 172, 42, '#FFFFFF');
    const secs = t < ZERO - 30 ? 30 : Math.max(0, Math.ceil(ZERO - t));
    const urgent = secs <= 5 && t > ZERO - 5;
    card(870, 170, 280, 100, urgent ? P.red : P.card, 'timer'); letter('00:' + String(secs).padStart(2, '0'), 870, 173, 64, urgent ? '#FFFFFF' : P.ink);

    // line 1: last puzzle's answer
    if (on(t, 2.6) && !on(t, S[1] - .1)) {
      const k = pop(t, 2.6);
      card(540, 640, 720, 110, P.gold, 'last'); letter('LAST ANSWER', 540, 642, 64, P.ink, { pop: k });
      for (let i = 0; i < 3; i++) { card(380 + i * 160, 830, 130, 160, P.green, 'ans' + i); letter('719'[i], 380 + i * 160, 836, 110, '#FFFFFF', { pop: k - .3 - i * .3 }); }
      if (on(t, 3.0 + .4)) letter('WELL DONE!', 540, 1010, 64, P.gold, { pop: pop(t, 3.4), stroke: '#7A1E18' });
    }
    // line 2: only 3 in 100
    if (on(t, S[1] - .1) && !on(t, S[2] - .1)) {
      card(540, 400, 640, 110, P.red, 'hard'); letter('EVEN HARDER', 540, 402, 66, '#FFFFFF', { pop: pop(t, S[1]) });
      push(); stroke(P.ink); strokeWeight(3);
      for (let i = 0; i < 100; i++) {
        const gx = 315 + (i % 10) * 50, gy = 560 + Math.floor(i / 10) * 50, lit = [34, 57, 82].includes(i) && t > S[1] + 2.2;
        if (t < S[1] + i * .012) continue;
        fill(lit ? P.gold : P.shadow); circle(gx, gy, lit ? 40 : 30);
      }
      pop();
      if (on(t, S[1] + 2.2)) letter('ONLY 3 IN 100', 540, 1150, 72, P.gold, { pop: pop(t, S[1] + 2.2), stroke: '#7A1E18' });
    }

    // the bench + 4 seats (line 3 on)
    if (on(t, S[2] - .2) && !on(t, S[12])) {
      const k = easeOut(seg(t, S[2] - .2, S[2] + .4)), by = lerp(820, 600, k);
      for (let i = 0; i < 4; i++) {                    // mystery sitters
        const x = SEATS[i]; boilSeed('sh' + i);
        paint(rrPts(x - 55, by - 150, 110, 150, 40), { wash: P.shadow, ink: P.ink, sw: 1 });
        paint(ellPts(x, by - 195, 80, 80, 20), { wash: P.shadow, ink: P.ink, sw: 1 });
        if (!on(t, S[11])) letter('?', x, by - 192, 60, P.gold);
      }
      boilSeed('bench'); paint(rrPts(130, by, 820, 44, 12), { wash: P.wood, ink: P.ink, sw: 1.5 });
      for (const lx of [170, 910]) paint(rectPts(lx - 12, by + 40, 24, 70), { wash: P.woodDk, ink: P.ink, sw: 1 });
      const lr = on(t, 16.9 + off4) ? clamp((t - (16.9 + off4)) / 1.2) : -1;   // "left to right" sweep
      for (let i = 0; i < 4; i++) {
        const hi = lr >= 0 && lr * 4 > i;
        boilSeed('no' + i); paint(ellPts(SEATS[i], by + 22, 44, 44, 16), { wash: hi ? P.gold : P.card, ink: P.ink, sw: 1 });
        letter(String(i + 1), SEATS[i], by + 24, 34, P.ink, { pop: on(t, S[3]) ? pop(t, S[3] + i * .2) : 1 });
      }
      if (on(t, 16.9 + off4) && !on(t, S[4])) { const ax = lerp(200, 880, clamp((t - (16.9 + off4)) / 1.2)); boilSeed('arr'); inkLine([[200, by + 80], [ax, by + 80]], 8, P.gold, 'ink', 0); inkLine([[ax - 26, by + 62], [ax, by + 80], [ax - 26, by + 98]], 8, P.gold, 'ink', 0); }
    }

    // legend: names (line 3) and drinks (line 4)
    if (!on(t, S[12])) {
      NAMES.forEach(([n, c], i) => { if (!on(t, NAME_T[i])) return; const x = 165 + i * 250; card(x, 800, 210, 70, c, 'nm' + i); letter(n, x, 802, 40, '#FFFFFF', { pop: pop(t, NAME_T[i]) }); });
      DRINKS.forEach(([n, kind], i) => { if (!on(t, DRINK_T[i])) return; const x = 165 + i * 250; cup(x, 880, kind, .8); letter(n, x, 940, 30, P.white, { pop: pop(t, DRINK_T[i]) }); });
    }

    // the six clues stack up (lines 5-10)
    const clues = ['BOOST sits at one END', 'ANU sits next to KAAPI', 'BINU is just RIGHT of SULAIMANI',
                   'CHINNU: not seat 1, not CHAYA', 'CHAYA is in SEAT 2', 'ANU is NOT at an end'];
    if (!on(t, S[12])) clues.forEach((c, i) => {
      const t0 = S[4 + i]; if (!on(t, t0)) return;
      const y = 1010 + i * 80, now = t < E[4 + i] + .3;
      card(560, y, 900, 68, now ? P.gold : P.card, 'cl' + i);
      boilSeed('bd' + i); paint(ellPts(150, y, 52, 52, 16), { wash: P.red, ink: P.ink, sw: 1 }); letter(String(i + 1), 150, y + 2, 36, '#FFFFFF');
      letter(c, 590, y + 2, 38, P.ink, { pop: pop(t, t0) });
    });

    // question, think, comment, follow
    if (on(t, S[10]) && !on(t, S[12])) { card(540, 290, 760, 100, P.card, 'q'); letter('WHAT DOES DINU DRINK?', 540, 292, 54, P.ink, { pop: pop(t, S[10]) }); }
    if (on(t, S[11]) && !on(t, S[12])) { const pulse = 1 + .05 * Math.sin(t * 8); card(540, 420, 600 * pulse, 110, P.red, 'think'); letter('PAUSE & THINK', 540, 422, 60, '#FFFFFF'); }
    if (on(t, S[12]) && !on(t, S[13])) {
      card(540, 520, 860, 140, P.gold, 'cm'); letter('COMMENT YOUR ANSWER!', 540, 522, 62, P.ink, { pop: pop(t, S[12]) });
      DRINKS.forEach(([n, kind], i) => cup(255 + i * 190, 760, kind, 1.3));
      letter('CHAYA?  KAAPI?  SULAIMANI?  BOOST?', 540, 880, 34, P.white);
      boilSeed('tagic'); paint(ellPts(380, 1060, 90, 90, 20), { wash: P.blue, ink: P.ink, sw: 1.2 }); letter('@', 380, 1062, 80, '#FFFFFF');
      letter('TAG A FRIEND', 630, 1062, 52, P.white, { pop: pop(t, S[12] + 2.5) });
    }
    if (on(t, S[13])) {
      const press = t > END - 1.6;
      letter('ANSWER IN THE NEXT PUZZLE', 540, 300, 50, P.gold, { pop: pop(t, S[13]) });
      boilSeed('pfp'); paint(ellPts(540, 520, 120, 120, 28), { wash: '#2F3C7A', ink: P.white, sw: 2 });
      person(522, 620, 10, { key: 'hero', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short', eyes: 'wide', mouth: 'grin', armF: .3, armB: .2 });
      card(540, 750, 380, 90, press ? '#3A3F6A' : P.blue, press ? 'f2' : 'f1'); letter(press ? 'Following' : 'Follow', 540, 752, 52, '#FFFFFF', { pop: press ? (t - (END - 1.6)) * 5 : 1 });
    }

    // HOOK: big banner for the first ~2.5 s
    if (t < 2.6) {
      const k = t < 2.2 ? 1 : 1 - (t - 2.2) / .4;
      boilSeed('hook'); paint(rrPts(60, 640, 960, 400, 40), { wash: P.red, washOp: 255 * k, ink: k > .9 ? P.ink : null, sw: 2 });
      letter('ONLY 3% CAN', 540, 770, 110, '#FFFFFF', { pop: t * 4, alpha: k, stroke: '#7A1E18' });
      letter('SOLVE THIS', 540, 910, 110, P.gold, { pop: (t - .2) * 4, alpha: k, stroke: '#7A1E18' });
    }
    if (t < .4) flash(1 - easeOut(t / .4), '#FFFFFF');
    if (t > END - .6) flash(seg(t, END - .6, END - .05), '#0B0D18');
  }

  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  shots([[0, (t, lt, dur) => { base(P.bg); scene(t, lt, dur); }]]);
})();
