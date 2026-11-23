// lightning.js: "Why do we see lightning before thunder?" (Pathira Chindhakal explainer, FULL-SCREEN 1080x1920).
// One shot per narration line; visuals live in y 230-1420 (subtitles sit at y≈1490, Instagram UI below that).
(() => {
  const P = {
    sky: '#141B36', sky2: '#22305E', cloud: '#4A5274', cloudLt: '#6E7798', bolt: '#FFF6C8', boltGlow: '#BFD6FF', card: '#FFF8EA',
    ink: PAL.ink, gold: '#E8B23A', red: '#D8423A', green: '#3FAF5A', blue: '#3FA7E0', white: '#F3EFE6', ground: '#2E3A2E', rain: '#8FA6C8'
  };
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];
  const fadeIn = (lt, d = .25, c = '#FFFFFF') => { if (lt < d) flash(1 - easeOut(lt / d), c); };
  function card(x, y, w, h, title, sub, o = {}) {
    boilSeed('cd' + title + x + y); paint(rrPts(x - w / 2, y - h / 2, w, h, 26), { wash: o.col || P.card, ink: P.ink, sw: 1.4 });
    const sz = o.size || 64;
    if (title) letter(title, x, y - (sub ? h * .16 : 0), sz, o.ink || P.ink, { pop: o.pop });
    if (sub) letter(sub, x, y + h * .24, sz * .6, o.subInk || '#5E5A62', { pop: o.pop });
  }
  function sky(t, key = 'sky') {
    boilSeed(key); paint(rectPts(-60, -60, W + 120, H + 120), { wash: P.sky, ink: null });
    paint(ellPts(W / 2, 500, W * .9, 520, 30, 6), { wash: P.sky2, washOp: 200, ink: null });
  }
  function storm(x, y, s, key) { boilSeed('sc' + key); for (let i = 0; i < 5; i++) paint(ellPts(x + (i - 2) * 120 * s, y - (i % 2) * 50 * s, 170 * s, 110 * s, 18, 2), { wash: i % 2 ? P.cloudLt : P.cloud, ink: P.ink, sw: .8 }); }
  function rain(t, n = 40, key = 'rn') { for (let i = 0; i < n; i++) { boilSeed(key + i); const x = hash(i) * W, y = ((hash(i + 40) * H + t * 1300) % (H + 200)) - 100; inkLine([[x, y], [x - 10, y + 40]], .6, P.rain, 'inkfine', 0); } }
  function bolt(x0, y0, x1, y1, seed, k = 1, w = 14) {
    if (k <= 0) return; const pts = [[x0, y0]]; const n = 8;
    for (let i = 1; i < n; i++) { const f = i / n; pts.push([lerp(x0, x1, f) + (hash(seed * 31 + i) - .5) * 120, lerp(y0, y1, f)]); } pts.push([x1, y1]);
    const m = Math.max(2, Math.ceil(pts.length * k)); const P2 = pts.slice(0, m);
    glow(P2[P2.length - 1][0], P2[P2.length - 1][1], 220, P.boltGlow, .6 * k); boilSeed('bolt' + seed);
    paint(ribbon(P2, w, w * .4), { wash: P.bolt, ink: '#9FB8E8', sw: .8 });
  }
  function ground(key = 'gd') { boilSeed(key); paint(rectPts(-60, 1300, W + 120, 700), { wash: P.ground, ink: null }); inkLine([[-60, 1300], [W + 60, 1300]], 1.2, P.ink, 'ink', 0); }
  function house(x, y, s, key) { push(); translate(x, y); scale(s); boilSeed('hs' + key); paint(rectPts(-120, -180, 240, 180), { wash: '#E8DCC4', ink: P.ink, sw: 1.2 }); paint([[-150, -170], [150, -170], [0, -300]], { wash: '#B5533C', ink: P.ink, sw: 1.2 }); paint(rectPts(-30, -100, 60, 100), { wash: '#6E4A30', ink: P.ink, sw: 1 }); pop(); }
  function tree(x, y, s, key) { push(); translate(x, y); scale(s); boilSeed('tr' + key); paint(rectPts(-20, -200, 40, 200), { wash: '#6E4A30', ink: P.ink, sw: 1 }); paint(ellPts(0, -280, 140, 120, 18, 2), { wash: '#3E7A3A', ink: P.ink, sw: 1.2 }); pop(); }
  function stopwatch(x, y, r, secs, key) { boilSeed('sw' + key); paint(rectPts(x - 20, y - r - 50, 40, 40), { wash: '#B9B2AE', ink: P.ink, sw: 1 }); paint(ellPts(x, y, r, r, 28), { wash: '#FFFFFF', ink: P.ink, sw: 2 });
    const a = (secs % 60) / 60 * TAU; inkLine([[x, y], [x + Math.sin(a) * r * .8, y - Math.cos(a) * r * .8]], 4, P.red, 'ink', 0); paint(ellPts(x, y, 10, 10, 8), { wash: P.ink, ink: null }); }
  function hookBanner(lt, until) {
    if (lt > until) return; const k = lt < until - .3 ? 1 : 1 - (lt - (until - .3)) / .3;
    boilSeed('hook'); paint(rrPts(60, 280, 960, 360, 40), { wash: P.red, washOp: 255 * k, ink: k > .9 ? P.ink : null, sw: 2 });
    letter('HOTTER THAN', 540, 400, 110, '#FFFFFF', { pop: lt * 4, alpha: k, stroke: '#7A1E18' });
    letter('THE SUN?!', 540, 530, 120, P.gold, { pop: (lt - .2) * 4, alpha: k, stroke: '#7A1E18' });
  }
  function tag() { boilSeed('tag'); paint(rrPts(60, 170, 460, 80, 24), { wash: P.blue, ink: P.ink, sw: 1.2 }); letter('PATHIRA EXPLAINS', 290, 212, 40, '#FFFFFF'); }

  // 1. HOOK: lightning is ~5x hotter than the sun's surface
  function s1(t, lt, dur) {
    sky(t); storm(540, 700, 1.3, 'h1'); ground(); rain(t);
    const k = seg(lt, .2, .5); bolt(560, 760, 500, 1300, 1, k, 22); if (lt > .2 && lt < .7) flash(.6 * (1 - seg(lt, .4, .7)));
    tag(); hookBanner(lt, L(0)[1] - .3);
    if (lt > L(0)[1] - .5) card(540, 1120, 640, 120, '5x THE SUN', null, { pop: (lt - (L(0)[1] - .5)) * 4, col: P.gold, size: 70 });
  }
  // 2. A trick at the end
  function s2(t, lt, dur) {
    sky(t, 's2'); rain(t); tag();
    stopwatch(540, 780, 230, lt * 2, 's2');
    if (lt > L(1)[0] + 1.0) card(540, 1180, 700, 130, 'TRICK AT THE END', null, { pop: (lt - L(1)[0] - 1.0) * 4, col: P.gold, size: 62 });
    fadeIn(lt);
  }
  // 3. Ice particles collide inside the cloud and build charge
  function s3(t, lt, dur) {
    const [a] = L(2);
    sky(t, 's3'); tag();
    boilSeed('bigcloud'); paint(ellPts(540, 760, 470, 380, 30, 3), { wash: P.cloud, ink: P.ink, sw: 1.4 });
    for (let i = 0; i < 18; i++) { boilSeed('ice' + i); const x = 540 + (hash(i) - .5) * 700 + 24 * Math.sin(t * 5 + i), y = 760 + (hash(i + 9) - .5) * 520 + 18 * Math.cos(t * 4 + i); paint(starPts(x, y, 16, .5, 4), { wash: '#DDEBFF', ink: P.ink, sw: .5 }); }
    if (lt > a + 1.8) for (let i = 0; i < 6; i++) { letter('+', 300 + i * 96, 480, 70, P.red, { pop: (lt - a - 1.8 - i * .08) * 4 }); letter('-', 300 + i * 96, 1060, 90, P.blue, { pop: (lt - a - 2.2 - i * .08) * 4 }); }
    if (lt > a + 2.6) card(540, 1290, 600, 110, 'ELECTRIC CHARGE', null, { pop: (lt - a - 2.6) * 4, size: 56 });
    fadeIn(lt);
  }
  // 4. Too much charge: a giant spark = lightning
  function s4(t, lt, dur) {
    const [a] = L(3), k = seg(lt, a + 1.6, a + 1.9);
    sky(t, 's4'); storm(540, 560, 1.4, 's4'); ground('g4'); rain(t, 30, 'r4'); tag();
    bolt(520, 620, 600, 1300, 4, k, 26); if (k > 0 && lt < a + 2.4) flash(.7 * (1 - seg(lt, a + 1.9, a + 2.4)));
    if (lt > a + 2.6) card(540, 1180, 520, 120, 'LIGHTNING!', null, { pop: (lt - a - 2.6) * 4, col: P.gold, size: 70 });
    fadeIn(lt);
  }
  // 5. ~30,000 C vs the sun's surface ~5,500 C
  function s5(t, lt, dur) {
    const [a] = L(4), k1 = easeOut(seg(lt, a + .6, a + 2.6)), k2 = easeOut(seg(lt, a + 2.4, a + 3.4));
    sky(t, 's5'); tag();
    boilSeed('bars'); paint(rectPts(160, 1300, 760, 8), { wash: P.white, ink: null });
    paint(rectPts(240, 1300 - 900 * k1, 240, 900 * k1 + 1), { wash: P.bolt, ink: P.ink, sw: 1.2 }); paint(rectPts(600, 1300 - 165 * k2, 240, 165 * k2 + 1), { wash: '#F2A23A', ink: P.ink, sw: 1.2 });
    glow(360, 1300 - 900 * k1, 140, P.boltGlow, .4 * k1);
    if (k1 > .9) card(360, 300, 400, 120, '~30,000 C', 'lightning', { size: 56 });
    if (k2 > .9) card(720, 1020, 400, 120, '~5,500 C', 'sun surface', { size: 56 });
    fadeIn(lt);
  }
  // 6. The air expands explosively: thunder
  function s6(t, lt, dur) {
    const [a, b] = L(5);
    sky(t, 's6'); storm(540, 520, 1.3, 's6'); ground('g6'); tag();
    bolt(520, 580, 560, 1300, 6, 1, 22);
    for (let i = 0; i < 4; i++) { const k = frac(lt * .6 + i / 4), r = 60 + 520 * k; boilSeed('ring' + i); const R = ellPts(540, 950, r, r * .9, 40); inkLine([...R, R[0]], 3 * (1 - k) + .5, P.boltGlow, 'ink', .3); }
    if (lt > b - 1.4) card(540, 1180, 440, 130, 'BOOM!', 'thunder', { pop: (lt - (b - 1.4)) * 4, col: P.gold, size: 80 });
    fadeIn(lt);
  }
  // 7. They happen together, but we see the flash first. Why?
  function s7(t, lt, dur) {
    const [a, b] = L(6);
    sky(t, 's7'); tag();
    card(300, 620, 380, 300, 'FLASH', null, { col: '#FFF6C8', size: 70 }); bolt(300, 480, 300, 600, 7, 1, 14);
    card(780, 620, 380, 300, 'BOOM', null, { col: '#DDEBFF', size: 70 });
    if (lt > a + 1.0) card(540, 960, 640, 110, 'SAME MOMENT', null, { pop: (lt - a - 1.0) * 4, size: 56 });
    if (lt > b - 1.0) emote('?', 540, 1220, 120, seg(lt, b - 1.0, b - .7), lt);
    fadeIn(lt);
  }
  // 8. Light: 300,000 km in one second
  function s8(t, lt, dur) {
    const [a] = L(7), x = lerp(-200, W + 400, frac(lt * 1.2));
    sky(t, 's8'); tag();
    boilSeed('lightbeam'); paint(ribbon([[x - 600, 760], [x, 760]], 8, 40), { wash: P.bolt, ink: null }); glow(x, 760, 160, P.boltGlow, .7);
    card(540, 1080, 700, 160, '300,000 km', 'every second', { pop: (lt - a - .6) * 4, col: P.gold, size: 80 });
    fadeIn(lt);
  }
  // 9. Sound: only ~340 m in one second
  function s9(t, lt, dur) {
    const [a] = L(8), x = lerp(100, 520, seg(lt, 0, dur));
    sky(t, 's9'); tag();
    for (let i = 0; i < 3; i++) { boilSeed('sw' + i); const P3 = []; for (let j = 0; j <= 10; j++) { const an = -.8 + 1.6 * j / 10; P3.push([x + Math.cos(an) * (40 + i * 40), 760 + Math.sin(an) * (40 + i * 40)]); } inkLine(P3, 3, P.blue, 'ink', .4); }
    card(540, 1080, 700, 160, '~340 m', 'every second', { pop: (lt - a - .6) * 4, size: 80 });
    fadeIn(lt);
  }
  // 10. The trick: count the seconds from flash to thunder
  function s10(t, lt, dur) {
    const [a] = L(9), c = Math.max(0, Math.floor(lt - a - 1.2) + 1);
    sky(t, 's10'); storm(540, 460, 1.1, 's10'); tag();
    if (lt > a + .8 && lt < a + 1.2) { bolt(520, 500, 560, 760, 10, 1, 16); flash(.5); }
    stopwatch(540, 960, 200, lt - a - 1.2, 's10');
    if (lt > a + 1.2) letter(String(Math.min(c, 9)), 540, 1260, 120, P.gold, { pop: 1 });
    fadeIn(lt);
  }
  // 11. Divide by 3 = kilometres
  function s11(t, lt, dur) {
    const [a] = L(10);
    sky(t, 's11'); tag();
    card(540, 760, 900, 220, 'SECONDS / 3', null, { pop: (lt - a - .2) * 4, size: 90 });
    if (lt > a + 2.0) card(540, 1080, 600, 160, '= KM AWAY', null, { pop: (lt - a - 2.0) * 4, col: P.gold, size: 80 });
    fadeIn(lt);
  }
  // 12. 9 seconds -> 3 km
  function s12(t, lt, dur) {
    const [a, b] = L(11);
    sky(t, 's12'); storm(860, 520, .8, 's12'); ground('g12'); tag();
    bolt(860, 560, 880, 1300, 12, 1, 14);
    person(220, 1300, 18, { key: 'watch', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short', eyes: 'wide', mouth: 'O', armF: .3, armB: .2 });
    boilSeed('dist'); inkLine([[260, 1380], [860, 1380]], 3, P.gold, 'ink', 0);
    card(540, 760, 520, 140, '9 / 3 = 3 km', null, { pop: (lt - a - .3) * 4, col: P.gold, size: 72 });
    if (lt > b - 1.8) letter('3 km', 560, 1440, 70, P.gold, { pop: (lt - (b - 1.8)) * 4 });
    fadeIn(lt);
  }
  // 13. Remember: under 30 s, go inside; never under a tree
  function s13(t, lt, dur) {
    const [a] = L(12);
    sky(t, 's13'); tag();
    card(540, 320, 520, 110, 'REMEMBER', null, { col: P.gold, size: 66 });
    card(540, 520, 760, 120, 'UNDER 30 SEC?', null, { pop: (lt - a - .6) * 4, size: 60 });
    house(320, 1180, 1.0, 'h13'); tree(780, 1180, 1.0, 't13');
    if (lt > a + 1.6) { boilSeed('ok'); paint(ellPts(320, 760, 60, 60, 16), { wash: P.green, ink: P.ink, sw: 1 }); inkLine([[290, 760], [312, 784], [354, 736]], 6, '#FFFFFF', 'ink', 0); card(320, 1290, 300, 90, 'GO INSIDE', null, { size: 44, col: '#E6F6EA' }); }
    if (lt > a + 3.6) { boilSeed('no'); paint(ellPts(780, 760, 60, 60, 16), { wash: P.red, ink: P.ink, sw: 1 }); inkLine([[750, 730], [810, 790]], 6, '#FFFFFF', 'ink', 0); inkLine([[750, 790], [810, 730]], 6, '#FFFFFF', 'ink', 0); card(780, 1290, 300, 90, 'NOT HERE', null, { size: 44, col: '#F8ECEA', ink: P.red }); }
    fadeIn(lt);
  }
  // 14. Comment your count
  function s14(t, lt, dur) {
    const [a] = L(13);
    sky(t, 's14'); tag();
    boilSeed('bubble'); paint(rrPts(240, 520, 600, 360, 50), { wash: '#FFFFFF', ink: P.ink, sw: 2 }); paint([[380, 880], [460, 880], [360, 980]], { wash: '#FFFFFF', ink: P.ink, sw: 2 });
    letter('? sec', 540, 700, 120, P.ink, { pop: (lt - a) * 3 });
    card(540, 1180, 820, 140, 'COMMENT YOUR COUNT', null, { pop: (lt - a - .6) * 4, col: P.gold, size: 58 });
    fadeIn(lt);
  }
  // 15. Follow
  function s15(t, lt, dur) {
    const [a, b] = L(14), press = lt > b - 1.0;
    sky(t, 's15');
    for (let i = 0; i < 30; i++) { boilSeed('st15' + i); paint(starPts(hash(i) * W, hash(i + 40) * H * .7, 4, .35, 4), { wash: PAL.cream, washOp: 160, ink: null }); }
    boilSeed('pfp'); paint(ellPts(540, 700, 200, 200, 32), { wash: '#2F3C7A', ink: PAL.cream, sw: 2 });
    person(510, 860, 15, { key: 'hero', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short', eyes: 'wide', mouth: 'grin', armF: .3, armB: .2 });
    letter('@pathira.chindhakal', 540, 1000, 60, PAL.cream);
    card(540, 1160, 380, 110, press ? 'Following' : 'Follow', null, { col: press ? '#3A3F6A' : P.blue, ink: '#FFFFFF', size: 56, pop: press ? (lt - (b - 1.0)) * 5 : 1 });
    fadeIn(lt, .3);
    if (lt > dur - .8) flash(seg(lt, dur - .8, dur - .1), '#0B0D18');
  }

  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], (t, lt, dur) => { base(P.sky); f(t, lt, dur); }]));
})();
