// boat.js: "The Last Boat" (Pathira Chindhakal reel #3, mystery thriller). One shot per narration line.
// Timing comes from boat_times.js (edits/last-boat/timeline.py).
(() => {
  const N = {
    sky: '#16203F', fog: '#B8C2D8', water: '#132C44', waterLt: '#2F5878', plank: '#4A3628', plankDk: '#2E2018',
    lamp: '#FFC27A', moonGlow: '#9FB4D9', boat: '#3E2A20', boatLt: '#5A3E2C', roof: '#2A1E18', ghost: '#7B8398', ghostDk: '#4E566C',
    black: '#0B0D18', paper: '#D9C48E', morning: '#E9B98A', morningSky: '#F2D6B0', stone: '#8E8A86'
  };
  const HERO = { key: 'hero', skin: C.skin, shirt: '#4E6A8F', lower: 'mundu', lowerCol: '#D8D2C2', hairStyle: 'short', kasavu: false };
  const GHOST = (k, o = {}) => ({ key: 'g' + k, skin: N.ghost, shirt: N.ghostDk, lower: k % 3 ? 'mundu' : 'saree', lowerCol: '#6A7084', hairStyle: k % 3 ? 'short' : 'bun', hair: '#1C2030', eyes: 'dot', mouth: 'flat', kasavu: false, ...o });
  const L = (i) => [PT.starts[i] - PT.shots[i], PT.ends[i] - PT.shots[i]];
  const fadeIn = (lt, d = .5, col = N.black) => { if (lt < d) flash(1 - easeOut(lt / d), col); };

  // ---------- set pieces ----------
  function nightSky(key = 'bsky') {
    boilSeed(key);
    paint(rectPts(-400, -400, W + 800, 1100), { wash: N.sky, ink: null });
    for (let i = 0; i < 40; i++) { boilSeed(key + 's' + i); paint(starPts(hash(i) * W, hash(i + 40) * 380, 3 + 3 * hash(i + 2), .35, 4), { wash: PAL.cream, washOp: 90 + 80 * hash(i + 6), ink: null }); }
  }
  function water(y0, t, key = 'water', col = N.water) {
    boilSeed(key);
    paint(rectPts(-400, y0, W + 800, 1000), { wash: col, ink: null });
    for (let i = 0; i < 16; i++) { boilSeed(key + 'r' + i); const y = y0 + 30 + 420 * hash(i + 3), x = ((i * 240 - t * 25) % (W + 400) + W + 400) % (W + 400) - 200; inkLine([[x, y], [x + 90 + 40 * hash(i), y]], .8, N.waterLt, 'inkfine', 0); }
  }
  function fog(t, y, k = 1, key = 'fog') {
    for (let i = 0; i < 5; i++) { boilSeed(key + i); const x = ((i * 520 + t * (20 + 8 * i)) % (W + 1200)) - 600; paint(ellPts(x, y + (i % 3) * 50, 520, 70, 22, 4), { wash: N.fog, washOp: 45 * k, ink: null }); }
  }
  function jetty(t, o = {}) {           // deck on the left, lamp post, bench, timetable board
    boilSeed('deck');
    for (let i = 0; i < 4; i++) paint(rectPts(80 + i * 190, 620, 26, 300), { wash: N.plankDk, ink: PAL.ink, sw: .7 });
    paint(rectPts(-300, 590, 1100, 40), { wash: N.plank, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 9; i++) inkLine([[-280 + i * 125, 592], [-280 + i * 125, 628]], .6, N.plankDk, 'inkfine', 0);
    boilSeed('lampPost');
    paint(rectPts(292, 220, 16, 372), { wash: '#3A3640', ink: PAL.ink, sw: .8 });
    paint(rectPts(270, 200, 60, 30), { wash: '#3A3640', ink: PAL.ink, sw: .8 });
    const fl = o.flicker ? .7 + .3 * Math.sin(t * 31) * Math.sin(t * 7) : 1;
    glow(300, 240, 300, N.lamp, .55 * fl);
    paint(ellPts(300, 238, 18, 14, 10), { wash: '#FFE6B0', ink: null });
    if (o.board !== false) { boilSeed('board'); paint(rectPts(520, 300, 200, 140), { wash: '#2E3A2E', ink: PAL.ink, sw: 1 }); paint(rectPts(610, 440, 12, 150), { wash: N.plankDk, ink: null }); letter('11:00', 620, 370, 46, '#E8E0C8'); }
    if (o.bench !== false) { boilSeed('bench'); paint(rectPts(360, 520, 200, 18), { wash: N.plank, ink: PAL.ink, sw: .8 }); for (const lx of [370, 530]) paint(rectPts(lx, 538, 12, 52), { wash: N.plankDk, ink: null }); }
  }
  // the ghost boat, (x, y) = middle of the hull at the waterline, faces right. o: n passengers, empty (index), lantern
  function boat(x, y, s, o = {}, t = T) {
    push(); translate(x, y); scale(s);
    boilSeed('hull');
    paint(through([[-460, -60], [-330, 40], [320, 40], [470, -80], [400, -30], [-400, -20]], 4), { wash: N.boat, ink: PAL.ink, sw: 1.2 });
    paint(through([[-430, -50], [0, -38], [440, -66]], 4).concat([[440, -56], [-430, -40]]), { wash: N.boatLt, ink: null });
    for (const px of [-300, 0, 300]) paint(rectPts(px - 6, -250, 12, 210), { wash: N.roof, ink: null });
    paint(through([[-340, -230], [0, -275], [340, -230], [330, -210], [0, -252], [-330, -210]], 4), { wash: N.roof, ink: PAL.ink, sw: 1 });
    const n = o.n ?? 11;
    for (let i = 0; i < n + (o.empty != null ? 1 : 0); i++) {
      if (i === o.empty) continue;
      const hx = -270 + i * (540 / (n)), hy = -92 + 4 * hash(i);
      boilSeed('pax' + i);
      paint(ellPts(hx - 3, hy - 8, 19, 15, 12, .5), { wash: '#1C2030', ink: null });
      paint(ellPts(hx, hy, 16, 18, 12, .5), { wash: N.ghost, ink: PAL.ink, sw: .5 });
      paint(rectPts(hx - 18, hy + 16, 36, 30), { wash: N.ghostDk, ink: null });
    }
    if (o.boatman !== false) { boilSeed('bman'); paint(rectPts(-405, -230, 30, 190), { wash: N.ghostDk, ink: PAL.ink, sw: .6 }); paint(ellPts(-390, -250, 26, 30, 12), { wash: '#C9C2B0', ink: PAL.ink, sw: .6 }); inkLine([[-360, -300], [-470, 80]], 1.6, '#5A4636', 'ink', 0); }
    if (o.lantern !== false) { boilSeed('lant'); inkLine([[420, -240], [430, -190]], .8, PAL.ink, 'inkfine', 0); paint(rrPts(414, -192, 34, 44, 6), { wash: '#FFD9A0', ink: PAL.ink, sw: .7 }); }
    pop();
    if (o.lantern !== false) glow(x + 431 * s, y - 170 * s, 220 * s + 60, N.lamp, .6);
  }
  function drips(x0, y0, w, t, n = 6, key = 'drip') {
    for (let i = 0; i < n; i++) { boilSeed(key + i); const k = frac(t * (.8 + .4 * hash(i)) + hash(i + 3)), x = x0 + w * hash(i + 7), y = y0 + k * 120;
      paint([[x, y - 9], [x + 5, y + 3], [x, y + 7], [x - 5, y + 3]], { wash: '#7FA6C8', washOp: 220 * (1 - k), ink: null, curv: .5 }); }
  }
  function face(cx, cy, r, o = {}) {   // big head facing right (same design as person()'s head)
    const skin = o.skin || C.skin, hair = o.hair || C.hair, ink = PAL.ink, sw = 1.1;
    boilSeed('face' + (o.key || ''));
    paint(ellPts(cx - .3 * r, cy + 1.25 * r, .55 * r, .6 * r, 14), { wash: o.shirt || '#4E6A8F', ink, sw });
    paint(ellPts(cx - .29 * r, cy - .18 * r, r, .97 * r, 24, .6), { wash: hair, ink, sw });
    paint(ellPts(cx, cy, r, 1.06 * r, 28, .5), { wash: skin, ink, sw });
    paint(ellPts(cx - .13 * r, cy - .71 * r, .97 * r, .45 * r, 22, .5, -.08), { wash: hair, ink: null });
    paint(ellPts(cx - .35 * r, cy + .1 * r, .19 * r, .29 * r, 12, .3), { wash: mixCol(skin, ink, .15), ink, sw: sw * .7 });
    for (const ex of [cx + .23 * r, cx + .71 * r]) {
      const ey = cy - .06 * r;
      if (o.eyes === 'wide') { paint(ellPts(ex, ey, .2 * r, .25 * r, 14), { wash: PAL.cream, ink, sw: sw * .8 }); paint(ellPts(ex + .04 * r, ey, .07 * r, .09 * r, 10), { wash: ink, ink: null }); }
      else paint(ellPts(ex, ey, .1 * r, .15 * r, 10), { wash: o.eyeCol || ink, ink: null });
    }
    inkLine([[cx + .94 * r, cy - .03 * r], [cx + 1.1 * r, cy + .23 * r], [cx + .9 * r, cy + .26 * r]], sw * .8, ink, 'inkfine', .5);
    const m = [cx + .55 * r, cy + .6 * r];
    if (o.mouth === 'O') paint(ellPts(m[0], m[1] + .05 * r, .13 * r, .17 * r, 12), { wash: '#3A2028', ink, sw: sw * .8 });
    else inkLine([[m[0] - .2 * r, m[1]], [m[0] + .2 * r, m[1]]], sw, ink, 'ink', 0);
  }

  // 1. The empty jetty in the fog
  function s1(t, lt, dur) {
    camBegin(800, 470, 1.0 + .04 * lt);
    nightSky(); water(630, t); jetty(t, { flicker: true }); fog(t, 560, 1);
    camEnd();
    if (lt < 1.2) flash(1 - easeOut(lt / 1.2), N.black);
  }
  // 2. The last boat left at 11; he is alone on the bench
  function s2(t, lt, dur) {
    camBegin(560, 430, 1.55 + .03 * lt);
    nightSky(); water(630, t); jetty(t);
    person(450, 590, 13, { ...HERO, sit: true, eyes: lt > L(1)[0] + 1.8 ? 'half' : 'dot', mouth: 'flat', armF: .5, armB: .4 });
    fog(t, 560, .7);
    camEnd(); fadeIn(lt, .4);
  }
  // 3. A lantern comes out of the fog
  function s3(t, lt, dur) {
    const [a] = L(2), k = easeIn(seg(lt, a + 1.0, dur));
    camBegin(1150, 470, 1.1);
    nightSky(); water(630, t);
    const lx = lerp(1500, 1300, k), ly = lerp(560, 520, k);
    glow(lx, ly, lerp(40, 160, k), N.lamp, lerp(.2, .8, k) * seg(lt, a + .8, a + 1.3));
    boilSeed('farLant'); if (lt > a + 1.0) paint(rrPts(lx - 6 - 6 * k, ly - 8 - 6 * k, 12 + 12 * k, 16 + 14 * k, 3), { wash: '#FFD9A0', ink: null });
    fog(t, 500, 1.3, 'fog3');
    camEnd(); fadeIn(lt, .4);
  }
  // 4. An old wooden boat glides in. No sound.
  function s4(t, lt, dur) {
    const bx = kf(lt, [[0, 2300], [dur - .3, 1250]], easeOut);
    camBegin(960, 470, 1.0);
    nightSky(); water(630, t); jetty(t, { board: false, bench: false });
    boat(bx, 640, .75, { n: 11, empty: 7 });
    fog(t, 560, .8);
    camEnd(); fadeIn(lt, .4);
  }
  // 5. The boatman, face hidden: "Get in."
  function s5(t, lt, dur) {
    const [a, b] = L(4), gest = seg(lt, b - .7, b - .3);
    camBegin(960, 520, 1.0 + .03 * lt);
    nightSky(); water(700, t);
    glow(1500, 300, 300, N.lamp, .5);
    boilSeed('stern'); paint(through([[600, 700], [1800, 690], [1900, 640], [560, 650]], 4), { wash: N.boat, ink: PAL.ink, sw: 1.2 });
    person(1100, 700, 30, { key: 'bman', flip: true, skin: '#6E6878', shirt: N.ghostDk, lower: 'mundu', lowerCol: '#5A6074', hairStyle: 'bald', hair: '#2A2430', eyes: 'closed', mouth: 'flat', armF: lerp(.2, 1.5, gest), bendF: -.2, armB: .1, kasavu: false, rot: .08 });
    boilSeed('towel'); paint(ellPts(1100 - 15, 700 - 30 * 14.1, 120, 120, 22, 1.5), { wash: '#C9C2B0', ink: PAL.ink, sw: .9 });
    paint(ellPts(1100 - 30, 700 - 30 * 13.5, 80, 92, 18, 1), { wash: '#141018', ink: null });
    boilSeed('deck5'); paint(rectPts(-300, 755, 900, 40), { wash: N.plank, ink: PAL.ink, sw: 1 }); for (const px of [60, 360]) paint(rectPts(px, 795, 26, 300), { wash: N.plankDk, ink: PAL.ink, sw: .7 });
    person(420, 758, 26, { ...HERO, eyes: 'wide', mouth: 'flat', brow: 'worry', armF: .1, armB: .05 });
    fog(t, 640, .8);
    camEnd(); fadeIn(lt, .4);
  }
  // 6. Eleven passengers, all soaking wet (pan along the row)
  function s6(t, lt, dur) {
    camBegin(lerp(500, 1500, ease(seg(lt, 0, dur))), 560, 1.25);
    boilSeed('in6'); paint(rectPts(-400, -400, W + 1200, H + 800), { wash: '#1A1E30', ink: null });
    glow(1900, 300, 500, N.lamp, .35);
    paint(rectPts(-400, 760, W + 1200, 300), { wash: N.boat, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 11; i++) { const x = -100 + i * 220; person(x, 760, 15, GHOST(i, { sit: true, armF: .6, armB: .5, rot: .02 * Math.sin(t + i) })); drips(x - 20, 760 - 15 * 16, 60, t + i, 3, 'd6' + i); }
    camEnd(); fadeIn(lt, .4);
  }
  // 7. No one speaks. No one looks at him.
  function s7(t, lt, dur) {
    camBegin(lerp(760, 1060, ease(seg(lt, 0, dur))), 520, 1.0);
    boilSeed('in7'); paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#1A1E30', ink: null });
    glow(1700, 250, 500, N.lamp, .3);
    for (let i = 0; i < 3; i++) face(250 + i * 520, 520 + 20 * (i % 2), 170, { skin: N.ghost, hair: '#1C2030', shirt: N.ghostDk, eyes: 'dot', key: 'g7' + i });
    drips(200, 300, 1300, t, 8, 'd7');
    camEnd(); fadeIn(lt, .4);
  }
  // 8. The ticket: 1996
  function s8(t, lt, dur) {
    const [a] = L(7), k = easeOut(seg(lt, 0, 1.0));
    camBegin(960, 540, 1.0 + .05 * lt);
    boilSeed('bg8'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#1A1E30', ink: null });
    glow(1400, 300, 500, N.lamp, .4);
    push(); translate(lerp(1500, 960, k), 540); rotate(-.08);
    boilSeed('ticket'); paint(rectPts(-330, -200, 660, 400), { wash: N.paper, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(-330, -200, 660, 60), { wash: '#A8823E', ink: null });
    for (let i = 0; i < 4; i++) inkLine([[-280, 40 + i * 36], [180 - i * 60, 40 + i * 36]], .9, '#7A6440', 'inkfine', 0);
    for (let i = 0; i < 8; i++) paint(ellPts(330, -175 + i * 50, 14, 14, 8), { wash: '#1A1E30', ink: null });
    pop();
    boilSeed('hand8'); paint(ribbon([[2100, 760], [lerp(1800, 1300, k), 640]], 90, 70), { wash: N.ghost, ink: PAL.ink, sw: 1 });
    letter('1996', lerp(1500, 960, k) - 40, 480, 120, '#5A3A1E', { alpha: seg(lt, a + 1.2, a + 1.6) });
    camEnd(); fadeIn(lt, .3);
  }
  // 9. The child turns: "Why did you get on, chetta?"
  function s9(t, lt, dur) {
    const [a, b] = L(8), turned = lt > a + 1.5;
    camBegin(900, 560, 1.15 + .06 * lt);
    boilSeed('in9'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#1A1E30', ink: null });
    glow(1600, 260, 450, N.lamp, .35);
    paint(rectPts(-300, 800, W + 600, 300), { wash: N.boat, ink: PAL.ink, sw: 1 });
    person(640, 800, 26, { ...HERO, sit: true, eyes: turned ? 'wide' : 'dot', mouth: 'flat', brow: turned ? 'worry' : null, armF: .5, armB: .4 });
    person(1280, 800, 15, { key: 'girl', flip: turned, sit: true, skin: N.ghost, shirt: '#8C6A80', lower: 'saree', lowerCol: '#8C6A80', hairStyle: 'bun', hair: '#1C2030', eyes: turned ? 'wide' : 'dot', mouth: lt > a + 2.0 ? 'o' : 'flat', armF: .4, armB: .3 });
    drips(1230, 560, 80, t, 4, 'd9');
    camEnd(); fadeIn(lt, .3);
  }
  // 10. The lantern has a reflection; the boat doesn't
  function s10(t, lt, dur) {
    const [a] = L(9), tilt = ease(seg(lt, a + 1.2, a + 2.4));
    camBegin(960, lerp(470, 640, tilt), 1.0);
    nightSky(); water(640, t);
    boat(960, 640, .8, { n: 11, empty: 7 });
    const lx = 960 + 431 * .8, ly = 640 - 170 * .8, ry = 640 + (640 - ly);
    glow(lx, ry, 120, N.lamp, .45 + .1 * Math.sin(t * 3));
    for (let i = 0; i < 5; i++) { boilSeed('refl' + i); inkLine([[lx - 30 + 6 * Math.sin(t * 2 + i), ry - 20 + i * 18], [lx + 30 + 6 * Math.sin(t * 2 + i), ry - 20 + i * 18]], 1.4, '#FFC27A', 'ink', 0); }
    fog(t, 560, .6);
    camEnd(); fadeIn(lt, .3);
  }
  // 11. He jumps: splash, cold water, darkness
  function s11(t, lt, dur) {
    const [a] = L(10), jump = a + .2, under = a + .9;
    if (lt < under) {
      camBegin(960, 500, 1.0);
      nightSky(); water(640, t); boat(1300, 640, .8, { n: 11, empty: 7 });
      const k = seg(lt, jump, under), p = arcPt([1000, 560], [760, 700], 160, k);
      person(p[0], p[1], 18, { ...HERO, flip: true, rot: -1.2 * k, eyes: 'wide', mouth: 'O', armF: 2.6, armB: 2.4 });
      if (lt > under - .15) { boilSeed('splash'); for (let i = 0; i < 7; i++) paint(ellPts(720 + (i - 3) * 30, 630 - 60 * hash(i), 14, 30, 10), { wash: '#A8C4DC', ink: PAL.ink, sw: .5 }); }
      camEnd();
    } else {
      camBegin(960, 540, 1.0);
      boilSeed('under'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#0F2236', ink: null });
      glow(960, -100, 600, N.moonGlow, .25 * (1 - seg(lt, under, dur)));
      person(960, 780 + 120 * (lt - under), 26, { ...HERO, rot: .3, eyes: 'closed', mouth: 'flat', armF: 2.3, armB: 2.1, hairFly: 1 });
      for (let i = 0; i < 12; i++) { boilSeed('bub' + i); const k2 = frac((lt - under) * .7 + hash(i)), x = 860 + 220 * hash(i + 3) + 20 * Math.sin(lt * 4 + i); paint(ellPts(x, 900 - k2 * 900, 8 + 8 * hash(i), 8 + 8 * hash(i), 10), { wash: '#6E9CC0', washOp: 200, ink: PAL.ink, sw: .4 }); }
      camEnd();
      flash(easeIn(seg(lt, under + .6, dur - .1)), N.black);
    }
    if (lt < .3) flash(1 - lt / .3, N.black);
  }
  // 12. Morning on the jetty
  function s12(t, lt, dur) {
    camBegin(620, 480, 1.4 + .03 * lt);
    boilSeed('msky'); paint(rectPts(-400, -400, W + 800, 1100), { wash: N.morningSky, ink: null });
    glow(1500, 520, 500, '#FFD28A', .6);
    water(630, t, 'mwater', '#5E87A0');
    fog(t, 560, .5, 'mfog');
    jetty(t, { board: false });
    person(420, 600, 14, { ...HERO, sit: true, eyes: lt > L(11)[0] + .6 ? 'wide' : 'closed', mouth: 'flat', armF: .3, armB: .2, hairFly: .2 });
    drips(380, 420, 90, t, 4, 'd12');
    for (let i = 0; i < 3; i++) crow(1100 + i * 240 + 40 * lt, 200 + 40 * i, .6, t * 10 + i, false, 'mb' + i);
    camEnd();
    if (lt < .8) flash(1 - easeOut(lt / .8), '#FFF6E0');
  }
  // 13. The plaque: 1996 boat tragedy, twelve lives
  function s13(t, lt, dur) {
    const [a] = L(12);
    camBegin(960, 520, 1.0 + .05 * lt);
    boilSeed('wall13'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#B7A68E', ink: null });
    for (let i = 0; i < 6; i++) inkLine([[-200, 120 + i * 170], [2200, 120 + i * 170]], .7, '#9A8A74', 'inkfine', 0);
    glow(1500, 200, 600, '#FFD28A', .4);
    boilSeed('plaque'); paint(rectPts(560, 180, 800, 600), { wash: N.stone, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(590, 210, 740, 540), { wash: '#9C9894', ink: null });
    for (let i = 0; i < 6; i++) inkLine([[660, 470 + i * 44], [1260 - (i % 2) * 120, 470 + i * 44]], 1.1, '#5E5A56', 'inkfine', 0);
    boilSeed('flowers'); for (let i = 0; i < 9; i++) paint(ellPts(700 + i * 60, 800 + 10 * hash(i), 16, 14, 10), { wash: i % 2 ? '#F2C14E' : '#E8E0C8', ink: PAL.ink, sw: .5 });
    letter('1996', 960, 300, 110, '#3A3632');
    for (let i = 0; i < 12; i++) if (lt > a + 4.0 + i * .08) { boilSeed('tally' + i); inkLine([[660 + i * 50, 385], [660 + i * 50, 435]], 1.6, '#3A3632', 'ink', 0); inkLine([[648 + i * 50, 400], [672 + i * 50, 400]], 1.4, '#3A3632', 'ink', 0); }
    camEnd();
    fadeIn(lt, .4, '#FFF6E0');
  }
  // 14. Flashback: he counted eleven; one seat is empty
  function s14(t, lt, dur) {
    camBegin(lerp(300, 1500, ease(seg(lt, 0, dur - .3))), 560, 1.3);
    boilSeed('in14'); paint(rectPts(-400, -400, W + 1200, H + 800), { wash: '#141828', ink: null });
    paint(rectPts(-400, 760, W + 1200, 300), { wash: N.boat, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 12; i++) {
      const x = -100 + i * 200;
      if (i === 8) { boilSeed('emptySeat'); paint(rectPts(x - 50, 680, 100, 80), { wash: N.boatLt, ink: PAL.ink, sw: .8 }); glow(x, 600, 140, N.moonGlow, .35 * seg(lt, 1.2, 2.2)); continue; }
      person(x, 760, 15, GHOST(i, { sit: true, armF: .6, armB: .5 }));
    }
    camEnd();
    flash(.25, '#2A3A6A');
    fadeIn(lt, .3);
  }
  // 15. The empty seat is still waiting
  function s15(t, lt, dur) {
    const black = dur - 1.2;
    camBegin(960, 560, 1.0 + .08 * lt);
    boilSeed('bg15'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#141828', ink: null });
    glow(960, 200, 600, N.moonGlow, .3);
    paint(rectPts(-300, 760, W + 600, 400), { wash: N.boat, ink: PAL.ink, sw: 1 });
    for (const x of [360, 1560]) person(x, 760, 22, GHOST(x, { sit: true, armF: .6, armB: .5, flip: x > 900 }));
    boilSeed('seat15'); paint(rectPts(780, 600, 360, 160), { wash: N.boatLt, ink: PAL.ink, sw: 1.2 }); paint(rectPts(760, 590, 400, 24), { wash: N.boat, ink: PAL.ink, sw: 1 });
    drips(820, 360, 280, t, 6, 'd15');
    boilSeed('puddle'); paint(ellPts(960, 598, 120 + 10 * lt, 10, 18), { wash: '#4E7090', washOp: 200, ink: null });
    camEnd();
    fadeIn(lt, .3);
    if (lt > black) flash(easeIn(seg(lt, black, black + .6)), N.black);
  }

  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
  shots(list.map((f, i) => [PT.shots[i], f]));
})();
