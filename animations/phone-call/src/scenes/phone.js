// phone.js: "The 2 AM Call" (Pathira Chindhakal reel #2, mystery thriller). One shot per narration line.
// Timing (shot starts, line starts/ends in video time) comes from phone_times.js (edits/phone-call/timeline.py).
(() => {
  const N = {
    night: '#141A33', sky: '#1B2347', wall: '#2A2438', wallLt: '#3A3350', wood: '#5A3A2A', woodDk: '#3B2619', floor: '#231A16',
    moon: '#DCE4F2', moonGlow: '#9FB4D9', lamp: '#FFB45A', phone: '#1E1B24', sand: '#6E6C82', sandDk: '#58566C',
    leaf: '#1F2A2E', leafDk: '#161E22', trunk: '#2A2226', roof: '#3A2420', paper: '#E6D8B4', sepia: '#A0805C', black: '#0B0D18'
  };
  const NIGHT_PALM = [N.leaf, N.leafDk, N.trunk];
  const HERO = { key: 'hero', skin: C.skin, shirt: '#4E6A8F', lower: 'mundu', lowerCol: '#D8D2C2', hairStyle: 'short', kasavu: false };
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];   // line i (0-based) start/end in shot-local time
  const fadeIn = (lt, d = .5) => { if (lt < d) flash(1 - easeOut(lt / d), N.black); };
  const arcPts = (cx, cy, r, a0, a1, n = 10) => { const P = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return P; };

  // ---------- props ----------
  function phone(x, y, s, o = {}) {        // old black rotary phone, (x, y) = middle of its base on the table
    const ring = o.ring || 0, sh = ring ? Math.sin(T * 70) * .05 * ring : 0;
    push(); translate(x, y); rotate(sh); scale(s);
    boilSeed('phone' + (o.key || ''));
    paint([[-125, 0], [125, 0], [96, -92], [-96, -92]], { wash: N.phone, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(0, -50, 44, 36, 20, .4), { wash: '#D8D0BC', ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 10; i++) { const a = -2.2 + i * .42; paint(ellPts(Math.cos(a) * 30, -50 + Math.sin(a) * 24, 6, 5, 8), { wash: N.phone, ink: null }); }
    paint(ellPts(0, -50, 10, 8, 10), { wash: C.red, ink: null });
    if (!o.off) {
      const lift = ring ? Math.abs(Math.sin(T * 35)) * 8 * ring : 0;
      paint(ribbon(through([[-128, -98 - lift], [-70, -130 - lift], [70, -130 - lift], [128, -98 - lift]], 4), 30, 30), { wash: N.phone, ink: PAL.ink, sw: 1 });
      for (const ex of [-128, 128]) paint(ellPts(ex, -96 - lift, 34, 22, 14, .4), { wash: N.phone, ink: PAL.ink, sw: .9 });
    }
    if (o.cord !== false) inkLine([[-125, -20], [-160, 0], [-150, 30], [-190, 40]], 1.4, '#3A3140', 'ink', .6);
    if (ring > .05) for (const sd of [-1, 1]) for (let k = 0; k < 2; k++) {
      const r = 170 + k * 40 + 20 * Math.sin(T * 30 + k);
      inkLine(arcPts(0, -60, r, sd > 0 ? -.9 : Math.PI - .5, sd > 0 ? -.5 : Math.PI - .9 + 0, 6).map(([px, py]) => [px, py]), 1.4, '#E8E0F0', 'ink', .4);
    }
    pop();
  }
  function table(x, y, w) {                // top surface at y
    boilSeed('table' + x);
    paint(rectPts(x - w / 2, y, w, 26), { wash: N.wood, ink: PAL.ink, sw: 1 });
    for (const lx of [x - w / 2 + 20, x + w / 2 - 44]) paint(rectPts(lx, y + 26, 24, 230), { wash: N.woodDk, ink: PAL.ink, sw: .8 });
  }
  function hall(t, o = {}) {               // the tharavadu hall at night
    boilSeed('hall');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: N.wall, ink: null });
    paint(rectPts(-300, 620, W + 600, 260), { wash: N.woodDk, ink: null });
    for (let i = 0; i < 14; i++) inkLine([[-200 + i * 170, 620], [-200 + i * 170, 880]], .7, '#2A1B12', 'inkfine', 0);
    paint(rectPts(-300, 880, W + 600, 500), { wash: N.floor, ink: null });
    // window with moonlight and wooden bars
    boilSeed('hwin');
    glow(300, 380, 360, N.moonGlow, .25);
    paint(rectPts(150, 200, 300, 330), { wash: '#34446E', ink: PAL.ink, sw: 1.4 });
    paint(ellPts(380, 270, 30, 30, 14), { wash: N.moon, ink: null });
    for (let i = 1; i < 6; i++) paint(rectPts(150 + i * 50 - 6, 200, 12, 330), { wash: N.wood, ink: PAL.ink, sw: .6 });
    if (o.clock) clockFace(1500, 300, 70, o.clock[0], o.clock[1], 'hclock');
    // a framed photo on the wall
    boilSeed('hframe');
    paint(rectPts(700, 240, 150, 190), { wash: N.wood, ink: PAL.ink, sw: 1 });
    paint(rectPts(718, 258, 114, 154), { wash: '#4A4258', ink: null });
    table(1100, 700, 420);
  }

  // a head in close-up (faces right): the same design as person()'s head, for big faces and the newspaper photo
  function face(cx, cy, r, o = {}) {
    const skin = o.skin || C.skin, hair = o.hair || C.hair, ink = o.ink || PAL.ink, sw = o.sw || 1.2;
    boilSeed('face' + (o.key || ''));
    paint(ellPts(cx - .3 * r, cy + 1.25 * r, .55 * r, .6 * r, 14), { wash: o.shirt || '#4E6A8F', ink, sw });
    paint(rectPts(cx - .15 * r, cy + .7 * r, .5 * r, .6 * r), { wash: skin, ink: null });
    paint(ellPts(cx - .29 * r, cy - .18 * r, r, .97 * r, 24, .6), { wash: hair, ink, sw });
    paint(ellPts(cx, cy, r, 1.06 * r, 28, .5), { wash: skin, ink, sw });
    paint(ellPts(cx - .13 * r, cy - .71 * r, .97 * r, .45 * r, 22, .5, -.08), { wash: hair, ink: null });
    paint(ellPts(cx - .35 * r, cy + .1 * r, .19 * r, .29 * r, 12, .3), { wash: mixCol(skin, PAL.ink, .15), ink, sw: sw * .7 });
    const wide = o.eyes !== 'dot', pr = o.pupil ?? .45;
    for (const ex of [cx + .23 * r, cx + .71 * r]) {
      const ey = cy - .06 * r;
      if (wide) { paint(ellPts(ex, ey, .2 * r, .25 * r, 14), { wash: o.eyeWhite || PAL.cream, ink, sw: sw * .8 }); paint(ellPts(ex + .04 * r, ey, .09 * r * pr / .45, .11 * r * pr / .45, 10), { wash: ink, ink: null }); }
      else paint(ellPts(ex, ey, .1 * r, .15 * r, 10), { wash: ink, ink: null });
      if (o.brow) inkLine([[ex - .16 * r, ey - .42 * r], [ex + .16 * r, ey - (o.brow === 'up' ? .5 : .3) * r]], sw * .9, ink, 'ink', 0);
    }
    inkLine([[cx + .94 * r, cy - .03 * r], [cx + 1.1 * r, cy + .23 * r], [cx + .9 * r, cy + .26 * r]], sw * .8, ink, 'inkfine', .5);
    const m = [cx + .55 * r, cy + .6 * r];
    if (o.mouth === 'O') paint(ellPts(m[0], m[1] + .05 * r, .15 * r, .19 * r, 12), { wash: '#5A2A2E', ink, sw: sw * .8 });
    else if (o.mouth === 'smile') inkLine([[m[0] - .25 * r, m[1] - .05 * r], [m[0], m[1] + .1 * r], [m[0] + .25 * r, m[1] - .07 * r]], sw, ink, 'ink', .6);
    else inkLine([[m[0] - .2 * r, m[1]], [m[0] + .2 * r, m[1]]], sw, ink, 'ink', 0);
    if (o.sweat) { const k = frac(T * .5), d = [cx + 1.0 * r, cy - .5 * r + k * .5 * r]; paint([[d[0], d[1] - .14 * r], [d[0] + .07 * r, d[1]], [d[0], d[1] + .06 * r], [d[0] - .07 * r, d[1]]], { wash: '#9FC8E8', ink, sw: sw * .6, curv: .5 }); }
  }
  function receiver(x, y, s, rot) {      // handset alone (local centre at the grip)
    push(); translate(x, y); rotate(rot); scale(s); boilSeed('rcv');
    paint(ribbon(through([[-110, 10], [-60, -18], [60, -18], [110, 10]], 4), 30, 30), { wash: N.phone, ink: PAL.ink, sw: 1 });
    for (const ex of [-110, 110]) paint(ellPts(ex, 12, 32, 22, 14, .4), { wash: N.phone, ink: PAL.ink, sw: .9 });
    pop();
  }
  function chair(x, y, s, key = 'chair') {  // wooden chair, side view, (x, y) = floor under the seat
    push(); translate(x, y); scale(s); boilSeed(key);
    paint(rectPts(-70, -180, 14, 180), { wash: N.woodDk, ink: PAL.ink, sw: .8 });
    paint(rectPts(56, -180, 14, 180), { wash: N.woodDk, ink: PAL.ink, sw: .8 });
    paint(rectPts(-80, -200, 160, 22), { wash: N.wood, ink: PAL.ink, sw: .9 });
    paint(rectPts(-80, -420, 16, 230), { wash: N.wood, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 3; i++) paint(rectPts(-80, -400 + i * 60, 16, 26), { wash: N.wood, ink: null });
    pop();
  }

  // 1. Hook: the old phone in the dark
  function s1(t, lt, dur) {
    camBegin(1100, 600, 1.5 + .08 * lt);
    hall(t, { clock: [1, 58] });
    phone(1100, 700, 1, { ring: lt > dur - .9 ? .6 : 0 });
    for (let i = 0; i < 12; i++) { boilSeed('mote' + i); const x = 900 + 400 * hash(i), y = 420 + 200 * hash(i + 9) - 20 * Math.sin(t * .4 + i); paint(ellPts(x, y, 2.5, 2.5, 6), { wash: N.moonGlow, washOp: 150, ink: null }); }
    camEnd();
    if (lt < 1.2) flash(1 - easeOut(lt / 1.2), N.black);
  }
  // 2. The tharavadu at night, one window lit
  function s2(t, lt, dur) {
    camBegin(960, 540, 1.0 + .04 * lt);
    boilSeed('nsky');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: N.sky, ink: null });
    for (let i = 0; i < 50; i++) { boilSeed('st' + i); paint(starPts(hash(i) * W, hash(i + 70) * 420, 3 + 4 * hash(i + 3), .35, 4), { wash: PAL.cream, washOp: 120 + 100 * hash(i + 5), ink: null }); }
    glow(1580, 160, 200, N.moonGlow, .35);
    boilSeed('nmoon'); paint(ellPts(1580, 160, 60, 60, 24), { wash: N.moon, ink: PAL.ink, sw: .6 });
    boilSeed('nground'); paint(rectPts(-200, 860, W + 400, 400), { wash: '#24232E', ink: null });
    palm(120, 900, 520, .06 * Math.sin(t * 1.5), 'n1', NIGHT_PALM);
    palm(1720, 900, 470, .06 * Math.sin(t * 1.5 + 1), 'n2', NIGHT_PALM);
    boilSeed('house');
    paint(rectPts(480, 570, 960, 300), { wash: '#3A3348', ink: PAL.ink, sw: 1.2 });
    paint([[380, 600], [1540, 600], [1290, 380], [630, 380]], { wash: N.roof, ink: PAL.ink, sw: 1.3 });
    paint([[820, 400], [1100, 400], [960, 290]], { wash: N.roof, ink: PAL.ink, sw: 1.2 });
    for (const px of [540, 760, 1160, 1380]) paint(rectPts(px, 600, 26, 270), { wash: N.woodDk, ink: PAL.ink, sw: .8 });
    paint(rectPts(880, 660, 160, 210), { wash: '#15121C', ink: PAL.ink, sw: 1 });
    glow(1260, 700, 260, N.lamp, .45 + .05 * Math.sin(t * 7));
    boilSeed('lit'); paint(rectPts(1200, 650, 120, 110), { wash: '#E8A65A', ink: PAL.ink, sw: 1 });
    paint(ellPts(1262, 725, 26, 30, 14), { wash: '#2A2030', ink: null }); paint(ellPts(1262, 770, 44, 26, 14), { wash: '#2A2030', ink: null });
    for (let i = 1; i < 3; i++) paint(rectPts(1200 + i * 40 - 4, 650, 8, 110), { wash: N.woodDk, ink: null });
    camEnd();
    fadeIn(lt);
  }
  // 3. 2:00 on the clock, then the phone rings
  function s3(t, lt, dur) {
    const [a, b] = L(2), tick = a + .35, pan = a + 1.0;
    const [cx, cy, z] = kf(lt, [[0, [1500, 300, 2.6]], [pan, [1500, 300, 2.7]], [pan + .7, [1150, 560, 1.5]], [dur, [1130, 580, 1.6]]], ease);
    camBegin(cx, cy, z);
    const m = lt < tick ? 59 : 0, h = lt < tick ? 1 : 2;
    hall(t, { clock: [h, m] });
    phone(1100, 700, 1, { ring: lt > pan + .2 ? 1 : 0 });
    camEnd();
    fadeIn(lt, .3);
  }
  // 4. The torch follows the wire to its cut end
  function s4(t, lt, dur) {
    const [a] = L(3);
    const sx = kf(lt, [[0, 560], [a + .3, 640], [a + 1.6, 1500], [dur, 1520]], ease);
    camBegin(lerp(760, 1200, seg(lt, a, a + 1.8)), 720, 1.12);
    boilSeed('floor4');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: N.floor, ink: null });
    paint(rectPts(-300, 300, W + 600, 380), { wash: '#1E1712', ink: null });
    table(420, 560, 380);
    phone(420, 560, .8, { cord: false });
    boilSeed('wire');
    const wire = [[320, 580], [300, 700], [330, 850], [600, 905], [1000, 890], [1350, 905], [1500, 898]];
    inkLine(wire, 3.4, '#8C8496', 'ink', .5);
    for (let i = 0; i < 6; i++) inkLine([[1500, 898], [1530 + 8 * i, 870 + 9 * i]], 1.4, '#E08A40', 'ink', .3);
    glow(sx, 890, 260, '#FFF0C8', .9);
    boilSeed('beam'); paint([[sx - 90, 910], [sx + 90, 910], [sx + 600, 1400], [sx - 200, 1400]], { wash: '#FFF0C8', washOp: 55, ink: null });
    camEnd();
    fadeIn(lt, .3);
  }
  // 5. He picks up: only breathing
  function s5(t, lt, dur) {
    const [a] = L(4);
    const sh = shakeXY(lt, 2);
    camBegin(960 + sh[0], 520 + sh[1], 1.0 + .03 * lt);
    hall(t, { clock: [2, 0] });
    const u = 44, x = 900, y = 1290, hc = [x + .5 * u, y - 13.9 * u];
    person(x, y, u, { ...HERO, eyes: 'wide', mouth: lt > a + 1.2 ? 'o' : 'flat', brow: 'worry', armB: 2.9, bendB: .4, armF: .2, emote: 'sweat', emoteK: seg(lt, a + 1.0, a + 1.3) });
    receiver(hc[0] - 1.0 * u, hc[1] + .4 * u, .9, 1.35);
    boilSeed('hand5'); paint(ellPts(hc[0] - 1.3 * u, hc[1] + .9 * u, .8 * u, .7 * u, 12), { wash: mixCol(C.skin, PAL.ink, .2), ink: PAL.ink, sw: .8 });
    camEnd();
    fadeIn(lt, .3);
  }
  // 6. "Don't open the door." Extreme close-up, pupils shrink
  function s6(t, lt, dur) {
    const [a, b] = L(5), k = seg(lt, a + .9, a + 1.5);
    camBegin(960, 560, 1.0 + .12 * lt);
    boilSeed('bg6'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: N.wall, ink: null });
    glow(1500, 300, 600, N.moonGlow, .18);
    face(980, 500, 300, { eyes: 'wide', pupil: lerp(.45, .2, k), brow: 'up', mouth: k > .5 ? 'O' : 'flat', sweat: true, key: 'h6' });
    receiver(660, 560, 1.5, 1.4);
    camEnd();
    fadeIn(lt, .25);
  }
  // 7. The voice is his own: the reflection smiles
  function s7(t, lt, dur) {
    const [a] = L(6), smile = lt > a + 1.2;
    camBegin(1000, 560, 1.0 + .03 * lt);
    boilSeed('bg7'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: N.wall, ink: null });
    paint(rectPts(-300, 960, W + 600, 400), { wash: N.floor, ink: null });
    boilSeed('mirror');
    paint(rrPts(520, 150, 380, 830, 30), { wash: N.wood, ink: PAL.ink, sw: 1.4 });
    paint(rrPts(550, 180, 320, 770, 20), { wash: '#3A4560', ink: PAL.ink, sw: 1 });
    person(720, 940, 23, { ...HERO, key: 'refl', eyes: smile ? 'happy' : 'wide', mouth: smile ? 'smile' : 'flat', armB: .1, armF: .15, skin: mixCol(C.skin, '#3A4560', .3), shirt: mixCol(HERO.shirt, '#3A4560', .3) });
    boilSeed('mirrorShine'); inkLine([[600, 260], [680, 200]], 1.2, '#7F8CB0', 'inkfine', 0); inkLine([[600, 330], [740, 210]], 1.0, '#7F8CB0', 'inkfine', 0);
    person(1380, 1010, 28, { ...HERO, flip: true, eyes: 'wide', mouth: 'O', brow: 'worry', armF: .2, armB: .1, emote: smile ? '!' : null, emoteK: seg(lt, a + 1.3, a + 1.5), emoteAge: lt });
    camEnd();
    fadeIn(lt, .3);
  }
  // 8. Three knocks on the front door (and feet in the light under it)
  function s8(t, lt, dur) {
    const [, b] = L(7), knocks = [b + .2, b + .75, b + 1.3];
    let dx = 0; for (const k of knocks) if (lt > k) dx += 7 * Math.exp(-(lt - k) * 22) * Math.sin((lt - k) * 70);
    camBegin(960 + dx, 540, 1.05 + .04 * lt);
    boilSeed('bg8'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: N.wall, ink: null });
    paint(rectPts(-300, 960, W + 600, 400), { wash: N.floor, ink: null });
    boilSeed('door');
    paint(rectPts(600, 120, 720, 840), { wash: N.woodDk, ink: PAL.ink, sw: 1.4 });
    for (const px of [630, 970]) { paint(rectPts(px, 150, 320, 800), { wash: N.wood, ink: PAL.ink, sw: 1 }); for (let r = 0; r < 3; r++) paint(rectPts(px + 40, 190 + r * 250, 240, 200), { wash: '#4E3224', ink: PAL.ink, sw: .7 }); }
    paint(rectPts(940, 500, 60, 24), { wash: '#6E6A72', ink: PAL.ink, sw: .8 });
    boilSeed('gap'); paint(rectPts(620, 952, 680, 10), { wash: '#9FB4D9', ink: null });
    if (lt > knocks[2] + .3) { boilSeed('feet'); for (const fx of [880, 1010]) paint(rectPts(fx, 951, 70, 12), { wash: N.black, ink: null }); }
    for (const k of knocks) if (lt > k) for (let i = 0; i < 5; i++) { const d = lt - k; boilSeed('dust' + k + i); paint(ellPts(700 + 520 * hash(i + k * 10), 140 + d * 260 * (1 + hash(i)), 4, 4, 6), { wash: '#8C8090', washOp: Math.max(0, 200 * (1 - d)), ink: null }); }
    camEnd();
    fadeIn(lt, .3);
  }
  // 9. Through the window: the yard is empty
  function s9(t, lt, dur) {
    camBegin(960, 540, 1.0 + .05 * lt);
    boilSeed('ysky'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: N.sky, ink: null });
    glow(1400, 200, 250, N.moonGlow, .3);
    boilSeed('ysand'); paint(rectPts(-200, 700, W + 400, 600), { wash: N.sand, ink: null });
    palm(500, 720, 480, .08 * Math.sin(t * 1.3), 'y1', NIGHT_PALM); palm(1350, 720, 430, .08 * Math.sin(t * 1.3 + 2), 'y2', NIGHT_PALM);
    boilSeed('frame9');
    paint(rectPts(-200, -200, W + 400, 250), { wash: N.wall, ink: null }); paint(rectPts(-200, 880, W + 400, 500), { wash: N.wall, ink: null });
    paint(rectPts(-200, -200, 380, H + 400), { wash: N.wall, ink: null }); paint(rectPts(1740, -200, 400, H + 400), { wash: N.wall, ink: null });
    for (let i = 0; i < 7; i++) paint(rectPts(260 + i * 230, 50, 26, 830), { wash: N.wood, ink: PAL.ink, sw: .8 });
    paint(rectPts(180, 40, 1560, 30), { wash: N.wood, ink: PAL.ink, sw: .9 }); paint(rectPts(180, 860, 1560, 30), { wash: N.wood, ink: PAL.ink, sw: .9 });
    camEnd();
    fadeIn(lt, .3);
  }
  // 10. Footprints in the sand, leading to the door
  function s10(t, lt, dur) {
    const [a, b] = L(9);
    camBegin(lerp(700, 1350, ease(seg(lt, a, b - .4))), 640, 1.15);
    boilSeed('fsand'); paint(rectPts(-300, -300, W + 900, H + 600), { wash: N.sand, ink: null });
    glow(900, 500, 700, N.moonGlow, .3);
    boilSeed('step'); paint(rectPts(1640, 300, 600, 900), { wash: '#4A4458', ink: PAL.ink, sw: 1.2 }); paint(rectPts(1760, 200, 300, 520), { wash: '#15121C', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 10; i++) { const x = 200 + i * 150, y = 720 + (i % 2 ? 40 : -40); boilSeed('fp' + i);
      paint(ellPts(x, y, 44, 19, 12, .5), { wash: '#34324A', ink: null }); paint(ellPts(x + 50, y - (i % 2 ? 3 : -3), 15, 13, 8), { wash: '#34324A', ink: null }); }
    camEnd();
    fadeIn(lt, .3);
  }
  // 11. The receiver dangles: "He's inside now."
  function s11(t, lt, dur) {
    const fl = .5 + .5 * Math.sin(t * 23) * Math.sin(t * 7);
    camBegin(1000, 520, 1.25 + .05 * lt);
    hall(t, { clock: [2, 3] });
    phone(1100, 700, 1, { off: true, cord: false });
    const a = .5 * Math.sin(lt * 2.2), p = [920 + Math.sin(a) * 300, 700 + Math.cos(a) * 300];
    boilSeed('coil'); const C2 = []; for (let i = 0; i <= 24; i++) { const k = i / 24; C2.push([lerp(980, p[0], k) + 14 * Math.sin(k * 40), lerp(690, p[1] - 30, k)]); } inkLine(C2, 1.3, '#3A3140', 'ink', .3);
    receiver(p[0], p[1], .9, Math.PI / 2 + a);
    camEnd();
    flash(.25 * fl, N.black);
    fadeIn(lt, .3);
  }
  // 12. A chair scrapes behind him; he doesn't turn around
  function s12(t, lt, dur) {
    const [a, b] = L(11);
    camBegin(lerp(900, 1180, ease(seg(lt, a + 1.6, dur))), lerp(560, 420, ease(seg(lt, a + 1.6, dur))), lerp(1.0, 1.7, ease(seg(lt, a + 1.6, dur))));
    hall(t, { clock: [2, 4] });
    const cx = 420 + 90 * easeOut(seg(lt, a + .4, a + 1.4));
    boilSeed('cshadow'); paint([[cx - 120, 880], [cx + 60, 880], [cx + 200, 200], [cx - 40, 160]], { wash: '#1A1626', washOp: 160, ink: null });
    glow(cx, 650, 360, N.lamp, .22);
    chair(cx, 900, 1.0, 'c12');
    person(1180, 1000, 30, { ...HERO, eyes: 'wide', mouth: 'flat', brow: 'worry', armF: .1, armB: .05, emote: lt > a + 1.0 ? 'sweat' : null, emoteK: seg(lt, a + 1.0, a + 1.3) });
    camEnd();
    fadeIn(lt, .3);
  }
  // 13. Morning in the attic: the 2006 newspaper
  function newspaper(x, y, s, o = {}) {
    push(); translate(x, y); rotate(o.rot || 0); scale(s); boilSeed('paper');
    paint(rectPts(-300, -380, 600, 760), { wash: N.paper, ink: PAL.ink, sw: 1 });
    paint(rectPts(-260, -340, 520, 50), { wash: '#3B2E25', ink: null });
    for (let i = 0; i < 3; i++) paint(rectPts(-260, -260 + i * 46, 520 - i * 120, 28), { wash: '#4E4034', ink: null });
    paint(rectPts(-260, -100, 230, 280), { wash: '#C9B48F', ink: PAL.ink, sw: .8 });
    face(-145, 20, 80, { skin: N.sepia, hair: '#3B2E25', shirt: '#8C7558', eyes: 'dot', mouth: 'flat', ink: '#3B2E25', sw: .9, key: 'paperboy' });
    for (let i = 0; i < 10; i++) inkLine([[0, -90 + i * 32], [250, -90 + i * 32]], .8, '#8C7B66', 'inkfine', 0);
    for (let i = 0; i < 4; i++) inkLine([[-260, 210 + i * 32], [250, 210 + i * 32]], .8, '#8C7B66', 'inkfine', 0);
    pop();
    letter('2006', x + 190 * s, y - 315 * s, 40 * s, '#F3EBDC');
  }
  function s13(t, lt, dur) {
    const [a] = L(12), zoomAt = a + 2.6;
    const [cx, cy, z] = kf(lt, [[0, [960, 540, 1.0]], [zoomAt, [1020, 560, 1.1]], [zoomAt + 1.2, [1180, 520, 1.9]], [dur, [1180, 520, 2.0]]], ease);
    camBegin(cx, cy, z);
    boilSeed('attic');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#5A4232', ink: null });
    for (let i = 0; i < 6; i++) paint(ribbon([[-200 + i * 420, -100], [200 + i * 420, 700]], 40, 40), { wash: '#3B2619', ink: PAL.ink, sw: .8 });
    paint(rectPts(-300, 860, W + 600, 400), { wash: '#4A3326', ink: null });
    glow(1500, 120, 500, '#FFD28A', .55);
    boilSeed('beams'); paint([[1380, 0], [1560, 0], [1100, 1100], [700, 1100]], { wash: '#FFE6B0', washOp: 40, ink: null });
    for (let i = 0; i < 16; i++) { boilSeed('am' + i); const px = 800 + 600 * hash(i), py = 200 + 700 * hash(i + 4) - 30 * Math.sin(t * .5 + i); paint(ellPts(px, py, 3, 3, 6), { wash: '#FFF0C8', washOp: 170, ink: null }); }
    boilSeed('trunk'); paint(rrPts(380, 700, 420, 220, 18), { wash: '#6E4A30', ink: PAL.ink, sw: 1.2 }); paint(rectPts(380, 760, 420, 20), { wash: '#B08A50', ink: null });
    person(820, 1000, 26, { ...HERO, shirt: '#7FA6D8', eyes: lt > zoomAt + 1.5 ? 'wide' : 'dot', mouth: 'flat', armF: 1.5, bendF: -.3, armB: 1.3, bendB: -.2 });
    newspaper(1180, 520, .55, { rot: -.06 });
    camEnd();
    if (lt < .6) flash(1 - easeOut(lt / .6), '#FFF6E0');
  }
  // 14. The boy in the photo has his face (smash cut on "my face")
  function s14(t, lt, dur) {
    const [a, b] = L(13), cut = b - .55;
    if (lt < cut) {
      camBegin(960, 560, 1.0 + .25 * lt);
      boilSeed('p14'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: N.paper, ink: null });
      for (let i = 0; i < 18; i++) inkLine([[1250, 80 + i * 55], [1900, 80 + i * 55]], 1, '#8C7B66', 'inkfine', 0);
      paint(rectPts(560, 100, 700, 880), { wash: '#C9B48F', ink: '#3B2E25', sw: 1.2 });
      face(900, 520, 240, { skin: N.sepia, hair: '#3B2E25', shirt: '#8C7558', eyes: 'dot', mouth: 'flat', ink: '#3B2E25', key: 'photo' });
      camEnd();
    } else {
      camBegin(960, 540, 1.05 + .05 * (lt - cut));
      boilSeed('b14'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: N.wall, ink: null });
      glow(1300, 300, 600, N.moonGlow, .2);
      face(900, 520, 300, { eyes: 'wide', pupil: .22, brow: 'up', mouth: 'O', sweat: true, key: 'h14' });
      camEnd();
      flash(Math.max(0, 1 - (lt - cut) * 8), '#F6F0E6');
    }
    fadeIn(lt, .3);
  }
  // 15. Tonight it will ring again. Would you pick up?
  function s15(t, lt, dur) {
    const [a, b] = L(14), tick = b + .2, ring = b + .5, black = dur - 1.0;
    camBegin(lerp(1250, 1110, ease(seg(lt, 0, b))), lerp(450, 600, ease(seg(lt, 0, b))), lerp(1.3, 1.9, ease(seg(lt, 0, b))));
    hall(t, { clock: lt < tick ? [1, 59] : [2, 0] });
    phone(1100, 700, 1, { ring: lt > ring && lt < ring + 1.0 ? 1 : 0 });
    camEnd();
    flash(.35, N.black);
    fadeIn(lt, .3);
    if (lt > black) flash(1, N.black);
  }

  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], f]));
})();
