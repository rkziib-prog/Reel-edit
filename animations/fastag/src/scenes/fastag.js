// fastag.js: "How does FASTag work?" (Pathira Chindhakal reel #6, explainer). One shot per narration line.
// Bright daytime toll plaza + labelled infographics. Timing from fastag_times.js (edits/fastag/timeline.py).
(() => {
  const F = {
    sky: '#9ED3EA', skyHi: '#E6F4F8', grass: '#7DB85A', road: '#5E5A62', lane: '#F3EFE6', canopy: '#2F6FB5', canopyDk: '#24548A',
    car: '#E2683A', carDk: '#B04A24', lorry: '#3E7F7A', glass: '#BFE0EC', tag: '#F2C14E', chip: '#3A3140', wave: '#3FA7E0',
    card: '#FFF8EA', green: '#3FAF5A', red: '#D8423A', ink: PAL.ink, booth: '#E8E0C8'
  };
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];
  const fadeIn = (lt, d = .25) => { if (lt < d) flash(1 - easeOut(lt / d), '#FFFFFF'); };
  const ROADY = 860;

  // ---------- set pieces ----------
  function plaza(t, o = {}) {
    boilSeed('psky'); paint(rectPts(-300, -300, W + 600, ROADY + 300), { wash: F.sky, ink: null });
    paint(ellPts(W / 2, ROADY - 40, W, 260, 30, 4), { wash: F.skyHi, washOp: 140, ink: null });
    for (let i = 0; i < 3; i++) cloud(260 + i * 700, 140 + 50 * hash(i), .7, 'fc' + i);
    palm(120, ROADY - 60, 360, .05 * Math.sin(t * 2), 'fp1'); palm(1800, ROADY - 60, 330, .05 * Math.sin(t * 2 + 1), 'fp2');
    boilSeed('grass'); paint(rectPts(-300, ROADY - 80, W + 600, 90), { wash: F.grass, ink: null });
    boilSeed('road'); paint(rectPts(-300, ROADY, W + 600, 500), { wash: F.road, ink: null });
    for (let i = 0; i < 9; i++) paint(rectPts(-200 + i * 260, ROADY + 150, 140, 12), { wash: F.lane, washOp: 220, ink: null });
    // canopy + reader + booth + barrier
    boilSeed('canopy');
    paint(rectPts(720, 260, 760, 70), { wash: F.canopy, ink: F.ink, sw: 1.2 }); paint(rectPts(720, 330, 760, 14), { wash: F.tag, ink: null });
    for (const px of [740, 1440]) paint(rectPts(px, 344, 22, ROADY - 344), { wash: '#B9B2AE', ink: F.ink, sw: .8 });
    boilSeed('reader'); paint(rrPts(1040, 344, 120, 60, 10), { wash: '#3A3140', ink: F.ink, sw: .9 }); paint(ellPts(1100, 404, 16, 8, 10), { wash: F.wave, ink: null });
    boilSeed('booth'); paint(rectPts(1260, 560, 160, 300), { wash: F.booth, ink: F.ink, sw: 1 }); paint(rectPts(1280, 600, 120, 90), { wash: F.glass, ink: F.ink, sw: .8 });
    const lift = clamp(o.barrier ?? 0);
    boilSeed('barrier'); push(); translate(1250, 760); rotate(lift * 1.3);
    paint(rectPts(-520, -10, 520, 20), { wash: F.lane, ink: F.ink, sw: .8 }); for (let i = 0; i < 5; i++) paint(rectPts(-500 + i * 100, -10, 50, 20), { wash: F.red, ink: null }); pop();
    paint(rectPts(1236, 740, 30, 120), { wash: '#B9B2AE', ink: F.ink, sw: .8 });
  }
  function car(x, y, s, o = {}) {       // side view facing right, (x, y) = ground under the middle
    push(); translate(x, y); scale(s); boilSeed('car' + (o.key || ''));
    paint(rrPts(-220, -130, 440, 90, 30), { wash: o.col || F.car, ink: F.ink, sw: 1.2 });
    paint([[-130, -130], [-80, -210], [90, -210], [150, -130]], { wash: o.col || F.car, ink: F.ink, sw: 1.1 });
    paint([[-110, -136], [-72, -196], [0, -196], [0, -136]], { wash: F.glass, ink: F.ink, sw: .7 });
    paint([[14, -136], [14, -196], [82, -196], [130, -136]], { wash: F.glass, ink: F.ink, sw: .7 });
    paint(rectPts(96, -186, 16, 16), { wash: o.tagCol || F.tag, ink: F.ink, sw: .5 });                      // the FASTag sticker
    paint(rectPts(180, -100, 44, 26), { wash: '#F3EFE6', ink: F.ink, sw: .6 });                             // number plate
    for (const wx of [-130, 130]) { paint(ellPts(wx, -40, 44, 44, 18), { wash: '#2E2A36', ink: F.ink, sw: 1 }); paint(ellPts(wx, -40, 18, 18, 10), { wash: '#B9B2AE', ink: null }); }
    pop();
    if (o.glowTag) glow(x + 104 * s, y - 178 * s, 60 * s + 20, '#FFE27A', o.glowTag);
  }
  function lorry(x, y, s) { push(); translate(x, y); scale(s); boilSeed('lorry');
    paint(rectPts(-300, -300, 400, 250), { wash: F.lorry, ink: F.ink, sw: 1.2 }); paint(rrPts(100, -240, 160, 190, 20), { wash: '#E8B23A', ink: F.ink, sw: 1.1 });
    paint(rectPts(150, -220, 90, 70), { wash: F.glass, ink: F.ink, sw: .7 });
    for (const wx of [-220, -120, 180]) { paint(ellPts(wx, -40, 44, 44, 18), { wash: '#2E2A36', ink: F.ink, sw: 1 }); paint(ellPts(wx, -40, 18, 18, 10), { wash: '#B9B2AE', ink: null }); } pop(); }
  function waves(x, y, t, n = 4, col = F.wave, key = 'wv') {
    for (let i = 0; i < n; i++) { const k = frac(t * .9 + i / n), r = 40 + k * 300; boilSeed(key + i);
      const P = []; for (let j = 0; j <= 10; j++) { const a = Math.PI * (.2 + .6 * j / 10); P.push([x + Math.cos(a) * r, y + Math.sin(a) * r * .8]); }
      inkLine(P, 1.6 * (1 - k) + .3, col, 'ink', .4); }
  }
  function card(x, y, w, h, title, sub, o = {}) {   // rounded label card + text
    w *= 1.3; h *= 1.3; boilSeed('card' + title); paint(rrPts(x - w / 2, y - h / 2, w, h, 22), { wash: o.col || F.card, ink: F.ink, sw: 1.2 });
    const sz = (o.size || 54) * 1.4;
    if (title) letter(title, x, y - (sub ? h * .16 : 0), sz, o.ink || F.ink, { pop: o.pop });
    if (sub) letter(sub, x, y + h * .24, sz * .62, o.subInk || '#5E5A62', { pop: o.pop });
  }
  function tick(x, y, s, k, col = F.green, key = 'tk') { if (k <= 0) return; boilSeed(key); paint(ellPts(x, y, 40 * s, 40 * s, 16), { wash: col, ink: F.ink, sw: .8 }); inkLine([[x - 18 * s, y], [x - 4 * s, y + 14 * s], [x + 20 * s, y - 16 * s]].slice(0, 2 + (k > .5)), 3, '#FFFFFF', 'ink', 0); }
  function sticker(x, y, s, o = {}) {     // big FASTag sticker, optional x-ray view
    push(); translate(x, y); scale(s); boilSeed('stk');
    paint(rrPts(-320, -200, 640, 400, 30), { wash: o.red ? F.red : F.tag, ink: F.ink, sw: 1.6 });
    if (o.xray) {
      paint(rrPts(-300, -180, 600, 360, 24), { wash: '#1E2A3E', washOp: 210, ink: null });
      for (let i = 0; i < 4; i++) { const P = rrPts(-240 + i * 22, -130 + i * 20, 480 - i * 44, 260 - i * 40, 16); inkLine([...P, P[0]], 1.6, '#C9773A', 'ink', 0); }
      paint(rectPts(-46, -36, 92, 72), { wash: F.chip, ink: '#9FC0FF', sw: 1.2 }); for (let i = 0; i < 4; i++) inkLine([[-46, -24 + i * 16], [-66, -24 + i * 16]], .8, '#9FC0FF', 'inkfine', 0);
      if (o.lit) glow(0, 0, 160, '#FFE27A', o.lit);
    }
    pop();
  }

  // 1. Through the toll lane without stopping: how?
  function s1(t, lt, dur) {
    camBegin(960, 540, 1.0);
    const cx = lerp(-300, 2200, seg(lt, 0, dur - .3)), lift = 1 - Math.min(1, Math.abs(cx - 1050) / 500);
    plaza(t, { barrier: Math.min(1, lift * 2) });
    car(cx, ROADY + 80, .9, { glowTag: lift * .8 });
    emote('?', 960, 160, 90, seg(lt, 2.2, 2.6), lt);
    camEnd(); if (lt < .6) flash(1 - easeOut(lt / .6), '#FFFFFF');
  }
  // 2. The answer is on your windshield: the FASTag sticker
  function s2(t, lt, dur) {
    const z = kf(lt, [[0, 1.0], [1.4, 1.0], [2.6, 4.2], [dur, 4.4]], ease);
    camBegin(lerp(960, 900 + 104 * .9 - 10, seg(z, 1, 4.2)), lerp(540, ROADY + 80 - 178 * .9, seg(z, 1, 4.2)), z);
    plaza(t, { barrier: 0 });
    car(900, ROADY + 80, .9, { glowTag: .4 * seg(lt, 2.6, 3.0) });
    camEnd();
    if (lt > 3.0) card(1500, 300, 420, 120, 'FASTag', null, { pop: (lt - 3.0) * 4, size: 70 });
    fadeIn(lt);
  }
  // 3. Inside: a chip and an antenna, no battery
  function s3(t, lt, dur) {
    const [a] = L(2);
    camBegin(960, 540, 1.0);
    boilSeed('bg3'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#EAF4F8', ink: null });
    const x = easeOut(seg(lt, a + .2, a + .9));
    sticker(820, 540, 1.1, { xray: x > .1 });
    if (lt > a + 1.0) card(1500, 300, 360, 100, 'CHIP', null, { pop: (lt - a - 1.0) * 4 });
    if (lt > a + 1.6) card(1500, 440, 360, 100, 'ANTENNA', null, { pop: (lt - a - 1.6) * 4 });
    if (lt > a + 2.8) { boilSeed('batt'); paint(rrPts(1380, 600, 200, 100, 14), { wash: '#B9B2AE', ink: F.ink, sw: 1.2 }); paint(rectPts(1580, 630, 18, 40), { wash: '#B9B2AE', ink: F.ink, sw: .8 });
      inkLine([[1360, 580], [1620, 720]], 4, F.red, 'ink', 0); inkLine([[1360, 720], [1620, 580]], 4, F.red, 'ink', 0); }
    camEnd(); fadeIn(lt);
  }
  // 4. The reader above the lane sends out radio waves
  function s4(t, lt, dur) {
    camBegin(1100, 420, 1.6 + .03 * lt);
    plaza(t);
    waves(1100, 410, t, 5);
    camEnd();
    if (lt > L(3)[0] + .8) card(1500, 160, 420, 100, 'READER', null, { pop: (lt - L(3)[0] - .8) * 4 });
    fadeIn(lt);
  }
  // 5. The car comes close; the chip wakes up on the waves' energy
  function s5(t, lt, dur) {
    const [a] = L(4), cx = lerp(-200, 980, easeOut(seg(lt, 0, a + 1.4))), wake = seg(lt, a + 1.8, a + 2.4);
    camBegin(1000, 520, 1.25);
    plaza(t);
    waves(1100, 410, t, 5);
    car(cx, ROADY + 80, .9, { glowTag: wake * .9 });
    camEnd();
    if (wake > .5) card(1500, 180, 520, 100, 'CHIP WAKES UP!', null, { pop: (wake - .5) * 6 });
    fadeIn(lt);
  }
  // 6. It sends back its ID: RFID
  function s6(t, lt, dur) {
    const [a, b] = L(5), k = seg(lt, a + .4, a + 1.6);
    camBegin(1000, 520, 1.25);
    plaza(t);
    car(980, ROADY + 80, .9, { glowTag: .7 });
    const p = [lerp(980 + 94, 1100, k), lerp(ROADY + 80 - 160, 420, k)];
    if (k > 0 && k < 1) card(p[0], p[1], 300, 70, 'ID 60817', null, { size: 40 });
    if (k >= 1) glow(1100, 380, 120, F.wave, .6);
    camEnd();
    if (lt > b - 2.2) card(1500, 180, 380, 120, 'RFID', 'Radio Frequency ID', { pop: (lt - (b - 2.2)) * 4, size: 70 });
    fadeIn(lt);
  }
  // 7. The ID is linked to your vehicle number and your bank account
  function s7(t, lt, dur) {
    const [a] = L(6);
    camBegin(960, 540, 1.0);
    boilSeed('bg7'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#EAF4F8', ink: null });
    const c = [['TAG ID', '60817', 330, a + .2], ['VEHICLE', 'KL 07 AB 1234', 960, a + 1.3], ['BANK', 'or wallet', 1590, a + 2.6]];
    for (let i = 0; i < 3; i++) { const [ti, su, x, t0] = c[i]; if (lt > t0) card(x, 540, 420, 220, ti, su, { pop: (lt - t0) * 4, size: 44 }); if (i && lt > t0) { boilSeed('link' + i); inkLine([[c[i - 1][2] + 275, 540], [x - 275, 540]], 3, F.wave, 'ink', 0); } }
    camEnd(); fadeIn(lt);
  }
  // 8. Vehicle class sets the toll: one rate for cars, another for lorries
  function s8(t, lt, dur) {
    const [a, b] = L(7);
    camBegin(960, 560, 1.0);
    boilSeed('bg8'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#EAF4F8', ink: null }); paint(rectPts(-300, 860, W + 600, 400), { wash: F.road, ink: null });
    car(520, 860, .9);
    if (lt > a + 3.0) lorry(1420, 860, .9);
    if (lt > a + 1.0) card(520, 300, 340, 110, 'CAR', 'rate 1', { pop: (lt - a - 1.0) * 4 });
    if (lt > a + 3.4) card(1420, 300, 340, 110, 'LORRY', 'rate 2', { pop: (lt - a - 3.4) * 4 });
    camEnd(); fadeIn(lt);
  }
  // 9. Money deducted, barrier lifts, in seconds
  function s9(t, lt, dur) {
    const [a] = L(8), ded = seg(lt, a + .2, a + .9), lift = easeOut(seg(lt, a + 1.1, a + 1.8));
    camBegin(1050, 540, 1.15);
    plaza(t, { barrier: lift });
    car(lerp(820, 1500, easeIn(seg(lt, a + 2.0, dur))), ROADY + 80, .9);
    camEnd();
    card(430, 220, 440, 140, ded < 1 ? 'Rs 500' : 'Rs 410', 'balance', { size: 64, ink: ded > 0 && ded < 1 ? F.red : F.ink });
    if (lt > a + 2.6) card(1560, 220, 380, 120, '~ 3 SEC', null, { pop: (lt - a - 2.6) * 4, size: 60 });
    fadeIn(lt);
  }
  // 10. A camera reads the number plate to cross-check
  function s10(t, lt, dur) {
    const [a, b] = L(9), scan = seg(lt, a + 1.0, a + 2.2);
    camBegin(1180, ROADY - 20, 2.6);
    plaza(t);
    car(1000, ROADY + 80, .9);
    const px = 1000 + 202 * .9, py = ROADY + 80 - 87 * .9;
    if (scan > 0) { boilSeed('scan'); const fr = rectPts(px - 40, py - 26, 80, 52); inkLine([...fr, fr[0]], 1.4, scan < 1 ? F.wave : F.green, 'ink', 0); inkLine([[px - 40, py - 26 + 52 * frac(lt * 2)], [px + 40, py - 26 + 52 * frac(lt * 2)]], .8, F.wave, 'inkfine', 0); }
    camEnd();
    if (lt > b - 1.0) { card(1500, 200, 460, 110, 'PLATE MATCHED', null, { pop: (lt - (b - 1.0)) * 4, size: 48 }); tick(1720, 200, 1, 1, F.green, 'tk10'); }
    fadeIn(lt);
  }
  // 11. A message on your phone: "Toll deducted"
  function s11(t, lt, dur) {
    const [a] = L(10), buzz = lt > a + 1.0 && lt < a + 1.6 ? Math.sin(lt * 80) * 8 : 0;
    camBegin(960 + buzz, 540, 1.0);
    boilSeed('bg11'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#EAF4F8', ink: null });
    boilSeed('ph11'); paint(rrPts(700, 60, 520, 960, 50), { wash: '#1E1B24', ink: F.ink, sw: 1.4 }); paint(rrPts(730, 100, 460, 880, 30), { wash: '#F3EFE6', ink: null });
    if (lt > a + 1.0) card(960, 360, 420, 180, 'Toll deducted', 'Rs 90 . KL 07 AB 1234', { pop: (lt - a - 1.0) * 4, size: 42 });
    camEnd(); fadeIn(lt);
  }
  // 12. Low balance: the tag gets blacklisted
  function s12(t, lt, dur) {
    const [a, b] = L(11), red = lt > b - 1.2;
    camBegin(960, 540, 1.0);
    boilSeed('bg12'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#F8ECEA', ink: null });
    sticker(820, 560, 1.0, { red });
    card(1500, 260, 380, 140, 'Rs 0', 'balance', { size: 70, ink: F.red });
    if (red) card(820, 560, 640, 140, 'BLACKLISTED', null, { pop: (lt - (b - 1.2)) * 5, col: '#FFFFFF', ink: F.red, size: 76 });
    camEnd(); fadeIn(lt);
  }
  // 13. No valid tag in a FASTag lane: pay double, in cash
  function s13(t, lt, dur) {
    const [a, b] = L(12);
    camBegin(960, 540, 1.0);
    boilSeed('bg13'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#EAF4F8', ink: null });
    card(760, 560, 560, 360, 'TOLL', 'cash', { size: 90 });
    if (lt > b - 2.0) { const k = easeOut(seg(lt, b - 2.0, b - 1.6)); boilSeed('stamp'); paint(ellPts(1340, 520, 200 * k + 1, 200 * k + 1, 28), { wash: '#FFFFFF', ink: F.red, sw: 3 }); letter('2x', 1340, 520, 180 * k + 1, F.red); }
    camEnd(); fadeIn(lt);
  }
  // 14. Remember: three ticks
  function s14(t, lt, dur) {
    const [a] = L(13), items = [['Keep a balance', a + .6], ["Don't tear the sticker", a + 1.6], ['Centre of the windshield', a + 3.0]];
    camBegin(960, 540, 1.0);
    boilSeed('bg14'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#EAF4F8', ink: null });
    card(960, 170, 520, 110, 'REMEMBER', null, { size: 70, col: F.tag });
    items.forEach(([txt, t0], i) => { if (lt > t0) { card(1000, 380 + i * 200, 900, 120, txt, null, { pop: (lt - t0) * 4, size: 56 }); tick(330, 380 + i * 200, 1, seg(lt, t0, t0 + .3), F.green, 'tk14' + i); } });
    camEnd(); fadeIn(lt);
  }
  // 15. Follow for more explainers
  function s15(t, lt, dur) {
    const [a, b] = L(14), press = lt > b - 1.0;
    camBegin(960, 540, 1.0);
    boilSeed('bg15'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#1F2550', ink: null });
    for (let i = 0; i < 30; i++) { boilSeed('st15' + i); paint(starPts(hash(i) * W, hash(i + 40) * H, 4, .35, 4), { wash: PAL.cream, washOp: 160, ink: null }); }
    boilSeed('pfp'); paint(ellPts(960, 400, 200, 200, 32), { wash: '#2F3C7A', ink: PAL.cream, sw: 2 });
    person(930, 560, 15, { key: 'hero', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short', eyes: 'wide', mouth: 'grin', armF: .3, armB: .2 });
    letter('@pathira.chindhakal', 960, 700, 64, PAL.cream);
    card(960, 860, 380, 110, press ? 'Following' : 'Follow', null, { col: press ? '#3A3F6A' : F.wave, ink: '#FFFFFF', size: 56, pop: press ? (lt - (b - 1.0)) * 5 : 1 });
    camEnd(); fadeIn(lt, .3);
    if (lt > dur - .8) flash(seg(lt, dur - .8, dur - .1), '#0B0D18');
  }

  const BASE = [F.sky, F.sky, '#EAF4F8', F.sky, F.sky, F.sky, '#EAF4F8', '#EAF4F8', F.sky, F.sky, '#EAF4F8', '#F8ECEA', '#EAF4F8', '#EAF4F8', '#1F2550'];
  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], (t, lt, dur) => { base(BASE[i]); f(t, lt, dur); }]));
})();
