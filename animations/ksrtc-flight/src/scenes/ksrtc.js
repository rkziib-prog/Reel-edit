// ksrtc.js: "KSRTC at plane speed" (Pathira Chinthakal reel #1). One shot per narration line (6+7 share the lift-off).
// Shot start times come from ksrtc_times.js (generated from the voice lengths by edits/ksrtc-flight/timeline.py).
(() => {
  PROJECT.duration = KT.total;
  const HERO = { key: 'hero', skin: C.skin, shirt: C.shirt, lower: 'mundu', hairStyle: 'short' };
  const DRIVER = { key: 'drv', skin: C.skin2, shirt: C.khaki, lower: 'pants', lowerCol: C.khakiDk, hairStyle: 'bald', hair: C.grey, stache: 'big', stacheCol: '#5A5560', towel: true, shoe: '#3A3140' };
  const COND = { key: 'cond', skin: C.skin3, shirt: C.khaki, lower: 'pants', lowerCol: C.khakiDk, glasses: true, bag: true, stache: 'small', shoe: '#3A3140' };
  const CHECHI = { key: 'chechi', skin: C.skin2, shirt: '#7A5BA8', lower: 'saree', lowerCol: C.saree, hairStyle: 'bun' };
  const BOY1 = { key: 'b1', skin: C.skin3, shirt: C.tee1, lower: 'pants', lowerCol: C.jeans, hairStyle: 'spiky', shoe: '#EDE6DA' };
  const BOY2 = { key: 'b2', skin: C.skin, shirt: C.tee2, lower: 'pants', lowerCol: '#3F4E6E', hairStyle: 'short', shoe: '#EDE6DA' };
  const ticket = (x, y, u) => { boilSeed('tkt'); paint(rectPts(x - .2 * u, y - 1.4 * u, 1.3 * u, 1.9 * u), { wash: PAL.cream, ink: PAL.ink, sw: .6 }); paint(rectPts(x - .2 * u, y - .9 * u, 1.3 * u, .35 * u), { wash: PAL.rose, ink: null }); };
  const phone = (x, y, u) => { boilSeed('phone'); paint(rrPts(x - .2 * u, y - 2.2 * u, 1.3 * u, 2.3 * u, .25 * u), { wash: '#2E2A36', ink: PAL.ink, sw: .7 }); };
  const peace = (x, y, u) => { boilSeed('peace'); for (const a of [-.25, .25]) paint(ribbon([[x, y], [x + Math.sin(a) * 1.5 * u, y - 1.6 * u]], .4 * u, .3 * u), { wash: C.skin, ink: PAL.ink, sw: .6 }); };
  const wipeIn = (lt, cols = [C.red, C.yellow]) => { if (lt < .35) brushWipe(.5 + lt / .7, cols); };
  const wipeOut = (lt, dur, cols = [C.red, C.yellow]) => { if (lt > dur - .35) brushWipe((lt - (dur - .35)) / .7, cols); };

  // 1. Hook: the bus tears down the road
  function hook(t, lt, dur) {
    const scroll = 300 * lt + 2600 * Math.max(0, lt - 1.1) ** 1.2;
    camBegin(960 + 10 * Math.sin(lt), 540, 1.0 + .015 * lt);
    roadScene(t, scroll);
    const bx = kf(lt, [[0, -700], [1.4, 880]], easeOut);
    if (lt > .9) speedLines(lt, 6, ROAD - 420, ROAD - 60, 3600);
    bus(bx, ROAD + 40 + Math.sin(lt * 28) * 3, .9, { spin: -lt * 30, driver: true });
    if (lt > .4) dust(bx - 420, ROAD + 35, frac(lt * 2.2), 'hd');
    emote('?', bx + 330, ROAD - 470, 70, seg(lt, 2.4, 2.75), lt);
    camEnd();
    wipeIn(lt);
    wipeOut(lt, dur);
  }

  // 2. 7 a.m.: the clock, then the hero sprints and jumps onto the moving bus
  function busStop(t, lt, dur) {
    const busX = 1060 + 75 * lt, busY = ROAD + 40;
    const [cx, cy, z] = kf(lt, [[0, [330, 470, 2.3]], [1.0, [330, 470, 2.35]], [2.0, [900, 560, 1.25]], [dur, [960, 570, 1.3]]], ease);
    camBegin(cx, cy, z);
    roadScene(t, 0);
    boilSeed('shelter');
    for (const px of [180, 560]) paint(rectPts(px, 420, 22, ROAD + 30 - 420), { wash: '#8C8A92', ink: PAL.ink, sw: .8 });
    paint(rrPts(130, 380, 520, 60, 10), { wash: C.red, ink: PAL.ink, sw: 1.1 });
    paint(rectPts(210, ROAD - 30, 360, 26), { wash: C.wallDk, ink: PAL.ink, sw: .8 });
    clockFace(330, 470, 55, 7, 0, 'stopclock');
    bus(busX, busY + Math.sin(lt * 20) * 2, .8, { spin: -lt * 6, driver: true });
    const door = (tt) => busDoor(1060 + 75 * tt, busY, .8);
    const u = 12.5;
    if (lt > .9) {
      const runEnd = 3.4, jumpEnd = 3.95;
      if (lt < runEnd) {
        const x = lerp(-120, door(runEnd)[0] - 170, seg(lt, .9, runEnd));
        person(x, ROAD + 75, u, { ...HERO, walk: lt * 15, rot: .12, eyes: 'wide', mouth: 'open', brow: 'worry', armF: .9 + .7 * Math.sin(lt * 15), armB: -.6 - .5 * Math.sin(lt * 15), bendB: .9, handB: (x, y, u) => fileProp(x, y, u, .3), emote: 'sweat', emoteK: 1 });
      } else if (lt < jumpEnd) {
        const k = seg(lt, runEnd, jumpEnd), p = arcPt([door(runEnd)[0] - 170, ROAD + 75], door(jumpEnd), 110, easeOut(k));
        person(p[0], p[1], u, { ...HERO, eyes: 'wide', mouth: 'O', armF: 2.4, armB: -1.2, handB: (x, y, u) => fileProp(x, y, u, .3), feet: (u) => [[1.4 * u, -.6 * u], [-1.6 * u, -1.0 * u]] });
      } else {
        const d = door(lt), k = seg(lt, jumpEnd, jumpEnd + .3);
        person(d[0] + 12, d[1], u, { ...HERO, eyes: 'happy', mouth: 'grin', armF: 2.9, bendF: -.3, armB: 1.4 + .2 * Math.sin(lt * 6), bendB: .3, handB: (x, y, u) => fileProp(x, y, u, -.2), dy: -.6 * Math.exp(-k * 4) * Math.sin(k * 12) });
      }
    }
    camEnd();
    wipeIn(lt, [C.yellow, C.red]);
  }

  // 3. Kuttan chettan: calm face, then the pan down to a brake pedal covered in cobwebs
  function driver(t, lt, dur) {
    const [cx, cy, z] = kf(lt, [[0, [760, 470, 1.35]], [2.2, [770, 470, 1.4]], [3.2, [990, 840, 2.0]], [dur, [995, 845, 2.1]]], ease);
    camBegin(cx, cy, z);
    boilSeed('cab');
    paint(rectPts(-200, -200, 2400, 1500), { wash: C.wall, ink: null });
    boilSeed('ws');
    paint(rectPts(1150, 80, 760, 520), { wash: C.sky, ink: null });
    paint([[1150, 430], [1910, 430], [1910, 600], [1150, 600]], { wash: C.paddy, ink: null });
    for (let i = 0; i < 5; i++) { const y0 = 432 + i * 34, w = 160 + i * 150; paint(rectPts(1510 - w / 2, y0, w, 34), { wash: C.road, ink: null }); }
    for (let i = 0; i < 4; i++) { const k = frac(lt * 1.6 + i / 4), r = 14 + k * 50; boilSeed('wsb' + i); const x = 1330 - k * 200; if (x > 1180) paint(ellPts(x, 440 + k * 110, r * 1.3, r, 14, 1), { wash: i % 2 ? C.palm : C.palmDk, ink: PAL.ink, sw: .5 }); const x2 = 1690 + k * 200; if (x2 < 1880) paint(ellPts(x2, 440 + k * 110, r * 1.3, r, 14, 1), { wash: i % 2 ? C.palmDk : C.palm, ink: PAL.ink, sw: .5 }); }
    boilSeed('wsframe');
    { const fr = rectPts(1150, 80, 760, 520); inkLine([...fr, fr[0]], 2, PAL.ink, 'ink', 0); }
    paint(rectPts(1080, 600, 900, 200), { wash: '#4A4450', ink: PAL.ink, sw: 1 });
    paint(rectPts(-200, 900, 2400, 400), { wash: '#6B5E58', ink: null });
    boilSeed('dseat');
    paint(rrPts(560, 330, 90, 460, 24), { wash: C.seat, ink: PAL.ink, sw: 1 });
    paint(rrPts(560, 700, 260, 60, 16), { wash: '#93503F', ink: PAL.ink, sw: 1 });
    const u = 36, x = 650, y = 900;
    boilSeed('pedals');
    paint(rrPts(x + 3.6 * u, y - 20, 3 * u, 18, 6), { wash: '#3A3140', ink: PAL.ink, sw: .8 });
    const bp = [x + 8.1 * u, y - 1.9 * u];
    paint(ribbon([[bp[0] + 30, y], [bp[0], bp[1]]], 10, 8), { wash: '#5E5560', ink: PAL.ink, sw: .7 });
    paint(rrPts(bp[0] - 40, bp[1] - 26, 80, 34, 8), { wash: '#5E5560', ink: PAL.ink, sw: .8 });
    boilSeed('web');
    const wc = [bp[0], bp[1] - 20], wr = 110, webCol = mixCol(PAL.cream, C.wall, .2);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; inkLine([wc, [wc[0] + Math.cos(a) * wr, wc[1] + Math.sin(a) * wr * .8]], .7, webCol, 'inkfine', 0); }
    for (const rk of [.35, .65, .95]) { const R = []; for (let i = 0; i <= 8; i++) { const a = i / 8 * TAU; R.push([wc[0] + Math.cos(a) * wr * rk, wc[1] + Math.sin(a) * wr * rk * .8]); } inkLine(R, .6, webCol, 'inkfine', .2); }
    const drop = 70 * easeOut(seg(lt, 3.7, 4.2)), sw = .25 * Math.sin(lt * 5) * seg(lt, 3.9, 4.3);
    const sp = [wc[0] + 30 + Math.sin(sw) * (30 + drop), wc[1] - 80 + Math.cos(sw) * (30 + drop)];
    boilSeed('spider');
    inkLine([[wc[0] + 30, wc[1] - 80], sp], .5, webCol, 'inkfine', 0);
    for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) inkLine([sp, [sp[0] + sd * 14, sp[1] - 6 + i * 5], [sp[0] + sd * 20, sp[1] + i * 6]], .5, PAL.ink, 'inkfine', .3);
    paint(ellPts(sp[0], sp[1], 9, 8, 10), { wash: PAL.ink, ink: null });
    if (lt > 4.25) emote('!', sp[0] + 20, sp[1] - 30, 22, seg(lt, 4.25, 4.45), lt);
    const bob = Math.sin(lt * 9) * .1;
    person(x, y, u, { ...DRIVER, sit: true, dy: bob, eyes: 'half', mouth: 'smile', brow: 'flat', armF: 1.95, bendF: -.5, armB: 1.75, bendB: -.4, feet: (u) => [[4.4 * u, 0], [3.9 * u, 0]] });
    boilSeed('wheel');
    paint(ribbon([[x + 7.6 * u, y - 10.2 * u], [x + 9.4 * u, y - 7.6 * u]], 18, 14), { wash: '#3A3140', ink: PAL.ink, sw: .8 });
    const ring = ellPts(x + 7.3 * u, y - 10.6 * u, 3.6 * u, 1.0 * u, 28, 0, -.35);
    inkLine([...ring, ring[0]], 7, '#3A3140', 'ink', .2);
    camEnd();
  }

  // 4. The speedometer: 80... 120... 200, and the glass cracks
  function speedo(t, lt, dur) {
    const v = kf(lt, [[0, 55], [.55, 80], [1.25, 80], [1.75, 120], [2.3, 120], [2.95, 200], [3.15, 214], [dur, 216]], easeOut);
    const sh = v > 150 ? shakeXY(lt, (v - 150) / 6) : [0, 0];
    camBegin(960 + sh[0], 540 + sh[1], 1.02 + .05 * seg(lt, 2.3, 3.0));
    boilSeed('dash');
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#3B3540', ink: null });
    const cx = 1000, cy = 600, R = 360, ang = (val) => -2.35 + val / 220 * 4.7;
    const at = (a, r) => [cx + Math.sin(a) * r, cy - Math.cos(a) * r];
    if (v > 175) glow(cx, cy, 520, '#FF6A4A', .35 * seg(v, 175, 210));
    boilSeed('dial');
    paint(ellPts(cx, cy, R + 30, R + 30, 40, .5), { wash: '#5E5560', ink: PAL.ink, sw: 1.5 });
    paint(ellPts(cx, cy, R, R, 40, .5), { wash: PAL.cream, ink: PAL.ink, sw: 1.2 });
    const red = []; for (let i = 0; i <= 10; i++) red.push(at(ang(170 + i * 5), R * .86));
    paint(ribbon(red, 34, 34), { wash: C.red, ink: null });
    for (let s = 0; s <= 220; s += 10) { const a = ang(s); inkLine([at(a, R * (s % 40 ? .8 : .72)), at(a, R * .93)], s % 40 ? .9 : 1.6, PAL.ink, 'ink', 0); }
    for (let s = 0; s <= 200; s += 40) { const p = at(ang(s), R * .56); letter(String(s), p[0], p[1], 56, PAL.ink); }
    boilSeed('needle');
    const a = ang(v) + (v > 200 ? .04 * Math.sin(lt * 60) : 0);
    paint(ribbon([at(a + Math.PI, R * .12), [cx, cy], at(a, R * .84)], 22, 5), { wash: C.red, ink: PAL.ink, sw: .9 });
    paint(ellPts(cx, cy, 34, 34, 16), { wash: '#3A3140', ink: PAL.ink, sw: 1 });
    if (lt > 3.0) {
      boilSeed('crack');
      const k = easeOut(seg(lt, 3.0, 3.15)), c0 = [cx + 150, cy - 170];
      for (let i = 0; i < 7; i++) { const aa = i / 7 * TAU + .3, L = (120 + 140 * hash(i + 50)) * k + 1; inkLine([c0, [c0[0] + Math.cos(aa) * L * .5 + 10, c0[1] + Math.sin(aa) * L * .5], [c0[0] + Math.cos(aa + .2) * L, c0[1] + Math.sin(aa + .2) * L]], 1.1, PAL.ink, 'inkfine', .2); }
      for (let i = 0; i < 4; i++) { const k2 = frac((lt - 3.0) * .9 + i * .25); boilSeed('smoke' + i); paint(ellPts(cx - 60 + i * 50, cy - R - 40 - k2 * 260, 50 + 50 * k2, 40 + 40 * k2, 14, 3), { wash: '#B9B2AE', washOp: 210 * (1 - k2), ink: null }); }
    }
    boilSeed('charm');
    const sa = (.25 + v / 260) * Math.sin(lt * (6 + v / 25)), ch = [300 + Math.sin(sa) * 330, -20 + Math.cos(sa) * 330];
    inkLine([[300, -20], ch], .8, PAL.cream, 'inkfine', 0);
    paint(ellPts(ch[0], ch[1] + 40, 40, 34, 16, .6), { wash: '#E8D040', ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 3; i++) paint(ribbon([[ch[0] - 20 + i * 20, ch[1] + 70], [ch[0] - 26 + i * 20 + sa * 30, ch[1] + 150]], 14, 3), { wash: C.paddyDk, ink: PAL.ink, sw: .6 });
    camEnd();
  }

  // 5. Fish chechi grips her seat; her fish fly backwards, one lands on our hero's face
  function chechi(t, lt, dur) {
    camBegin(960 + 12 * Math.sin(lt * 30) * seg(lt, 0, .5), 540, 1.02);
    interior(t, 'green', 3200);
    const u = 27, fy = 975, hx = 300, cxp = 960;
    seatBack(hx - 70, fy - 110, 'h');
    seatBack(cxp - 70, fy - 110, 'c');
    seatBack(cxp + 8.2 * u, fy - 110, 'f');
    const hit = lt > 2.8;
    person(hx, fy, u, { ...HERO, sit: true, hairFly: .6, eyes: hit ? 'closed' : 'dot', mouth: hit ? 'O' : 'smile', armF: hit ? 2.6 : .9, bendF: hit ? .3 : -.4, armB: hit ? 2.8 : .8, emote: hit ? '!' : null, emoteK: seg(lt, 2.85, 3.05), emoteAge: lt });
    person(cxp, fy, u, { ...CHECHI, sit: true, hairFly: 1, eyes: 'wide', mouth: 'O', brow: 'worry', armF: 1.55, bendF: 0, armB: 1.45, bendB: .1, rot: -.04 });
    const bk = [cxp + 3.6 * u, fy - 7.3 * u];
    boilSeed('basket');
    paint(ellPts(bk[0], bk[1], 2.6 * u, 1.3 * u, 18, .6), { wash: '#A57A44', ink: PAL.ink, sw: .9 });
    for (let i = -2; i <= 2; i++) inkLine([[bk[0] + i * .9 * u, bk[1] - 1.0 * u], [bk[0] + i * .8 * u, bk[1] + 1.0 * u]], .6, '#7A5530', 'inkfine', .3);
    const flights = [[1.2, 1.9, [-200, 260], 260], [1.45, 2.2, [-150, 80], 300], [1.75, 2.8, [hx + 3.1 * u, fy - 13.6 * u], 240]];
    flights.forEach(([t0, t1, to, h], i) => {
      if (lt < t0) { fish(bk[0] - 20 + i * 30, bk[1] - 1.1 * u, .9, -.4 + i * .3, 'f' + i); return; }
      if (i < 2 && lt > t1) return;
      const k = seg(lt, t0, t1), p = arcPt([bk[0], bk[1] - u], to, h, k);
      fish(p[0], p[1], 1.1, i === 2 && lt > t1 ? -1.2 + .1 * Math.sin(lt * 20) : -k * 9, 'f' + i);
    });
    camEnd();
  }

  // 6+7. Speed bump, lift-off
  function liftoff(t, lt, dur) {
    const B = KT.bumpAt, speed = 2600, scroll = lt * speed, up = Math.max(0, lt - B);
    const rot = kf(lt, [[B, 0], [B + .12, .22], [B + .6, .32], [dur, .24]], easeOut);
    const climb = up > 0 ? 120 * up * up + 300 * up : 0;
    const camY = 540 - climb * .92 + (lt > B && lt < B + .35 ? shakeXY(lt, 14)[1] : 0);
    const zoom = kf(lt, [[0, 1.0], [B, 1.06], [B + 1.2, .93], [dur, .9]], ease);
    camBegin(960, camY, zoom);
    roadScene(t, scroll, camY - 560 / zoom, camY + 560 / zoom);
    const busX = 760, frontW = busX + BUS.L * .3 * .95, bx = frontW + (B - lt) * speed;
    if (bx > -400 && bx < W + 400) bump(bx, ROAD + 40);
    speedLines(lt, 7, ROAD - 380 - climb, ROAD - 80 - climb, 3200);
    bus(busX, ROAD + 40 - climb + (up > 0 ? 0 : Math.sin(lt * 28) * 3), .95, { rot, spin: -lt * 30, arms: seg(lt, B + .2, B + .6), driver: true });
    dust(frontW, ROAD + 30, seg(lt, B - .02, B + .5), 'bd');
    camEnd();
  }

  // 8. The side shutters open into wings
  function wings(t, lt, dur) {
    camBegin(960, 540, 1 + .02 * lt);
    skyWash('sky8');
    cloudField(lt, 1500, 60, 1000, 7, .9);
    speedLines(lt, 8, 120, 1000, 2600);
    const w = kf(lt, [[0, 0], [.35, 0], [1.0, 1]], backOut), fl = 8 * Math.max(0, lt - .8);
    const by = 700 - 60 * seg(lt, .9, dur) + 14 * Math.sin(lt * 4);
    bus(900, by, .85, { rot: kf(lt, [[0, .22], [1.6, .02]], ease), wings: w, flap: fl, arms: 1, spin: -lt * 10, driver: true });
    if (lt > 1.6) {
      const k = seg(lt, 1.6, 2.4), cxw = lerp(W + 120, 1530, easeOut(k));
      crow(cxw, 330 + 10 * Math.sin(lt * 5), 1.4, lt * 14, false, 'crow8');
      emote('!?', cxw + 40, 250, 46, seg(lt, 2.4, 2.6), lt);
    }
    camEnd();
  }

  // 9. The conductor: punch, ticket, "got change?", shrug
  function conductor(t, lt, dur) {
    camBegin(960, 540, 1.02 + .02 * lt);
    interior(t, 'sky', 1500);
    const u = 30, fy = 985, hx = 330, cx = 1240;
    seatBack(hx - 75, fy - 110, 'h9');
    const give = lt > 2.0, shrug = lt > 3.2;
    person(hx, fy, u - 3, { ...HERO, sit: true, eyes: shrug ? 'closed' : 'dot', mouth: shrug ? 'flat' : 'smile', brow: shrug ? 'worry' : null,
      armF: shrug ? 2.6 : (lt > 1.7 ? 1.5 : .8), bendF: shrug ? -1.2 : -.2, armB: shrug ? 2.5 : .7, bendB: shrug ? -1.2 : .2,
      handF: give && !shrug ? ticket : null, emote: shrug ? 'sweat' : null, emoteK: seg(lt, 3.3, 3.5), emoteAge: lt });
    const punch = Math.exp(-(((lt - 1.0) * 9) ** 2));
    const armF = kf(lt, [[0, .9], [.6, 1.1], [1.35, 1.1], [1.9, 1.75], [2.35, 1.75], [2.6, 1.45]], ease) + .3 * punch;
    person(cx, fy, u, { ...COND, flip: true, eyes: 'dot', mouth: lt > 2.5 ? 'o' : 'smile', brow: lt > 2.5 ? 'up' : null, armF, bendF: lt > 2.5 ? -.5 : -.2,
      armB: 1.3, bendB: 1.4, handB: (x, y, u) => { boilSeed('rack'); paint(rrPts(x - .4 * u, y - 2.4 * u, 1.6 * u, 2.6 * u, .2 * u), { wash: '#6E4A30', ink: PAL.ink, sw: .7 }); for (let i = 0; i < 4; i++) paint(rectPts(x - .2 * u, y - 2.2 * u + i * .55 * u, 1.2 * u, .35 * u), { wash: [PAL.rose, PAL.cream, C.tee1, C.tee2][i], ink: null }); },
      handF: !give ? ticket : null, emote: lt > 2.55 ? '?' : null, emoteK: seg(lt, 2.55, 2.75), emoteAge: lt });
    if (punch > .2) { const p = [cx - (1.2 * u + Math.sin(armF) * 5.3 * u), fy - 10.3 * u + Math.cos(armF) * 5.3 * u]; emote('spark', p[0], p[1] - 20, 30, punch, lt); }
    camEnd();
  }

  // 10. Over the Alappuzha backwaters
  function houseboat(x, y, s, key) {
    boilSeed('hb' + key);
    paint(through([[x - 260 * s, y - 50 * s], [x - 120 * s, y + 30 * s], [x + 140 * s, y + 30 * s], [x + 270 * s, y - 60 * s], [x + 200 * s, y - 10 * s], [x - 200 * s, y - 10 * s]], 4), { wash: C.boat, ink: PAL.ink, sw: .9 });
    paint(through([[x - 190 * s, y - 14 * s], [x - 160 * s, y - 120 * s], [x, y - 150 * s], [x + 160 * s, y - 120 * s], [x + 190 * s, y - 14 * s]], 4), { wash: C.thatch, ink: PAL.ink, sw: .9 });
    for (let i = -3; i <= 3; i++) inkLine([[x + i * 50 * s, y - 14 * s], [x + i * 44 * s, y - 136 * s + Math.abs(i) * 12 * s]], .6, '#A88650', 'inkfine', .3);
    paint(rectPts(x - 60 * s, y - 70 * s, 120 * s, 46 * s), { wash: '#5A3A2A', ink: PAL.ink, sw: .6 });
  }
  function backwaters(t, lt, dur) {
    camBegin(960 + 30 * lt, 540, 1 + .02 * lt);
    skyWash('sky10');
    cloudField(lt, 80, 40, 260, 4, .7);
    boilSeed('bank');
    paint(rectPts(-200, 440, W + 400, 80), { wash: C.paddyDk, ink: null });
    for (let i = 0; i < 12; i++) palm(-100 + i * 190 + 40 * hash(i), 470, 120 + 50 * hash(i + 1), .1 * Math.sin(t + i), 'bk' + i);
    boilSeed('water');
    paint(rectPts(-200, 500, W + 400, 700), { wash: C.water, ink: null });
    for (let i = 0; i < 14; i++) { boilSeed('rip' + i); const y = 540 + 520 * hash(i + 3), x = ((i * 260 - lt * 40) % (W + 300) + W + 300) % (W + 300) - 150; inkLine([[x, y], [x + 90, y]], .8, C.waterLt, 'inkfine', 0); }
    houseboat(450 + 25 * lt, 760, .9, 1);
    houseboat(1420 - 30 * lt, 960, 1.25, 2);
    const k = seg(lt, .4, dur - .2), bx = lerp(-650, W + 700, k), by = 260 + 16 * Math.sin(lt * 4);
    boilSeed('shadow');
    paint(ellPts(bx, 640, 200, 22, 18, 2), { wash: '#245F60', washOp: 120, ink: null });
    speedLines(lt, 5, 160, 360, 2600);
    bus(bx, by + 40, .62, { wings: 1, flap: lt * 8, arms: 1, driver: true, spin: -lt * 10 });
    camEnd();
  }

  // 11. College boys hanging at the door take a selfie; a crow photobombs
  function selfie(t, lt, dur) {
    camBegin(960, 540, 1 + .015 * lt);
    skyWash('sky11');
    cloudField(lt, 2400, 80, 1000, 6, 1.1);
    speedLines(lt, 9, 80, 1040, 3800);
    boilSeed('panel');
    paint(rectPts(-100, -100, 1080, 1300), { wash: C.red, ink: null });
    paint(rectPts(-100, -100, 1080, 210), { wash: C.cream, ink: null });
    paint(rectPts(-100, 700, 1080, 40), { wash: C.yellow, ink: null });
    paint(rrPts(80, 170, 460, 300, 24), { wash: C.glassDk, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(700, 140, 280, 1000), { wash: '#3E2A2E', ink: PAL.ink, sw: 1.2 });
    inkLine([[980, -100], [980, 1200]], 1.6, PAL.ink, 'ink', 0);
    paint(ribbon([[940, 150], [940, 1080]], 16, 16), { wash: C.grey, ink: PAL.ink, sw: .7 });
    const crowIn = lt > 2.7, shock = lt > 3.35;
    const flashK = Math.max(Math.exp(-(((lt - 2.1) * 12) ** 2)), Math.exp(-(((lt - 3.45) * 12) ** 2)));
    person(830, 1110, 30, { ...BOY2, rot: .12, hairFly: 1, eyes: shock ? 'wide' : 'happy', mouth: shock ? 'O' : 'grin', armF: 2.8, bendF: .2, handF: peace, armB: -.3, bendB: -.9 });
    const ph = (x, y, u) => { phone(x, y, u); if (flashK > .05) glow(x + .4 * u, y - 1.2 * u, 120, '#FFF6D8', flashK); };
    person(1060, 1120, 31, { ...BOY1, rot: .42, hairFly: 1, eyes: shock ? 'wide' : 'happy', mouth: shock ? 'O' : 'grin', brow: shock ? 'up' : null, armF: 2.55, bendF: .15, handF: ph, armB: -2.4, bendB: .4, emote: shock ? '!!' : null, emoteK: seg(lt, 3.35, 3.55), emoteAge: lt });
    if (crowIn) {
      const k = seg(lt, 2.7, 3.3), p = [lerp(W + 150, 1640, easeOut(k)), lerp(120, 300, easeOut(k))];
      crow(p[0], p[1], 1.8, lt * 16 * (1 - .7 * seg(lt, 3.3, 3.5)), true, 'crow11');
    }
    camEnd();
    if (flashK > .05) flash(flashK * .55);
  }

  // exam centre (shots 12-13): building, clock, gate
  function examCentre(t, clockTime) {
    boilSeed('ecsky');
    paint(rectPts(-300, -500, W + 600, 1400), { wash: C.sky, ink: null });
    paint(ellPts(W * .5, 820, W * .9, 300, 30, 6), { wash: C.skyHi, washOp: 120, ink: null });
    for (let i = 0; i < 3; i++) cloud(300 + i * 700, 120 + 60 * hash(i), .8, 'ec' + i);
    palm(1300, 830, 420, .08 * Math.sin(t * 2), 'ecp1');
    palm(160, 830, 380, .08 * Math.sin(t * 2 + 1), 'ecp2');
    boilSeed('bldg');
    paint(rectPts(260, 340, 1100, 490), { wash: '#F1E2C0', ink: PAL.ink, sw: 1.2 });
    paint([[200, 360], [1420, 360], [1330, 250], [290, 250]], { wash: C.tile, ink: PAL.ink, sw: 1.2 });
    paint([[640, 260], [1000, 260], [820, 150]], { wash: C.tile, ink: PAL.ink, sw: 1.2 });
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { if (r === 1 && (i === 2 || i === 3)) continue; boilSeed('bw' + r + i); paint(rectPts(320 + i * 175, 420 + r * 200, 100, 120), { wash: '#3E7F7A', ink: PAL.ink, sw: .8 }); }
    paint(rectPts(700, 640, 240, 190), { wash: '#6E4A30', ink: PAL.ink, sw: 1 });
    clockFace(820, 225, 48, clockTime[0], clockTime[1], 'ecclock');
    boilSeed('ground');
    paint(rectPts(-300, 830, W + 600, 500), { wash: C.laterite, ink: null });
    inkLine([[-300, 830], [W + 300, 830]], 1, PAL.ink, 'ink', 0);
    boilSeed('gate');
    for (const gx of [1460, 1860]) { paint(rectPts(gx - 30, 560, 60, 290), { wash: '#F1E2C0', ink: PAL.ink, sw: 1 }); paint(rectPts(gx - 40, 540, 80, 30), { wash: C.yellow, ink: PAL.ink, sw: .8 }); }
    for (let i = 0; i < 5; i++) inkLine([[1500 + i * 18, 640], [1500 + i * 18, 845]], 1, '#3A3140', 'ink', 0);
    inkLine([[1490, 650], [1590, 650]], 1, '#3A3140', 'ink', 0);
  }
  const students = (lt, react, k) => [[1610, '#E27A92', 'bun', 'saree'], [1700, C.tee1, 'short', 'pants'], [1790, '#7FA6D8', 'spiky', 'pants']].forEach(([x, sh, hs, lw], i) =>
    person(x, 870, 11, { key: 'st' + i, flip: true, skin: [C.skin3, C.skin, C.skin2][i], shirt: sh, hairStyle: hs, lower: lw, lowerCol: lw === 'saree' ? '#E27A92' : C.jeans,
      eyes: react ? 'wide' : 'dot', mouth: react ? 'O' : 'smile', armF: react ? 2.4 + .2 * i : .1, bendF: react ? .5 : .2, armB: react ? 2.2 : -.1, emote: react && i === 1 ? '!' : null, emoteK: k, emoteAge: lt, dy: -Math.abs(Math.sin(lt * 6 + i)) * (react ? .3 : 0) }));

  // 12. Landing in front of the exam centre
  function landing(t, lt, dur) {
    camBegin(960 + 20 * lt, 560, 1.0 + .03 * lt);
    examCentre(t, [7, 10]);
    const T0 = 2.4, bx = lt < T0 ? kf(lt, [[0, -700], [T0, 520]], ease) : kf(lt, [[T0, 520], [3.6, 860]], easeOut);
    const by = lt < T0 ? lerp(-120, 860, easeIn(seg(lt, 0, T0)) * .5 + seg(lt, 0, T0) * .5) : 860;
    const sq = lt > T0 ? .14 * Math.exp(-(lt - T0) * 7) * Math.cos((lt - T0) * 26) : 0;
    const w = lt < 2.0 ? 1 : 1 - seg(lt, 2.0, 2.9);
    students(lt, lt > 1.1, seg(lt, 1.2, 1.4));
    bus(bx, by, .55, { rot: lt < T0 ? -.12 * (1 - seg(lt, 1.6, T0)) : 0, sq, wings: w, flap: lt * 7, spin: -lt * 12, driver: true, arms: lt < T0 ? 1 : 0 });
    dust(bx, 860, seg(lt, T0, T0 + 1.1), 'ld', 6, .7);
    camEnd();
  }

  // 13. 7:10 on the clock; the hero steps out, proud; the students gape
  function early(t, lt, dur) {
    const [cx, cy, z] = kf(lt, [[0, [820, 240, 2.8]], [2.4, [820, 245, 2.9]], [3.4, [1080, 600, 1.35]], [dur, [1120, 640, 1.5]]], ease);
    camBegin(cx, cy, z);
    examCentre(t, [7, 10]);
    const busX = 860;
    students(lt, lt > 4.1, seg(lt, 4.1, 4.3));
    bus(busX, 860, .55, { driver: true });
    const door = busDoor(busX, 860, .55), u = 10;
    if (lt > 3.4) {
      const k = seg(lt, 3.6, 4.1), p = lt < 3.6 ? door : arcPt(door, [door[0] + 110, 875], 50, k);
      const proud = lt > 4.3;
      person(p[0], p[1], u, { ...HERO, rot: proud ? -.08 : 0, eyes: proud ? 'happy' : 'dot', mouth: proud ? 'grin' : 'smile',
        armF: proud ? 3.0 : .3, bendF: proud ? -.2 : .2, handF: proud ? (x, y, u) => fileProp(x, y, u, -.4) : null, armB: proud ? .7 : -.2, bendB: proud ? -1.9 : .3,
        handB: proud ? null : (x, y, u) => fileProp(x, y, u, .2), emote: proud ? 'stars' : null, emoteK: seg(lt, 4.4, 4.7), emoteAge: lt });
    }
    camEnd();
  }

  // 14. Pockets: no hall ticket
  function pockets(t, lt, dur) {
    camBegin(960, 540, 1 + .05 * lt);
    boilSeed('wall14');
    paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#F1E2C0', ink: null });
    paint(rectPts(1250, 120, 320, 380), { wash: '#3E7F7A', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(-100, -100, 330, H + 200), { wash: C.red, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(-100, 300, 330, 34), { wash: C.yellow, ink: null });
    const pat = lt > .9 && lt < 2.3, ph = Math.abs(Math.sin(lt * 10)), shocked = lt > 1.4, back = lt > 2.5;
    person(back ? 760 : 820, 1190, 58, { ...HERO, flip: back, eyes: shocked ? 'wide' : 'happy', mouth: shocked ? 'O' : 'grin', brow: shocked ? 'worry' : null,
      armF: pat ? .2 + .5 * ph : (shocked ? .2 : .1), bendF: pat ? .2 : .1, armB: pat ? .2 + .5 * (1 - ph) : .1,
      emote: back ? '!!' : (shocked ? 'sweat' : null), emoteK: back ? seg(lt, 2.55, 2.75) : seg(lt, 1.7, 1.9), emoteAge: lt });
    camEnd();
  }

  // 15. The bus flies off to Dubai; iris out on our hero
  function dubai(t, lt, dur) {
    camBegin(960, 540, 1);
    skyWash('sky15', '#A9D4E6', '#F6C98E');
    glow(1640, 620, 260, '#FFD28A', .6);
    boilSeed('desert');
    paint(rectPts(-100, 740, W + 200, 140), { wash: '#D8B577', ink: null });
    for (const [x, h, w] of [[1500, 160, 50], [1560, 110, 40], [1760, 140, 46], [1820, 90, 36]]) paint(rectPts(x, 760 - h, w, h), { wash: '#8C9AB0', ink: null });
    paint([[1610, 760], [1675, 760], [1652, 560], [1647, 330], [1640, 560]], { wash: '#7C8DA6', ink: PAL.ink, sw: .6 });
    boilSeed('green15');
    paint(rectPts(-100, 860, W + 200, 400), { wash: C.paddy, ink: null });
    palm(80, 900, 420, .08 * Math.sin(t * 2), 'p15');
    const k = seg(lt, .2, 3.2), s = lerp(.5, .03, easeIn(k));
    const bp = [lerp(700, 1640, easeOut(k)), lerp(760, 380, k)];
    if (s > .035) bus(bp[0], bp[1], s, { wings: 1, flap: lt * 9, rot: .12 * (1 - k), driver: s > .2 });
    const slump = lt > 2.9, run = lt < 1.3;
    const hx = lerp(260, 420, easeOut(seg(lt, 0, 1.3))), u = 22;
    person(hx, 1010, u, { ...HERO, walk: run ? lt * 14 : null, rot: slump ? .18 : .05, eyes: slump ? 'closed' : 'wide', mouth: slump ? 'frown' : 'open', brow: 'worry',
      armF: slump ? -.1 : 2.0 + .2 * Math.sin(lt * 8), bendF: slump ? 0 : -.2, armB: slump ? -.05 : .4, emote: slump ? 'cloud' : null, emoteK: seg(lt, 3.0, 3.3), emoteAge: lt });
    camEnd();
    const hd = [hx + .5 * u, 1010 - 13.9 * u];
    if (lt > dur - 1.0) iris(hd[0], hd[1], lerp(1500, 0, easeIn(seg(lt, dur - 1.0, dur - .15))));
  }

  const list = [hook, busStop, driver, speedo, chechi, liftoff, wings, conductor, backwaters, selfie, landing, early, pockets, dubai];
  shots(list.map((f, i) => [KT.shots[i], f]));
})();
