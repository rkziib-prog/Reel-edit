// upi.js: "How does UPI send money in 2 seconds?" (Pathira Chindhakal reel #7, explainer). One shot per narration line.
// Same explainer language as fastag.js (bright scenes, card() labels). Timing from upi_times.js (edits/upi/timeline.py).
(() => {
  const F = {
    sky: '#9ED3EA', bg: '#EAF4F8', bgWarm: '#F8F0E2', bgRed: '#F8ECEA', card: '#FFF8EA', ink: PAL.ink, green: '#3FAF5A', red: '#D8423A',
    blue: '#3FA7E0', navy: '#1F2550', phone: '#1E1B24', screen: '#F3EFE6', bank: '#E8E0C8', bankRoof: '#B5533C', npci: '#2F6FB5', coin: '#E8B23A'
  };
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];
  const fadeIn = (lt, d = .25) => { if (lt < d) flash(1 - easeOut(lt / d), '#FFFFFF'); };
  function card(x, y, w, h, title, sub, o = {}) {
    w *= 1.3; h *= 1.3; boilSeed('card' + title + x); paint(rrPts(x - w / 2, y - h / 2, w, h, 22), { wash: o.col || F.card, ink: F.ink, sw: 1.2 });
    const sz = (o.size || 54) * 1.4;
    if (title) letter(title, x, y - (sub ? h * .16 : 0), sz, o.ink || F.ink, { pop: o.pop });
    if (sub) letter(sub, x, y + h * .24, sz * .62, o.subInk || '#5E5A62', { pop: o.pop });
  }
  function tick(x, y, s, k, col = F.green, key = 'tk') { if (k <= 0) return; boilSeed(key); paint(ellPts(x, y, 40 * s, 40 * s, 16), { wash: col, ink: F.ink, sw: .8 }); inkLine([[x - 18 * s, y], [x - 4 * s, y + 14 * s], [x + 20 * s, y - 16 * s]], 3, '#FFFFFF', 'ink', 0); }
  function phone(x, y, s, key = 'ph', screenCol = F.screen) { push(); translate(x, y); scale(s); boilSeed(key);
    paint(rrPts(-140, -260, 280, 520, 34), { wash: F.phone, ink: F.ink, sw: 1.4 }); paint(rrPts(-122, -232, 244, 464, 20), { wash: screenCol, ink: null }); pop(); }
  function bank(x, y, s, key, col = F.bank) { push(); translate(x, y); scale(s); boilSeed('bank' + key);
    paint([[-130, -150], [130, -150], [0, -230]], { wash: F.bankRoof, ink: F.ink, sw: 1 }); paint(rectPts(-120, -150, 240, 150), { wash: col, ink: F.ink, sw: 1 });
    for (let i = 0; i < 4; i++) paint(rectPts(-95 + i * 60, -130, 20, 120), { wash: '#FFFFFF', ink: F.ink, sw: .5 }); pop(); }
  function hub(x, y, r, t) { boilSeed('hub'); glow(x, y, r * 1.6, F.blue, .35 + .1 * Math.sin(t * 4)); paint(ellPts(x, y, r, r, 28), { wash: F.npci, ink: F.ink, sw: 1.4 }); letter('NPCI', x, y, r * .55, '#FFFFFF'); }
  function coin(x, y, r = 34, key = 'coin') { boilSeed(key); paint(ellPts(x, y, r, r, 18), { wash: F.coin, ink: F.ink, sw: 1 }); letter('Rs', x, y, r * .9, '#7A5A10'); }
  function qr(x, y, s, key = 'qr') { push(); translate(x, y); scale(s); boilSeed(key); paint(rectPts(-110, -110, 220, 220), { wash: '#FFFFFF', ink: F.ink, sw: 1.2 });
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) if (hash(i * 7 + j + 3) > .5) paint(rectPts(-90 + i * 26, -90 + j * 26, 22, 22), { wash: F.ink, ink: null });
    for (const [cx, cy] of [[-70, -70], [70, -70], [-70, 70]]) { paint(rectPts(cx - 30, cy - 30, 60, 60), { wash: F.ink, ink: null }); paint(rectPts(cx - 18, cy - 18, 36, 36), { wash: '#FFFFFF', ink: null }); paint(rectPts(cx - 9, cy - 9, 18, 18), { wash: F.ink, ink: null }); }
    pop(); }
  function line(a, b, col = F.blue, sw = 3, key = 'ln') { boilSeed(key); inkLine([a, b], sw, col, 'ink', 0); }
  const along = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

  // 1. Tea shop: scan a QR, send Rs 10, "ting" in two seconds. How?
  function s1(t, lt, dur) {
    const [a, b] = L(0);
    camBegin(960, 540, 1.0 + .02 * lt);
    boilSeed('shop1'); paint(rectPts(-300, 260, W + 600, 1000), { wash: '#7A5A3A', ink: null }); paint([[200, 300], [1720, 300], [1600, 160], [320, 160]], { wash: '#3E6A5A', ink: F.ink, sw: 1.2 });
    paint(rectPts(-300, 700, W + 600, 60), { wash: '#5A3E2C', ink: F.ink, sw: 1 });
    for (let i = 0; i < 4; i++) { boilSeed('gl' + i); paint(rectPts(380 + i * 90, 640, 40, 60), { wash: '#E8C48A', ink: F.ink, sw: .6 }); }
    qr(1000, 560, .7, 'qr1');
    const ph = [lerp(1500, 1300, easeOut(seg(lt, .2, 1.0))), 600];
    phone(ph[0], ph[1], .8, 'ph1');
    if (lt > .9 && lt < 2.6) { boilSeed('beam1'); paint([[ph[0] - 90, ph[1] - 40], [ph[0] - 90, ph[1] + 40], [1080, 640], [1080, 480]], { wash: F.blue, washOp: 50, ink: null }); }
    if (lt > a + 3.0) card(ph[0], 420, 220, 90, 'Rs 10', null, { pop: (lt - a - 3.0) * 4, size: 40, col: '#E6F6EA' });
    emote('?', 960, 140, 90, seg(lt, b - 1.6, b - 1.2), lt);
    camEnd(); if (lt < .5) flash(1 - easeOut(lt / .5), '#FFFFFF');
  }
  // 2. The QR hides the shop owner's UPI ID
  function s2(t, lt, dur) {
    const [a, b] = L(1), z = kf(lt, [[0, 1.0], [.8, 1.0], [1.8, 2.4], [dur, 2.5]], ease);
    camBegin(lerp(960, 1000, seg(z, 1, 2.4)), lerp(540, 560, seg(z, 1, 2.4)), z);
    boilSeed('bg2'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#7A5A3A', ink: null });
    qr(1000, 560, .7, 'qr1');
    camEnd();
    if (lt > b - 1.8) card(960, 540, 520, 140, 'UPI ID', null, { pop: (lt - (b - 1.8)) * 4, size: 72, col: F.card });
    fadeIn(lt);
  }
  // 3. A UPI ID is like an address: chayakada@bank
  function s3(t, lt, dur) {
    const [a, b] = L(2);
    camBegin(960, 540, 1.0);
    boilSeed('bg3'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bgWarm, ink: null });
    boilSeed('env'); paint(rectPts(560, 300, 800, 480), { wash: '#F2E6C8', ink: F.ink, sw: 1.4 }); inkLine([[560, 300], [960, 560], [1360, 300]], 1.4, F.ink, 'ink', 0);
    if (lt > a + .4) card(960, 220, 420, 100, 'ADDRESS', null, { pop: (lt - a - .4) * 4, size: 50, col: F.coin });
    if (lt > b - 1.8) card(960, 640, 620, 130, 'chayakada@bank', null, { pop: (lt - (b - 1.8)) * 4, size: 56 });
    camEnd(); fadeIn(lt);
  }
  // 4. Amount + PIN; the PIN leaves the phone encrypted
  function s4(t, lt, dur) {
    const [a, b] = L(3), dots = Math.floor(clamp((lt - a - .4) / .3, 0, 4)), lock = lt > a + 2.2;
    camBegin(960, 540, 1.0);
    boilSeed('bg4'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    phone(700, 560, 1.4, 'ph4');
    letter('Rs 10', 700, 300, 90, F.ink);
    for (let i = 0; i < 4; i++) { boilSeed('dot' + i); paint(ellPts(610 + i * 60, 420, 18, 18, 12), { wash: i < dots ? F.ink : '#C9C4BC', ink: null }); }
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { boilSeed('key' + r + c); paint(rrPts(560 + c * 100, 500 + r * 100, 80, 80, 14), { wash: '#E2DDD4', ink: F.ink, sw: .6 }); }
    if (lock) { const k = easeOut(seg(lt, a + 2.2, a + 2.8)), p = [lerp(700, 1400, k), lerp(420, 420, k)]; boilSeed('lock');
      paint(rrPts(p[0] - 70, p[1] - 30, 140, 110, 16), { wash: F.coin, ink: F.ink, sw: 1.2 }); inkLine([[p[0] - 40, p[1] - 30], [p[0] - 40, p[1] - 80], [p[0] + 40, p[1] - 80], [p[0] + 40, p[1] - 30]], 4, F.ink, 'ink', .6); }
    if (lt > b - 1.6) card(1400, 720, 420, 110, 'ENCRYPTED', null, { pop: (lt - (b - 1.6)) * 4, size: 52, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 5. The app sends the request to NPCI, a central switch
  function s5(t, lt, dur) {
    const [a, b] = L(4);
    camBegin(960, 540, 1.0);
    boilSeed('bg5'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    phone(420, 560, .9, 'ph5');
    hub(1420, 540, 180, t);
    line([560, 540], [1240, 540], F.blue, 3, 'l5');
    const pk = seg(lt, a + .8, a + 2.4), p = along([560, 540], [1240, 540], easeInOut2(pk));
    if (pk > 0 && pk < 1) { boilSeed('pkt'); paint(rrPts(p[0] - 60, p[1] - 36, 120, 72, 12), { wash: F.card, ink: F.ink, sw: 1 }); letter('REQ', p[0], p[1], 34, F.ink); }
    if (lt > b - 1.8) card(1420, 840, 460, 110, 'CENTRAL SWITCH', null, { pop: (lt - (b - 1.8)) * 4, size: 46 });
    camEnd(); fadeIn(lt);
  }
  function easeInOut2(k) { return k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
  // 6. NPCI is the highway that connects all the banks
  function s6(t, lt, dur) {
    const [a] = L(5);
    camBegin(960, 540, 1.0);
    boilSeed('bg6'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    const B = [[260, 300], [260, 840], [960, 980], [1660, 840], [1660, 300]];
    B.forEach((p, i) => { if (lt > a + .3 + i * .3) { line([960, 520], [p[0], p[1] - 80], F.blue, 6, 'road' + i); bank(p[0], p[1], .7, i); } });
    hub(960, 520, 150, t);
    if (lt > a + 2.2) card(960, 160, 520, 100, 'HIGHWAY', 'between all banks', { pop: (lt - a - 2.2) * 4, size: 52 });
    camEnd(); fadeIn(lt);
  }
  // 7. First, your bank: PIN correct? Balance there?
  function s7(t, lt, dur) {
    const [a] = L(6);
    camBegin(960, 540, 1.0);
    boilSeed('bg7'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    bank(520, 760, 1.4, 'yours'); letter('YOUR BANK', 520, 830, 50, F.ink);
    if (lt > a + 1.6) { card(1300, 380, 440, 110, 'PIN OK?', null, { pop: (lt - a - 1.6) * 4, size: 56 }); tick(1630, 380, 1.1, seg(lt, a + 2.2, a + 2.4), F.green, 't7a'); }
    if (lt > a + 2.6) { card(1300, 620, 440, 110, 'BALANCE?', null, { pop: (lt - a - 2.6) * 4, size: 56 }); tick(1630, 620, 1.1, seg(lt, a + 3.2, a + 3.4), F.green, 't7b'); }
    camEnd(); fadeIn(lt);
  }
  // 8. If yes: Rs 10 debited
  function s8(t, lt, dur) {
    const [a] = L(7), d = lt > a + 1.8;
    camBegin(960, 540, 1.0);
    boilSeed('bg8'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    bank(520, 760, 1.4, 'yours');
    card(1250, 480, 520, 200, d ? 'Rs 490' : 'Rs 500', 'your balance', { size: 80, ink: d && lt < a + 2.6 ? F.red : F.ink });
    if (d) { const k = seg(lt, a + 1.8, a + 2.6); coin(lerp(1250, 1250, k), lerp(560, 860, k), 40, 'c8'); letter('- Rs 10', 1600, 300, 60, F.red, { pop: (lt - a - 1.8) * 4 }); }
    camEnd(); fadeIn(lt);
  }
  // 9. NPCI tells the shop's bank: credit Rs 10
  function s9(t, lt, dur) {
    const [a, b] = L(8), k = easeInOut2(seg(lt, a + 1.2, a + 2.8));
    camBegin(960, 540, 1.0);
    boilSeed('bg9'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    bank(300, 760, .9, 'yours'); bank(1620, 760, .9, 'shop', '#E6F6EA');
    letter('SHOP', 1620, 820, 44, F.ink);
    line([420, 620], [1500, 620], F.blue, 6, 'hw9'); hub(960, 620, 110, t);
    if (k > 0) coin(lerp(420, 1500, k), 620 - 120 * Math.sin(Math.PI * k), 40, 'c9');
    if (lt > b - 1.6) card(1620, 300, 440, 110, 'CREDIT Rs 10', null, { pop: (lt - (b - 1.6)) * 4, size: 46, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 10. Both get a message, all in two or three seconds
  function s10(t, lt, dur) {
    const [a, b] = L(9), ding = lt > a + .4;
    camBegin(960 + (ding && lt < a + .9 ? Math.sin(lt * 80) * 6 : 0), 540, 1.0);
    boilSeed('bg10'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    phone(560, 560, 1.1, 'ph10a'); phone(1360, 560, 1.1, 'ph10b');
    if (ding) { card(560, 420, 240, 90, 'Paid Rs 10', null, { size: 32 }); card(1360, 420, 260, 90, 'Got Rs 10', null, { size: 32, col: '#E6F6EA' }); }
    if (lt > b - 2.0) card(960, 860, 360, 110, '~ 2 SEC', null, { pop: (lt - (b - 2.0)) * 4, size: 60, col: F.coin });
    camEnd(); fadeIn(lt);
  }
  // 11. The app never holds your money: bank to bank
  function s11(t, lt, dur) {
    const [a, b] = L(10), k = frac(lt * .5);
    camBegin(960, 540, 1.0);
    boilSeed('bg11'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    bank(400, 640, 1.1, 'yours'); bank(1520, 640, 1.1, 'shop', '#E6F6EA');
    line([560, 560], [1360, 560], F.green, 8, 'bb'); coin(lerp(560, 1360, k), 560, 36, 'c11');
    boilSeed('app11'); phone(960, 900, .45, 'ph11');
    if (lt > a + 1.0) { inkLine([[900, 780], [1020, 900]], 4, F.red, 'ink', 0); inkLine([[1020, 780], [900, 900]], 4, F.red, 'ink', 0); }
    if (lt > b - 2.2) card(960, 220, 560, 110, 'BANK  ->  BANK', null, { pop: (lt - (b - 2.2)) * 4, size: 56, col: '#E6F6EA' });
    camEnd(); fadeIn(lt);
  }
  // 12. Any UPI app, any bank
  function s12(t, lt, dur) {
    const [a] = L(11), cols = ['#5A3FD8', '#3FA7E0', '#3FAF5A', '#E2683A'];
    camBegin(960, 540, 1.0);
    boilSeed('bg12'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    hub(960, 540, 110, t);
    cols.forEach((c, i) => { const y = 220 + i * 210; if (lt > a + .3 + i * .25) { line([380, y], [860, 540], F.blue, 3, 'la' + i); boilSeed('app' + i); paint(rrPts(240, y - 70, 140, 140, 30), { wash: c, ink: F.ink, sw: 1 }); } });
    for (let i = 0; i < 4; i++) { const y = 260 + i * 200; if (lt > a + 1.6 + i * .25) { line([1060, 540], [1560, y], F.blue, 3, 'lb' + i); bank(1650, y + 70, .55, 'b12' + i); } }
    camEnd(); fadeIn(lt);
  }
  // 13. Remember: never enter your PIN to receive money
  function s13(t, lt, dur) {
    const [a, b] = L(12);
    camBegin(960, 540, 1.0);
    boilSeed('bg13'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    card(960, 200, 460, 100, 'REMEMBER', null, { size: 64, col: F.coin });
    if (lt > b - 2.6) { card(960, 560, 900, 240, 'RECEIVE MONEY', 'NO PIN NEEDED', { pop: (lt - (b - 2.6)) * 4, size: 66, col: '#E6F6EA', subInk: F.green }); }
    camEnd(); fadeIn(lt);
  }
  // 14. "Enter PIN to get money" = scam
  function s14(t, lt, dur) {
    const [a, b] = L(13);
    camBegin(960, 540, 1.0);
    boilSeed('bg14'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bgRed, ink: null });
    phone(760, 560, 1.4, 'ph14');
    card(760, 420, 300, 150, 'Enter PIN', 'to receive Rs 5000', { size: 40 });
    if (lt > b - 1.4) { const k = easeOut(seg(lt, b - 1.4, b - 1.0)); boilSeed('stamp14'); paint(ellPts(1360, 520, 230 * k + 1, 230 * k + 1, 28), { wash: '#FFFFFF', ink: F.red, sw: 3 }); letter('SCAM', 1360, 520, 120 * k + 1, F.red); }
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

  const BASE = ['#7A5A3A', '#7A5A3A', F.bgWarm, F.bg, F.bg, F.bg, F.bg, F.bg, F.bg, F.bg, F.bg, F.bg, F.bg, F.bgRed, F.navy];
  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], (t, lt, dur) => { base(BASE[i]); f(t, lt, dur); }]));
})();
