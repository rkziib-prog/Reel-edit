// cooker.js: "Your pressure cooker is a physics machine" (Pathira Chindhakal reel #10, explainer with a hook).
// Same explainer kit (bright scenes, card() labels, BASE colours) + a big hook text for the first ~2.5 s.
(() => {
  const F = {
    sky: '#9ED3EA', bg: '#EAF4F8', bgWarm: '#F8F0E2', kitchen: '#F2E4CC', tile: '#E6D2B0', card: '#FFF8EA', ink: PAL.ink,
    green: '#3FAF5A', red: '#D8423A', blue: '#3FA7E0', navy: '#1F2550', steel: '#C9CED6', steelDk: '#8C939E', handle: '#2E2A36',
    flame: '#F2A23A', flameIn: '#5AA8E8', snow: '#F3F6FA', rock: '#7A7E8C', coin: '#E8B23A'
  };
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];
  const fadeIn = (lt, d = .25) => { if (lt < d) flash(1 - easeOut(lt / d), '#FFFFFF'); };
  function card(x, y, w, h, title, sub, o = {}) {
    w *= 1.3; h *= 1.3; boilSeed('card' + title + x); paint(rrPts(x - w / 2, y - h / 2, w, h, 22), { wash: o.col || F.card, ink: F.ink, sw: 1.2 });
    const sz = (o.size || 54) * 1.4;
    if (title) letter(title, x, y - (sub ? h * .16 : 0), sz, o.ink || F.ink, { pop: o.pop });
    if (sub) letter(sub, x, y + h * .24, sz * .62, o.subInk || '#5E5A62', { pop: o.pop });
  }
  function hook(lt, txt, until = 2.6) {   // big hook text for the opening seconds
    if (lt > until) return;
    const k = lt < until - .3 ? 1 : 1 - (lt - (until - .3)) / .3;
    boilSeed('hook'); paint(rrPts(160, 60, 1600, 220, 30), { wash: F.red, washOp: 255 * k, ink: F.ink, sw: 1.6 });
    letter(txt, 960, 170, 120, '#FFFFFF', { pop: lt * 4, alpha: k, stroke: '#7A1E18' });
  }
  function stove(x, y, w, k, key = 'st') {   // gas burner, k = flame size 0..1
    boilSeed(key); paint(rectPts(x - w / 2, y - 50, w, 50), { wash: '#3A3640', ink: F.ink, sw: 1 });
    for (let i = 0; i < 9; i++) { const fx = x - 120 + i * 30, h = (26 + 12 * Math.sin(T * 13 + i)) * k + 4, yb = y - 50; boilSeed(key + 'f' + i);
      paint([[fx - 12, yb], [fx, yb - h], [fx + 12, yb]], { wash: F.flame, ink: null }); paint([[fx - 6, yb], [fx, yb - h * .5], [fx + 6, yb]], { wash: F.flameIn, ink: null }); }
  }
  function cooker(x, y, s, o = {}) {      // side view; (x, y) = bottom centre
    y -= 90; push(); translate(x, y); scale(s); boilSeed('ck' + (o.key || ''));
    paint(rrPts(-200, -260, 400, 260, 30), { wash: F.steel, ink: F.ink, sw: 1.4 });
    paint(rectPts(-200, -200, 400, 14), { wash: F.steelDk, ink: null });
    paint(rrPts(-215, -290, 430, 40, 14), { wash: '#B9BEC8', ink: F.ink, sw: 1.2 });
    paint(rrPts(200, -284, 300, 30, 12), { wash: F.handle, ink: F.ink, sw: 1 }); paint(rrPts(-420, -284, 220, 26, 12), { wash: F.handle, ink: F.ink, sw: 1 });
    const lift = o.lift || 0;
    paint(rectPts(-12, -330, 24, 40), { wash: F.steelDk, ink: F.ink, sw: .8 });
    paint(rrPts(-34, -370 - lift, 68, 46, 12), { wash: F.handle, ink: F.ink, sw: 1 });
    if (o.cut) {                          // cut-away: water + steam dots inside
      paint(rrPts(-180, -240, 360, 220, 20), { wash: '#F3F6FA', ink: F.ink, sw: .8 });
      paint(rectPts(-180, -110, 360, 90), { wash: '#BFE3F2', ink: null });
      for (let i = 0; i < (o.dots || 0); i++) { boilSeed('sd' + i); const dx = -160 + 320 * hash(i), dy = -230 + 110 * hash(i + 9) + 6 * Math.sin(T * 6 + i); paint(ellPts(dx, dy, 9, 9, 8), { wash: '#FFFFFF', ink: F.steelDk, sw: .5 }); }
    }
    pop();
    if (o.jet) { for (let i = 0; i < 6; i++) { const k2 = frac(T * 1.6 + i / 6); boilSeed('jet' + i); paint(ellPts(x + 10 * Math.sin(i), y - (370 + lift) * s - k2 * 300, 30 + 40 * k2, 22 + 30 * k2, 12), { wash: '#FFFFFF', washOp: 220 * (1 - k2), ink: null }); } }
  }
  function pot(x, y, s, steam, key = 'pot') { y -= 90; push(); translate(x, y); scale(s); boilSeed(key);
    paint(rrPts(-200, -240, 400, 240, 24), { wash: F.steelDk, ink: F.ink, sw: 1.4 }); paint(rectPts(-180, -200, 360, 40), { wash: '#BFE3F2', ink: null }); pop();
    if (steam) for (let i = 0; i < 8; i++) { const k = frac(T * .8 + i / 8); boilSeed(key + 's' + i); paint(ellPts(x + (hash(i) - .5) * 300 * s, y - 240 * s - k * 360, 26 + 30 * k, 20 + 20 * k, 12), { wash: '#FFFFFF', washOp: 200 * (1 - k), ink: null }); } }
  function thermo(x, y, h, val, lo = 0, hi = 130, key = 'th') {   // vertical thermometer, val in C
    boilSeed(key); paint(rrPts(x - 26, y - h, 52, h, 26), { wash: '#FFFFFF', ink: F.ink, sw: 1.2 }); paint(ellPts(x, y + 20, 44, 44, 16), { wash: F.red, ink: F.ink, sw: 1.2 });
    const f = clamp((val - lo) / (hi - lo)); paint(rectPts(x - 12, y - (h - 20) * f, 24, (h - 20) * f + 10), { wash: F.red, ink: null });
    const y100 = y - (h - 20) * ((100 - lo) / (hi - lo)); inkLine([[x - 40, y100], [x + 40, y100]], 1.4, F.ink, 'ink', 0); letter('100', x - 90, y100, 40, F.ink);
    letter(Math.round(val) + ' C', x + 120, y - (h - 20) * f, 54, F.red);
  }
  function gauge(x, y, r, k, key = 'gg') { boilSeed(key); paint(ellPts(x, y, r, r, 26), { wash: '#FFFFFF', ink: F.ink, sw: 1.4 });
    for (let i = 0; i <= 8; i++) { const a = -2.3 + i * 4.6 / 8; inkLine([[x + Math.sin(a) * r * .75, y - Math.cos(a) * r * .75], [x + Math.sin(a) * r * .9, y - Math.cos(a) * r * .9]], 1, F.ink, 'inkfine', 0); }
    const a = -2.3 + 4.6 * k; paint(ribbon([[x, y], [x + Math.sin(a) * r * .8, y - Math.cos(a) * r * .8]], 10, 3), { wash: F.red, ink: null }); paint(ellPts(x, y, 10, 10, 8), { wash: F.ink, ink: null }); }
  function kitchen() { boilSeed('kit'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.kitchen, ink: null });
    for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) { const P = rectPts(i * 170, 80 + j * 150, 160, 140); inkLine([...P, P[0]], .5, '#D8C4A0', 'inkfine', 0); }
    paint(rectPts(-300, 880, W + 600, 400), { wash: '#8A6A4A', ink: F.ink, sw: 1 }); }
  function mountain(x, y, w, h, key = 'mt') { boilSeed(key); paint([[x - w / 2, y], [x, y - h], [x + w / 2, y]], { wash: F.rock, ink: F.ink, sw: 1.2 }); paint([[x - w * .14, y - h * .72], [x, y - h], [x + w * .14, y - h * .72], [x + w * .05, y - h * .66], [x - w * .05, y - h * .7]], { wash: F.snow, ink: F.ink, sw: .8 }); }

  // 1. HOOK: your cooker heats water above 100 C
  function s1(t, lt, dur) {
    const [a] = L(0), v = lerp(25, 120, easeInOut2(seg(lt, .4, a + 4.0)));
    camBegin(960, 560, 1.0);
    kitchen(); cooker(800, 880, 1.05, { jet: lt > a + 3.5 }); stove(800, 880, 360, 1);
    thermo(1460, 800, 520, v, 0, 130, 'th1');
    camEnd();
    hook(lt, 'WATER ABOVE 100 C?!', 2.6);
    if (lt < .4) flash(1 - easeOut(lt / .4), '#FFFFFF');
  }
  function easeInOut2(k) { return k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
  // 2. How? + the mountain tease
  function s2(t, lt, dur) {
    const [a, b] = L(1);
    camBegin(960, 560, 1.0);
    boilSeed('bg2'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.sky, ink: null });
    mountain(960, 1000, 1500, 760, 'm2');
    emote('?', 1240, 260, 110, seg(lt, a + .8, a + 1.2), lt);
    if (lt > a + 1.4) card(960, 160, 520, 100, 'STAY TILL THE END', null, { pop: (lt - a - 1.4) * 4, size: 44, col: F.coin });
    camEnd(); fadeIn(lt);
  }
  // 3. Open pot: stuck at 100 C however high the flame
  function s3(t, lt, dur) {
    const [a] = L(2), fl = .5 + .5 * seg(lt, a + 2.8, a + 3.6);
    camBegin(960, 560, 1.0);
    kitchen(); pot(760, 880, 1.0, true, 'p3'); stove(760, 880, 360, fl, 's3');
    thermo(1400, 800, 520, Math.min(100, lerp(40, 100, seg(lt, a, a + 2.2))), 0, 130, 'th3');
    if (lt > a + 3.6) card(1400, 160, 400, 90, 'STUCK AT 100', null, { pop: (lt - a - 3.6) * 4, size: 46, col: '#F8ECEA', ink: F.red });
    camEnd(); fadeIn(lt);
  }
  // 4. The extra heat escapes as steam
  function s4(t, lt, dur) {
    const [a] = L(3);
    camBegin(800, 520, 1.25);
    kitchen(); pot(760, 880, 1.0, true, 'p4'); stove(760, 880, 360, 1, 's4');
    for (let i = 0; i < 3; i++) { boilSeed('ar4' + i); const x = 620 + i * 140, k = frac(lt * .7 + i / 3); paint(ribbon([[x, 560 - k * 200], [x, 460 - k * 200]], 20, 4), { wash: F.red, washOp: 220 * (1 - k), ink: null }); }
    if (lt > a + 1.6) card(1260, 300, 400, 90, 'HEAT ESCAPES', null, { pop: (lt - a - 1.6) * 4, size: 44 });
    camEnd(); fadeIn(lt);
  }
  // 5. The lid seals: steam has nowhere to go
  function s5(t, lt, dur) {
    const [a] = L(4), lock = easeOut(seg(lt, a + .3, a + 1.2));
    camBegin(960, 560, 1.0);
    kitchen(); stove(800, 880, 360, 1, 's5');
    push(); translate(0, -200 * (1 - lock)); pop();
    cooker(800, 880, 1.05, { key: 'c5' });
    if (lt > a + 1.3) card(1460, 360, 360, 100, 'SEALED', null, { pop: (lt - a - 1.3) * 4, size: 56, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 6. Steam builds up: pressure rises
  function s6(t, lt, dur) {
    const [a] = L(5), k = seg(lt, a, a + 2.4);
    camBegin(960, 560, 1.0);
    kitchen(); cooker(700, 880, 1.1, { cut: true, dots: Math.floor(6 + 40 * k), key: 'c6' }); stove(700, 880, 360, 1, 's6');
    gauge(1420, 480, 200, .15 + .7 * k, 'g6'); letter('PRESSURE', 1420, 740, 54, F.ink);
    camEnd(); fadeIn(lt);
  }
  // 7. Higher pressure: water needs ~120 C to boil
  function s7(t, lt, dur) {
    const [a, b] = L(6), v = lerp(60, 120, easeInOut2(seg(lt, a + 1.0, b - 1.4)));
    camBegin(960, 560, 1.0);
    kitchen(); cooker(700, 880, 1.1, { cut: true, dots: 46, key: 'c7' }); stove(700, 880, 360, 1, 's7');
    thermo(1400, 820, 560, v, 0, 130, 'th7');
    if (lt > b - 1.2) card(1400, 140, 360, 90, '~ 120 C', null, { pop: (lt - (b - 1.2)) * 4, size: 56, col: F.coin });
    camEnd(); fadeIn(lt);
  }
  // 8. That extra heat cooks dal and meat fast
  function s8(t, lt, dur) {
    const [a] = L(7);
    camBegin(960, 540, 1.0);
    boilSeed('bg8'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bgWarm, ink: null });
    boilSeed('dal'); paint(through([[320, 520], [400, 640], [720, 640], [800, 520]], 4), { wash: '#B9B2AE', ink: F.ink, sw: 1 }); paint(ellPts(560, 520, 240, 50, 22), { wash: '#E8B23A', ink: F.ink, sw: 1.2 });
    boilSeed('meat'); paint(ellPts(1360, 520, 200, 120, 22, 2), { wash: '#B5533C', ink: F.ink, sw: 1.2 }); paint(ribbon([[1500, 500], [1620, 440]], 30, 20), { wash: '#F3EFE6', ink: F.ink, sw: .8 });
    card(560, 760, 260, 80, 'DAL', null, { size: 44 }); card(1360, 760, 260, 80, 'MEAT', null, { size: 44 });
    boilSeed('clock8'); paint(ellPts(960, 300, 120, 120, 24), { wash: '#FFFFFF', ink: F.ink, sw: 1.4 }); const ang = lt * 8; inkLine([[960, 300], [960 + Math.sin(ang) * 90, 300 - Math.cos(ang) * 90]], 3, F.red, 'ink', 0);
    if (lt > a + 2.0) card(960, 960, 380, 90, 'FAST!', null, { pop: (lt - a - 2.0) * 4, size: 52, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 9. The whistle is a weighted valve
  function s9(t, lt, dur) {
    const [a] = L(8), z = kf(lt, [[0, 1.0], [a + .6, 1.0], [a + 1.6, 2.4], [dur, 2.5]], ease);
    camBegin(lerp(960, 800, seg(z, 1, 2.4)), lerp(560, 520, seg(z, 1, 2.4)), z);
    kitchen(); cooker(800, 880, 1.05, { key: 'c9' }); stove(800, 880, 360, 1, 's9');
    camEnd();
    if (lt > a + 1.8) card(1400, 300, 360, 100, 'VALVE', 'weight on top', { pop: (lt - a - 1.8) * 4, size: 56 });
    fadeIn(lt);
  }
  // 10. Over the limit, the valve lifts: whistle!
  function s10(t, lt, dur) {
    const [a, b] = L(9), up = lt > a + 1.6;
    camBegin(800, 520, 1.6);
    kitchen(); cooker(800, 880, 1.05, { key: 'c10', lift: up ? 26 + 6 * Math.sin(lt * 40) : 0, jet: up }); stove(800, 880, 360, 1, 's10');
    camEnd();
    gauge(1560, 300, 120, up ? .9 : lerp(.5, .9, seg(lt, a, a + 1.6)), 'g10');
    if (lt > b - 1.4) card(960, 920, 420, 100, 'WHISTLE!', null, { pop: (lt - (b - 1.4)) * 4, size: 60, col: F.coin });
    fadeIn(lt);
  }
  // 11. The mountain secret: less air pressure up high, water boils below 100 C
  function s11(t, lt, dur) {
    const [a, b] = L(10), v = lerp(100, 85, seg(lt, a + 3.0, b - .6));
    camBegin(960, 560, 1.0);
    boilSeed('bg11'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.sky, ink: null });
    mountain(760, 1040, 1300, 880, 'm11');
    for (let i = 0; i < 60; i++) { const y = 200 + 840 * hash(i + 3); if (hash(i + 7) > (1040 - y) / 900 + .1) continue; boilSeed('air' + i); paint(ellPts(200 + 1200 * hash(i), y, 8, 8, 8), { wash: F.blue, ink: null }); }
    thermo(1600, 820, 520, v, 0, 130, 'th11');
    if (lt > a + 1.6) card(1500, 160, 420, 90, 'LESS AIR UP HIGH', null, { pop: (lt - a - 1.6) * 4, size: 40 });
    camEnd(); fadeIn(lt);
  }
  // 12. Everest: water boils at ~70 C, rice won't cook
  function s12(t, lt, dur) {
    const [a, b] = L(11);
    camBegin(960, 560, 1.0);
    boilSeed('bg12'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#C9E4F2', ink: null });
    mountain(700, 1080, 1100, 960, 'm12');
    card(700, 120, 300, 80, 'EVEREST', null, { size: 40 });
    thermo(1300, 820, 520, lerp(100, 70, seg(lt, a + .4, a + 2.4)), 0, 130, 'th12');
    if (lt > a + 2.6) card(1300, 120, 280, 90, '~ 70 C', null, { pop: (lt - a - 2.6) * 4, size: 56, col: F.coin });
    if (lt > b - 1.6) { pot(1620, 1000, .6, false, 'rice'); boilSeed('ricegr'); for (let i = 0; i < 10; i++) paint(ellPts(1560 + 12 * i, 870 + 8 * hash(i), 6, 3, 6), { wash: '#FFFFFF', ink: F.ink, sw: .3 }); emote('sweat', 1700, 760, 50, 1, lt); }
    camEnd(); fadeIn(lt);
  }
  // 13. In the mountains, a pressure cooker is a must
  function s13(t, lt, dur) {
    const [a] = L(12);
    camBegin(960, 560, 1.0);
    boilSeed('bg13'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#C9E4F2', ink: null }); paint(rectPts(-300, 860, W + 600, 400), { wash: F.snow, ink: null });
    mountain(400, 880, 900, 600, 'm13a'); mountain(1600, 880, 800, 500, 'm13b');
    cooker(1000, 860, .8, { key: 'c13', jet: true }); stove(1000, 860, 300, 1, 's13');
    person(620, 900, 22, { key: 'climber', skin: C.skin, shirt: '#D8423A', lower: 'pants', lowerCol: '#2E3A4E', hairStyle: 'short', eyes: 'happy', mouth: 'grin', armF: 1.4, bendF: -.3, armB: .3 });
    if (lt > a + 1.6) card(1500, 200, 420, 100, 'MUST-HAVE', null, { pop: (lt - a - 1.6) * 4, size: 52, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 14. Remember: wait for the pressure to drop; keep gasket and valve clean
  function s14(t, lt, dur) {
    const [a] = L(13), items = [['Wait till pressure drops', a + .4], ['Clean the gasket', a + 3.0], ['Clean the valve', a + 4.2]];
    camBegin(960, 540, 1.0);
    boilSeed('bg14'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    card(960, 170, 460, 100, 'REMEMBER', null, { size: 64, col: F.coin });
    items.forEach(([txt, t0], i) => { if (lt > t0) { card(1000, 400 + i * 200, 900, 120, txt, null, { pop: (lt - t0) * 4, size: 52 });
      boilSeed('tk14' + i); paint(ellPts(330, 400 + i * 200, 40, 40, 16), { wash: F.green, ink: F.ink, sw: .8 }); inkLine([[312, 400 + i * 200], [326, 414 + i * 200], [350, 384 + i * 200]], 3, '#FFFFFF', 'ink', 0); } });
    camEnd(); fadeIn(lt);
  }
  // 15. Follow
  function s15(t, lt, dur) {
    const [a, b] = L(14), press = lt > b - 1.0;
    camBegin(960, 540, 1.0);
    boilSeed('bg15'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.navy, ink: null });
    for (let i = 0; i < 30; i++) { boilSeed('st15' + i); paint(starPts(hash(i) * W, hash(i + 40) * H, 4, .35, 4), { wash: PAL.cream, washOp: 160, ink: null }); }
    boilSeed('pfp'); paint(ellPts(960, 400, 200, 200, 32), { wash: '#2F3C7A', ink: PAL.cream, sw: 2 });
    person(930, 560, 15, { key: 'hero', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short', eyes: 'wide', mouth: 'grin', armF: .3, armB: .2 });
    letter('@pathira.chindhakal', 960, 700, 64, PAL.cream);
    card(960, 860, 380, 110, press ? 'Following' : 'Follow', null, { col: press ? '#3A3F6A' : F.blue, ink: '#FFFFFF', size: 56, pop: press ? (lt - (b - 1.0)) * 5 : 1 });
    camEnd(); fadeIn(lt, .3);
    if (lt > dur - .8) flash(seg(lt, dur - .8, dur - .1), '#0B0D18');
  }

  const BASE = [F.kitchen, F.sky, F.kitchen, F.kitchen, F.kitchen, F.kitchen, F.kitchen, F.bgWarm, F.kitchen, F.kitchen, F.sky, '#C9E4F2', '#C9E4F2', F.bg, F.navy];
  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], (t, lt, dur) => { base(BASE[i]); f(t, lt, dur); }]));
})();
