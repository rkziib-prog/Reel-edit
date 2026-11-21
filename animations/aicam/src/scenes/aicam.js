// aicam.js: "How do AI traffic cameras catch you?" (Pathira Chindhakal reel #8, explainer). One shot per narration line.
// Same explainer kit as fastag/upi (bright scenes, card() labels, BASE colours). Timing from aicam_times.js.
(() => {
  const F = {
    sky: '#9ED3EA', skyHi: '#E6F4F8', grass: '#7DB85A', road: '#5E5A62', lane: '#F3EFE6', bg: '#EAF4F8', bgRed: '#F8ECEA',
    card: '#FFF8EA', ink: PAL.ink, green: '#3FAF5A', red: '#D8423A', blue: '#3FA7E0', navy: '#1F2550', night: '#141B36',
    phone: '#1E1B24', screen: '#F3EFE6', bike: '#2F6FB5', car: '#E2683A', coin: '#E8B23A'
  };
  const ROADY = 860;
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];
  const fadeIn = (lt, d = .25) => { if (lt < d) flash(1 - easeOut(lt / d), '#FFFFFF'); };
  function card(x, y, w, h, title, sub, o = {}) {
    w *= 1.3; h *= 1.3; boilSeed('card' + title + x); paint(rrPts(x - w / 2, y - h / 2, w, h, 22), { wash: o.col || F.card, ink: F.ink, sw: 1.2 });
    const sz = (o.size || 54) * 1.4;
    if (title) letter(title, x, y - (sub ? h * .16 : 0), sz, o.ink || F.ink, { pop: o.pop });
    if (sub) letter(sub, x, y + h * .24, sz * .62, o.subInk || '#5E5A62', { pop: o.pop });
  }
  function tick(x, y, s, k, col = F.green, key = 'tk') { if (k <= 0) return; boilSeed(key); paint(ellPts(x, y, 40 * s, 40 * s, 16), { wash: col, ink: F.ink, sw: .8 }); inkLine([[x - 18 * s, y], [x - 4 * s, y + 14 * s], [x + 20 * s, y - 16 * s]], 3, '#FFFFFF', 'ink', 0); }
  function box(x, y, w, h, col, label, key) { boilSeed('bx' + key); const P = rectPts(x, y, w, h); inkLine([...P, P[0]], 2.4, col, 'ink', 0); if (label) { paint(rectPts(x, y - 40, Math.max(120, label.length * 26), 40), { wash: col, ink: null }); letter(label, x + Math.max(120, label.length * 26) / 2, y - 20, 30, '#FFFFFF'); } }
  function phone(x, y, s, key = 'ph') { push(); translate(x, y); scale(s); boilSeed(key); paint(rrPts(-140, -260, 280, 520, 34), { wash: F.phone, ink: F.ink, sw: 1.4 }); paint(rrPts(-122, -232, 244, 464, 20), { wash: F.screen, ink: null }); pop(); }
  function street(t, night = false) {
    boilSeed('st' + night); paint(rectPts(-300, -300, W + 600, ROADY + 300), { wash: night ? F.night : F.sky, ink: null });
    if (!night) { for (let i = 0; i < 3; i++) cloud(260 + i * 700, 140 + 50 * hash(i), .7, 'ac' + i); }
    palm(160, ROADY - 60, 360, .05 * Math.sin(t * 2), 'ap1', night ? ['#1F2A2E', '#161E22', '#2A2226'] : null);
    boilSeed('gr' + night); paint(rectPts(-300, ROADY - 80, W + 600, 90), { wash: night ? '#24323A' : F.grass, ink: null });
    boilSeed('rd' + night); paint(rectPts(-300, ROADY, W + 600, 500), { wash: night ? '#2E2C34' : F.road, ink: null });
    for (let i = 0; i < 9; i++) paint(rectPts(-200 + i * 260, ROADY + 150, 140, 12), { wash: F.lane, washOp: night ? 90 : 220, ink: null });
  }
  function camPole(x, y, s, key = 'cp', flashK = 0) { push(); translate(x, y); scale(s); boilSeed(key);
    paint(rectPts(-10, -520, 20, 520), { wash: '#8C8A92', ink: F.ink, sw: .8 }); paint(rectPts(-10, -520, 200, 16), { wash: '#8C8A92', ink: F.ink, sw: .6 });
    paint(rrPts(120, -570, 170, 80, 14), { wash: '#3A3640', ink: F.ink, sw: 1 }); paint(ellPts(110, -530, 30, 30, 14), { wash: '#1E1B24', ink: F.ink, sw: 1 }); paint(ellPts(110, -530, 12, 12, 10), { wash: '#5A8AC8', ink: null }); paint(ellPts(270, -555, 7, 7, 8), { wash: F.red, ink: null }); pop();
    if (flashK > 0) glow(x + 110 * s, y - 525 * s, 260 * s, '#FFFFFF', flashK); }
  function bikeRider(x, y, s, o = {}) {   // side view facing right
    push(); translate(x, y); scale(s); boilSeed('bk' + (o.key || ''));
    for (const wx of [-110, 110]) { paint(ellPts(wx, -52, 52, 52, 18), { wash: '#1E1B24', ink: F.ink, sw: 1 }); paint(ellPts(wx, -52, 20, 20, 10), { wash: '#8C8A92', ink: null }); }
    paint([[-110, -52], [-20, -140], [80, -140], [110, -52], [50, -90], [-50, -90]], { wash: F.bike, ink: F.ink, sw: 1 });
    paint(rrPts(-70, -165, 120, 26, 10), { wash: '#2A2630', ink: F.ink, sw: .7 }); inkLine([[95, -185], [135, -230], [160, -230]], 2, '#3A3640', 'ink', 0);
    paint(rectPts(-160, -110, 44, 28), { wash: '#F3EFE6', ink: F.ink, sw: .6 }); pop();
    const rider = (dx, k, helmet, shirt) => { person(x + dx * s, y - 150 * s, 14 * s, { key: 'rd' + k + (o.key || ''), sit: true, skin: C.skin, shirt, lower: 'pants', lowerCol: '#2E3A4E', hairStyle: 'short', eyes: 'dot', mouth: 'flat', armF: 1.6, bendF: -.2, armB: 1.5 });
      if (helmet) { boilSeed('helm' + k); paint(ellPts(x + (dx + 7) * s, y - 150 * s - 14 * s * 14.4, 14 * s * 3.5, 14 * s * 3.1, 18, .5), { wash: '#D8423A', ink: F.ink, sw: .9 }); paint(rectPts(x + (dx + 20) * s, y - 150 * s - 14 * s * 14.6, 14 * s * 2.0, 14 * s * 1.2), { wash: '#3A4A6A', ink: null }); } };
    rider(-20, 0, o.helmet, '#E8B23A');
    if (o.triple) { rider(-90, 1, false, '#7FA6D8'); rider(-150, 2, false, '#4E9A5A'); }
  }

  // 1. No police, but a fine reaches your phone. Who saw you?
  function s1(t, lt, dur) {
    const [a, b] = L(0);
    camBegin(960, 540, 1.0);
    street(t);
    bikeRider(lerp(-200, 1000, seg(lt, 0, a + 3.0)), ROADY + 70, .9, { key: 'r1' });
    if (lt > a + 3.2) { phone(1560, 480, .7, 'ph1'); card(1560, 380, 220, 90, 'FINE', null, { size: 40, col: '#F8ECEA', ink: F.red, pop: (lt - a - 3.2) * 4 }); }
    emote('?', 960, 160, 90, seg(lt, b - .8, b - .5), lt);
    camEnd(); if (lt < .5) flash(1 - easeOut(lt / .5), '#FFFFFF');
  }
  // 2. The AI camera by the roadside
  function s2(t, lt, dur) {
    const [a] = L(1), z = kf(lt, [[0, 1.0], [a + .4, 1.0], [a + 1.6, 2.0], [dur, 2.1]], ease);
    camBegin(lerp(960, 1520, seg(z, 1, 2)), lerp(540, 380, seg(z, 1, 2)), z);
    street(t); camPole(1400, ROADY - 40, 1, 'cp2');
    camEnd();
    if (lt > a + 1.4) card(960, 860, 420, 110, 'AI CAMERA', null, { pop: (lt - a - 1.4) * 4, size: 60, col: F.coin });
    fadeIn(lt);
  }
  // 3. It photographs every vehicle; at night with infrared
  function s3(t, lt, dur) {
    const [a, b] = L(2), night = lt > a + 3.0;
    camBegin(960, 540, 1.0);
    street(t, night); camPole(1500, ROADY - 40, 1, 'cp3', night ? .5 : 0);
    const cx = lerp(-200, 1100, frac((lt - (night ? a + 3.0 : 0)) * .35));
    bikeRider(cx, ROADY + 70, .9, { key: 'r3' });
    const fl = Math.exp(-((((lt % 1.6) - .8) * 12) ** 2)); if (!night) flash(fl * .35);
    if (night) { glow(1300, ROADY - 100, 520, '#B84A6A', .25); card(1500, 160, 400, 100, 'INFRARED', null, { pop: (lt - a - 3.0) * 4, size: 52, col: '#F2E0EA' }); }
    camEnd(); fadeIn(lt);
  }
  // 4. The AI examines the photo: computer vision
  function s4(t, lt, dur) {
    const [a, b] = L(3), k = easeOut(seg(lt, a + .2, a + 1.2));
    camBegin(960, 540, 1.0);
    boilSeed('bg4'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    boilSeed('photo4'); paint(rectPts(lerp(200, 540, k), 320, 520, 380), { wash: F.sky, ink: F.ink, sw: 1.4 });
    bikeRider(lerp(200, 540, k) + 260, 660, .7, { key: 'p4' });
    boilSeed('brain'); glow(1400, 500, 300, F.blue, .3 + .1 * Math.sin(t * 4)); paint(ellPts(1400, 500, 220, 170, 26), { wash: '#E2DDF2', ink: F.ink, sw: 1.4 });
    for (let i = 0; i < 5; i++) inkLine([[1260 + i * 60, 400], [1290 + i * 50, 600]], 1, '#9A8AC8', 'inkfine', .6);
    letter('AI', 1400, 500, 100, '#5A3FD8');
    if (lt > b - 2.2) card(1400, 820, 520, 110, 'COMPUTER VISION', null, { pop: (lt - (b - 2.2)) * 4, size: 46 });
    camEnd(); fadeIn(lt);
  }
  // 5. It learned from thousands of photos
  function s5(t, lt, dur) {
    const [a] = L(4);
    camBegin(960, 540, 1.0 + .03 * lt);
    boilSeed('bg5'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const i = r * 6 + c; if (lt < a + .2 + i * .12) continue; boilSeed('th' + i);
      const x = 180 + c * 270, y = 200 + r * 250; paint(rectPts(x, y, 230, 200), { wash: i % 2 ? '#D8E8F0' : '#E8F0DA', ink: F.ink, sw: .8 });
      if (i % 3 === 0) { paint(ellPts(x + 115, y + 90, 50, 44, 16), { wash: F.red, ink: F.ink, sw: .8 }); } else if (i % 3 === 1) { inkLine([[x + 70, y + 40], [x + 170, y + 170]], 6, '#2E2A36', 'ink', 0); } else { paint(ellPts(x + 115, y + 100, 46, 50, 14), { wash: C.skin, ink: F.ink, sw: .8 }); } }
    if (lt > a + 2.8) card(500, 960, 300, 80, 'HELMET', null, { size: 40, pop: (lt - a - 2.8) * 4 });
    if (lt > a + 4.4) card(1400, 960, 340, 80, 'SEAT BELT', null, { size: 40, pop: (lt - a - 4.4) * 4 });
    camEnd(); fadeIn(lt);
  }
  // 6. It draws boxes: bike, rider, head
  function s6(t, lt, dur) {
    const [a] = L(5);
    camBegin(960, 540, 1.0);
    boilSeed('bg6'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.sky, ink: null }); paint(rectPts(-300, 860, W + 600, 400), { wash: F.road, ink: null });
    const x = 960, y = 900, s = 1.4;
    bikeRider(x, y, s, { key: 'r6' });
    if (lt > a + 2.0) box(x - 230, y - 240, 460, 240, F.blue, 'BIKE', 'b');
    if (lt > a + 2.6) box(x - 120, y - 520, 240, 380, F.green, 'RIDER', 'r');
    if (lt > a + 3.2) box(x - 60, y - 560, 150, 140, '#E8B23A', 'HEAD', 'h');
    camEnd(); fadeIn(lt);
  }
  // 7. No helmet on the head: violation
  function s7(t, lt, dur) {
    const [a, b] = L(6), bad = lt > a + 1.2;
    camBegin(990, 400, 1.6 + .05 * lt);
    boilSeed('bg7'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.sky, ink: null }); paint(rectPts(-300, 860, W + 600, 400), { wash: F.road, ink: null });
    bikeRider(960, 900, 1.4, { key: 'r6' });
    box(900, 340, 150, 140, bad ? F.red : '#E8B23A', bad ? 'NO HELMET' : 'HEAD', 'h7');
    camEnd();
    if (lt > b - 1.6) card(1500, 860, 420, 110, 'VIOLATION', null, { pop: (lt - (b - 1.6)) * 4, size: 56, col: '#F8ECEA', ink: F.red });
    fadeIn(lt);
  }
  // 8. Seat belt, phone while driving, three on a bike
  function s8(t, lt, dur) {
    const [a] = L(7);
    camBegin(960, 540, 1.0);
    boilSeed('bg8'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    const P = [['NO SEAT BELT', 360, a + .2], ['PHONE', 960, a + 1.4], ['3 ON A BIKE', 1560, a + 2.6]];
    P.forEach(([lab, x, t0], i) => { if (lt < t0) return; boilSeed('pn' + i); paint(rectPts(x - 260, 300, 520, 420), { wash: F.sky, ink: F.ink, sw: 1.2 }); paint(rectPts(x - 260, 620, 520, 100), { wash: F.road, ink: null });
      if (i === 2) bikeRider(x + 60, 680, .7, { key: 'p8', triple: true });
      else { boilSeed('mini' + i); paint(rrPts(x - 180, 470, 360, 160, 40), { wash: F.car, ink: F.ink, sw: 1 }); paint(rectPts(x - 60, 400, 140, 80), { wash: '#BFE0EC', ink: F.ink, sw: .8 }); paint(ellPts(x + 10, 440, 26, 28, 12), { wash: C.skin, ink: F.ink, sw: .6 });
        if (i === 1) paint(rrPts(x + 30, 430, 22, 36, 4), { wash: '#1E1B24', ink: null }); }
      box(x - 200, 380, 400, 280, F.red, null, 'pb' + i); card(x, 800, 380, 90, lab, null, { size: 36, col: '#F8ECEA', ink: F.red, pop: (lt - t0) * 4 }); });
    camEnd(); fadeIn(lt);
  }
  // 9. The number plate: ANPR
  function s9(t, lt, dur) {
    const [a, b] = L(8), txt = 'KL 07 AB 1234', n = Math.floor(clamp((lt - a - 1.0) / .14, 0, txt.length));
    camBegin(960, 540, 1.0);
    boilSeed('bg9'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    boilSeed('plate'); paint(rrPts(460, 380, 1000, 260, 26), { wash: '#F3EFE6', ink: F.ink, sw: 2 });
    letter(txt.slice(0, n), 960, 510, 130, F.ink);
    if (lt > a + .4 && lt < a + 3.0) { boilSeed('scan9'); const y = 380 + 260 * frac(lt * 1.2); inkLine([[460, y], [1460, y]], 2, F.blue, 'ink', 0); }
    if (lt > b - 1.8) card(960, 820, 340, 110, 'ANPR', 'plate reader', { pop: (lt - (b - 1.8)) * 4, size: 60 });
    camEnd(); fadeIn(lt);
  }
  // 10. Owner details from the vehicle database
  function s10(t, lt, dur) {
    const [a] = L(9), k = easeOut(seg(lt, a + .4, a + 1.6));
    camBegin(960, 540, 1.0);
    boilSeed('bg10'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    card(lerp(320, 560, k), 540, 320, 90, 'KL 07 AB 1234', null, { size: 34 });
    boilSeed('db'); for (let i = 0; i < 3; i++) { paint(ellPts(1000, 360 + i * 120, 160, 40, 20), { wash: '#5A7AB8', ink: F.ink, sw: 1 }); paint(rectPts(840, 360 + i * 120, 320, 80), { wash: '#5A7AB8', ink: null }); }
    paint(ellPts(1000, 680, 160, 40, 20), { wash: '#4A6AA8', ink: F.ink, sw: 1 }); letter('DATABASE', 1000, 520, 44, '#FFFFFF');
    if (lt > a + 2.2) card(1560, 540, 380, 200, 'OWNER', 'name . phone', { pop: (lt - a - 2.2) * 4, size: 52 });
    camEnd(); fadeIn(lt);
  }
  // 11. AI can be wrong, so an officer checks
  function s11(t, lt, dur) {
    const [a, b] = L(10), ok = lt > b - 1.6;
    camBegin(960, 560, 1.0);
    boilSeed('bg11'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#DDE6EE', ink: null }); paint(rectPts(-300, 800, W + 600, 400), { wash: '#8C8A92', ink: null });
    for (let i = 0; i < 3; i++) { boilSeed('mon' + i); paint(rrPts(300 + i * 480, 200, 400, 260, 16), { wash: '#1E2A3E', ink: F.ink, sw: 1.2 }); paint(rectPts(330 + i * 480, 230, 340, 200), { wash: F.sky, ink: null }); }
    boilSeed('desk'); paint(rectPts(300, 640, 1320, 40), { wash: '#6E4A30', ink: F.ink, sw: 1 });
    person(860, 880, 22, { key: 'officer', skin: '#8A5634', shirt: '#B89A62', lower: 'pants', lowerCol: '#8F7748', hairStyle: 'short', eyes: 'dot', mouth: 'flat', armF: 1.5, bendF: -.3, armB: 1.3, flip: false });
    if (lt > a + .4) card(960, 120, 420, 90, 'AI CAN BE WRONG', null, { pop: (lt - a - .4) * 4, size: 40, col: '#FFF0D8' });
    if (ok) { card(1500, 560, 360, 100, 'CONFIRMED', null, { pop: (lt - (b - 1.6)) * 4, size: 48, col: '#E6F6EA' }); tick(1730, 560, 1.1, 1, F.green, 't11'); }
    camEnd(); fadeIn(lt);
  }
  // 12. e-challan to the owner's phone, with the photo
  function s12(t, lt, dur) {
    const [a] = L(11), buzz = lt > a + .8 && lt < a + 1.4 ? Math.sin(lt * 80) * 6 : 0;
    camBegin(960 + buzz, 540, 1.0);
    boilSeed('bg12'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    phone(960, 560, 1.6, 'ph12');
    if (lt > a + .8) { card(960, 340, 260, 90, 'e-Challan', 'KL 07 AB 1234', { size: 40, col: '#F8ECEA', ink: F.red, pop: (lt - a - .8) * 4 }); boilSeed('thumb'); paint(rectPts(830, 520, 260, 200), { wash: F.sky, ink: F.ink, sw: 1 }); bikeRider(990, 700, .35, { key: 't12' }); box(940, 560, 50, 50, F.red, null, 'th12'); }
    camEnd(); fadeIn(lt);
  }
  // 13. Someone else was riding? The fine still goes to the owner
  function s13(t, lt, dur) {
    const [a, b] = L(12);
    camBegin(960, 540, 1.0);
    boilSeed('bg13'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.sky, ink: null }); paint(rectPts(-300, 860, W + 600, 400), { wash: F.road, ink: null });
    bikeRider(lerp(300, 700, seg(lt, 0, dur)), 930, .9, { key: 'friend' });
    card(500, 200, 300, 80, 'FRIEND', null, { size: 40 });
    person(1500, 930, 22, { key: 'owner', skin: C.skin, shirt: '#4E9A5A', lower: 'mundu', hairStyle: 'short', eyes: lt > b - 1.4 ? 'wide' : 'dot', mouth: lt > b - 1.4 ? 'O' : 'smile', armF: 1.4, bendF: -.6, handF: (x, y, u) => { boilSeed('oph'); paint(rrPts(x - .4 * u, y - 1.8 * u, 1.3 * u, 2.2 * u, .2 * u), { wash: '#1E1B24', ink: null }); } });
    card(1500, 200, 300, 80, 'OWNER', null, { size: 40 });
    if (lt > b - 1.6) card(1500, 380, 260, 80, 'FINE', null, { size: 40, col: '#F8ECEA', ink: F.red, pop: (lt - (b - 1.6)) * 4 });
    camEnd(); fadeIn(lt);
  }
  // 14. Remember: helmet and seat belt are for your life
  function s14(t, lt, dur) {
    const [a, b] = L(13);
    camBegin(960, 540, 1.0);
    boilSeed('bg14'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: F.bg, ink: null });
    card(960, 170, 460, 100, 'REMEMBER', null, { size: 64, col: F.coin });
    boilSeed('h14'); paint(ellPts(660, 520, 150, 130, 22), { wash: F.red, ink: F.ink, sw: 1.4 }); paint(rectPts(700, 480, 110, 70), { wash: '#3A4A6A', ink: null });
    boilSeed('sb14'); inkLine([[1180, 380], [1420, 680]], 14, '#2E2A36', 'ink', 0); paint(rrPts(1270, 500, 60, 40, 6), { wash: '#B9B2AE', ink: F.ink, sw: .8 });
    if (lt > b - 2.4) { const k = easeOut(seg(lt, b - 2.4, b - 1.9)); boilSeed('heart'); paint(heartPts(960, 560, 120 * k + 1), { wash: F.red, ink: F.ink, sw: 1 }); card(960, 880, 560, 110, 'FOR YOUR LIFE', null, { pop: (lt - (b - 2.4)) * 4, size: 56, col: '#E6F6EA' }); }
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

  const BASE = [F.sky, F.sky, F.sky, F.bg, F.bg, F.sky, F.sky, F.bg, F.bg, F.bg, '#DDE6EE', F.bg, F.sky, F.bg, F.navy];
  const base = (c) => { push(); noStroke(); fill(c); rect(-10, -10, W + 20, H + 20); pop(); };
  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], (t, lt, dur) => { base(BASE[i]); f(t, lt, dur); }]));
})();
