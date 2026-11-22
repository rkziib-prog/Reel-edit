// puzzle.js: Pathira Puzzle #2 "Ammooma's lock code" (full-screen 1080x1920). One continuous scene; elements appear on
// the narration lines (PT.starts/ends, video time). Answer: 719 (unique; checked by script). Never show it in this reel.
(() => {
  const P = {
    bg: '#141B36', bg2: '#1F2A55', card: '#FFF8EA', ink: PAL.ink, gold: '#E8B23A', red: '#D8423A', green: '#3FAF5A', orange: '#F08A2E',
    wood: '#8A5A34', woodDk: '#5E3C22', brass: '#D9A441', brassDk: '#A67A2A', blue: '#3FA7E0', white: '#F3EFE6'
  };
  const S = PT.starts, E = PT.ends, END = PT.total;
  const ZERO = S[10] - .1;                 // the timer reaches 0 just as the "comment" line starts
  const on = (t, t0) => t >= t0;
  const pop = (t, t0) => (t - t0) * 4;
  function card(x, y, w, h, col, key) { boilSeed('cd' + key); paint(rrPts(x - w / 2, y - h / 2, w, h, 26), { wash: col, ink: P.ink, sw: 1.4 }); }
  function tile(x, y, d, key, hi = null) { boilSeed('tl' + key); paint(rrPts(x - 52, y - 60, 104, 120, 18), { wash: hi || P.white, ink: P.ink, sw: 1.3 }); letter(d, x, y + 4, 80, P.ink); }
  function dot(x, y, col, key) { boilSeed('dt' + key); paint(ellPts(x, y, 24, 24, 14), { wash: col, ink: P.ink, sw: 1 }); }
  function cross(x, y, key) { boilSeed('cx' + key); inkLine([[x - 22, y - 22], [x + 22, y + 22]], 5, P.red, 'ink', 0); inkLine([[x - 22, y + 22], [x + 22, y - 22]], 5, P.red, 'ink', 0); }

  function scene(t, lt, dur) {
    // background: night sky, stars, a soft lamp glow (the account's 2 AM look)
    boilSeed('bg'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: P.bg, ink: null });
    paint(ellPts(W / 2, H * .35, W * .9, H * .35, 30, 6), { wash: P.bg2, washOp: 200, ink: null });
    for (let i = 0; i < 40; i++) { boilSeed('st' + i); const tw = .6 + .4 * Math.sin(t * 2 + i); paint(starPts(hash(i) * W, hash(i + 50) * H * .55, 3 + 3 * hash(i + 3), .35, 4), { wash: P.white, washOp: 120 * tw, ink: null }); }

    // top bar: series tag + countdown timer
    card(260, 170, 420, 90, P.red, 'tag'); letter('PATHIRA PUZZLE #2', 260, 172, 42, '#FFFFFF');
    const secs = t < ZERO - 30 ? 30 : Math.max(0, Math.ceil(ZERO - t));
    const urgent = secs <= 5 && t > ZERO - 5;
    card(870, 170, 280, 100, urgent ? P.red : P.card, 'timer'); letter('00:' + String(secs).padStart(2, '0'), 870, 173, 64, urgent ? '#FFFFFF' : P.ink);

    // trunk + padlock (appears with line 2)
    if (on(t, S[1] - .2) && !on(t, S[10])) {
      const k = easeOut(seg(t, S[1] - .2, S[1] + .4)), ty = lerp(900, 560, k);
      boilSeed('trunk'); paint(rrPts(190, ty - 150, 700, 300, 30), { wash: P.wood, ink: P.ink, sw: 1.6 });
      paint(rrPts(190, ty - 190, 700, 90, 30), { wash: P.woodDk, ink: P.ink, sw: 1.4 });
      for (const bx of [270, 790]) paint(rectPts(bx - 18, ty - 190, 36, 340), { wash: P.brassDk, ink: P.ink, sw: .8 });
      const glowK = on(t, S[8]) ? .5 + .2 * Math.sin(t * 6) : 0;
      if (glowK) glow(540, ty - 40, 260, '#FFE27A', glowK);
      boilSeed('lock'); inkLine([[470, ty - 110], [470, ty - 190], [610, ty - 190], [610, ty - 110]], 10, P.brassDk, 'ink', .6);
      paint(rrPts(400, ty - 120, 280, 200, 26), { wash: P.brass, ink: P.ink, sw: 1.4 });
      for (let i = 0; i < 3; i++) { boilSeed('wh' + i); paint(rrPts(430 + i * 78, ty - 70, 64, 96, 10), { wash: '#2E2A36', ink: P.ink, sw: .8 }); letter('?', 462 + i * 78, ty - 20, 64, P.gold); }
    }

    // the five clues stack up (lines 4-8)
    const clues = [['743', [['g']], '1 correct, right place'], ['370', [['o']], '1 correct, wrong place'], ['091', [['o'], ['o']], '2 correct, wrong places'],
                   ['826', [['x']], 'nothing correct'], ['390', [['o']], '1 correct, wrong place']];
    if (on(t, S[2] + .3)) { card(540, 790, 520, 80, P.gold, 'note'); letter("AMMOOMA'S 5 CLUES", 540, 792, 40, P.ink); }
    clues.forEach(([digits, marks, label], i) => {
      const t0 = S[3 + i]; if (!on(t, t0)) return;
      const y = 900 + i * 118, k = clamp(pop(t, t0));
      for (let j = 0; j < 3; j++) tile(130 + j * 112, y, digits[j], i + '' + j);
      marks.forEach(([m], j) => { const mx = 500 + j * 62; if (k < .5) return; if (m === 'x') cross(mx, y, 'x' + i); else dot(mx, y, m === 'g' ? P.green : P.orange, i + '' + j); });
      letter(label, 830, y + 2, 38, P.white, { pop: k * 2 });
    });

    // question, think, comment, follow
    if (on(t, S[8]) && !on(t, S[10])) { card(540, 310, 640, 100, P.card, 'q'); letter('CODE = ? ? ?', 540, 312, 66, P.ink, { pop: pop(t, S[8]) }); }
    if (on(t, S[9]) && !on(t, S[10])) { const pulse = 1 + .05 * Math.sin(t * 8); card(540, 600, 600 * pulse, 110, P.red, 'think'); letter('PAUSE & THINK', 540, 602, 60, '#FFFFFF'); }
    if (on(t, S[10])) { boilSeed('cover'); paint(rrPts(80, 260, 920, 480, 40), { wash: P.bg2, ink: P.ink, sw: 1.6 }); }
    if (on(t, S[10]) && !on(t, S[11])) { card(540, 400, 800, 140, P.gold, 'cm'); letter('COMMENT THE CODE!', 540, 402, 66, P.ink, { pop: pop(t, S[10]) });
      boilSeed('tagic'); paint(ellPts(540, 600, 70, 70, 20), { wash: P.blue, ink: P.ink, sw: 1.2 }); letter('@', 540, 602, 80, '#FFFFFF'); }
    if (on(t, S[11])) {
      const press = t > END - 1.6;
      boilSeed('pfp'); paint(ellPts(540, 400, 120, 120, 28), { wash: '#2F3C7A', ink: P.white, sw: 2 });
      person(522, 500, 10, { key: 'hero', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short', eyes: 'wide', mouth: 'grin', armF: .3, armB: .2 });
      card(540, 630, 380, 90, press ? '#3A3F6A' : P.blue, press ? 'f2' : 'f1'); letter(press ? 'Following' : 'Follow', 540, 632, 52, '#FFFFFF', { pop: press ? (t - (END - 1.6)) * 5 : 1 });
    }

    // HOOK: big banner for the first ~3.4 s
    if (t < E[0] + .2) {
      const k = t < E[0] - .2 ? 1 : 1 - (t - (E[0] - .2)) / .4;
      boilSeed('hook'); paint(rrPts(60, 640, 960, 400, 40), { wash: P.red, washOp: 255 * k, ink: P.ink, sw: 2 });
      letter('ONLY GENIUSES', 540, 770, 110, '#FFFFFF', { pop: t * 4, alpha: k, stroke: '#7A1E18' });
      letter('CRACK THIS', 540, 910, 110, P.gold, { pop: (t - .2) * 4, alpha: k, stroke: '#7A1E18' });
    }
    if (t < .4) flash(1 - easeOut(t / .4), '#FFFFFF');
    if (t > END - .6) flash(seg(t, END - .6, END - .05), '#0B0D18');
  }

  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  shots([[0, (t, lt, dur) => { base(P.bg); scene(t, lt, dur); }]]);
})();
